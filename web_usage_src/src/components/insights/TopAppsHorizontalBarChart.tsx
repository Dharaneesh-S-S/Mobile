import React from 'react'
import { AppInfo } from '../../types'
import { formatDuration } from '../../utils/formatters'
import { AppIcon } from '../common/AppIcon'

interface TopAppsHorizontalBarChartProps {
  apps: AppInfo[]
  appTotals: Record<string, number>
  onSelectApp?: (appId: string) => void
}

export const TopAppsHorizontalBarChart: React.FC<TopAppsHorizontalBarChartProps> = ({
  apps,
  appTotals,
  onSelectApp,
}) => {
  const totalScreenTime = Object.values(appTotals).reduce((a, b) => a + b, 0) || 1

  const sorted = [...apps]
    .map((app) => ({
      ...app,
      minutes: appTotals[app.id] || 0,
      percent: Math.round(((appTotals[app.id] || 0) / totalScreenTime) * 100),
    }))
    .filter((a) => a.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 10)

  return (
    <div className="p-5 rounded-[28px] glass-card shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Top 10 Apps by Usage</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Percentage share of total screen time
          </p>
        </div>
        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          {formatDuration(totalScreenTime)} Total
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectApp && onSelectApp(item.id)}
            className="flex flex-col gap-1 cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold w-3.5">
                  {idx + 1}.
                </span>
                <AppIcon
                  name={item.name}
                  iconName={item.icon}
                  color={item.accentColor}
                  size={13}
                />
                <span className="text-gray-800 dark:text-gray-200 group-hover:text-emerald-500 transition-colors">
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">
                  {formatDuration(item.minutes)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium w-8 text-right">
                  {item.percent}%
                </span>
              </div>
            </div>

            {/* Progress Bar with Percentage Tag */}
            <div className="w-full bg-gray-100 dark:bg-neutral-700/40 h-2.5 rounded-full overflow-hidden flex items-center">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(4, item.percent)}%`,
                  backgroundColor: item.accentColor,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
