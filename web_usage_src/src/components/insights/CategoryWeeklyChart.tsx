import React, { useState } from 'react'
import { AppCategory, DailyUsage } from '../../types'
import { formatDuration } from '../../utils/formatters'
import { getWeeklyCategoryRollup } from '../../utils/aggregations'

interface CategoryWeeklyChartProps {
  usages: DailyUsage[]
  isColorblindSafe?: boolean
  onSelectDay?: (date: string) => void
}

export const CategoryWeeklyChart: React.FC<CategoryWeeklyChartProps> = ({
  usages,
  isColorblindSafe = false,
  onSelectDay,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)

  const { days, averageDailyMinutes } = getWeeklyCategoryRollup(usages)

  const categories: AppCategory[] = [
    'Social',
    'Video',
    'Games',
    'Productivity',
    'Communication',
    'Other',
  ]

  const categoryColors: Record<AppCategory, string> = isColorblindSafe
    ? {
        Social: '#0072b2',
        Video: '#d55e00',
        Games: '#cc79a7',
        Productivity: '#009e73',
        Communication: '#56b4e9',
        Other: '#f0e442',
      }
    : {
        Social: '#3b82f6',
        Video: '#ef4444',
        Games: '#8b5cf6',
        Productivity: '#10b981',
        Communication: '#06b6d4',
        Other: '#94a3b8',
      }

  const chartHeight = 160
  const maxDayMinutes = Math.max(360, ...days.map((d) => d.totalMinutes))

  const activeDay = selectedDayIndex !== null ? days[selectedDayIndex] : null

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Weekly Breakdown by Category
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Mon–Sun stacked columns. Tap bar to inspect day.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="w-3 border-b-2 border-dashed border-amber-500" />
          <span>Avg ({formatDuration(averageDailyMinutes)})</span>
        </div>
      </div>

      {/* Selected Day Tooltip */}
      {activeDay && (
        <div className="mb-3 p-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700/80 flex items-center justify-between text-xs animate-fade-in">
          <div>
            <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              <span>{activeDay.dayLabel} ({activeDay.date})</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                {formatDuration(activeDay.totalMinutes)}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              {categories.map((cat) => {
                const mins = activeDay.categories[cat] || 0
                if (mins === 0) return null
                return (
                  <span key={cat}>
                    {cat}: <strong>{formatDuration(mins)}</strong>
                  </span>
                )
              })}
            </div>
          </div>

          {onSelectDay && (
            <button
              onClick={() => onSelectDay(activeDay.date)}
              className="px-2.5 py-1 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-[11px] hover:bg-emerald-600 transition-colors shrink-0"
            >
              Open Day
            </button>
          )}
        </div>
      )}

      {/* SVG Stacked Bar Chart */}
      <div className="relative w-full h-[160px] select-none">
        <svg
          viewBox="0 0 350 160"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Weekly category breakdown stacked bar chart"
        >
          {/* Average Reference Line */}
          {averageDailyMinutes > 0 && (
            <line
              x1="0"
              y1={chartHeight - (averageDailyMinutes / maxDayMinutes) * chartHeight}
              x2="350"
              y2={chartHeight - (averageDailyMinutes / maxDayMinutes) * chartHeight}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.85"
            />
          )}

          {/* 7 Daily Bars */}
          {days.map((day, idx) => {
            const barWidth = 26
            const colSpacing = 50
            const x = idx * colSpacing + 12
            const isSelected = selectedDayIndex === idx

            let currentY = chartHeight
            const segments: { cat: AppCategory; height: number; mins: number }[] = []

            categories.forEach((cat) => {
              const mins = day.categories[cat] || 0
              if (mins > 0) {
                const segHeight = Math.max(1, (mins / maxDayMinutes) * chartHeight)
                segments.push({ cat, height: segHeight, mins })
              }
            })

            return (
              <g
                key={day.date}
                className="cursor-pointer"
                onClick={() => setSelectedDayIndex(selectedDayIndex === idx ? null : idx)}
              >
                {/* Click target */}
                <rect
                  x={x - 8}
                  y={0}
                  width={barWidth + 16}
                  height={chartHeight}
                  fill={isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent'}
                  rx="6"
                />

                {/* Background column */}
                <rect
                  x={x}
                  y={0}
                  width={barWidth}
                  height={chartHeight}
                  fill="currentColor"
                  className="text-gray-100 dark:text-neutral-700/30"
                  rx="5"
                />

                {/* Stacked segments */}
                {segments.map((seg, sIdx) => {
                  currentY -= seg.height
                  return (
                    <rect
                      key={seg.cat}
                      x={x}
                      y={currentY}
                      width={barWidth}
                      height={seg.height}
                      fill={categoryColors[seg.cat]}
                      rx={sIdx === segments.length - 1 ? 5 : 0}
                      opacity={isSelected ? 1 : 0.9}
                      className="transition-all duration-200"
                    />
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Day Labels below bars */}
      <div className="flex justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-2 px-3">
        {days.map((d, i) => (
          <span
            key={d.date}
            className={`cursor-pointer ${
              selectedDayIndex === i ? 'text-emerald-500 font-extrabold' : ''
            }`}
            onClick={() => setSelectedDayIndex(i)}
          >
            {d.dayLabel}
          </span>
        ))}
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800 text-[10px] text-gray-600 dark:text-gray-300">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: categoryColors[cat] }}
            />
            <span>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
