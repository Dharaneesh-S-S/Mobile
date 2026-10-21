import React from 'react'
import { DailyUsage } from '../../types'
import { Moon, Sparkles, AlertCircle } from 'lucide-react'
import { formatDuration } from '../../utils/formatters'

interface SleepWindowChartProps {
  last7Days: DailyUsage[]
  bedtimeTarget?: string // '23:00'
  wakeTarget?: string // '07:00'
}

export const SleepWindowChart: React.FC<SleepWindowChartProps> = ({
  last7Days,
  bedtimeTarget = '23:00',
  wakeTarget = '07:00',
}) => {
  // Sort chronological
  const sorted = [...last7Days].sort((a, b) => a.date.localeCompare(b.date)).slice(-7)

  const nightsPastBedtime = sorted.filter((d) => d.bedtimeUseMinutes > 10).length

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Sleep Window & Night Usage
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Target sleep: {bedtimeTarget} – {wakeTarget}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
          <Moon size={13} />
          <span>{7 - nightsPastBedtime}/7 on track</span>
        </div>
      </div>

      {/* 7 Nights Timeline */}
      <div className="flex flex-col gap-2.5 mb-2">
        {sorted.map((day) => {
          const [y, m, d] = day.date.split('-').map(Number)
          const dt = new Date(y, m - 1, d)
          const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' })

          const hasNightUse = day.bedtimeUseMinutes > 10

          return (
            <div
              key={day.date}
              className="p-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-gray-700 dark:text-gray-300">
                  {dayName}
                </span>

                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                  <span>Last use:</span>
                  <span
                    className={`font-bold ${
                      hasNightUse
                        ? 'text-rose-500 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {day.lastPickupTime}
                  </span>
                  <span>• Wake: {day.firstPickupTime}</span>
                </div>
              </div>

              {hasNightUse ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-lg">
                  <AlertCircle size={11} />
                  <span>{formatDuration(day.bedtimeUseMinutes)} past bed</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                  <Sparkles size={11} />
                  <span>Peaceful sleep</span>
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
        <span>Bedtime mode reduces screen stimulation</span>
        <span>Target: 0m past {bedtimeTarget}</span>
      </div>
    </div>
  )
}
