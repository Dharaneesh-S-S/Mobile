import React, { useState } from 'react'
import { Target, Flame, Edit2 } from 'lucide-react'
import { formatDuration } from '../../utils/formatters'
import { BottomSheet } from '../common/BottomSheet'

interface GoalRingCardProps {
  currentMinutes: number
  goalMinutes: number
  streakDays: number
  onUpdateGoal: (newGoalMinutes: number) => void
}

export const GoalRingCard: React.FC<GoalRingCardProps> = ({
  currentMinutes,
  goalMinutes,
  streakDays,
  onUpdateGoal,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [tempGoalHours, setTempGoalHours] = useState(Math.round(goalMinutes / 60))

  const percent = Math.min(150, Math.round((currentMinutes / goalMinutes) * 100))

  // Color dynamics: green < 75%, amber 75-95%, red > 95%
  let strokeColor = '#10b981' // emerald
  let statusText = 'Well within limit'
  if (percent >= 95) {
    strokeColor = '#ef4444' // rose / red
    statusText = percent > 100 ? 'Goal exceeded' : 'Limit almost reached'
  } else if (percent >= 75) {
    strokeColor = '#f59e0b' // amber
    statusText = 'Approaching limit'
  }

  // SVG Ring calculations
  const size = 110
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(100, percent) / 100) * circumference

  return (
    <>
      <div
        onClick={() => {
          setTempGoalHours(Math.max(1, Math.round(goalMinutes / 60)))
          setIsEditOpen(true)
        }}
        className="mx-4 mb-4 p-5 rounded-[28px] glass-card glass-card-interactive shadow-sm cursor-pointer flex items-center justify-between group"
        role="button"
        tabIndex={0}
        aria-label="Daily screen time goal progress card. Tap to edit goal."
      >
        <div className="flex-1 pr-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <Target size={14} className="text-emerald-500" />
            <span>Daily Goal Target</span>
            <Edit2
              size={12}
              className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
            />
          </div>

          <h4 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
            {formatDuration(goalMinutes)} Goal
          </h4>

          <p className="text-xs font-semibold mt-1" style={{ color: strokeColor }}>
            {statusText} ({percent}%)
          </p>

          {/* Streak pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Flame size={14} className="text-amber-500 animate-pulse" />
            <span>{streakDays} Day Streak Under Goal!</span>
          </div>
        </div>

        {/* Circular Progress Ring with ambient glow */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-200/50 dark:text-slate-800/60"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ filter: `drop-shadow(0 0 6px ${strokeColor}60)` }}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-display font-extrabold text-slate-900 dark:text-white">
              {percent}%
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-tight">used</span>
          </div>
        </div>
      </div>

      {/* Edit Goal Bottom Sheet */}
      <BottomSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Screen Time Goal"
        subtitle="Set your desired maximum daily phone target"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="text-center py-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/[0.08]">
            <div className="text-5xl font-display font-extrabold text-emerald-600 dark:text-emerald-400">
              {tempGoalHours}h
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              ({tempGoalHours * 60} minutes per day)
            </p>
          </div>

          <div className="px-2">
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={tempGoalHours}
              onChange={(e) => setTempGoalHours(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
              <span>1h</span>
              <span>3h</span>
              <span>5h</span>
              <span>8h</span>
              <span>10h</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2">
            {[2, 3, 4, 5].map((h) => (
              <button
                key={h}
                onClick={() => setTempGoalHours(h)}
                className={`py-2.5 rounded-2xl text-xs font-bold border transition-all active:scale-95 ${
                  tempGoalHours === h
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {h} Hours
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onUpdateGoal(Math.round(tempGoalHours * 60))
              setIsEditOpen(false)
            }}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-transform active:scale-95 shadow-md shadow-emerald-500/25 mt-2"
          >
            Save Goal Target
          </button>
        </div>
      </BottomSheet>
    </>
  )
}
