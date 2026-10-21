import React, { useState } from 'react'
import { ChevronRight, ChevronDown, ChevronUp, Layers } from 'lucide-react'
import { AppInfo } from '../../types'
import { AppIcon } from '../common/AppIcon'
import { formatDuration } from '../../utils/formatters'

interface MostUsedAppsListProps {
  apps: AppInfo[]
  appTotals: Record<string, number>
  onSelectApp: (appId: string) => void
}

export const MostUsedAppsList: React.FC<MostUsedAppsListProps> = ({
  apps,
  appTotals,
  onSelectApp,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Filter apps with usage and sort descending
  const sortedApps = [...apps]
    .map((app) => ({
      ...app,
      minutes: appTotals[app.id] || 0,
    }))
    .filter((a) => a.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  const topMinutes = sortedApps[0]?.minutes || 1
  const displayApps = isExpanded ? sortedApps : sortedApps.slice(0, 5)

  if (sortedApps.length === 0) {
    return (
      <div className="mx-4 mb-4 p-6 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 text-center text-gray-400 text-xs">
        No app usage recorded for this date.
      </div>
    )
  }

  return (
    <div className="mx-4 mb-4 p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          <Layers size={14} className="text-emerald-500" />
          <span>Most Used Apps</span>
        </div>
        <span className="text-[11px] text-gray-400">{sortedApps.length} apps active</span>
      </div>

      {/* App rows */}
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-neutral-800/70">
        {displayApps.map((item) => {
          const relativePercent = Math.max(3, Math.round((item.minutes / topMinutes) * 100))

          return (
            <div
              key={item.id}
              onClick={() => onSelectApp(item.id)}
              className="py-3 px-1 flex items-center justify-between hover:bg-gray-50/80 dark:hover:bg-neutral-800/40 rounded-2xl cursor-pointer transition-colors group"
              role="button"
              tabIndex={0}
              aria-label={`View usage details for ${item.name}: ${formatDuration(item.minutes)}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                <AppIcon
                  name={item.name}
                  iconName={item.icon}
                  color={item.accentColor}
                  size={18}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {item.name}
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-2 shrink-0">
                      {formatDuration(item.minutes)}
                    </span>
                  </div>

                  {/* Thin relative progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-neutral-700/50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${relativePercent}%`,
                        backgroundColor: item.accentColor,
                      }}
                    />
                  </div>

                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {item.category}
                  </span>
                </div>
              </div>

              <ChevronRight
                size={18}
                className="text-gray-300 dark:text-neutral-600 group-hover:text-emerald-500 transition-colors shrink-0"
              />
            </div>
          )
        })}
      </div>

      {/* Show all apps expander */}
      {sortedApps.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-2xl transition-colors"
        >
          <span>{isExpanded ? 'Show less' : `Show all ${sortedApps.length} apps`}</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
    </div>
  )
}
