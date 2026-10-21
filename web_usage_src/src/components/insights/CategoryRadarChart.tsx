import React from 'react'
import { AppCategory, DailyUsage } from '../../types'
import { formatDuration } from '../../utils/formatters'

interface CategoryRadarChartProps {
  thisWeekUsages: DailyUsage[]
  lastWeekUsages: DailyUsage[]
}

export const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({
  thisWeekUsages,
  lastWeekUsages,
}) => {
  const categories: AppCategory[] = [
    'Social',
    'Video',
    'Games',
    'Productivity',
    'Communication',
    'Other',
  ]

  // Sum categories for each week
  const thisWeek: Record<AppCategory, number> = {
    Social: 0,
    Video: 0,
    Games: 0,
    Productivity: 0,
    Communication: 0,
    Other: 0,
  }
  const lastWeek: Record<AppCategory, number> = {
    Social: 0,
    Video: 0,
    Games: 0,
    Productivity: 0,
    Communication: 0,
    Other: 0,
  }

  thisWeekUsages.forEach((u) => {
    categories.forEach((c) => {
      thisWeek[c] += u.categoryTotals[c] || 0
    })
  })

  lastWeekUsages.forEach((u) => {
    categories.forEach((c) => {
      lastWeek[c] += u.categoryTotals[c] || 0
    })
  })

  const maxVal = Math.max(
    180,
    ...categories.map((c) => Math.max(thisWeek[c], lastWeek[c]))
  )

  const size = 260
  const center = size / 2
  const maxR = 90

  // Calculate polygon coordinates
  const getPoints = (data: Record<AppCategory, number>) => {
    return categories
      .map((cat, i) => {
        const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2
        const r = (Math.min(maxVal, data[cat] || 0) / maxVal) * maxR
        const x = center + r * Math.cos(angle)
        const y = center + r * Math.sin(angle)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }

  const thisWeekPoints = getPoints(thisWeek)
  const lastWeekPoints = getPoints(lastWeek)

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Category Balance Radar
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            This week vs. last week category distribution
          </p>
        </div>
      </div>

      {/* SVG Radar */}
      <div className="relative w-full flex justify-center items-center my-2 select-none">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
          role="img"
          aria-label="Category balance radar chart"
        >
          {/* Concentric Web Rings */}
          {[0.25, 0.5, 0.75, 1.0].map((scale) => {
            const r = maxR * scale
            const ringPoints = categories
              .map((_, i) => {
                const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2
                return `${(center + r * Math.cos(angle)).toFixed(1)},${(
                  center +
                  r * Math.sin(angle)
                ).toFixed(1)}`
              })
              .join(' ')

            return (
              <polygon
                key={scale}
                points={ringPoints}
                fill="none"
                stroke="currentColor"
                className="text-gray-200 dark:text-neutral-700/60"
                strokeWidth="1"
              />
            )
          })}

          {/* Spokes from center to vertices */}
          {categories.map((_, i) => {
            const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2
            const x2 = center + maxR * Math.cos(angle)
            const y2 = center + maxR * Math.sin(angle)
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                className="text-gray-200 dark:text-neutral-700/60"
                strokeWidth="1"
              />
            )
          })}

          {/* Last Week Polygon */}
          <polygon
            points={lastWeekPoints}
            fill="#a855f7"
            fillOpacity="0.2"
            stroke="#a855f7"
            strokeWidth="1.8"
            strokeDasharray="3 3"
          />

          {/* This Week Polygon */}
          <polygon
            points={thisWeekPoints}
            fill="#10b981"
            fillOpacity="0.38"
            stroke="#10b981"
            strokeWidth="2.2"
          />

          {/* Category Labels at Vertices */}
          {categories.map((cat, i) => {
            const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2
            const labelR = maxR + 20
            const x = center + labelR * Math.cos(angle)
            const y = center + labelR * Math.sin(angle)

            return (
              <text
                key={cat}
                x={x}
                y={y + 3}
                textAnchor="middle"
                className="text-[9px] font-bold fill-gray-600 dark:fill-gray-300 pointer-events-none"
              >
                {cat}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Legend & Totals */}
      <div className="flex items-center justify-around text-xs pt-3 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            This Week ({formatDuration(Object.values(thisWeek).reduce((a, b) => a + b, 0))})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0 border border-dashed border-white" />
          <span className="font-semibold text-gray-500 dark:text-gray-400">
            Last Week ({formatDuration(Object.values(lastWeek).reduce((a, b) => a + b, 0))})
          </span>
        </div>
      </div>
    </div>
  )
}
