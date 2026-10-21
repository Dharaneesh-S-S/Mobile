import React, { useState } from 'react'
import { AppCategory, AppInfo } from '../../types'
import { formatDuration } from '../../utils/formatters'
import { AppIcon } from '../common/AppIcon'

interface CategoryDonutChartProps {
  categoryTotals: Record<AppCategory, number>
  apps: AppInfo[]
  appTotals: Record<string, number>
  isColorblindSafe?: boolean
  onSelectApp?: (appId: string) => void
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categoryTotals,
  apps,
  appTotals,
  isColorblindSafe = false,
  onSelectApp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | null>(null)

  const categoryColors: Record<AppCategory, string> = isColorblindSafe
    ? {
        Social: '#0072b2',
        Video: '#d55e00',
        Games: '#cc79a7',
        Productivity: '#009e73',
        Communication: '#56b4e9',
        Other: '#f0e442',
      }
    : {
        Social: '#3b82f6',
        Video: '#ef4444',
        Games: '#8b5cf6',
        Productivity: '#10b981',
        Communication: '#06b6d4',
        Other: '#94a3b8',
      }

  const totalMinutes = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1

  // Calculate SVG arc paths
  const size = 180
  const strokeWidth = 28
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  const categories = Object.keys(categoryTotals) as AppCategory[]
  let accumulatedPercent = 0

  const slices = categories.map((cat) => {
    const mins = categoryTotals[cat] || 0
    const percent = mins / totalMinutes
    const strokeDasharray = `${percent * circumference} ${circumference}`
    const strokeDashoffset = -accumulatedPercent * circumference
    accumulatedPercent += percent

    return {
      cat,
      mins,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
      color: categoryColors[cat],
    }
  })

  // Filter apps below
  const filteredApps = apps
    .filter((a) => {
      const mins = appTotals[a.id] || 0
      if (mins === 0) return false
      if (!selectedCategory) return true
      return a.category === selectedCategory
    })
    .sort((a, b) => (appTotals[b.id] || 0) - (appTotals[a.id] || 0))

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Category Distribution
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Tap slice to filter apps below
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Show All
          </button>
        )}
      </div>

      {/* SVG Donut Chart with Center Total */}
      <div className="relative w-full flex items-center justify-center my-2 select-none">
        <svg width={size} height={size} className="transform -rotate-90">
          {slices.map((slice) => {
            const isSelected = selectedCategory === slice.cat
            return (
              <circle
                key={slice.cat}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
                onClick={() =>
                  setSelectedCategory(selectedCategory === slice.cat ? null : slice.cat)
                }
              />
            )
          })}
        </svg>

        {/* Center Total Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xs text-gray-400 font-semibold">
            {selectedCategory || 'Total'}
          </span>
          <span className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
            {formatDuration(
              selectedCategory ? categoryTotals[selectedCategory] || 0 : totalMinutes
            )}
          </span>
          <span className="text-[10px] text-gray-400">
            {selectedCategory
              ? `${Math.round(((categoryTotals[selectedCategory] || 0) / totalMinutes) * 100)}% share`
              : 'Screen Time'}
          </span>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 mb-3">
        {slices.map((slice) => (
          <button
            key={slice.cat}
            onClick={() =>
              setSelectedCategory(selectedCategory === slice.cat ? null : slice.cat)
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === slice.cat
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'bg-gray-100 dark:bg-neutral-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span>{slice.cat}</span>
            <span className="text-[10px] opacity-75">{slice.percent}%</span>
          </button>
        ))}
      </div>

      {/* Filtered App List */}
      <div className="mt-2 pt-3 border-t border-gray-100 dark:border-neutral-800">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          {selectedCategory ? `${selectedCategory} Apps` : 'All Active Apps'} (
          {filteredApps.length})
        </div>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => onSelectApp && onSelectApp(app.id)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-700/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <AppIcon
                  name={app.name}
                  iconName={app.icon}
                  color={app.accentColor}
                  size={15}
                />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {app.name}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                {formatDuration(appTotals[app.id] || 0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
