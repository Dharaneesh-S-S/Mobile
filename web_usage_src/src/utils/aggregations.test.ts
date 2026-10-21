import { describe, expect, it } from 'vitest'
import {
  calculateAverageScreenTime,
  calculateDelta,
  calculateMovingAverage,
  calculateStreak,
  validateUsageConsistency,
} from './aggregations'
import { DailyUsage } from '../types'

describe('Aggregations and Metrics Unit Tests', () => {
  it('calculates average screen time correctly', () => {
    const mockList = [
      { totalScreenTimeMinutes: 120 } as DailyUsage,
      { totalScreenTimeMinutes: 180 } as DailyUsage,
      { totalScreenTimeMinutes: 240 } as DailyUsage,
    ]
    expect(calculateAverageScreenTime(mockList)).toBe(180)
    expect(calculateAverageScreenTime([])).toBe(0)
  })

  it('calculates delta vs baseline with lower-is-better logic', () => {
    // 200 vs 250 = -50 min (-20%), which is better for screen time
    const resBetter = calculateDelta(200, 250, true)
    expect(resBetter.diff).toBe(-50)
    expect(resBetter.percent).toBe(-20)
    expect(resBetter.isBetter).toBe(true)
    expect(resBetter.label).toBe('-20%')

    // 300 vs 200 = +100 min (+50%), which is worse for screen time
    const resWorse = calculateDelta(300, 200, true)
    expect(resWorse.diff).toBe(100)
    expect(resWorse.percent).toBe(50)
    expect(resWorse.isBetter).toBe(false)
    expect(resWorse.label).toBe('+50%')
  })

  it('calculates 7-day moving averages', () => {
    const series = [10, 20, 30, 40, 50, 60, 70, 80]
    const ma = calculateMovingAverage(series, 3)
    // index 0: avg(10) = 10
    // index 1: avg(10, 20) = 15
    // index 2: avg(10, 20, 30) = 20
    // index 3: avg(20, 30, 40) = 30
    expect(ma[0]).toBe(10)
    expect(ma[1]).toBe(15)
    expect(ma[2]).toBe(20)
    expect(ma[3]).toBe(30)
  })

  it('calculates streaks correctly for days under goal', () => {
    const list = [
      { date: '2026-10-21', totalScreenTimeMinutes: 200, goalMinutes: 240 } as DailyUsage,
      { date: '2026-10-20', totalScreenTimeMinutes: 180, goalMinutes: 240 } as DailyUsage,
      { date: '2026-10-19', totalScreenTimeMinutes: 210, goalMinutes: 240 } as DailyUsage,
      { date: '2026-10-18', totalScreenTimeMinutes: 300, goalMinutes: 240 } as DailyUsage, // broken here
      { date: '2026-10-17', totalScreenTimeMinutes: 190, goalMinutes: 240 } as DailyUsage,
    ]
    const streakResult = calculateStreak(list, 240)
    expect(streakResult.currentStreak).toBe(3)
    expect(streakResult.bestStreak).toBe(3)
  })

  it('validates mathematical consistency of mock usage data', () => {
    const consistentUsage: DailyUsage = {
      date: '2026-10-21',
      totalScreenTimeMinutes: 100,
      goalMinutes: 240,
      unlocks: 30,
      notifications: 45,
      hourly: [
        { hour: 0, totalMinutes: 40, appMinutes: { app1: 40 }, unlocks: 5, notifications: 10 },
        { hour: 1, totalMinutes: 60, appMinutes: { app2: 60 }, unlocks: 10, notifications: 15 },
        ...Array.from({ length: 22 }, (_, i) => ({
          hour: i + 2,
          totalMinutes: 0,
          appMinutes: {},
          unlocks: 0,
          notifications: 0,
        })),
      ],
      sessions: [],
      appTotals: { app1: 40, app2: 60 },
      categoryTotals: {
        Social: 40,
        Video: 60,
        Games: 0,
        Productivity: 0,
        Communication: 0,
        Other: 0,
      },
      bedtimeUseMinutes: 40,
      firstPickupTime: '08:15',
      lastPickupTime: '23:45',
    }

    const val = validateUsageConsistency(consistentUsage)
    expect(val.isValid).toBe(true)
    expect(val.hourlySumDiff).toBe(0)
    expect(val.categoryVsAppDiff).toBe(0)
  })
})
