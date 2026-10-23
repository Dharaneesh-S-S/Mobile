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

  // Color dynamics: neon cyan < 75%, mint 75-95%, rose > 95%
  let strokeColor = '#19E6C8' // neon cyan
  let statusText = 'Well within limit'
  if (percent >= 95) {
    strokeColor = '#f43f5e' // rose
    statusText = percent > 100 ? 'Goal exceeded' : 'Limit almost reached'
  } else if (percent >= 75) {
    strokeColor = '#2dd4bf' // mint
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
        className="mx-4 mb-4 p-5 rounded-[28px] bg-[#051211]/90 border border-teal-500/20 hover:border-teal-500/40 hover:bg-[#08221f] shadow-[0_10px_35px_-8px_rgba(0,0,0,0.5)] cursor-pointer flex items-center justify-between group transition-all"
        role="button"
        tabIndex={0}
        aria-label="Daily screen time goal progress card. Tap to edit goal."
      >
        <div className="flex-1 pr-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400/80 mb-1">
            <Target size={14} className="text-[#19E6C8]" />
            <span>Daily Goal Target</span>
            <Edit2
              size={12}
              className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
            />
          </div>

          <h4 className="text-xl font-display font-extrabold text-white">
            {formatDuration(goalMinutes)} Goal
          </h4>

          <p className="text-xs font-semibold mt-1" style={{ color: strokeColor }}>
            {statusText} ({percent}%)
          </p>

          {/* Streak pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-[#19E6C8] text-xs font-bold shadow-[0_0_15px_rgba(25,230,200,0.2)]">
            <Flame size={14} className="text-[#19E6C8] animate-pulse" />
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
              className="text-[#030707]"
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
              style={{ filter: `drop-shadow(0 0 8px ${strokeColor}80)` }}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-display font-extrabold text-white">
              {percent}%
            </span>
            <span className="text-[10px] text-teal-400/70 font-semibold tracking-tight">used</span>
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
          <div className="text-center py-4 rounded-2xl bg-[#030707] border border-teal-500/20">
            <div className="text-5xl font-display font-extrabold text-[#19E6C8] drop-shadow-[0_0_15px_rgba(25,230,200,0.4)]">
              {tempGoalHours}h
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
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
              className="w-full accent-[#19E6C8] h-2.5 bg-[#030707] border border-teal-500/20 rounded-lg cursor-pointer"
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
                    ? 'border-[#19E6C8] bg-teal-500/15 text-[#19E6C8] shadow-sm'
                    : 'border-teal-500/20 text-slate-300 hover:bg-[#08221f] bg-[#030707]'
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
            className="w-full py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-bold text-sm transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.22)] mt-2"
          >
            Save Goal Target
          </button>
        </div>
      </BottomSheet>
    </>
  )
}
