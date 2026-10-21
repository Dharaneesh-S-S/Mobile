import React from 'react'
import { DailyUsage } from '../../types'
import { formatDuration } from '../../utils/formatters'
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from 'lucide-react'
import { calculateDelta } from '../../utils/aggregations'

interface WeekOverWeekCardProps {
  thisWeekUsages: DailyUsage[]
  lastWeekUsages: DailyUsage[]
}

export const WeekOverWeekCard: React.FC<WeekOverWeekCardProps> = ({
  thisWeekUsages,
  lastWeekUsages,
}) => {
  const thisWeekTotal = thisWeekUsages.reduce((a, b) => a + b.totalScreenTimeMinutes, 0)
  const lastWeekTotal = lastWeekUsages.reduce((a, b) => a + b.totalScreenTimeMinutes, 0)

  const overallDelta = calculateDelta(thisWeekTotal, lastWeekTotal, true)

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Align days
  const pairedDays = dayNames.map((name, i) => {
    const thisDay = thisWeekUsages[i]?.totalScreenTimeMinutes || 0
    const lastDay = lastWeekUsages[i]?.totalScreenTimeMinutes || 0
    return {
      name,
      thisDay,
      lastDay,
    }
  })

  const maxVal = Math.max(300, ...pairedDays.map((d) => Math.max(d.thisDay, d.lastDay)))
  const chartHeight = 120

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Week-over-Week Comparison
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Paired daily comparison vs previous 7-day period
          </p>
        </div>

        {/* Delta Tag */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            overallDelta.isBetter
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}
        >
          {overallDelta.diff < 0 ? (
            <TrendingDown size={14} />
          ) : (
            <TrendingUp size={14} />
          )}
          <span>{overallDelta.label} total change</span>
        </div>
      </div>

      {/* Paired SVG Bars */}
      <div className="relative w-full h-[120px] select-none my-2">
        <svg
          viewBox="0 0 350 120"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Week-over-week paired bar chart"
        >
          {pairedDays.map((d, i) => {
            const groupW = 38
            const x = i * 50 + 6
            const thisH = (d.thisDay / maxVal) * chartHeight
            const lastH = (d.lastDay / maxVal) * chartHeight

            return (
              <g key={d.name}>
                {/* Last week bar (left, muted) */}
                <rect
                  x={x}
                  y={chartHeight - lastH}
                  width="13"
                  height={lastH}
                  fill="#94a3b8"
                  className="opacity-60"
                  rx="3"
                />

                {/* This week bar (right, emerald) */}
                <rect
                  x={x + 15}
                  y={chartHeight - thisH}
                  width="13"
                  height={thisH}
                  fill="#10b981"
                  rx="3"
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Day Labels */}
      <div className="flex justify-between text-[10px] font-bold text-gray-400 px-2 mt-1">
        {dayNames.map((n) => (
          <span key={n} className="w-8 text-center">
            {n}
          </span>
        ))}
      </div>

      {/* Totals Summary */}
      <div className="flex items-center justify-between text-xs pt-3 mt-2 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-gray-800 dark:text-gray-200 font-semibold">
            This: {formatDuration(thisWeekTotal)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-400" />
          <span className="text-gray-500 dark:text-gray-400">
            Last: {formatDuration(lastWeekTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
