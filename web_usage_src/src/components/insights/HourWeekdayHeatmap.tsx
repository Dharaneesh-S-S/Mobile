import React, { useState } from 'react'
import { DailyUsage } from '../../types'
import { formatDuration, formatTimeOfDay } from '../../utils/formatters'

interface HourWeekdayHeatmapProps {
  usages: DailyUsage[]
}

export const HourWeekdayHeatmap: React.FC<HourWeekdayHeatmapProps> = ({ usages }) => {
  const [activeCell, setActiveCell] = useState<{
    dayName: string
    hour: number
    avgMinutes: number
  } | null>(null)

  // 7 rows (Mon=0 .. Sun=6), 24 columns (hour=0..23)
  const grid: { totalMins: number; count: number }[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => ({ totalMins: 0, count: 0 }))
  )

  usages.forEach((u) => {
    const [y, m, d] = u.date.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    const dow = (dt.getDay() + 6) % 7 // 0=Mon, 6=Sun

    u.hourly.forEach((h) => {
      if (grid[dow] && grid[dow][h.hour]) {
        grid[dow][h.hour].totalMins += h.totalMinutes
        grid[dow][h.hour].count += 1
      }
    })
  })

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const getIntensityColor = (mins: number) => {
    if (mins <= 2) return 'bg-gray-100 dark:bg-neutral-800'
    if (mins <= 10) return 'bg-purple-200 dark:bg-purple-950/70 text-purple-900'
    if (mins <= 20) return 'bg-purple-300 dark:bg-purple-900 text-purple-950'
    if (mins <= 35) return 'bg-purple-500 dark:bg-purple-700 text-white'
    return 'bg-purple-700 dark:bg-purple-500 text-white'
  }

  return (
    <div className="p-5 rounded-[28px] glass-card shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Hour-by-Weekday Heatmap</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            7 days x 24 hours. Reveals peak daily usage periods.
          </p>
        </div>
      </div>

      {/* Tooltip */}
      {activeCell && (
        <div className="mb-3 p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-purple-500/30 text-xs animate-fade-in flex items-center justify-between shadow-sm backdrop-blur-md">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {activeCell.dayName} at {formatTimeOfDay(activeCell.hour)}:
          </span>
          <span className="font-bold text-purple-600 dark:text-purple-400">
            Avg {formatDuration(activeCell.avgMinutes)}
          </span>
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-1 pt-1 select-none">
        <div className="min-w-[340px]">
          {/* Hour labels header */}
          <div className="flex text-[9px] font-bold text-gray-400 mb-1 ml-9 justify-between pr-1">
            <span>00</span>
            <span>04</span>
            <span>08</span>
            <span>12</span>
            <span>16</span>
            <span>20</span>
            <span>23</span>
          </div>

          <div className="flex flex-col gap-1">
            {dayNames.map((name, dow) => (
              <div key={name} className="flex items-center gap-1.5">
                <span className="w-7 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                  {name}
                </span>

                <div className="flex gap-1 flex-1">
                  {grid[dow].map((cell, hour) => {
                    const avgMins =
                      cell.count > 0 ? Math.round(cell.totalMins / cell.count) : 0
                    const isSelected =
                      activeCell?.dayName === name && activeCell?.hour === hour

                    return (
                      <div
                        key={hour}
                        onClick={() =>
                          setActiveCell({ dayName: name, hour, avgMinutes: avgMins })
                        }
                        onMouseEnter={() =>
                          setActiveCell({ dayName: name, hour, avgMinutes: avgMins })
                        }
                        className={`h-4 flex-1 rounded-xs cursor-pointer transition-all ${getIntensityColor(
                          avgMins
                        )} ${
                          isSelected
                            ? 'ring-2 ring-purple-500 scale-125 z-10'
                            : 'hover:scale-115'
                        }`}
                        title={`${name} ${hour}:00 - Avg ${formatDuration(avgMins)}`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-neutral-800">
        <span>0m</span>
        <span className="w-3 h-3 rounded-xs bg-gray-100 dark:bg-neutral-800" />
        <span className="w-3 h-3 rounded-xs bg-purple-200 dark:bg-purple-950/70" />
        <span className="w-3 h-3 rounded-xs bg-purple-300 dark:bg-purple-900" />
        <span className="w-3 h-3 rounded-xs bg-purple-500 dark:bg-purple-700" />
        <span className="w-3 h-3 rounded-xs bg-purple-700 dark:bg-purple-500" />
        <span>40m+</span>
      </div>
    </div>
  )
}
