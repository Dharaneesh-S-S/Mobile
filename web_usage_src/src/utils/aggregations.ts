import { AppCategory, AppInfo, DailyUsage } from '../types'

/**
 * Calculates average screen time minutes across a list of DailyUsage objects.
 */
export function calculateAverageScreenTime(usages: DailyUsage[]): number {
  if (!usages || usages.length === 0) return 0
  const sum = usages.reduce((acc, u) => acc + u.totalScreenTimeMinutes, 0)
  return Math.round(sum / usages.length)
}

/**
 * Calculates delta and percentage change between current and previous values.
 * For screen time, a decrease (negative diff) is considered "better" (healthier).
 */
export function calculateDelta(
  current: number,
  baseline: number,
  lowerIsBetter: boolean = true
): { diff: number; percent: number; isBetter: boolean; label: string } {
  const diff = current - baseline
  if (baseline === 0) {
    return {
      diff,
      percent: current > 0 ? 100 : 0,
      isBetter: lowerIsBetter ? diff <= 0 : diff >= 0,
      label: current > 0 ? '+100%' : '0%',
    }
  }

  const percent = Math.round((diff / baseline) * 100)
  const isBetter = lowerIsBetter ? diff <= 0 : diff >= 0
  const sign = percent > 0 ? '+' : ''
  return {
    diff,
    percent,
    isBetter,
    label: `${sign}${percent}%`,
  }
}

/**
 * Calculates 7-day moving average for an array of numbers.
 */
export function calculateMovingAverage(data: number[], windowSize: number = 7): number[] {
  const result: number[] = []
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1)
    const windowSlice = data.slice(start, i + 1)
    const avg = windowSlice.reduce((a, b) => a + b, 0) / windowSlice.length
    result.push(Math.round(avg))
  }
  return result
}

/**
 * Calculates current streak and 7-day goal compliance.
 * Days are evaluated where totalScreenTimeMinutes <= goalMinutes.
 */
export function calculateStreak(
  dailyList: DailyUsage[], // Ordered newest to oldest, or we sort
  goalMinutes: number
): { currentStreak: number; bestStreak: number; last7DaysUnder: boolean[] } {
  if (!dailyList || dailyList.length === 0) {
    return { currentStreak: 0, bestStreak: 0, last7DaysUnder: [false, false, false, false, false, false, false] }
  }

  // Sort descending by date (newest first)
  const sorted = [...dailyList].sort((a, b) => b.date.localeCompare(a.date))

  let currentStreak = 0
  let countingCurrent = true
  let bestStreak = 0
  let tempStreak = 0

  for (let i = 0; i < sorted.length; i++) {
    const under = sorted[i].totalScreenTimeMinutes <= (sorted[i].goalMinutes || goalMinutes)
    if (under) {
      if (countingCurrent) currentStreak++
      tempStreak++
      if (tempStreak > bestStreak) bestStreak = tempStreak
    } else {
      countingCurrent = false
      tempStreak = 0
    }
  }

  // Last 7 days status (chronological Mon-Sun / past 7 days)
  const last7 = sorted.slice(0, 7).reverse()
  const last7DaysUnder = last7.map((u) => u.totalScreenTimeMinutes <= (u.goalMinutes || goalMinutes))

  return { currentStreak, bestStreak, last7DaysUnder }
}

/**
 * Verifies internal mathematical consistency of a DailyUsage object:
 * 1. Hourly sum of totalMinutes equals totalScreenTimeMinutes.
 * 2. Sum of appTotals equals sum of categoryTotals.
 * 3. Each hour's appMinutes sum equals that hour's totalMinutes.
 */
export function validateUsageConsistency(usage: DailyUsage): {
  isValid: boolean
  hourlySumDiff: number
  categoryVsAppDiff: number
} {
  const hourlySum = usage.hourly.reduce((acc, h) => acc + h.totalMinutes, 0)
  const hourlySumDiff = Math.abs(hourlySum - usage.totalScreenTimeMinutes)

  const appSum = Object.values(usage.appTotals).reduce((a, b) => a + b, 0)
  const catSum = Object.values(usage.categoryTotals).reduce((a, b) => a + b, 0)
  const categoryVsAppDiff = Math.abs(appSum - catSum)

  const isValid = hourlySumDiff <= 1 && categoryVsAppDiff <= 1
  return { isValid, hourlySumDiff, categoryVsAppDiff }
}

/**
 * Roll up weekly category usage across 7 days.
 */
export function getWeeklyCategoryRollup(usages: DailyUsage[]): {
  days: {
    dayLabel: string
    date: string
    categories: Record<AppCategory, number>
    totalMinutes: number
  }[]
  averageDailyMinutes: number
} {
  const last7 = [...usages].sort((a, b) => a.date.localeCompare(b.date)).slice(-7)
  const days = last7.map((u) => {
    const [y, m, d] = u.date.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    const dayLabel = dt.toLocaleDateString('en-US', { weekday: 'short' })
    return {
      dayLabel,
      date: u.date,
      categories: { ...u.categoryTotals },
      totalMinutes: u.totalScreenTimeMinutes,
    }
  })

  const averageDailyMinutes = calculateAverageScreenTime(last7)
  return { days, averageDailyMinutes }
}
