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
  const progressPercent = Math.min(100, Math.round((totalMinutes / goalMinutes) * 100))

  return (
    <div className="mx-4 mb-4 p-5 rounded-[28px] bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent dark:from-emerald-500/20 dark:via-emerald-950/30 dark:to-[#0C121E]/60 border border-emerald-500/30 dark:border-emerald-400/25 shadow-[0_10px_35px_-8px_rgba(16,185,129,0.22)] dark:shadow-[0_16px_45px_-10px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 blur-2xl pointer-events-none" />
      <div className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full bg-teal-500/15 dark:bg-teal-400/15 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-2 relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Clock size={14} className="text-emerald-500" />
          <span>Total Screen Time</span>
        </span>

        {isUnderGoal ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-500/30 dark:border-emerald-400/30 px-2.5 py-0.5 rounded-full shadow-sm">
            <Sparkles size={12} className="text-emerald-500" />
            <span>On Track</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-500/15 dark:bg-rose-400/20 border border-rose-500/30 dark:border-rose-400/30 px-2.5 py-0.5 rounded-full shadow-sm">
            <span>Over Goal</span>
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-3 relative z-10">
        <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
          {formatDuration(totalMinutes)}
        </h2>

        {/* Delta Chip */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
            delta.diff === 0
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              : delta.isBetter
              ? 'bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-400/30'
              : 'bg-rose-500/15 dark:bg-rose-400/20 text-rose-700 dark:text-rose-300 border-rose-500/30 dark:border-rose-400/30'
          }`}
          title={`${delta.diff > 0 ? '+' : ''}${delta.diff} minutes ${comparisonLabel}`}
        >
          {delta.diff < 0 ? (
            <ArrowDown size={13} strokeWidth={2.8} />
          ) : delta.diff > 0 ? (
            <ArrowUp size={13} strokeWidth={2.8} />
          ) : null}
          <span>{delta.label}</span>
          <span className="font-normal opacity-75 text-[10px] ml-0.5">{comparisonLabel}</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="mt-4 relative z-10">
        <div className="w-full bg-slate-200/70 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-white/[0.06]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              totalMinutes > goalMinutes
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-teal-400 to-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Goal Comparison subtitle */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 relative z-10 font-medium">
        <span>Daily goal: <strong className="text-slate-700 dark:text-slate-200">{formatDuration(goalMinutes)}</strong></span>
        <span className={totalMinutes > goalMinutes ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
          {totalMinutes > goalMinutes
            ? `${formatDuration(totalMinutes - goalMinutes)} over goal`
            : `${formatDuration(goalMinutes - totalMinutes)} remaining`}
        </span>
      </div>
    </div>
  )
}
