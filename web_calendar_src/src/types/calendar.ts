export type CalendarItemType = 
  | 'event' 
  | 'task' 
  | 'out_of_office' 
  | 'focus_time' 
  | 'working_location' 
  | 'appointment_schedule';

export type ViewType = 'day' | 'week' | 'month' | 'year' | 'schedule' | 'four_day';

export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'every_weekday' | 'custom';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number; // e.g. every 2 weeks
  weekdays?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  ends?: {
    type: 'never' | 'on_date' | 'after_occurrences';
    date?: string; // YYYY-MM-DD
    occurrences?: number;
  };
}

export interface Guest {
  email: string;
  name?: string;
  status: 'yes' | 'no' | 'maybe' | 'needs_action';
  isOptional?: boolean;
  canModify?: boolean;
  canInviteOthers?: boolean;
  canSeeGuests?: boolean;
}

export interface NotificationSetting {
  type: 'notification' | 'email';
  minutesBefore: number;
}

export interface Attachment {
  id: string;
  name: string;
  size?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  type: CalendarItemType;
  title: string;
  description?: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (24-hour format)
  endDate: string; // YYYY-MM-DD
  endTime?: string; // HH:mm
  isAllDay: boolean;
  
  // Time zones
  startCityTimeZone?: string;
  endCityTimeZone?: string;
  
  // Recurrence
  recurrence?: RecurrenceRule;
  recurringEventId?: string; // points to base event for instances
  
  // Styling & Metadata
  colorOverride?: string;
  busyStatus?: 'busy' | 'free';
  visibility?: 'default' | 'public' | 'private';
  
  // Integrations & Collaboration
  guests?: Guest[];
  videoConference?: {
    id: string;
    url: string;
    platform: string;
  };
  notifications?: NotificationSetting[];
  attachments?: Attachment[];
  
  // Specialized types
  outOfOffice?: {
    autoDecline: boolean;
    declineMessage?: string;
  };
  focusTime?: {
    autoDecline: boolean;
    doNotDisturb: boolean;
  };
  workingLocation?: 'home' | 'office' | 'other';
  workingLocationDetails?: string;
  
  // Tasks
  isCompleted?: boolean;
  subtasks?: Subtask[];
  
  // Appointment schedule
  appointmentSchedule?: {
    durationMinutes: number;
    availableDays: number[]; // 0..6
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    bufferMinutes: number;
    bookingWindowDays: number;
    publicSlug: string;
  };
  
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // For Trash (kept for 30 days)
}

export interface CalendarCategory {
  id: string;
  name: string;
  color: string;
  isPrimary?: boolean;
  isVisible: boolean;
  isSubscribed?: boolean;
  description?: string;
  timeZone?: string;
  defaultReminders?: NotificationSetting[];
  sharing?: {
    isPublic: boolean;
    sharedWith: Array<{
      email: string;
      role: 'see_free_busy' | 'see_details' | 'make_changes' | 'manage_sharing';
    }>;
  };
}

export interface AdvancedSearchFilters {
  query: string;
  who?: string;
  what?: string;
  where?: string;
  startDate?: string;
  endDate?: string;
  doesntHave?: string;
  hasAttachment?: boolean;
  calendarId?: string;
}

export interface Settings {
  language: string;
  country: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  timeZone: string;
  secondaryTimeZone?: string;
  showWeekends: boolean;
  startWeekOn: 0 | 1 | 6; // 0=Sun, 1=Mon, 6=Sat
  defaultView: ViewType;
  density: 'compact' | 'comfortable';
  eventNotificationSound: boolean;
  
  // Event settings
  defaultEventDuration: number; // in minutes (15, 30, 45, 60, etc.)
  speedyMeetings: boolean; // shortens meetings by 5/10 min
  defaultGuestCanModify: boolean;
  defaultGuestCanInviteOthers: boolean;
  defaultGuestCanSeeGuests: boolean;
  autoAddVideoCall: boolean;
  
  // View options toggles
  showDeclinedEvents: boolean;
  showCompletedTasks: boolean;
  dimPastEvents: boolean;
  showWeekNumbers: boolean;
  
  // World clock
  showWorldClock: boolean;
  worldClockCities: string[];

  // System
  enableShortcuts: boolean;
  theme: 'light' | 'dark';
}
