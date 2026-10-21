import React, { useState } from 'react'
import { AppInfo, HourlyUsage } from '../../types'
import { formatDuration, formatTimeOfDay } from '../../utils/formatters'
import { Bell, Unlock } from 'lucide-react'

interface HourlyStackedBarChartProps {
  hourly: HourlyUsage[]
  apps: AppInfo[]
  goalMinutes?: number
  isColorblindSafe?: boolean
  onSelectHour?: (hour: number) => void
}

export const HourlyStackedBarChart: React.FC<HourlyStackedBarChartProps> = ({
  hourly,
  apps,
  goalMinutes = 240,
  isColorblindSafe = false,
  onSelectHour,
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null)

  // Max minutes in an hour is 60. We'll set the Y domain max to 60.
  const chartHeight = 160
  const maxMinute = 60
  const hourlyGoalPace = Math.round(goalMinutes / 16) // ~15m/hr waking hours pace

  // Find top 5 apps used today across all hours
  const appTotalUsage: Record<string, number> = {}
  hourly.forEach((h) => {
    Object.entries(h.appMinutes).forEach(([appId, mins]) => {
      appTotalUsage[appId] = (appTotalUsage[appId] || 0) + mins
    })
  })

  const topAppIds = Object.keys(appTotalUsage)
    .sort((a, b) => (appTotalUsage[b] || 0) - (appTotalUsage[a] || 0))
    .slice(0, 5)

  const topApps = topAppIds
    .map((id) => apps.find((a) => a.id === id))
    .filter(Boolean) as AppInfo[]

  const otherColor = isColorblindSafe ? '#94a3b8' : '#cbd5e1'

  const activeHourData = selectedHour !== null ? hourly[selectedHour] : null

  // Determine top app for active hour
  let topAppInHour: { app: AppInfo; minutes: number } | null = null
  if (activeHourData && activeHourData.totalMinutes > 0) {
    let maxMins = 0
    let topId = ''
    Object.entries(activeHourData.appMinutes).forEach(([id, mins]) => {
      if (mins > maxMins) {
        maxMins = mins
        topId = id
      }
    })
    const found = apps.find((a) => a.id === topId)
    if (found) {
      topAppInHour = { app: found, minutes: maxMins }
    }
  }

  return (
    <div className="mx-4 mb-4 p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Hourly Activity</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            24-hour stacked breakdown by app
          </p>
        </div>

        {/* Goal Pace Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="w-3 border-b-2 border-dashed border-emerald-500" />
          <span>Goal pace ({hourlyGoalPace}m/h)</span>
        </div>
      </div>

      {/* Selected Hour Tooltip Card */}
      {activeHourData && (
        <div className="mb-3 p-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700/80 flex items-center justify-between text-xs animate-fade-in">
          <div>
            <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              <span>
                {formatTimeOfDay(activeHourData.hour)} – {formatTimeOfDay(activeHourData.hour + 1)}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                ({formatDuration(activeHourData.totalMinutes)})
              </span>
            </div>
            {topAppInHour ? (
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Top app: <span className="font-semibold">{topAppInHour.app.name}</span> (
                {formatDuration(topAppInHour.minutes)})
              </div>
            ) : (
              <div className="text-[11px] text-gray-400 mt-0.5">No app activity</div>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300 text-[11px]">
            <span className="flex items-center gap-1" title="Unlocks">
              <Unlock size={12} className="text-amber-500" />
              <span>{activeHourData.unlocks}</span>
            </span>
            <span className="flex items-center gap-1" title="Notifications">
              <Bell size={12} className="text-blue-500" />
              <span>{activeHourData.notifications}</span>
            </span>
          </div>
        </div>
      )}

      {/* Interactive SVG Stacked Chart */}
      <div className="relative w-full h-[160px] select-none">
        <svg
          viewBox="0 0 480 160"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Hourly usage stacked bar chart for 24 hours"
        >
          {/* Dashed Goal Pace Line */}
          {hourlyGoalPace <= maxMinute && (
            <line
              x1="0"
              y1={chartHeight - (hourlyGoalPace / maxMinute) * chartHeight}
              x2="480"
              y2={chartHeight - (hourlyGoalPace / maxMinute) * chartHeight}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.85"
            />
          )}

          {/* 24 Hourly Stacked Columns */}
          {hourly.map((h, i) => {
            const barWidth = 14
            const barSpacing = 20
            const x = i * barSpacing + 3
            const isSelected = selectedHour === i

            // Stack segments for this hour
            let currentY = chartHeight
            const segments: { key: string; color: string; height: number; minutes: number }[] = []

            let otherMins = h.totalMinutes

            topAppIds.forEach((appId) => {
              const mins = h.appMinutes[appId] || 0
              if (mins > 0) {
                const segHeight = Math.max(1, (mins / maxMinute) * chartHeight)
                const app = apps.find((a) => a.id === appId)
                segments.push({
                  key: appId,
                  color: app?.accentColor || '#3b82f6',
                  height: segHeight,
                  minutes: mins,
                })
                otherMins -= mins
              }
            })

            if (otherMins > 0) {
              const otherHeight = Math.max(1, (otherMins / maxMinute) * chartHeight)
              segments.push({
                key: 'other',
                color: otherColor,
                height: otherHeight,
                minutes: otherMins,
              })
            }

            return (
              <g
                key={h.hour}
                className="cursor-pointer transition-opacity"
                onClick={() => {
                  setSelectedHour(selectedHour === i ? null : i)
                  if (onSelectHour) onSelectHour(i)
                }}
              >
                {/* Invisible hover hit target */}
                <rect
                  x={x - 3}
                  y={0}
                  width={barSpacing}
                  height={chartHeight}
                  fill={isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent'}
                  rx="4"
                />

                {/* Background placeholder subtle track */}
                <rect
                  x={x}
                  y={0}
                  width={barWidth}
                  height={chartHeight}
                  fill="currentColor"
                  className="text-gray-100 dark:text-neutral-700/30"
                  rx="3"
                />

                {/* Stacked Segments */}
                {segments.map((seg) => {
                  currentY -= seg.height
                  return (
                    <rect
                      key={seg.key}
                      x={x}
                      y={currentY}
                      width={barWidth}
                      height={seg.height}
                      fill={seg.color}
                      rx={segments.indexOf(seg) === segments.length - 1 ? 3 : 0}
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

      {/* Axis Labels (0, 6, 12, 18, 24) */}
      <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-2 px-1">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>

      {/* Top Apps Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800 text-[11px] text-gray-600 dark:text-gray-300">
        {topApps.map((app) => (
          <div key={app.id} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: app.accentColor }}
            />
            <span className="truncate max-w-[80px]">{app.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: otherColor }}
          />
          <span>Other</span>
        </div>
      </div>
    </div>
  )
}
