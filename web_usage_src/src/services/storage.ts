import {
  AppTimer,
  BedtimeConfig,
  ChildProfile,
  DndConfig,
  EyeProtectionConfig,
  FocusMode,
  GoalConfig,
  ParentalControlsConfig,
  UserSettings,
} from '../types'
import { getTodayDateStr } from '../utils/formatters'

const KEYS = {
  TIMERS: 'zenpulse_timers_v1',
  FOCUS: 'zenpulse_focus_v1',
  BEDTIME: 'zenpulse_bedtime_v1',
  EYECARE: 'zenpulse_eyecare_v1',
  DND: 'zenpulse_dnd_v1',
  PARENTAL: 'zenpulse_parental_v1',
  GOALS: 'zenpulse_goals_v1',
  SETTINGS: 'zenpulse_settings_v1',
  BLOCKED_TODAY: 'zenpulse_blocked_today_v1',
}

export function loadTimers(): AppTimer[] {
  try {
    const raw = localStorage.getItem(KEYS.TIMERS)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error(e)
  }
  return [
    { appId: 'instagram', limitMinutes: 45, enabled: true, daysOfWeek: [0, 1, 2, 3, 4, 5, 6], resetTime: '00:00' },
    { appId: 'tiktok', limitMinutes: 30, enabled: true, daysOfWeek: [0, 1, 2, 3, 4, 5, 6], resetTime: '00:00' },
    { appId: 'youtube', limitMinutes: 60, enabled: true, daysOfWeek: [0, 1, 2, 3, 4, 5, 6], resetTime: '00:00' },
  ]
}

export function saveTimers(timers: AppTimer[]): void {
  localStorage.setItem(KEYS.TIMERS, JSON.stringify(timers))
}

export function loadFocusMode(): FocusMode {
  try {
    const raw = localStorage.getItem(KEYS.FOCUS)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error(e)
  }
  return {
    enabled: false,
    activeUntil: null,
    schedule: {
      enabled: false,
      days: [1, 2, 3, 4, 5],
      startTime: '09:00',
      endTime: '17:00',
    },
    distractingAppIds: ['instagram', 'tiktok', 'reddit', 'subway_surfers'],
    breakUntil: null,
    streakDays: 4,
    sessionsHistory: [
      { date: getTodayDateStr(), minutes: 45 },
    ],
  }
}

export function saveFocusMode(fm: FocusMode): void {
  localStorage.setItem(KEYS.FOCUS, JSON.stringify(fm))
}

export function loadBedtimeConfig(): BedtimeConfig {
  try {
    const raw = localStorage.getItem(KEYS.BEDTIME)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error(e)
  }
  return {
    enabled: true,
    bedtime: '23:00',
    wakeTime: '07:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    grayscale: true,
    dnd: true,
    dimWallpaper: true,
    lowerBrightness: true,
    alwaysOnDisplayOff: true,
  }
}

export function saveBedtimeConfig(cfg: BedtimeConfig): void {
  localStorage.setItem(KEYS.BEDTIME, JSON.stringify(cfg))
}

export function loadEyeProtection(): EyeProtectionConfig {
  try {
    const raw = localStorage.getItem(KEYS.EYECARE)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error(e)
  }
  return {
    enabled: false,
    intensity: 45,
    scheduleType: 'sunset',
    startTime: '20:00',
    endTime: '06:30',
  }
}

export function saveEyeProtection(cfg: EyeProtectionConfig): void {
  localStorage.setItem(KEYS.EYECARE, JSON.stringify(cfg))
}

export function loadDndConfig(): DndConfig {
  try {
    const raw = localStorage.getItem(KEYS.DND)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error(e)
  }
  return {
    enabled: false,
    schedule: {
      enabled: true,
      days: [0, 1, 2, 3, 4, 5, 6],
      start: '22:30',
      end: '07:00',
    },
    allowCalls: 'favorites',
    allowRepeatCallers: true,
    allowAlarms: true,
  }
}

export function saveDndConfig(cfg: DndConfig): void {
  localStorage.setItem(KEYS.DND, JSON.stringify(cfg))
}

export function loadParentalControls(): ParentalControlsConfig {
  try {
    const raw = localStorage.getItem(KEYS.PARENTAL)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error(e)
  }
  return {
    pin: '1234',
    children: [
      {
        id: 'child_leo',
        name: 'Leo',
        age: 10,
        avatarColor: '#3B82F6',
        screenTimeLimitMinutes: 120,
        appLimits: {
          youtube: 45,
          subway_surfers: 30,
        },
        downtime: {
          enabled: true,
          start: '20:30',
          end: '07:00',
        },
        approvedAppIds: ['duolingo', 'maps', 'chrome'],
        blockedCategories: ['Social'],
        bonusTimeMinutes: 0,
        locked: false,
      },
    ],
    activeChildId: null,
    alerts: [
      {
        id: 'alert_1',
        childId: 'child_leo',
        childName: 'Leo',
        message: 'Subway Surfers reached 30m daily limit.',
        timestamp: '17:42',
        read: false,
        type: 'limit_reached',
      },
    ],
  }
}

export function saveParentalControls(cfg: ParentalControlsConfig): void {
  localStorage.setItem(KEYS.PARENTAL, JSON.stringify(cfg))
}

export function loadGoalConfig(): GoalConfig {
  try {
    const raw = localStorage.getItem(KEYS.GOALS)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error(e)
  }
  return {
    dailyScreenTimeGoal: 240, // 4 hours
    unlocksGoal: 50,
    categoryGoals: {
      Social: 60,
      Video: 90,
      Games: 45,
    },
    streak: 5,
    lastStreakDate: getTodayDateStr(),
    badges: [
      {
        id: 'badge_first_day',
        title: 'Goal Pioneer',
        description: 'First day finishing under your screen time goal',
        icon: 'Award',
        unlockedAt: '2026-10-15',
      },
      {
        id: 'badge_7_streak',
        title: '7-Day Champion',
        description: 'Maintained a 7-day screen time goal streak',
        icon: 'Flame',
        unlockedAt: '2026-10-18',
      },
      {
        id: 'badge_night_owl',
        title: 'Night Owl Cured',
        description: 'Zero phone use past bedtime for 5 consecutive nights',
        icon: 'Moon',
        unlockedAt: '2026-10-19',
      },
      {
        id: 'badge_focus_master',
        title: 'Focus Master',
        description: 'Completed 10 productive focus sessions without interruption',
        icon: 'Zap',
        unlockedAt: null,
      },
    ],
  }
}

export function saveGoalConfig(cfg: GoalConfig): void {
  localStorage.setItem(KEYS.GOALS, JSON.stringify(cfg))
}

export function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error(e)
  }
  return {
    theme: 'dark',
    palette: 'default',
    timeFormat: '12h',
    dailyResetTime: '00:00',
    showInAppDrawer: true,
    notificationsEnabled: true,
    demoProfile: 'medium',
    phoneFrameMode: false,
  }
}

export function saveUserSettings(cfg: UserSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(cfg))
}

export function loadBlockedAppsToday(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.BLOCKED_TODAY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.date === getTodayDateStr()) {
        return data.apps || []
      }
    }
  } catch (e) {
    console.error(e)
  }
  return []
}

export function saveBlockedAppsToday(apps: string[]): void {
  localStorage.setItem(
    KEYS.BLOCKED_TODAY,
    JSON.stringify({ date: getTodayDateStr(), apps })
  )
}
