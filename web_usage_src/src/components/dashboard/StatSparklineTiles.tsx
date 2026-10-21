import React from 'react'
import { Bell, Clock, Unlock, ArrowDown, ArrowUp } from 'lucide-react'
import { formatDuration } from '../../utils/formatters'
import { calculateDelta } from '../../utils/aggregations'

interface StatTileData {
  title: string
  current: number
  previous: number
  history7Days: number[]
  isDuration?: boolean
  icon: React.ElementType
  colorClass: string
}

interface StatSparklineTilesProps {
  screenTimeMinutes: number
  prevScreenTimeMinutes: number
  screenTime7Days: number[]

  notifications: number
  prevNotifications: number
  notifications7Days: number[]

  unlocks: number
  prevUnlocks: number
  unlocks7Days: number[]
}

const MiniSparkline: React.FC<{ data: number[]; color: string; id: string }> = ({ data, color, id }) => {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 64
  const height = 24

  const linePoints = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 8) - 4
      return `${x},${y}`
    })

  const areaPoints = [
    `0,${height}`,
    ...linePoints,
    `${width},${height}`
  ].join(' ')

  const gradientId = `sparkline_grad_${id}`

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePoints.join(' ')}
      />
    </svg>
  )
}

export const StatSparklineTiles: React.FC<StatSparklineTilesProps> = ({
  screenTimeMinutes,
  prevScreenTimeMinutes,
  screenTime7Days,
  notifications,
  prevNotifications,
  notifications7Days,
  unlocks,
  prevUnlocks,
  unlocks7Days,
}) => {
  const tiles: (StatTileData & { id: string })[] = [
    {
      id: 'screen_time',
      title: 'Screen time',
      current: screenTimeMinutes,
      previous: prevScreenTimeMinutes,
      history7Days: screenTime7Days,
      isDuration: true,
      icon: Clock,
      colorClass: '#10b981', // emerald
    },
    {
      id: 'notifications',
      title: 'Notifications',
      current: notifications,
      previous: prevNotifications,
      history7Days: notifications7Days,
      icon: Bell,
      colorClass: '#3b82f6', // blue
    },
    {
      id: 'unlocks',
      title: 'Unlocked',
      current: unlocks,
      previous: prevUnlocks,
      history7Days: unlocks7Days,
      icon: Unlock,
      colorClass: '#f59e0b', // amber
    },
  ]

  return (
    <div className="mx-4 mb-4 grid grid-cols-3 gap-2.5">
      {tiles.map((tile) => {
        const Icon = tile.icon
        const delta = calculateDelta(tile.current, tile.previous, true)

        return (
          <div
            key={tile.title}
            className="p-3.5 rounded-[24px] glass-card shadow-sm flex flex-col justify-between transition-all hover:scale-[1.02]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{
                    backgroundColor: `${tile.colorClass}18`,
                    color: tile.colorClass,
                    border: `1px solid ${tile.colorClass}30`
                  }}
                >
                  <Icon size={14} strokeWidth={2.4} />
                </div>
                <MiniSparkline data={tile.history7Days} color={tile.colorClass} id={tile.id} />
              </div>

              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate tracking-tight">
                {tile.title}
              </div>

              <div className="text-base sm:text-lg font-display font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">
                {tile.isDuration ? formatDuration(tile.current) : tile.current}
              </div>
            </div>

            {/* Mini Delta Tag */}
            <div className="mt-2.5 flex items-center text-[10px] font-bold">
              <span
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg border ${
                  delta.diff === 0
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    : delta.isBetter
                    ? 'bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/10 dark:bg-rose-400/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                }`}
              >
                {delta.diff < 0 ? (
                  <ArrowDown size={10} strokeWidth={2.8} />
                ) : delta.diff > 0 ? (
                  <ArrowUp size={10} strokeWidth={2.8} />
                ) : null}
                {delta.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
