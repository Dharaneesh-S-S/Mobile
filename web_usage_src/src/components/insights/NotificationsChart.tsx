import React, { useState } from 'react'
import { AppInfo, HourlyUsage } from '../../types'
import { Bell } from 'lucide-react'
import { AppIcon } from '../common/AppIcon'
import { formatTimeOfDay } from '../../utils/formatters'

interface NotificationsChartProps {
  hourly: HourlyUsage[]
  apps: AppInfo[]
  onSelectApp?: (appId: string) => void
}

export const NotificationsChart: React.FC<NotificationsChartProps> = ({
  hourly,
  apps,
  onSelectApp,
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null)

  const totalNotifications = hourly.reduce((acc, h) => acc + h.notifications, 0)

  // Derive notifications per app (approximate based on app usage weights)
  const appNotifs: Record<string, number> = {
    whatsapp: Math.round(totalNotifications * 0.32),
    instagram: Math.round(totalNotifications * 0.24),
    slack: Math.round(totalNotifications * 0.18),
    youtube: Math.round(totalNotifications * 0.12),
    reddit: Math.round(totalNotifications * 0.08),
    chrome: Math.round(totalNotifications * 0.06),
  }

  const rankedApps = Object.entries(appNotifs)
    .map(([id, count]) => {
      const app = apps.find((a) => a.id === id) || {
        id,
        name: id,
        packageName: `com.${id}`,
        icon: 'Bell',
        category: 'Communication' as const,
        accentColor: '#3b82f6',
      }
      return {
        app,
        count,
        percent: Math.round((count / (totalNotifications || 1)) * 100),
      }
    })
    .sort((a, b) => b.count - a.count)

  const maxVal = Math.max(15, ...hourly.map((h) => h.notifications))
  const chartHeight = 140
  const chartWidth = 400

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Notifications Received
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Hourly volume and ranked notification drivers
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full">
          <Bell size={13} />
          <span>{totalNotifications} alerts</span>
        </div>
      </div>

      {/* Selected Hour Details */}
      {selectedHour !== null && (
        <div className="mb-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex items-center justify-between text-blue-700 dark:text-blue-300">
          <span className="font-semibold">
            {formatTimeOfDay(selectedHour)} – {formatTimeOfDay(selectedHour + 1)}:
          </span>
          <span className="font-bold">
            {hourly[selectedHour]?.notifications || 0} notifications
          </span>
        </div>
      )}

      {/* SVG Bar Chart */}
      <div className="relative w-full h-[140px] select-none mb-3">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Hourly notifications stacked bar chart"
        >
          {hourly.map((h, i) => {
            const barW = 12
            const spacing = chartWidth / 24
            const x = i * spacing + 2
            const barH = (h.notifications / maxVal) * chartHeight
            const y = chartHeight - barH
            const isSelected = selectedHour === i

            return (
              <g
                key={h.hour}
                className="cursor-pointer"
                onClick={() => setSelectedHour(selectedHour === i ? null : i)}
              >
                <rect
                  x={x}
                  y={0}
                  width={barW}
                  height={chartHeight}
                  fill="currentColor"
                  className="text-gray-100 dark:text-neutral-700/30"
                  rx="3"
                />

                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  fill={isSelected ? '#1d4ed8' : '#3b82f6'}
                  rx="3"
                  className="transition-all duration-200"
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Ranked Notification Apps */}
      <div className="pt-3 border-t border-gray-100 dark:border-neutral-800">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
          Ranked by Notifications
        </span>

        <div className="flex flex-col gap-2">
          {rankedApps.map((item) => (
            <div
              key={item.app.id}
              onClick={() => onSelectApp && onSelectApp(item.app.id)}
              className="flex items-center justify-between p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-700/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <AppIcon
                  name={item.app.name}
                  iconName={item.app.icon}
                  color={item.app.accentColor}
                  size={14}
                />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {item.app.name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {item.count}
                </span>
                <span className="text-[10px] text-gray-400 w-8 text-right">
                  {item.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
