import React from 'react'
import { ArrowDown, ArrowUp, Clock, Sparkles } from 'lucide-react'
import { formatDuration } from '../../utils/formatters'
import { calculateDelta } from '../../utils/aggregations'

interface HeroCardProps {
  totalMinutes: number
  previousMinutes: number
  comparisonLabel?: string
  goalMinutes?: number
}

export const HeroCard: React.FC<HeroCardProps> = ({
  totalMinutes,
  previousMinutes,
  comparisonLabel = 'vs yesterday',
  goalMinutes = 240,
}) => {
  const delta = calculateDelta(totalMinutes, previousMinutes, true)
  const isUnderGoal = totalMinutes <= goalMinutes

  return (
    <div className="mx-4 mb-4 p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 shadow-sm relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Clock size={14} className="text-emerald-500" />
          <span>Total Screen Time</span>
        </span>

        {isUnderGoal && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full">
            <Sparkles size={12} />
            <span>On Track</span>
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          {formatDuration(totalMinutes)}
        </h2>

        {/* Delta Chip */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            delta.diff === 0
              ? 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400'
              : delta.isBetter
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
          }`}
          title={`${delta.diff > 0 ? '+' : ''}${delta.diff} minutes ${comparisonLabel}`}
        >
          {delta.diff < 0 ? (
            <ArrowDown size={13} strokeWidth={2.8} />
          ) : delta.diff > 0 ? (
            <ArrowUp size={13} strokeWidth={2.8} />
          ) : null}
          <span>{delta.label}</span>
          <span className="font-normal opacity-80 text-[10px] ml-0.5">{comparisonLabel}</span>
        </div>
      </div>

      {/* Goal Comparison progress line */}
      <div className="mt-3.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Daily goal: {formatDuration(goalMinutes)}</span>
        <span>
          {totalMinutes > goalMinutes
            ? `${formatDuration(totalMinutes - goalMinutes)} over goal`
            : `${formatDuration(goalMinutes - totalMinutes)} remaining`}
        </span>
      </div>
    </div>
  )
}
