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
      {/* Sub Tab Bar */}
      <div className="sticky top-[68px] z-20 bg-slate-50/90 dark:bg-[#090D16]/90 backdrop-blur-xl px-4 py-2.5 border-b border-slate-200/70 dark:border-white/[0.06] flex gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-2 sm:px-4 pt-4">
        {/* TAB 1: Screen time */}
        {activeTab === 'screen_time' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 animate-fade-in items-start">
            {/* 1. Daily stacked column chart by hour */}
            <div className="lg:col-span-2">
              <HourlyStackedBarChart
                hourly={todayUsage.hourly}
                apps={apps}
                goalMinutes={goalMinutes}
                isColorblindSafe={isColorblindSafe}
              />
            </div>

            {/* 2. Weekly stacked column chart */}
            <div>
              <CategoryWeeklyChart
                usages={usages}
                isColorblindSafe={isColorblindSafe}
                onSelectDay={onSelectDay}
              />
            </div>

            {/* 3. 30-day area/line trend with 7/30/90d filter */}
            <div>
              <TrendAreaChart usages={usages} goalMinutes={goalMinutes} />
            </div>

            {/* 4. Donut chart with category filter & total in center */}
            <div>
              <CategoryDonutChart
                categoryTotals={todayUsage.categoryTotals}
                apps={apps}
                appTotals={todayUsage.appTotals}
                isColorblindSafe={isColorblindSafe}
                onSelectApp={onSelectApp}
              />
            </div>

            {/* 5. Horizontal bar chart: top 10 apps with % */}
            <div>
              <TopAppsHorizontalBarChart
                apps={apps}
                appTotals={todayUsage.appTotals}
                onSelectApp={onSelectApp}
              />
            </div>

            {/* 6. Calendar heatmap (GitHub-style 12 weeks) */}
            <div className="lg:col-span-2">
              <CalendarHeatmap usages={usages} onSelectDay={onSelectDay} />
            </div>

            {/* 12. Radar chart: category balance this week vs last week */}
            <div>
              <CategoryRadarChart
                thisWeekUsages={thisWeekUsages}
                lastWeekUsages={lastWeekUsages}
              />
            </div>

            {/* 13. Week-over-week comparison card */}
            <div>
              <WeekOverWeekCard
                thisWeekUsages={thisWeekUsages}
                lastWeekUsages={lastWeekUsages}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Unlocks */}
        {activeTab === 'unlocks' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 animate-fade-in items-start">
            {/* 8. Unlocks chart: hourly unlocks + 30-day average line */}
            <div className="lg:col-span-8">
              <UnlocksChart
                todayHourly={todayUsage.hourly}
                last30Days={usages.slice(-30)}
              />
            </div>

            <div className="lg:col-span-4 p-5 rounded-[28px] glass-card shadow-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              <span className="font-bold text-slate-900 dark:text-white block text-sm mb-2">
                About Phone Unlocks
              </span>
              Checking your phone frequently creates cognitive fragmentation. Setting app timers
              and keeping your phone out of sight during focus sessions can reduce mindless pickups by up to 40%.
            </div>
          </div>
        )}

        {/* TAB 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 animate-fade-in items-start">
            {/* 9. Notifications chart: stacked bar by hour + ranked list of apps */}
            <div className="lg:col-span-8">
              <NotificationsChart
                hourly={todayUsage.hourly}
                apps={apps}
                onSelectApp={onSelectApp}
              />
            </div>

            <div className="lg:col-span-4 p-5 rounded-[28px] glass-card shadow-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              <span className="font-bold text-slate-900 dark:text-white block text-sm mb-2">
                Notification Fatigue Tip
              </span>
              Batching communication alerts (WhatsApp, Slack) into 2-3 specific check-in times during the day significantly lowers background anxiety and interruption frequency.
            </div>
          </div>
        )}

        {/* TAB 4: Patterns */}
        {activeTab === 'patterns' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 animate-fade-in items-start">
            {/* 7. Hour-by-weekday heatmap (7 rows x 24 columns) */}
            <div className="lg:col-span-2">
              <HourWeekdayHeatmap usages={usages} />
            </div>

            {/* 10. Pickup-vs-duration scatter plot */}
            <div>
              <PickupDurationScatterPlot
                apps={apps}
                appTotals={todayUsage.appTotals}
                onSelectApp={onSelectApp}
              />
            </div>

            {/* 11. Sleep-window chart: 7 nights around bedtime target band */}
            <div>
              <SleepWindowChart last7Days={thisWeekUsages} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
