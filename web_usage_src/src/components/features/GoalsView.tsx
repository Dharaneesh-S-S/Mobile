import React, { useState } from 'react'
import { GoalConfig, AppCategory } from '../../types'
import { formatDuration } from '../../utils/formatters'
import { Target, Flame, Award, Zap, Moon, Lightbulb, TrendingDown, Check } from 'lucide-react'
import confetti from 'canvas-confetti'

interface GoalsViewProps {
  goalConfig: GoalConfig
  streakDays: number
  last7DaysUnder: boolean[]
  onUpdateGoalConfig: (cfg: GoalConfig) => void
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goalConfig,
  streakDays,
  last7DaysUnder,
  onUpdateGoalConfig,
}) => {
  const [screenTimeHours, setScreenTimeHours] = useState(
    Math.round(goalConfig.dailyScreenTimeGoal / 60)
  )
  const [unlocksGoal, setUnlocksGoal] = useState(goalConfig.unlocksGoal)

  const daysLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const handleBadgeClick = (badge: any) => {
    if (badge.unlockedAt) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      })
    }
  }

  const badgeIcons: Record<string, React.ElementType> = {
    Award,
    Flame,
    Moon,
    Zap,
  }

  return (
    <div className="flex flex-col px-4 pb-16 animate-fade-in">
      <div className="py-4">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
          Goals & Achievements
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Build healthier habits and earn milestone wellness badges.
        </p>
      </div>

      {/* Streak Counter Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/20 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Flame size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100 block">
                {streakDays} Day Streak!
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                Days consecutively under your screen goal
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day Streak Chip Row */}
        <div className="flex justify-between gap-1 mt-2">
          {daysLabels.map((dayName, idx) => {
            const isCompleted = last7DaysUnder[idx]
            return (
              <div
                key={dayName}
                className={`flex-1 py-2 rounded-2xl flex flex-col items-center justify-center text-xs transition-all ${
                  isCompleted
                    ? 'bg-amber-500 text-white font-bold shadow-xs'
                    : 'bg-white/60 dark:bg-neutral-800/60 text-gray-400'
                }`}
              >
                <span className="text-[10px] mb-0.5">{dayName}</span>
                {isCompleted ? <Check size={14} strokeWidth={2.6} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-neutral-600" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Monday Weekly Summary Card */}
      <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={16} className="text-emerald-500" />
          <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            Monday Wellness Report
          </h4>
        </div>

        <div className="flex items-start gap-3 my-1">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
            <TrendingDown size={16} />
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300">
            <strong>Biggest win:</strong> Instagram usage dropped by <strong>45m</strong> this past week!
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-emerald-500/20 text-xs text-gray-600 dark:text-gray-400">
          💡 <em>Tip for next week:</em> Schedule Bedtime Grayscale at 22:30 to avoid midnight YouTube loops.
        </div>
      </div>

      {/* Goal Targets Config Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm mb-4 flex flex-col gap-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Daily Targets
        </h4>

        {/* Screen Time Goal */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Daily Screen Time</span>
            <span className="text-emerald-500">{screenTimeHours} Hours</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={screenTimeHours}
            onChange={(e) => {
              const h = parseInt(e.target.value)
              setScreenTimeHours(h)
              onUpdateGoalConfig({ ...goalConfig, dailyScreenTimeGoal: h * 60 })
            }}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Unlocks Goal */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Unlocks Limit</span>
            <span className="text-amber-500">{unlocksGoal} unlocks/day</span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            step="5"
            value={unlocksGoal}
            onChange={(e) => {
              const u = parseInt(e.target.value)
              setUnlocksGoal(u)
              onUpdateGoalConfig({ ...goalConfig, unlocksGoal: u })
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Milestone Badges ({goalConfig.badges.filter((b) => b.unlockedAt).length}/{goalConfig.badges.length})
        </h4>

        <div className="grid grid-cols-2 gap-2.5">
          {goalConfig.badges.map((badge) => {
            const Icon = badgeIcons[badge.icon] || Award
            const isUnlocked = Boolean(badge.unlockedAt)

            return (
              <div
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                  isUnlocked
                    ? 'border-emerald-500/30 bg-emerald-500/5 hover:scale-102 shadow-xs'
                    : 'border-gray-200 dark:border-neutral-800 opacity-50 bg-gray-50 dark:bg-neutral-900/40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 ${
                    isUnlocked
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                      : 'bg-gray-200 dark:bg-neutral-800 text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                </div>

                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">
                  {badge.title}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight line-clamp-2">
                  {badge.description}
                </span>

                {isUnlocked && (
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                    Unlocked {badge.unlockedAt}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
