export type AppCategory =
  | 'Social'
  | 'Video'
  | 'Games'
  | 'Productivity'
  | 'Communication'
  | 'Other'

export interface AppInfo {
  id: string
  name: string
  packageName: string
  icon: string // Lucide icon identifier or SVG
  category: AppCategory
  accentColor: string
}

export interface UsageSession {
  id: string
  appId: string
  startTime: string // ISO string or HH:mm
  endTime: string // ISO string or HH:mm
  durationMinutes: number
}

export interface HourlyUsage {
  hour: number // 0 to 23
  totalMinutes: number
  appMinutes: Record<string, number>
  unlocks: number
  notifications: number
}

export interface DailyUsage {
  date: string // 'YYYY-MM-DD'
  totalScreenTimeMinutes: number
  goalMinutes: number
  unlocks: number
  notifications: number
  hourly: HourlyUsage[]
  sessions: UsageSession[]
  appTotals: Record<string, number>
  categoryTotals: Record<AppCategory, number>
  bedtimeUseMinutes: number
  firstPickupTime: string // 'HH:mm'
  lastPickupTime: string // 'HH:mm'
}

export interface AppUsageSummary {
  app: AppInfo
  totalMinutes: number
  dailyAverageMinutes: number
  openCount: number
  notificationCount: number
  averageSessionMinutes: number
  longestSessionMinutes: number
  firstUseTime: string
  lastUseTime: string
  sessions: UsageSession[]
  hourlyToday: number[]
  dailyLast7Days: { date: string; minutes: number }[]
  dailyLast30Days: { date: string; minutes: number }[]
  compareLastWeekChangePercent: number
  timerLimitMinutes: number | null
  isBlockedToday: boolean
}

export interface AppTimer {
  appId: string
  limitMinutes: number
  enabled: boolean
  daysOfWeek: number[] // 0=Sun, 1=Mon... 6=Sat
  resetTime: string // '00:00'
}

export interface FocusMode {
  enabled: boolean
  activeUntil: string | null
  schedule: {
    enabled: boolean
    days: number[]
    startTime: string
    endTime: string
  }
  distractingAppIds: string[]
  breakUntil: string | null
  streakDays: number
  sessionsHistory: { date: string; minutes: number }[]
}

export interface BedtimeConfig {
  enabled: boolean
  bedtime: string // '23:00'
  wakeTime: string // '07:00'
  days: number[]
  grayscale: boolean
  dnd: boolean
  dimWallpaper: boolean
  lowerBrightness: boolean
  alwaysOnDisplayOff: boolean
}

export interface EyeProtectionConfig {
  enabled: boolean
  intensity: number // 0 to 100
  scheduleType: 'sunset' | 'custom' | 'always'
  startTime: string // '20:00'
  endTime: string // '06:00'
}

export interface DndConfig {
  enabled: boolean
  schedule: {
    enabled: boolean
    days: number[]
    start: string
    end: string
  }
  allowCalls: 'anyone' | 'contacts' | 'favorites' | 'none'
  allowRepeatCallers: boolean
  allowAlarms: boolean
}

export interface ChildProfile {
  id: string
  name: string
  age: number
  avatarColor: string
  screenTimeLimitMinutes: number
  appLimits: Record<string, number>
  downtime: {
    enabled: boolean
    start: string
    end: string
  }
  approvedAppIds: string[]
  blockedCategories: AppCategory[]
  bonusTimeMinutes: number
  locked: boolean
}

export interface ParentalControlsAlert {
  id: string
  childId: string
  childName: string
  message: string
  timestamp: string
  read: boolean
  type: 'limit_reached' | 'downtime' | 'app_blocked'
}

export interface ParentalControlsConfig {
  pin: string | null // e.g. "1234"
  children: ChildProfile[]
  activeChildId: string | null // null = whole device
  alerts: ParentalControlsAlert[]
}

export interface AchievementBadge {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string | null
}

export interface GoalConfig {
  dailyScreenTimeGoal: number // minutes, e.g. 240 (4h)
  unlocksGoal: number // e.g. 50
  categoryGoals: Partial<Record<AppCategory, number>>
  streak: number
  lastStreakDate: string
  badges: AchievementBadge[]
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  palette: 'default' | 'colorblind'
  timeFormat: '12h' | '24h'
  dailyResetTime: string
  showInAppDrawer: boolean
  notificationsEnabled: boolean
  demoProfile: 'low' | 'medium' | 'high'
  phoneFrameMode: boolean
}
