import React, { useState } from 'react'
import { AppInfo, DailyUsage } from '../../types'
import { CategoryWeeklyChart } from './CategoryWeeklyChart'
import { TrendAreaChart } from './TrendAreaChart'
import { CategoryDonutChart } from './CategoryDonutChart'
import { TopAppsHorizontalBarChart } from './TopAppsHorizontalBarChart'
import { CalendarHeatmap } from './CalendarHeatmap'
import { HourWeekdayHeatmap } from './HourWeekdayHeatmap'
import { UnlocksChart } from './UnlocksChart'
import { NotificationsChart } from './NotificationsChart'
import { PickupDurationScatterPlot } from './PickupDurationScatterPlot'
import { SleepWindowChart } from './SleepWindowChart'
import { CategoryRadarChart } from './CategoryRadarChart'
import { WeekOverWeekCard } from './WeekOverWeekCard'
import { HourlyStackedBarChart } from '../dashboard/HourlyStackedBarChart'

export type InsightsTab = 'screen_time' | 'unlocks' | 'notifications' | 'patterns'

interface InsightsViewProps {
  usages: DailyUsage[]
  todayUsage: DailyUsage
  apps: AppInfo[]
  goalMinutes?: number
  isColorblindSafe?: boolean
  onSelectDay?: (date: string) => void
  onSelectApp?: (appId: string) => void
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  usages,
  todayUsage,
  apps,
  goalMinutes = 240,
  isColorblindSafe = false,
  onSelectDay,
  onSelectApp,
}) => {
  const [activeTab, setActiveTab] = useState<InsightsTab>('screen_time')

  // Split last 7 and previous 7 days for comparisons
  const sorted = [...usages].sort((a, b) => a.date.localeCompare(b.date))
  const thisWeekUsages = sorted.slice(-7)
  const lastWeekUsages = sorted.slice(-14, -7)

  const tabs = [
    { id: 'screen_time' as const, label: 'Screen time' },
    { id: 'unlocks' as const, label: 'Unlocks' },
    { id: 'notifications' as const, label: 'Notifications' },
    { id: 'patterns' as const, label: 'Patterns' },
  ]

  return (
    <div className="flex flex-col pb-12">
      {/* Tab Bar */}
      <div className="sticky top-[68px] z-20 bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md px-4 py-2 border-b border-gray-100 dark:border-neutral-800 flex gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {/* TAB 1: Screen time */}
        {activeTab === 'screen_time' && (
          <div className="flex flex-col animate-fade-in">
            {/* 1. Daily stacked column chart by hour */}
            <HourlyStackedBarChart
              hourly={todayUsage.hourly}
              apps={apps}
              goalMinutes={goalMinutes}
              isColorblindSafe={isColorblindSafe}
            />

            {/* 2. Weekly stacked column chart */}
            <CategoryWeeklyChart
              usages={usages}
              isColorblindSafe={isColorblindSafe}
              onSelectDay={onSelectDay}
            />

            {/* 3. 30-day area/line trend with 7/30/90d filter */}
            <TrendAreaChart usages={usages} goalMinutes={goalMinutes} />

            {/* 4. Donut chart with category filter & total in center */}
            <CategoryDonutChart
              categoryTotals={todayUsage.categoryTotals}
              apps={apps}
              appTotals={todayUsage.appTotals}
              isColorblindSafe={isColorblindSafe}
              onSelectApp={onSelectApp}
            />

            {/* 5. Horizontal bar chart: top 10 apps with % */}
            <TopAppsHorizontalBarChart
              apps={apps}
              appTotals={todayUsage.appTotals}
              onSelectApp={onSelectApp}
            />

            {/* 6. Calendar heatmap (GitHub-style 12 weeks) */}
            <CalendarHeatmap usages={usages} onSelectDay={onSelectDay} />

            {/* 12. Radar chart: category balance this week vs last week */}
            <CategoryRadarChart
              thisWeekUsages={thisWeekUsages}
              lastWeekUsages={lastWeekUsages}
            />

            {/* 13. Week-over-week comparison card */}
            <WeekOverWeekCard
              thisWeekUsages={thisWeekUsages}
              lastWeekUsages={lastWeekUsages}
            />
          </div>
        )}

        {/* TAB 2: Unlocks */}
        {activeTab === 'unlocks' && (
          <div className="flex flex-col animate-fade-in">
            {/* 8. Unlocks chart: hourly unlocks + 30-day average line */}
            <UnlocksChart
              todayHourly={todayUsage.hourly}
              last30Days={usages.slice(-30)}
            />

            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm text-xs text-gray-500 leading-relaxed mb-4">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">
                About Phone Unlocks
              </span>
              Checking your phone frequently creates cognitive fragmentation. Setting app timers
              and keeping your phone out of sight during focus sessions can reduce mindless pickups by up to 40%.
            </div>
          </div>
        )}

        {/* TAB 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="flex flex-col animate-fade-in">
            {/* 9. Notifications chart: stacked bar by hour + ranked list of apps */}
            <NotificationsChart
              hourly={todayUsage.hourly}
              apps={apps}
              onSelectApp={onSelectApp}
            />

            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm text-xs text-gray-500 leading-relaxed mb-4">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Notification Fatigue Tip
              </span>
              Batching communication alerts (WhatsApp, Slack) into 2-3 specific check-in times during the day significantly lowers background anxiety and interruption frequency.
            </div>
          </div>
        )}

        {/* TAB 4: Patterns */}
        {activeTab === 'patterns' && (
          <div className="flex flex-col animate-fade-in">
            {/* 7. Hour-by-weekday heatmap (7 rows x 24 columns) */}
            <HourWeekdayHeatmap usages={usages} />

            {/* 10. Pickup-vs-duration scatter plot */}
            <PickupDurationScatterPlot
              apps={apps}
              appTotals={todayUsage.appTotals}
              onSelectApp={onSelectApp}
            />

            {/* 11. Sleep-window chart: 7 nights around bedtime target band */}
            <SleepWindowChart last7Days={thisWeekUsages} />
          </div>
        )}
      </div>
    </div>
  )
}
