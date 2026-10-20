import { CalendarCategory, CalendarEvent, Settings } from '../types/calendar';
import { formatDateToYYYYMMDD, addDays } from '../utils/dateUtils';

export const DEFAULT_CALENDARS: CalendarCategory[] = [
  {
    id: 'cal_my_calendar',
    name: 'My Calendar',
    color: '#2563eb', // Brand Blue
    isPrimary: true,
    isVisible: true,
    description: 'Personal and work events',
  },
  {
    id: 'cal_birthdays',
    name: 'Birthdays',
    color: '#10b981', // Emerald
    isVisible: true,
    description: 'Anniversaries and friends birthdays',
  },
  {
    id: 'cal_tasks',
    name: 'Tasks',
    color: '#f59e0b', // Amber
    isVisible: true,
    description: 'Scheduled todos and action items',
  },
  {
    id: 'cal_holidays',
    name: 'Holidays in India & US',
    color: '#8b5cf6', // Violet
    isVisible: true,
    isSubscribed: true,
    description: 'Official national and international holidays',
  },
];

export const MOCK_CONTACTS = [
  {
    id: 'person_alex',
    name: 'Alex Chen',
    email: 'alex.chen@chronos.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    color: '#f43f5e',
    role: 'Product Lead',
  },
  {
    id: 'person_priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@chronos.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    color: '#06b6d4',
    role: 'Principal Architect',
  },
  {
    id: 'person_marcus',
    name: 'Marcus Vance',
    email: 'marcus.vance@chronos.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    color: '#8b5cf6',
    role: 'VP Engineering',
  },
];

export const DEFAULT_SETTINGS: Settings = {
  language: 'English (US)',
  country: 'United States',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
  secondaryTimeZone: 'America/New_York',
  showWeekends: true,
  startWeekOn: 0, // Sunday
  defaultView: 'week',
  density: 'comfortable',
  eventNotificationSound: true,
  defaultEventDuration: 30,
  speedyMeetings: false,
  defaultGuestCanModify: false,
  defaultGuestCanInviteOthers: true,
  defaultGuestCanSeeGuests: true,
  autoAddVideoCall: true,
  showDeclinedEvents: true,
  showCompletedTasks: true,
  dimPastEvents: true,
  showWeekNumbers: false,
  showWorldClock: true,
  worldClockCities: ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata'],
  enableShortcuts: true,
  theme: 'light',
};

export function generateSeedEvents(): CalendarEvent[] {
  const today = new Date();
  const todayStr = formatDateToYYYYMMDD(today);
  const tomorrowStr = formatDateToYYYYMMDD(addDays(today, 1));
  const yesterdayStr = formatDateToYYYYMMDD(addDays(today, -1));
  const nextWeekStr = formatDateToYYYYMMDD(addDays(today, 5));

  return [
    {
      id: 'evt_sprint_sync',
      calendarId: 'cal_my_calendar',
      type: 'event',
      title: 'Sprint Planning & Roadmap Sync',
      description: 'Review Q4 priorities, unblock design dependencies, and assign sprint tickets.',
      location: 'Conference Room Alpha / Virtual',
      startDate: todayStr,
      startTime: '10:00',
      endDate: todayStr,
      endTime: '11:15',
      isAllDay: false,
      busyStatus: 'busy',
      visibility: 'public',
      colorOverride: '#2563eb',
      guests: [
        { email: 'alex.chen@chronos.io', name: 'Alex Chen', status: 'yes' },
        { email: 'priya.sharma@chronos.io', name: 'Priya Sharma', status: 'maybe' },
        { email: 'marcus.vance@chronos.io', name: 'Marcus Vance', status: 'needs_action', isOptional: true },
      ],
      videoConference: {
        id: 'conf_101',
        url: 'https://meet.chronos.app/sprint-planning-sync',
        platform: 'Chronos Video Meet',
      },
      notifications: [
        { type: 'notification', minutesBefore: 15 },
        { type: 'email', minutesBefore: 60 },
      ],
      attachments: [
        { id: 'att_1', name: 'Sprint_Backlog_Specs.pdf', size: '2.4 MB' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'evt_deep_work',
      calendarId: 'cal_my_calendar',
      type: 'focus_time',
      title: 'Deep Work: Core Engine Refactoring',
      description: 'No meetings. Phone silenced. Implementing recurrence algorithms.',
      startDate: todayStr,
      startTime: '14:00',
      endDate: todayStr,
      endTime: '16:00',
      isAllDay: false,
      busyStatus: 'busy',
      focusTime: {
        autoDecline: true,
        doNotDisturb: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'evt_standup_recurring',
      calendarId: 'cal_my_calendar',
      type: 'event',
      title: 'Engineering Daily Standup',
      description: 'Quick 15-minute sync on yesterday achievements, today goals, blockers.',
      startDate: yesterdayStr,
      startTime: '09:30',
      endDate: yesterdayStr,
      endTime: '09:45',
      isAllDay: false,
      recurrence: {
        frequency: 'every_weekday',
      },
      videoConference: {
        id: 'conf_102',
        url: 'https://meet.chronos.app/daily-eng-standup',
        platform: 'Chronos Video Meet',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'evt_task_okr',
      calendarId: 'cal_tasks',
      type: 'task',
      title: 'Finalize Q4 OKR Presentation',
      description: 'Incorporate revenue metrics and engineering velocity charts.',
      startDate: todayStr,
      startTime: '17:30',
      endDate: todayStr,
      endTime: '18:00',
      isAllDay: false,
      isCompleted: false,
      subtasks: [
        { id: 'st_1', title: 'Export Mixpanel analytics figures', completed: true },
        { id: 'st_2', title: 'Gather design system adoption stats', completed: false },
        { id: 'st_3', title: 'Send draft slides to executive sponsor', completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'evt_work_loc',
      calendarId: 'cal_my_calendar',
      type: 'working_location',
      title: 'Working from Office (Tech Park)',
      workingLocation: 'office',
      workingLocationDetails: 'Campus 4, 3rd Floor Desk #42',
      startDate: todayStr,
      endDate: todayStr,
      isAllDay: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'evt_birthday_friend',
      calendarId: 'cal_birthdays',
      type: 'event',
      title: 'Sarah Jenkins Birthday 🎂',
      startDate: tomorrowStr,
      endDate: tomorrowStr,
      isAllDay: true,
      colorOverride: '#10b981',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'evt_appointment_booking',
      calendarId: 'cal_my_calendar',
      type: 'appointment_schedule',
      title: '30-Minute 1:1 Advisory Session',
      description: 'Book a 30-minute slot for architectural consultation or career mentoring.',
      startDate: todayStr,
      endDate: nextWeekStr,
      isAllDay: true,
      appointmentSchedule: {
        durationMinutes: 30,
        availableDays: [1, 2, 3, 4, 5], // Mon..Fri
        startTime: '14:00',
        endTime: '18:00',
        bufferMinutes: 15,
        bookingWindowDays: 14,
        publicSlug: 'advisory-consultation',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export const DEMO_EVENTS: CalendarEvent[] = generateSeedEvents();
