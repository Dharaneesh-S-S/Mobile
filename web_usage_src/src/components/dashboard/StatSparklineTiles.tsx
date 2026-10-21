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

const MiniSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 64
  const height = 22

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 6) - 3
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
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
  const tiles: StatTileData[] = [
    {
      title: 'Screen time',
      current: screenTimeMinutes,
      previous: prevScreenTimeMinutes,
      history7Days: screenTime7Days,
      isDuration: true,
      icon: Clock,
      colorClass: '#10b981', // emerald
    },
    {
      title: 'Notifications',
      current: notifications,
      previous: prevNotifications,
      history7Days: notifications7Days,
      icon: Bell,
      colorClass: '#3b82f6', // blue
    },
    {
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
            className="p-3 rounded-2xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Icon size={14} style={{ color: tile.colorClass }} />
                <MiniSparkline data={tile.history7Days} color={tile.colorClass} />
              </div>

              <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                {tile.title}
              </div>

              <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                {tile.isDuration ? formatDuration(tile.current) : tile.current}
              </div>
            </div>

            {/* Mini Delta Tag */}
            <div className="mt-2 flex items-center text-[10px] font-bold">
              <span
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                  delta.diff === 0
                    ? 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400'
                    : delta.isBetter
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400'
                }`}
              >
                {delta.diff < 0 ? (
                  <ArrowDown size={10} strokeWidth={2.5} />
                ) : delta.diff > 0 ? (
                  <ArrowUp size={10} strokeWidth={2.5} />
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
