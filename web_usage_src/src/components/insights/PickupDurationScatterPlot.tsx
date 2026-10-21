import React, { useState } from 'react'
import { AppInfo } from '../../types'
import { formatDuration } from '../../utils/formatters'
import { AppIcon } from '../common/AppIcon'

interface PickupDurationScatterPlotProps {
  apps: AppInfo[]
  appTotals: Record<string, number>
  onSelectApp?: (appId: string) => void
}

export const PickupDurationScatterPlot: React.FC<PickupDurationScatterPlotProps> = ({
  apps,
  appTotals,
  onSelectApp,
}) => {
  const [activeApp, setActiveApp] = useState<{
    app: AppInfo
    opens: number
    minutes: number
    notifications: number
  } | null>(null)

  // Compute metrics for active apps
  const points = apps
    .map((app) => {
      const minutes = appTotals[app.id] || 0
      if (minutes === 0) return null
      // Estimate opens based on app type
      const isQuickCheck = app.category === 'Communication' || app.id === 'whatsapp'
      const opens = isQuickCheck
        ? Math.max(8, Math.round(minutes / 4))
        : Math.max(2, Math.round(minutes / 16))
      const notifications = Math.max(5, Math.round(minutes / 3))

      return {
        app,
        opens,
        minutes,
        notifications,
      }
    })
    .filter(Boolean) as {
    app: AppInfo
    opens: number
    minutes: number
    notifications: number
  }[]

  const maxX = Math.max(30, ...points.map((p) => p.opens)) + 5
  const maxY = Math.max(100, ...points.map((p) => p.minutes)) + 15

  const chartWidth = 360
  const chartHeight = 180
  const padding = 30

  return (
    <div className="p-5 rounded-[28px] glass-card shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>Session Duration vs. Open Frequency</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Bubble size = notifications. Spots quick-check vs long-session apps.
          </p>
        </div>
      </div>

      {/* Active App Tooltip Card */}
      {activeApp && (
        <div className="mb-3 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-teal-500/30 text-xs flex items-center justify-between animate-fade-in shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AppIcon
              name={activeApp.app.name}
              iconName={activeApp.app.icon}
              color={activeApp.app.accentColor}
              size={13}
            />
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {activeApp.app.name}
              </span>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                {activeApp.opens} opens • {formatDuration(activeApp.minutes)} total • {activeApp.notifications} alerts
              </div>
            </div>
          </div>

          {onSelectApp && (
            <button
              onClick={() => onSelectApp(activeApp.app.id)}
              className="px-2 py-1 rounded-xl bg-emerald-500 text-neutral-950 text-[10px] font-bold"
            >
              Details
            </button>
          )}
        </div>
      )}

      {/* SVG Scatter Plot */}
      <div className="relative w-full h-[180px] select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Pickup vs duration scatter plot"
        >
          {/* Background Grid Lines & Quadrant labels */}
          <line
            x1={padding}
            y1={chartHeight / 2}
            x2={chartWidth - 10}
            y2={chartHeight / 2}
            stroke="#e5e7eb"
            className="dark:stroke-neutral-800"
            strokeDasharray="2 2"
          />
          <line
            x1={chartWidth / 2}
            y1={10}
            x2={chartWidth / 2}
            y2={chartHeight - padding}
            stroke="#e5e7eb"
            className="dark:stroke-neutral-800"
            strokeDasharray="2 2"
          />

          <text
            x={padding + 6}
            y={24}
            className="text-[9px] fill-gray-400 font-medium"
          >
            Long sessions
          </text>
          <text
            x={chartWidth - 75}
            y={chartHeight - padding - 6}
            className="text-[9px] fill-gray-400 font-medium"
          >
            Quick checks
          </text>

          {/* Bubbles */}
          {points.map((p) => {
            const cx = padding + (p.opens / maxX) * (chartWidth - padding - 20)
            const cy = chartHeight - padding - (p.minutes / maxY) * (chartHeight - padding - 20)
            const r = Math.min(18, Math.max(7, Math.round(p.notifications / 4)))
            const isSelected = activeApp?.app.id === p.app.id

            return (
              <g
                key={p.app.id}
                className="cursor-pointer transition-transform"
                onClick={() => setActiveApp(activeApp?.app.id === p.app.id ? null : p)}
                onMouseEnter={() => setActiveApp(p)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? r + 3 : r}
                  fill={p.app.accentColor}
                  fillOpacity={0.7}
                  stroke={isSelected ? '#ffffff' : p.app.accentColor}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all hover:fill-opacity-95"
                />
                <text
                  x={cx}
                  y={cy + 3}
                  textAnchor="middle"
                  className="text-[8px] font-bold fill-white pointer-events-none"
                >
                  {p.app.name.slice(0, 3)}
                </text>
              </g>
            )
          })}

          {/* Axes */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth}
            y2={chartHeight - padding}
            stroke="#9ca3af"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={0}
            x2={padding}
            y2={chartHeight - padding}
            stroke="#9ca3af"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-4">
        <span>Y: Total Minutes Used</span>
        <span>X: Number of Opens</span>
      </div>
    </div>
  )
}
