import React, { useState } from 'react'
import { DailyUsage } from '../../types'
import { formatDateLabel, formatDuration, getOffsetDateStr, getTodayDateStr } from '../../utils/formatters'

interface CalendarHeatmapProps {
  usages: DailyUsage[]
  onSelectDay?: (date: string) => void
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  usages,
  onSelectDay,
}) => {
  const [activeCell, setActiveCell] = useState<{ date: string; minutes: number } | null>(null)

  const usageMap: Record<string, number> = {}
  usages.forEach((u) => {
    usageMap[u.date] = u.totalScreenTimeMinutes
  })

  // 12 weeks = 84 days
  const today = getTodayDateStr()
  const days: { date: string; minutes: number; dayOfWeek: number }[] = []

  for (let i = 83; i >= 0; i--) {
    const dStr = getOffsetDateStr(-i, today)
    const [y, m, d] = dStr.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    const dow = (dt.getDay() + 6) % 7 // 0 = Mon, 6 = Sun
    days.push({
      date: dStr,
      minutes: usageMap[dStr] || 0,
      dayOfWeek: dow,
    })
  }

  // Group into 12 columns of 7 days
  const weeks: { date: string; minutes: number }[][] = []
  let currentWeek: { date: string; minutes: number }[] = []

  days.forEach((day) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  if (currentWeek.length > 0) weeks.push(currentWeek)

  // Color intensity scale
  const getColor = (mins: number) => {
    if (mins === 0) return 'bg-gray-100 dark:bg-neutral-800'
    if (mins < 120) return 'bg-emerald-200 dark:bg-emerald-950 text-emerald-800'
    if (mins < 240) return 'bg-emerald-400 dark:bg-emerald-700 text-white'
    if (mins < 360) return 'bg-emerald-600 dark:bg-emerald-500 text-white'
    return 'bg-emerald-700 dark:bg-emerald-400 text-white'
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="p-5 rounded-[28px] glass-card shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Activity Heatmap</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            12-week screen time intensity. Tap cell to open day.
          </p>
        </div>
      </div>

      {/* Selected Cell Preview */}
      {activeCell && (
        <div className="mb-3 p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-emerald-500/30 text-xs flex items-center justify-between animate-fade-in shadow-sm backdrop-blur-md">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDateLabel(activeCell.date)} ({activeCell.date}):{' '}
            </span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              {formatDuration(activeCell.minutes)}
            </span>
          </div>

          {onSelectDay && (
            <button
              onClick={() => onSelectDay(activeCell.date)}
              className="px-2 py-0.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-[10px]"
            >
              View Day
            </button>
          )}
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 select-none">
        {/* Row Day Labels */}
        <div className="flex flex-col gap-1.5 justify-between py-0.5 text-[9px] font-bold text-gray-400 shrink-0">
          {dayLabels.map((l, i) => (
            <span key={i} className="h-4 flex items-center justify-center">
              {l}
            </span>
          ))}
        </div>

        {/* 12 Columns */}
        <div className="flex gap-1.5 flex-1 justify-between">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((cell) => {
                const isSelected = activeCell?.date === cell.date
                return (
                  <button
                    key={cell.date}
                    onClick={() => {
                      setActiveCell(cell)
                      if (onSelectDay) onSelectDay(cell.date)
                    }}
                    onMouseEnter={() => setActiveCell(cell)}
                    className={`w-4 h-4 rounded-md transition-all ${getColor(
                      cell.minutes
                    )} ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 scale-125 z-10'
                        : 'hover:scale-110'
                    }`}
                    title={`${cell.date}: ${formatDuration(cell.minutes)}`}
                    aria-label={`${cell.date}: ${formatDuration(cell.minutes)}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-neutral-800">
        <span>Less</span>
        <span className="w-3 h-3 rounded-xs bg-gray-100 dark:bg-neutral-800" />
        <span className="w-3 h-3 rounded-xs bg-emerald-200 dark:bg-emerald-950" />
        <span className="w-3 h-3 rounded-xs bg-emerald-400 dark:bg-emerald-700" />
        <span className="w-3 h-3 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
        <span className="w-3 h-3 rounded-xs bg-emerald-700 dark:bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  )
}
