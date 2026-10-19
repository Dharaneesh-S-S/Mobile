import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CalendarCategory,
  CalendarEvent,
  CalendarItemType,
  Settings,
  ViewType,
  AdvancedSearchFilters,
} from '../types/calendar';
import {
  DEFAULT_CALENDARS,
  DEFAULT_SETTINGS,
  DEMO_EVENTS,
  MOCK_CONTACTS,
} from '../data/mockData';
import {
  addDays,
  addMonths,
  addYears,
  subDays,
  formatDateToYYYYMMDD,
  exportEventsToICS,
  parseICSContent,
} from '../utils/dateUtils';

export interface ToastItem {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface RecurringActionConfig {
  isOpen: boolean;
  action: 'edit' | 'delete';
  event: CalendarEvent;
  updatedData?: CalendarEvent;
}

interface CalendarContextType {
  // State
  events: CalendarEvent[];
  calendars: CalendarCategory[];
  settings: Settings;
  trash: CalendarEvent[];
  currentDate: Date;
  currentView: ViewType;
  sidebarOpen: boolean;
  tasksSidebarOpen: boolean;
  activeOverlaidPeople: string[];
  searchQuery: string;
  advancedFilters: AdvancedSearchFilters | null;
  isSearchOpen: boolean;
  
  // Active UI / Popovers / Modals
  selectedEvent: CalendarEvent | null;
  popoverAnchor: { x: number; y: number } | null;
  isEditorOpen: boolean;
  editingEvent: CalendarEvent | null;
  isQuickCreateOpen: boolean;
  quickCreateData: { date: string; time?: string; type?: CalendarItemType } | null;
  isSettingsOpen: boolean;
  settingsInitialTab: string;
  isHelpOpen: boolean;
  isBookingPageOpen: boolean;
  bookingScheduleEvent: CalendarEvent | null;
  recurringActionDialog: RecurringActionConfig | null;
  toasts: ToastItem[];

  // Navigation
  setCurrentDate: (date: Date) => void;
  goToToday: () => void;
  navigateNext: () => void;
  navigatePrev: () => void;
  setCurrentView: (view: ViewType) => void;
  toggleSidebar: () => void;
  toggleTasksSidebar: () => void;

  // Search
  setSearchQuery: (query: string) => void;
  setAdvancedFilters: (filters: AdvancedSearchFilters | null) => void;
  setIsSearchOpen: (open: boolean) => void;

  // Contact overlays
  togglePersonOverlay: (personId: string) => void;

  // Calendars
  toggleCalendarVisibility: (id: string) => void;
  setCalendarColor: (id: string, color: string) => void;
  displayOnlyCalendar: (id: string) => void;
  addCalendar: (cal: Partial<CalendarCategory>) => void;
  updateCalendar: (cal: CalendarCategory) => void;
  deleteCalendar: (id: string) => void;

  // Events CRUD
  addEvent: (eventData: Partial<CalendarEvent>) => CalendarEvent;
  updateEvent: (event: CalendarEvent, scope?: 'this' | 'following' | 'all') => void;
  deleteEvent: (id: string, scope?: 'this' | 'following' | 'all') => void;
  duplicateEvent: (event: CalendarEvent) => void;
  quickToggleTaskCompletion: (taskId: string) => void;

  // Trash
  restoreFromTrash: (id: string) => void;
  deleteForeverFromTrash: (id: string) => void;
  emptyTrash: () => void;

  // Settings
  updateSettings: (newSettings: Partial<Settings>) => void;
  toggleTheme: () => void;

  // Modals / Popups Openers
  openQuickCreate: (date: string, time?: string, type?: CalendarItemType, anchor?: { x: number; y: number }) => void;
  closeQuickCreate: () => void;
  openEditor: (event?: CalendarEvent | null, initialData?: Partial<CalendarEvent>) => void;
  closeEditor: () => void;
  openEventDetails: (event: CalendarEvent, anchor?: { x: number; y: number }) => void;
  closeEventDetails: () => void;
  openSettings: (tab?: string) => void;
  closeSettings: () => void;
  openHelp: () => void;
  closeHelp: () => void;
  openBookingPage: (event: CalendarEvent) => void;
  closeBookingPage: () => void;
  handleRecurringChoice: (scope: 'this' | 'following' | 'all') => void;
  closeRecurringDialog: () => void;

  // Toast & Utilities
  showToast: (message: string, actionLabel?: string, onAction?: () => void, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  seedDemoData: () => void;
  clearAllData: () => void;
  exportICS: () => void;
  importICS: (content: string) => number;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENTS: 'chronos_events',
  CALENDARS: 'chronos_calendars',
  SETTINGS: 'chronos_settings',
  TRASH: 'chronos_trash',
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial settings
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Failed to parse settings:', e);
      return DEFAULT_SETTINGS;
    }
  });

  // Load initial calendars
  const [calendars, setCalendars] = useState<CalendarCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CALENDARS);
      return saved ? JSON.parse(saved) : DEFAULT_CALENDARS;
    } catch (e) {
      console.error('Failed to parse calendars:', e);
      return DEFAULT_CALENDARS;
    }
  });

  // Load initial events
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : DEMO_EVENTS;
    } catch (e) {
      console.error('Failed to parse events:', e);
      return DEMO_EVENTS;
    }
  });

  // Load initial trash
  const [trash, setTrash] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRASH);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse trash:', e);
      return [];
    }
  });

  // App Navigation & View state
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [currentView, setCurrentView] = useState<ViewType>(settings.defaultView || 'week');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => window.innerWidth >= 1024);
  const [tasksSidebarOpen, setTasksSidebarOpen] = useState<boolean>(false);
  const [activeOverlaidPeople, setActiveOverlaidPeople] = useState<string[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedSearchFilters | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Modals & Popovers state
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<{ x: number; y: number } | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState<boolean>(false);
  const [quickCreateData, setQuickCreateData] = useState<{ date: string; time?: string; type?: CalendarItemType } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<string>('general');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isBookingPageOpen, setIsBookingPageOpen] = useState<boolean>(false);
  const [bookingScheduleEvent, setBookingScheduleEvent] = useState<CalendarEvent | null>(null);
  const [recurringActionDialog, setRecurringActionDialog] = useState<RecurringActionConfig | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Keep localStorage in sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CALENDARS, JSON.stringify(calendars));
    } catch (e) {
      console.error('Error saving calendars to localStorage:', e);
    }
  }, [calendars]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Error saving events to localStorage:', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(trash));
    } catch (e) {
      console.error('Error saving trash to localStorage:', e);
    }
  }, [trash]);

  // Sync theme to <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Clean old trash (>30 days) on mount
  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

    setTrash(prev => prev.filter(item => !item.deletedAt || item.deletedAt > thirtyDaysAgoISO));
  }, []);

  // Show Toast
  const showToast = useCallback((
    message: string,
    actionLabel?: string,
    onAction?: () => void,
    type: ToastItem['type'] = 'info'
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, message, actionLabel, onAction, type };
    setToasts(prev => [...prev.slice(-4), newToast]); // keep at most 5

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully', undefined, undefined, 'success');
  }, [showToast]);

  // Navigation handlers
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const navigateNext = useCallback(() => {
    setCurrentDate(prev => {
      switch (currentView) {
        case 'day':
          return addDays(prev, 1);
        case 'week':
          return addDays(prev, 7);
        case 'four_day':
          return addDays(prev, 4);
        case 'month':
          return addMonths(prev, 1);
        case 'year':
          return addYears(prev, 1);
        case 'schedule':
          return addDays(prev, 14);
        default:
          return addDays(prev, 7);
      }
    });
  }, [currentView]);

  const navigatePrev = useCallback(() => {
    setCurrentDate(prev => {
      switch (currentView) {
        case 'day':
          return subDays(prev, 1);
        case 'week':
          return subDays(prev, 7);
        case 'four_day':
          return subDays(prev, 4);
        case 'month':
          return addMonths(prev, -1);
        case 'year':
          return addYears(prev, -1);
        case 'schedule':
          return subDays(prev, 14);
        default:
          return subDays(prev, 7);
      }
    });
  }, [currentView]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const toggleTasksSidebar = useCallback(() => {
    setTasksSidebarOpen(prev => !prev);
  }, []);

  // Contact overlays
  const togglePersonOverlay = useCallback((personId: string) => {
    setActiveOverlaidPeople(prev =>
      prev.includes(personId) ? prev.filter(id => id !== personId) : [...prev, personId]
    );
  }, []);

  // Calendars logic
  const toggleCalendarVisibility = useCallback((id: string) => {
    setCalendars(prev =>
      prev.map(cal => (cal.id === id ? { ...cal, isVisible: !cal.isVisible } : cal))
    );
  }, []);

  const setCalendarColor = useCallback((id: string, color: string) => {
    setCalendars(prev =>
      prev.map(cal => (cal.id === id ? { ...cal, color } : cal))
    );
  }, []);

  const displayOnlyCalendar = useCallback((id: string) => {
    setCalendars(prev =>
      prev.map(cal => ({ ...cal, isVisible: cal.id === id }))
    );
  }, []);

  const addCalendar = useCallback((cal: Partial<CalendarCategory>) => {
    const newCal: CalendarCategory = {
      id: `cal_${Date.now()}`,
      name: cal.name || 'New Calendar',
      color: cal.color || '#3b82f6',
      isVisible: true,
      description: cal.description || '',
      sharing: { isPublic: false, sharedWith: [] },
      defaultReminders: [{ type: 'notification', minutesBefore: 10 }],
    };
    setCalendars(prev => [...prev, newCal]);
    showToast(`Calendar "${newCal.name}" created`, undefined, undefined, 'success');
  }, [showToast]);

  const updateCalendar = useCallback((cal: CalendarCategory) => {
    setCalendars(prev => prev.map(c => (c.id === cal.id ? cal : c)));
    showToast(`Updated "${cal.name}"`, undefined, undefined, 'success');
  }, [showToast]);

  const deleteCalendar = useCallback((id: string) => {
    const target = calendars.find(c => c.id === id);
    if (!target) return;
    if (target.isPrimary) {
      showToast('Cannot delete primary calendar', undefined, undefined, 'warning');
      return;
    }
    setCalendars(prev => prev.filter(c => c.id !== id));
    // Also move all events of this calendar to trash
    const associatedEvents = events.filter(e => e.calendarId === id);
    if (associatedEvents.length > 0) {
      const nowISO = new Date().toISOString();
      setTrash(prev => [...prev, ...associatedEvents.map(e => ({ ...e, deletedAt: nowISO }))]);
      setEvents(prev => prev.filter(e => e.calendarId !== id));
    }
    showToast(`Calendar "${target.name}" deleted`, undefined, undefined, 'info');
  }, [calendars, events, showToast]);

  // Events CRUD
  const addEvent = useCallback((eventData: Partial<CalendarEvent>): CalendarEvent => {
    const nowISO = new Date().toISOString();
    const primaryCal = calendars.find(c => c.isPrimary) || calendars[0];
    
    const newEvent: CalendarEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      calendarId: eventData.calendarId || primaryCal?.id || 'cal_my_calendar',
      type: eventData.type || 'event',
      title: eventData.title?.trim() || (eventData.type === 'task' ? 'Untitled task' : 'Untitled event'),
      description: eventData.description || '',
      location: eventData.location || '',
      startDate: eventData.startDate || formatDateToYYYYMMDD(currentDate),
      startTime: eventData.startTime || '10:00',
      endDate: eventData.endDate || eventData.startDate || formatDateToYYYYMMDD(currentDate),
      endTime: eventData.endTime || '11:00',
      isAllDay: eventData.isAllDay ?? false,
      colorOverride: eventData.colorOverride,
      recurrence: eventData.recurrence,
      guests: eventData.guests || [],
      videoConference: eventData.videoConference,
      notifications: eventData.notifications || [{ type: 'notification', minutesBefore: 10 }],
      attachments: eventData.attachments || [],
      outOfOffice: eventData.outOfOffice,
      focusTime: eventData.focusTime,
      workingLocation: eventData.workingLocation,
      workingLocationDetails: eventData.workingLocationDetails,
      isCompleted: eventData.isCompleted ?? false,
      subtasks: eventData.subtasks || [],
      appointmentSchedule: eventData.appointmentSchedule,
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    setEvents(prev => [...prev, newEvent]);
    showToast(
      `${newEvent.type === 'task' ? 'Task' : 'Event'} created`,
      'Undo',
      () => {
        setEvents(prev => prev.filter(e => e.id !== newEvent.id));
      },
      'success'
    );
    return newEvent;
  }, [calendars, currentDate, showToast]);

  const updateEventInternal = useCallback((updated: CalendarEvent, scope: 'this' | 'following' | 'all' = 'all') => {
    const nowISO = new Date().toISOString();
    const cleanUpdated = { ...updated, updatedAt: nowISO };

    // Check if updating an instance of a recurring event
    if (updated.recurringEventId && updated.recurringEventId !== updated.id) {
      const parentId = updated.recurringEventId;
      if (scope === 'this') {
        // Detach this instance into a standalone event and update parent recurrence if needed
        const detached: CalendarEvent = {
          ...cleanUpdated,
          id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          recurrence: undefined,
          recurringEventId: undefined,
        };
        setEvents(prev => [...prev, detached]);
      } else if (scope === 'all') {
        // Update parent
        setEvents(prev => prev.map(e => (e.id === parentId ? { ...cleanUpdated, id: parentId } : e)));
      } else if (scope === 'following') {
        // End parent before this date and create a new recurring event from this date
        setEvents(prev => {
          const parent = prev.find(e => e.id === parentId);
          if (!parent) return prev;
          const dayBefore = formatDateToYYYYMMDD(subDays(new Date(updated.startDate), 1));
          const updatedParent: CalendarEvent = {
            ...parent,
            recurrence: {
              ...parent.recurrence!,
              ends: { type: 'on_date', date: dayBefore },
            },
          };
          const newRecurringSeries: CalendarEvent = {
            ...cleanUpdated,
            id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            recurringEventId: undefined,
          };
          return [...prev.filter(e => e.id !== parentId), updatedParent, newRecurringSeries];
        });
      }
    } else {
      // Normal event update
      setEvents(prev => prev.map(e => (e.id === updated.id ? cleanUpdated : e)));
    }

    showToast('Saved changes', undefined, undefined, 'success');
  }, [showToast]);

  const updateEvent = useCallback((event: CalendarEvent, scope?: 'this' | 'following' | 'all') => {
    if (event.recurrence && event.recurrence.frequency !== 'none' && !scope) {
      setRecurringActionDialog({
        isOpen: true,
        action: 'edit',
        event,
        updatedData: event,
      });
      return;
    }
    updateEventInternal(event, scope || 'all');
  }, [updateEventInternal]);

  const deleteEventInternal = useCallback((targetId: string, scope: 'this' | 'following' | 'all' = 'all') => {
    const targetEvent = events.find(e => e.id === targetId || (e.recurringEventId && targetId.startsWith(e.id)));
    if (!targetEvent) return;

    const previousEvents = [...events];
    const nowISO = new Date().toISOString();

    if (targetId.includes('_inst_')) {
      const parentId = targetEvent.recurringEventId || targetEvent.id;
      if (scope === 'all') {
        // Move entire series to trash
        setEvents(prev => prev.filter(e => e.id !== parentId));
        setTrash(prev => [...prev, { ...targetEvent, id: parentId, deletedAt: nowISO }]);
      } else if (scope === 'following') {
        // End series before this instance date
        setEvents(prev =>
          prev.map(e => {
            if (e.id === parentId && e.recurrence) {
              const instanceDate = targetId.split('_inst_')[1];
              const dayBefore = formatDateToYYYYMMDD(subDays(new Date(instanceDate), 1));
              return {
                ...e,
                recurrence: { ...e.recurrence, ends: { type: 'on_date', date: dayBefore } },
              };
            }
            return e;
          })
        );
      } else {
        // Delete only this instance: in a complete calendar, we could add an exdate.
        // For local storage, we can push a stub exclusion or simply notify.
        showToast('Event removed from this date', undefined, undefined, 'info');
      }
    } else {
      // Non-instance or base recurring event
      setEvents(prev => prev.filter(e => e.id !== targetId));
      setTrash(prev => [...prev, { ...targetEvent, deletedAt: nowISO }]);
    }

    showToast(
      'Event moved to trash',
      'Undo',
      () => {
        setEvents(previousEvents);
        setTrash(prev => prev.filter(e => e.id !== targetId));
      },
      'info'
    );
  }, [events, showToast]);

  const deleteEvent = useCallback((id: string, scope?: 'this' | 'following' | 'all') => {
    const isRecurring = id.includes('_inst_') || events.find(e => e.id === id)?.recurrence?.frequency !== 'none';
    if (isRecurring && !scope) {
      const ev = events.find(e => e.id === id || id.startsWith(e.id));
      if (ev) {
        setRecurringActionDialog({
          isOpen: true,
          action: 'delete',
          event: { ...ev, id },
        });
        return;
      }
    }
    deleteEventInternal(id, scope || 'all');
  }, [deleteEventInternal, events]);

  const handleRecurringChoice = useCallback((scope: 'this' | 'following' | 'all') => {
    if (!recurringActionDialog) return;
    const { action, event, updatedData } = recurringActionDialog;
    if (action === 'edit' && updatedData) {
      updateEventInternal(updatedData, scope);
    } else if (action === 'delete') {
      deleteEventInternal(event.id, scope);
    }
    setRecurringActionDialog(null);
  }, [recurringActionDialog, updateEventInternal, deleteEventInternal]);

  const closeRecurringDialog = useCallback(() => {
    setRecurringActionDialog(null);
  }, []);

  const duplicateEvent = useCallback((event: CalendarEvent) => {
    const nowISO = new Date().toISOString();
    const duplicated: CalendarEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${event.title} (Copy)`,
      recurringEventId: undefined,
      createdAt: nowISO,
      updatedAt: nowISO,
    };
    setEvents(prev => [...prev, duplicated]);
    showToast(`Duplicated "${event.title}"`, undefined, undefined, 'success');
  }, [showToast]);

  const quickToggleTaskCompletion = useCallback((taskId: string) => {
    setEvents(prev =>
      prev.map(e => {
        if (e.id === taskId) {
          const isCompleted = !e.isCompleted;
          return { ...e, isCompleted };
        }
        return e;
      })
    );
  }, []);

  // Trash actions
  const restoreFromTrash = useCallback((id: string) => {
    const item = trash.find(t => t.id === id);
    if (!item) return;
    const { deletedAt, ...restored } = item;
    setTrash(prev => prev.filter(t => t.id !== id));
    setEvents(prev => [...prev, restored as CalendarEvent]);
    showToast(`Restored "${restored.title}"`, undefined, undefined, 'success');
  }, [trash, showToast]);

  const deleteForeverFromTrash = useCallback((id: string) => {
    setTrash(prev => prev.filter(t => t.id !== id));
    showToast('Deleted forever', undefined, undefined, 'info');
  }, [showToast]);

  const emptyTrash = useCallback(() => {
    setTrash([]);
    showToast('Trash emptied', undefined, undefined, 'info');
  }, [showToast]);

  // Modal openers
  const openQuickCreate = useCallback((
    date: string,
    time?: string,
    type: CalendarItemType = 'event',
    anchor?: { x: number; y: number }
  ) => {
    setSelectedEvent(null);
    setQuickCreateData({ date, time, type });
    if (anchor) setPopoverAnchor(anchor);
    setIsQuickCreateOpen(true);
  }, []);

  const closeQuickCreate = useCallback(() => {
    setIsQuickCreateOpen(false);
    setQuickCreateData(null);
  }, []);

  const openEditor = useCallback((event?: CalendarEvent | null, initialData?: Partial<CalendarEvent>) => {
    setSelectedEvent(null);
    setIsQuickCreateOpen(false);
    if (event) {
      setEditingEvent(event);
    } else if (initialData) {
      const primaryCal = calendars.find(c => c.isPrimary) || calendars[0];
      setEditingEvent({
        id: '',
        calendarId: initialData.calendarId || primaryCal.id,
        type: initialData.type || 'event',
        title: initialData.title || '',
        startDate: initialData.startDate || formatDateToYYYYMMDD(currentDate),
        endDate: initialData.endDate || initialData.startDate || formatDateToYYYYMMDD(currentDate),
        startTime: initialData.startTime || '10:00',
        endTime: initialData.endTime || '11:00',
        isAllDay: initialData.isAllDay || false,
        guests: initialData.guests || [],
        notifications: [{ type: 'notification', minutesBefore: 10 }],
        createdAt: '',
        updatedAt: '',
        ...initialData,
      });
    } else {
      setEditingEvent(null);
    }
    setIsEditorOpen(true);
  }, [calendars, currentDate]);

  const closeEditor = useCallback(() => {
    setIsEditorOpen(false);
    setEditingEvent(null);
  }, []);

  const openEventDetails = useCallback((event: CalendarEvent, anchor?: { x: number; y: number }) => {
    setIsQuickCreateOpen(false);
    setSelectedEvent(event);
    if (anchor) {
      setPopoverAnchor(anchor);
    }
  }, []);

  const closeEventDetails = useCallback(() => {
    setSelectedEvent(null);
    setPopoverAnchor(null);
  }, []);

  const openSettings = useCallback((tab: string = 'general') => {
    setSettingsInitialTab(tab);
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const openHelp = useCallback(() => {
    setIsHelpOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  const openBookingPage = useCallback((event: CalendarEvent) => {
    setBookingScheduleEvent(event);
    setIsBookingPageOpen(true);
  }, []);

  const closeBookingPage = useCallback(() => {
    setIsBookingPageOpen(false);
    setBookingScheduleEvent(null);
  }, []);

  // Demo data and Reset
  const seedDemoData = useCallback(() => {
    setEvents(DEMO_EVENTS);
    setCalendars(DEFAULT_CALENDARS);
    setSettings(DEFAULT_SETTINGS);
    setTrash([]);
    showToast('Reset to demo data with sample events', undefined, undefined, 'success');
  }, [showToast]);

  const clearAllData = useCallback(() => {
    setEvents([]);
    setTrash([]);
    showToast('All calendar items cleared', undefined, undefined, 'info');
  }, [showToast]);

  // ICS Export & Import
  const exportICS = useCallback(() => {
    const icsContent = exportEventsToICS(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `chronos_calendar_export_${formatDateToYYYYMMDD(new Date())}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported calendar as .ics file', undefined, undefined, 'success');
  }, [events, showToast]);

  const importICS = useCallback((content: string): number => {
    const imported = parseICSContent(content);
    if (imported.length === 0) {
      showToast('No valid events found in .ics file', undefined, undefined, 'warning');
      return 0;
    }
    const primaryCal = calendars.find(c => c.isPrimary) || calendars[0];
    const newItems: CalendarEvent[] = imported.map((item, idx) => ({
      id: `evt_import_${Date.now()}_${idx}`,
      calendarId: primaryCal.id,
      type: 'event',
      title: item.title || 'Imported Event',
      description: item.description || '',
      location: item.location || '',
      startDate: item.startDate || formatDateToYYYYMMDD(new Date()),
      endDate: item.endDate || item.startDate || formatDateToYYYYMMDD(new Date()),
      startTime: item.startTime,
      endTime: item.endTime,
      isAllDay: item.isAllDay ?? false,
      notifications: [{ type: 'notification', minutesBefore: 10 }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setEvents(prev => [...prev, ...newItems]);
    showToast(`Successfully imported ${newItems.length} events!`, undefined, undefined, 'success');
    return newItems.length;
  }, [calendars, showToast]);

  // Check reminders and trigger in-app notification toasts
  useEffect(() => {
    if (!settings.eventNotificationSound) return;

    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = formatDateToYYYYMMDD(now);
      const curH = now.getHours();
      const curM = now.getMinutes();
      const nowTotalMins = curH * 60 + curM;

      events.forEach(event => {
        if (event.deletedAt || event.isAllDay || !event.startTime || event.startDate !== todayStr) return;
        const [h, m] = event.startTime.split(':').map(Number);
        const eventMins = h * 60 + m;
        const diffMins = eventMins - nowTotalMins;

        // Check if event has a reminder matching this exact minute
        event.notifications?.forEach(notif => {
          if (notif.minutesBefore === diffMins) {
            showToast(
              `Reminder: "${event.title}" starts in ${diffMins} min!`,
              'View',
              () => openEventDetails(event),
              'warning'
            );
          }
        });
      });
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, [events, settings.eventNotificationSound, showToast, openEventDetails]);

  const value = useMemo(
    () => ({
      events,
      calendars,
      settings,
      trash,
      currentDate,
      currentView,
      sidebarOpen,
      tasksSidebarOpen,
      activeOverlaidPeople,
      searchQuery,
      advancedFilters,
      isSearchOpen,
      selectedEvent,
      popoverAnchor,
      isEditorOpen,
      editingEvent,
      isQuickCreateOpen,
      quickCreateData,
      isSettingsOpen,
      settingsInitialTab,
      isHelpOpen,
      isBookingPageOpen,
      bookingScheduleEvent,
      recurringActionDialog,
      toasts,
      setCurrentDate,
      goToToday,
      navigateNext,
      navigatePrev,
      setCurrentView,
      toggleSidebar,
      toggleTasksSidebar,
      setSearchQuery,
      setAdvancedFilters,
      setIsSearchOpen,
      togglePersonOverlay,
      toggleCalendarVisibility,
      setCalendarColor,
      displayOnlyCalendar,
      addCalendar,
      updateCalendar,
      deleteCalendar,
      addEvent,
      updateEvent,
      deleteEvent,
      duplicateEvent,
      quickToggleTaskCompletion,
      restoreFromTrash,
      deleteForeverFromTrash,
      emptyTrash,
      updateSettings,
      toggleTheme,
      openQuickCreate,
      closeQuickCreate,
      openEditor,
      closeEditor,
      openEventDetails,
      closeEventDetails,
      openSettings,
      closeSettings,
      openHelp,
      closeHelp,
      openBookingPage,
      closeBookingPage,
      handleRecurringChoice,
      closeRecurringDialog,
      showToast,
      removeToast,
      seedDemoData,
      clearAllData,
      exportICS,
      importICS,
    }),
    [
      events,
      calendars,
      settings,
      trash,
      currentDate,
      currentView,
      sidebarOpen,
      tasksSidebarOpen,
      activeOverlaidPeople,
      searchQuery,
      advancedFilters,
      isSearchOpen,
      selectedEvent,
      popoverAnchor,
      isEditorOpen,
      editingEvent,
      isQuickCreateOpen,
      quickCreateData,
      isSettingsOpen,
      settingsInitialTab,
      isHelpOpen,
      isBookingPageOpen,
      bookingScheduleEvent,
      recurringActionDialog,
      toasts,
      setCurrentDate,
      goToToday,
      navigateNext,
      navigatePrev,
      setCurrentView,
      toggleSidebar,
      toggleTasksSidebar,
      setSearchQuery,
      setAdvancedFilters,
      setIsSearchOpen,
      togglePersonOverlay,
      toggleCalendarVisibility,
      setCalendarColor,
      displayOnlyCalendar,
      addCalendar,
      updateCalendar,
      deleteCalendar,
      addEvent,
      updateEvent,
      deleteEvent,
      duplicateEvent,
      quickToggleTaskCompletion,
      restoreFromTrash,
      deleteForeverFromTrash,
      emptyTrash,
      updateSettings,
      toggleTheme,
      openQuickCreate,
      closeQuickCreate,
      openEditor,
      closeEditor,
      openEventDetails,
      closeEventDetails,
      openSettings,
      closeSettings,
      openHelp,
      closeHelp,
      openBookingPage,
      closeBookingPage,
      handleRecurringChoice,
      closeRecurringDialog,
      showToast,
      removeToast,
      seedDemoData,
      clearAllData,
      exportICS,
      importICS,
    ]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
