import {
  AppCategory,
  AppInfo,
  AppUsageSummary,
  DailyUsage,
  HourlyUsage,
  UsageSession,
} from '../types'
import { UsageProvider } from './UsageProvider'
import { getOffsetDateStr, getTodayDateStr } from '../utils/formatters'

export const DEFAULT_APPS: AppInfo[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    packageName: 'com.instagram.android',
    icon: 'Camera',
    category: 'Social',
    accentColor: '#E1306C',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    packageName: 'com.google.android.youtube',
    icon: 'PlaySquare',
    category: 'Video',
    accentColor: '#EF4444',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    packageName: 'com.zhiliaoapp.musically',
    icon: 'Music2',
    category: 'Video',
    accentColor: '#000000',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    packageName: 'com.whatsapp',
    icon: 'MessageCircle',
    category: 'Communication',
    accentColor: '#25D366',
  },
  {
    id: 'chrome',
    name: 'Chrome',
    packageName: 'com.android.chrome',
    icon: 'Globe',
    category: 'Productivity',
    accentColor: '#3B82F6',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    packageName: 'com.reddit.frontpage',
    icon: 'Flame',
    category: 'Social',
    accentColor: '#FF4500',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    packageName: 'com.spotify.music',
    icon: 'Headphones',
    category: 'Other',
    accentColor: '#1DB954',
  },
  {
    id: 'slack',
    name: 'Slack',
    packageName: 'com.Slack',
    icon: 'Hash',
    category: 'Communication',
    accentColor: '#611f69',
  },
  {
    id: 'maps',
    name: 'Maps',
    packageName: 'com.google.android.apps.maps',
    icon: 'MapPin',
    category: 'Productivity',
    accentColor: '#10B981',
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    packageName: 'com.duolingo',
    icon: 'GraduationCap',
    category: 'Productivity',
    accentColor: '#58CC02',
  },
  {
    id: 'subway_surfers',
    name: 'Subway Surfers',
    packageName: 'com.kiloo.subwaysurf',
    icon: 'Gamepad2',
    category: 'Games',
    accentColor: '#F59E0B',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    packageName: 'com.netflix.mediaclient',
    icon: 'Tv',
    category: 'Video',
    accentColor: '#DC2626',
  },
]

// Simple Mulberry32 seeded PRNG
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STORAGE_KEY_USAGES = 'zenpulse_usages_v1'
const STORAGE_KEY_SEED = 'zenpulse_seed_v1'

export class MockUsageProvider implements UsageProvider {
  private usagesCache: Record<string, DailyUsage> = {}
  private apps: AppInfo[] = DEFAULT_APPS

  constructor(profile: 'low' | 'medium' | 'high' = 'medium') {
    this.initialize(profile)
  }

  public initialize(profile: 'low' | 'medium' | 'high' = 'medium', force: boolean = false) {
    if (!force) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_USAGES)
        if (stored) {
          this.usagesCache = JSON.parse(stored)
          if (Object.keys(this.usagesCache).length >= 80) {
            return
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached usage data, generating fresh mock data', e)
      }
    }

    this.usagesCache = this.generate90DaysMockData(profile)
    this.saveToStorage()
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_USAGES, JSON.stringify(this.usagesCache))
    } catch (e) {
      console.warn('LocalStorage quota exceeded or unavailable', e)
    }
  }

  private generate90DaysMockData(profile: 'low' | 'medium' | 'high'): Record<string, DailyUsage> {
    const data: Record<string, DailyUsage> = {}
    const rand = mulberry32(1337)

    const profileMultiplier = profile === 'low' ? 0.65 : profile === 'high' ? 1.45 : 1.0
    const today = getTodayDateStr()

    // Generate 90 days backwards from today
    for (let i = 89; i >= 0; i--) {
      const dateStr = getOffsetDateStr(-i, today)
      const [y, m, d] = dateStr.split('-').map(Number)
      const dayDate = new Date(y, m - 1, d)
      const dayOfWeek = dayDate.getDay() // 0 = Sun, 6 = Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      // Base daily goal
      const goalMinutes = 240 // 4 hours goal

      // App weights
      const appWeights: Record<string, number> = {
        instagram: isWeekend ? 1.4 : 1.0,
        youtube: isWeekend ? 1.6 : 0.9,
        tiktok: isWeekend ? 1.5 : 1.1,
        whatsapp: 1.0,
        chrome: isWeekend ? 0.6 : 1.3,
        reddit: isWeekend ? 1.3 : 0.8,
        spotify: 0.8,
        slack: isWeekend ? 0.1 : 1.4,
        maps: isWeekend ? 1.2 : 0.7,
        duolingo: 0.5,
        subway_surfers: isWeekend ? 1.4 : 0.6,
        netflix: isWeekend ? 1.8 : 0.7,
      }

      const hourlyList: HourlyUsage[] = []
      const appTotals: Record<string, number> = {}
      this.apps.forEach((a) => (appTotals[a.id] = 0))

      let dayTotalMinutes = 0
      let dayUnlocks = 0
      let dayNotifications = 0
      let bedtimeUseMinutes = 0

      for (let hour = 0; hour < 24; hour++) {
        // Curve of likelihood per hour
        let hourBase = 0
        if (hour >= 0 && hour <= 4) {
          // Late night spike occasionally
          hourBase = rand() < 0.25 ? 15 + Math.floor(rand() * 20) : Math.floor(rand() * 4)
        } else if (hour >= 5 && hour <= 7) {
          // Morning wake up
          hourBase = 10 + Math.floor(rand() * 15)
        } else if (hour >= 8 && hour <= 11) {
          // Morning work
          hourBase = 20 + Math.floor(rand() * 25)
        } else if (hour >= 12 && hour <= 14) {
          // Lunch
          hourBase = 30 + Math.floor(rand() * 25)
        } else if (hour >= 15 && hour <= 18) {
          // Afternoon
          hourBase = 22 + Math.floor(rand() * 20)
        } else if (hour >= 19 && hour <= 22) {
          // Evening peak
          hourBase = 35 + Math.floor(rand() * 22)
        } else {
          // 23:00 wind down
          hourBase = 15 + Math.floor(rand() * 20)
        }

        let hourMinutes = Math.min(58, Math.round(hourBase * profileMultiplier))
        // Add random jitter
        if (hourMinutes > 0 && rand() < 0.15) {
          hourMinutes = Math.min(59, Math.round(hourMinutes * 1.25))
        }

        // App breakdown for this hour
        const hourAppMinutes: Record<string, number> = {}
        let remainingMinutes = hourMinutes

        if (hourMinutes > 0) {
          // Select 2-4 active apps this hour
          const activeApps = [...this.apps]
            .sort(() => rand() - 0.5)
            .slice(0, Math.min(4, Math.max(1, Math.floor(hourMinutes / 10))))

          let totalActiveWeight = activeApps.reduce((acc, a) => acc + (appWeights[a.id] || 1), 0)

          activeApps.forEach((app, idx) => {
            if (idx === activeApps.length - 1) {
              hourAppMinutes[app.id] = remainingMinutes
            } else {
              const portion = Math.min(
                remainingMinutes,
                Math.round(hourMinutes * ((appWeights[app.id] || 1) / totalActiveWeight))
              )
              hourAppMinutes[app.id] = portion
              remainingMinutes -= portion
            }
            appTotals[app.id] += hourAppMinutes[app.id] || 0
          })
        }

        // Unlocks and notifications
        const hrUnlocks = hourMinutes === 0 ? Math.floor(rand() * 2) : 2 + Math.floor(rand() * 6)
        const hrNotifications =
          hourMinutes === 0 ? Math.floor(rand() * 3) : 5 + Math.floor(rand() * 12)

        dayTotalMinutes += hourMinutes
        dayUnlocks += hrUnlocks
        dayNotifications += hrNotifications

        if (hour >= 23 || hour <= 5) {
          bedtimeUseMinutes += hourMinutes
        }

        hourlyList.push({
          hour,
          totalMinutes: hourMinutes,
          appMinutes: hourAppMinutes,
          unlocks: hrUnlocks,
          notifications: hrNotifications,
        })
      }

      // Group into categories
      const categoryTotals: Record<AppCategory, number> = {
        Social: 0,
        Video: 0,
        Games: 0,
        Productivity: 0,
        Communication: 0,
        Other: 0,
      }

      this.apps.forEach((app) => {
        categoryTotals[app.category] += appTotals[app.id] || 0
      })

      // Generate realistic sessions
      const sessions: UsageSession[] = []
      let sessId = 1
      const activeAppIds = Object.keys(appTotals).filter((id) => (appTotals[id] || 0) > 0)

      for (let s = 0; s < Math.min(18, activeAppIds.length * 2); s++) {
        const appId = activeAppIds[s % activeAppIds.length]
        const app = this.apps.find((a) => a.id === appId)!
        const startHr = 8 + (s % 14)
        const startMin = Math.floor(rand() * 45)
        const duration = Math.min(45, Math.max(3, Math.floor((appTotals[appId] || 10) / 4)))

        const endMin = (startMin + duration) % 60
        const endHr = startHr + Math.floor((startMin + duration) / 60)

        sessions.push({
          id: `sess_${dateStr}_${sessId++}`,
          appId,
          startTime: `${String(startHr).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`,
          endTime: `${String(endHr).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
          durationMinutes: duration,
        })
      }

      // Sort sessions by start time
      sessions.sort((a, b) => a.startTime.localeCompare(b.startTime))

      data[dateStr] = {
        date: dateStr,
        totalScreenTimeMinutes: dayTotalMinutes,
        goalMinutes,
        unlocks: dayUnlocks,
        notifications: dayNotifications,
        hourly: hourlyList,
        sessions,
        appTotals,
        categoryTotals,
        bedtimeUseMinutes,
        firstPickupTime: `07:${String(10 + Math.floor(rand() * 40)).padStart(2, '0')}`,
        lastPickupTime: `23:${String(15 + Math.floor(rand() * 40)).padStart(2, '0')}`,
      }
    }

    return data
  }

  public async getDailyUsage(date: string): Promise<DailyUsage> {
    if (this.usagesCache[date]) {
      return this.usagesCache[date]
    }
    // Return empty fallback if out of range
    return {
      date,
      totalScreenTimeMinutes: 0,
      goalMinutes: 240,
      unlocks: 0,
      notifications: 0,
      hourly: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        totalMinutes: 0,
        appMinutes: {},
        unlocks: 0,
        notifications: 0,
      })),
      sessions: [],
      appTotals: {},
      categoryTotals: {
        Social: 0,
        Video: 0,
        Games: 0,
        Productivity: 0,
        Communication: 0,
        Other: 0,
      },
      bedtimeUseMinutes: 0,
      firstPickupTime: '08:00',
      lastPickupTime: '23:00',
    }
  }

  public async getUsageRange(startDate: string, endDate: string): Promise<DailyUsage[]> {
    const results: DailyUsage[] = []
    let curr = startDate
    while (curr <= endDate) {
      if (this.usagesCache[curr]) {
        results.push(this.usagesCache[curr])
      }
      curr = getOffsetDateStr(1, curr)
    }
    return results
  }

  public async getApps(): Promise<AppInfo[]> {
    return this.apps
  }

  public async getAppUsage(
    appId: string,
    startDate: string,
    endDate: string
  ): Promise<AppUsageSummary> {
    const app = this.apps.find((a) => a.id === appId) || {
      id: appId,
      name: appId,
      packageName: `com.${appId}`,
      icon: 'Smartphone',
      category: 'Other' as AppCategory,
      accentColor: '#6B7280',
    }

    const range = await this.getUsageRange(startDate, endDate)
    const todayStr = getTodayDateStr()
    const todayUsage = this.usagesCache[todayStr]

    let totalMinutes = 0
    let daysWithUse = 0
    let openCount = 0
    let notificationCount = 0

    const dailyLast30Days: { date: string; minutes: number }[] = []
    const dailyLast7Days: { date: string; minutes: number }[] = []

    const last30Range = await this.getUsageRange(getOffsetDateStr(-30, todayStr), todayStr)
    last30Range.forEach((d) => {
      const mins = d.appTotals[appId] || 0
      dailyLast30Days.push({ date: d.date, minutes: mins })
    })

    const last7Range = await this.getUsageRange(getOffsetDateStr(-7, todayStr), todayStr)
    last7Range.forEach((d) => {
      const mins = d.appTotals[appId] || 0
      dailyLast7Days.push({ date: d.date, minutes: mins })
    })

    range.forEach((d) => {
      const mins = d.appTotals[appId] || 0
      totalMinutes += mins
      if (mins > 0) {
        daysWithUse++
        openCount += Math.max(1, Math.round(mins / 12))
        notificationCount += Math.max(2, Math.round(mins / 6))
      }
    })

    const dailyAverageMinutes = daysWithUse > 0 ? Math.round(totalMinutes / daysWithUse) : 0
    const averageSessionMinutes = openCount > 0 ? Math.round(totalMinutes / openCount) : 0
    const longestSessionMinutes = Math.min(90, Math.round(averageSessionMinutes * 2.4))

    const hourlyToday = Array.from({ length: 24 }, (_, h) => {
      return todayUsage?.hourly[h]?.appMinutes[appId] || 0
    })

    const appSessions = (todayUsage?.sessions || []).filter((s) => s.appId === appId)

    // Compare with last week
    const thisWeekMins = dailyLast7Days.reduce((a, b) => a + b.minutes, 0)
    const prevWeekDays = await this.getUsageRange(
      getOffsetDateStr(-14, todayStr),
      getOffsetDateStr(-8, todayStr)
    )
    const prevWeekMins = prevWeekDays.reduce((a, b) => a + (b.appTotals[appId] || 0), 0)
    const compareLastWeekChangePercent =
      prevWeekMins === 0 ? 0 : Math.round(((thisWeekMins - prevWeekMins) / prevWeekMins) * 100)

    return {
      app,
      totalMinutes: todayUsage?.appTotals[appId] || 0,
      dailyAverageMinutes,
      openCount,
      notificationCount,
      averageSessionMinutes,
      longestSessionMinutes,
      firstUseTime: appSessions[0]?.startTime || '09:15',
      lastUseTime: appSessions[appSessions.length - 1]?.endTime || '22:45',
      sessions: appSessions,
      hourlyToday,
      dailyLast7Days,
      dailyLast30Days,
      compareLastWeekChangePercent,
      timerLimitMinutes: null,
      isBlockedToday: false,
    }
  }

  public async recordSession(session: UsageSession): Promise<void> {
    const today = getTodayDateStr()
    const usage = await this.getDailyUsage(today)
    usage.sessions.push(session)
    usage.totalScreenTimeMinutes += session.durationMinutes
    usage.appTotals[session.appId] = (usage.appTotals[session.appId] || 0) + session.durationMinutes

    const app = this.apps.find((a) => a.id === session.appId)
    if (app) {
      usage.categoryTotals[app.category] =
        (usage.categoryTotals[app.category] || 0) + session.durationMinutes
    }

    const currentHour = new Date().getHours()
    const hourBucket = usage.hourly[currentHour]
    if (hourBucket) {
      hourBucket.totalMinutes += session.durationMinutes
      hourBucket.appMinutes[session.appId] =
        (hourBucket.appMinutes[session.appId] || 0) + session.durationMinutes
    }

    this.usagesCache[today] = usage
    this.saveToStorage()
  }

  public isNativeSource(): boolean {
    return false
  }

  public async syncFromNative(): Promise<void> {
    // Extensibility point for real Android UsageStatsManager
    // e.g. window.AndroidBridge?.fetchUsageStats(...)
  }

  public resetAllData(profile: 'low' | 'medium' | 'high' = 'medium') {
    this.initialize(profile, true)
  }
}

export const mockUsageProvider = new MockUsageProvider('medium')
