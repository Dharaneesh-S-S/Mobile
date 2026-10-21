import React, { useState } from 'react'
import { DailyUsage } from '../../types'
import { formatDuration } from '../../utils/formatters'
import { calculateMovingAverage } from '../../utils/aggregations'

interface TrendAreaChartProps {
  usages: DailyUsage[] // Chronological
  goalMinutes?: number
}

export const TrendAreaChart: React.FC<TrendAreaChartProps> = ({
  usages,
  goalMinutes = 240,
}) => {
  const [rangeDays, setRangeDays] = useState<7 | 30 | 90>(30)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Slice chronological usages for the selected range
  const filtered = usages.slice(-rangeDays)
  const dataPoints = filtered.map((u) => u.totalScreenTimeMinutes)
  const movingAverages = calculateMovingAverage(dataPoints, 7)

  const maxVal = Math.max(360, goalMinutes + 60, ...dataPoints)
  const chartHeight = 150
  const chartWidth = 400

  // Generate SVG path for the area and the line
  const points = dataPoints.map((val, idx) => {
    const x = (idx / (dataPoints.length - 1 || 1)) * chartWidth
    const y = chartHeight - (val / maxVal) * (chartHeight - 15) - 5
    return { x, y, val, date: filtered[idx]?.date || '' }
  })

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaD = `${lineD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`

  // 7-day moving average path
  const maPoints = movingAverages.map((val, idx) => {
    const x = (idx / (movingAverages.length - 1 || 1)) * chartWidth
    const y = chartHeight - (val / maxVal) * (chartHeight - 15) - 5
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')

  const goalY = chartHeight - (goalMinutes / maxVal) * (chartHeight - 15) - 5

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null
  const activeMA = hoverIndex !== null ? movingAverages[hoverIndex] : null

  return (
    <div className="p-5 rounded-[28px] glass-card shadow-sm flex flex-col mb-4">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Screen Time Trend</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Gradient area with 7-day moving average overlay
          </p>
        </div>

        {/* 7 / 30 / 90 Days Toggle */}
        <div className="flex items-center bg-slate-200/60 dark:bg-slate-800/80 p-0.5 rounded-xl text-[11px] font-bold border border-slate-300/40 dark:border-white/[0.06]">
          {([7, 30, 90] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRangeDays(r)
                setHoverIndex(null)
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                rangeDays === r
                  ? 'bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-sm border border-transparent dark:border-emerald-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Hover Info Tooltip */}
      {activePoint && (
        <div className="mb-2 p-2 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-xs flex items-center justify-between animate-fade-in">
          <div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {activePoint.date}:{' '}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {formatDuration(activePoint.val)}
            </span>
          </div>
          {activeMA && (
            <span className="text-[11px] text-amber-500 font-medium">
              7d Avg: {formatDuration(activeMA)}
            </span>
          )}
        </div>
      )}

      {/* SVG Chart */}
      <div className="relative w-full h-[150px] select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label={`${rangeDays}-day screen time trend line chart`}
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Goal Reference Line */}
          <line
            x1="0"
            y1={goalY}
            x2={chartWidth}
            y2={goalY}
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Gradient Fill Area */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Daily Usage Line */}
          <path
            d={lineD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 7-day Moving Average Line */}
          <path
            d={maPoints}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="3 3"
            opacity="0.9"
          />

          {/* Interactive touch targets */}
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={hoverIndex === idx ? 5 : 2.5}
              fill={hoverIndex === idx ? '#10b981' : '#059669'}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoverIndex(idx)}
              onClick={() => setHoverIndex(idx)}
            />
          ))}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
          <span>Daily Screen Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 border-b-2 border-dashed border-amber-500" />
          <span>7-day Moving Avg</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 border-b-2 border-dashed border-rose-500" />
          <span>Goal ({formatDuration(goalMinutes)})</span>
        </div>
      </div>
    </div>
  )
}
