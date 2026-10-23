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
    <div className="mx-4 mb-4 p-5 rounded-[28px] bg-[#051211]/90 border border-teal-500/20 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#19E6C8] shadow-[0_0_8px_rgba(25,230,200,0.8)]" />
            <span>Hourly Activity</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            24-hour stacked breakdown by app
          </p>
        </div>

        {/* Goal Pace Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-[#030707] px-2.5 py-1 rounded-full border border-teal-500/20">
          <span className="w-3 border-b-2 border-dashed border-[#19E6C8]" />
          <span>Goal pace ({hourlyGoalPace}m/h)</span>
        </div>
      </div>

      {/* Selected Hour Tooltip Card */}
      {activeHourData && (
        <div className="mb-3.5 p-3 rounded-2xl bg-[#051211]/95 border border-teal-500/30 shadow-md flex items-center justify-between text-xs animate-fade-in backdrop-blur-md">
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span className="text-xs">
                {formatTimeOfDay(activeHourData.hour)} – {formatTimeOfDay(activeHourData.hour + 1)}
              </span>
              <span className="text-[#19E6C8] font-extrabold bg-teal-500/15 px-2 py-0.5 rounded-full text-[11px] border border-teal-500/30">
                {formatDuration(activeHourData.totalMinutes)}
              </span>
            </div>
            {topAppInHour ? (
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: topAppInHour.app.accentColor }}
                />
                <span>Top app:</span>
                <span className="font-bold text-slate-200">{topAppInHour.app.name}</span>
                <span className="font-semibold text-slate-400">({formatDuration(topAppInHour.minutes)})</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 mt-1">No app activity in this hour</div>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1 bg-[#030707] border border-teal-500/20 px-2 py-1 rounded-xl text-teal-300 font-bold" title="Unlocks">
              <Unlock size={12} strokeWidth={2.4} />
              <span>{activeHourData.unlocks}</span>
            </span>
            <span className="flex items-center gap-1 bg-[#030707] border border-teal-500/20 px-2 py-1 rounded-xl text-cyan-300 font-bold" title="Notifications">
              <Bell size={12} strokeWidth={2.4} />
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
              stroke="#19E6C8"
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
                className="cursor-pointer transition-all duration-150"
                onClick={() => {
                  setSelectedHour(selectedHour === i ? null : i)
                  if (onSelectHour) onSelectHour(i)
                }}
              >
                {/* Invisible hover hit target with active halo */}
                <rect
                  x={x - 3}
                  y={0}
                  width={barSpacing}
                  height={chartHeight}
                  fill={isSelected ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}
                  stroke={isSelected ? '#10b981' : 'transparent'}
                  strokeWidth={isSelected ? '1' : '0'}
                  rx="6"
                />

                {/* Background placeholder subtle track */}
                <rect
                  x={x}
                  y={0}
                  width={barWidth}
                  height={chartHeight}
                  fill="currentColor"
                  className="text-slate-200/50 dark:text-slate-800/40"
                  rx="4"
                />

                {/* Stacked Segments */}
                {segments.map((seg, idx) => {
                  currentY -= seg.height
                  const isTopSegment = idx === segments.length - 1
                  return (
                    <rect
                      key={seg.key}
                      x={x}
                      y={currentY}
                      width={barWidth}
                      height={seg.height}
                      fill={seg.color}
                      rx={isTopSegment ? 4 : 0}
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
      <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2.5 px-1 tracking-wider">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>

      {/* Top Apps Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 mt-3.5 pt-3 border-t border-slate-200/60 dark:border-white/[0.08] text-[11px] text-slate-600 dark:text-slate-300 font-medium">
        {topApps.map((app) => (
          <div key={app.id} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: app.accentColor }}
            />
            <span className="truncate max-w-[85px] font-semibold">{app.name}</span>
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
