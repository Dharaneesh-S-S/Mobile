import React, { useState } from 'react'
import { DailyUsage, HourlyUsage } from '../../types'
import { Unlock, Zap } from 'lucide-react'
import { formatTimeOfDay } from '../../utils/formatters'

interface UnlocksChartProps {
  todayHourly: HourlyUsage[]
  last30Days: DailyUsage[]
}

export const UnlocksChart: React.FC<UnlocksChartProps> = ({
  todayHourly,
  last30Days,
}) => {
  const [activeHour, setActiveHour] = useState<number | null>(null)

  const todayTotalUnlocks = todayHourly.reduce((acc, h) => acc + h.unlocks, 0)

  // 30-day daily unlocks average
  const total30DayUnlocks = last30Days.reduce((acc, d) => acc + d.unlocks, 0)
  const avg30DayDaily = Math.round(total30DayUnlocks / (last30Days.length || 1))
  const avgHourlyUnlock = Number((avg30DayDaily / 16).toFixed(1)) // active hours

  // Peak unlock hour today
  let peakHour = 0
  let peakCount = 0
  todayHourly.forEach((h) => {
    if (h.unlocks > peakCount) {
      peakCount = h.unlocks
      peakHour = h.hour
    }
  })

  const maxVal = Math.max(12, peakCount + 2)
  const chartHeight = 150
  const chartWidth = 400

  return (
    <div className="p-5 rounded-[28px] glass-card shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Unlocks & Pickups</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Hourly unlocks vs 30-day daily average baseline
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Unlock size={13} strokeWidth={2.4} />
          <span>{todayTotalUnlocks} unlocks</span>
        </div>
      </div>

      {/* Metric Summary Tiles */}
      <div className="grid grid-cols-2 gap-2 mb-3.5">
        <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.08]">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Peak Hour</span>
          <span className="text-sm font-display font-bold text-slate-900 dark:text-white mt-0.5 block">
            {formatTimeOfDay(peakHour)} ({peakCount} unlocks)
          </span>
        </div>
        <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700/60">
          <span className="text-[10px] text-gray-400 font-semibold block">30-Day Average</span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {avg30DayDaily} unlocks/day
          </span>
        </div>
      </div>

      {/* Selected Hour Details */}
      {activeHour !== null && (
        <div className="mb-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between animate-fade-in text-amber-700 dark:text-amber-300">
          <span className="font-semibold">
            {formatTimeOfDay(activeHour)} – {formatTimeOfDay(activeHour + 1)}:
          </span>
          <span className="font-bold">{todayHourly[activeHour]?.unlocks || 0} device unlocks</span>
        </div>
      )}

      {/* SVG Bar Chart */}
      <div className="relative w-full h-[150px] select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Hourly device unlocks chart"
        >
          {/* Average Reference Line */}
          <line
            x1="0"
            y1={chartHeight - (avgHourlyUnlock / maxVal) * chartHeight}
            x2={chartWidth}
            y2={chartHeight - (avgHourlyUnlock / maxVal) * chartHeight}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {todayHourly.map((h, i) => {
            const barW = 12
            const spacing = chartWidth / 24
            const x = i * spacing + 2
            const barH = (h.unlocks / maxVal) * chartHeight
            const y = chartHeight - barH
            const isSelected = activeHour === i

            return (
              <g
                key={h.hour}
                className="cursor-pointer"
                onClick={() => setActiveHour(activeHour === i ? null : i)}
              >
                {/* Background track */}
                <rect
                  x={x}
                  y={0}
                  width={barW}
                  height={chartHeight}
                  fill="currentColor"
                  className="text-gray-100 dark:text-neutral-700/30"
                  rx="3"
                />

                {/* Unlocks bar */}
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  fill={isSelected ? '#d97706' : '#f59e0b'}
                  rx="3"
                  className="transition-all duration-200"
                />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-2 px-1">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>
    </div>
  )
}
