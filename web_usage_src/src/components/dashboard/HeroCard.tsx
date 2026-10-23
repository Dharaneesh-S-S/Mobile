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
    <div className="mx-4 mb-4 p-5 rounded-[28px] bg-[#051211]/90 border border-teal-500/20 shadow-[0_16px_45px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative overflow-hidden">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-[#19E6C8]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-2 relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400/80 flex items-center gap-1.5">
          <Clock size={14} className="text-[#19E6C8]" />
          <span>Total Screen Time</span>
        </span>

        {isUnderGoal ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#19E6C8] bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(25,230,200,0.2)]">
            <Sparkles size={12} className="text-[#19E6C8]" />
            <span>On Track</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
            <span>Over Goal</span>
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-3 relative z-10">
        <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(25,230,200,0.25)]">
          {formatDuration(totalMinutes)}
        </h2>

        {/* Delta Chip */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
            delta.diff === 0
              ? 'bg-[#030707] text-slate-400 border-teal-500/20'
              : delta.isBetter
              ? 'bg-teal-500/10 text-[#19E6C8] border-teal-500/30'
              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
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
        <div className="w-full bg-[#030707] h-2 rounded-full overflow-hidden p-0.5 border border-teal-500/20">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              totalMinutes > goalMinutes
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-teal-500 to-[#19E6C8] shadow-[0_0_10px_rgba(25,230,200,0.5)]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Goal Comparison subtitle */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 relative z-10 font-medium">
        <span>Daily goal: <strong className="text-teal-300">{formatDuration(goalMinutes)}</strong></span>
        <span className={totalMinutes > goalMinutes ? 'text-rose-400 font-semibold' : 'text-[#19E6C8] font-semibold'}>
          {totalMinutes > goalMinutes
            ? `${formatDuration(totalMinutes - goalMinutes)} over goal`
            : `${formatDuration(goalMinutes - totalMinutes)} remaining`}
        </span>
      </div>
    </div>
  )
}
