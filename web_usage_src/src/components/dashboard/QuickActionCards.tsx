import React from 'react'
import {
  Zap,
  Moon,
  Hourglass,
  Award,
  Eye,
  BellOff,
  ChevronRight,
} from 'lucide-react'

export type QuickActionKey =
  | 'focus'
  | 'bedtime'
  | 'timers'
  | 'goals'
  | 'eyecare'
  | 'dnd'

interface QuickActionCardsProps {
  onSelectAction: (key: QuickActionKey) => void
  isFocusActive?: boolean
  isBedtimeActive?: boolean
  timersCount?: number
  isEyeCareActive?: boolean
  isDndActive?: boolean
  streakDays?: number
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  onSelectAction,
  isFocusActive = false,
  isBedtimeActive = true,
  timersCount = 3,
  isEyeCareActive = false,
  isDndActive = false,
  streakDays = 5,
}) => {
  const actions = [
    {
      key: 'focus' as QuickActionKey,
      title: 'Focus mode',
      subtitle: isFocusActive ? 'Active now' : 'Pause distractions',
      icon: Zap,
      color: '#8b5cf6', // purple
      active: isFocusActive,
    },
    {
      key: 'bedtime' as QuickActionKey,
      title: 'Bedtime mode',
      subtitle: isBedtimeActive ? 'Scheduled 23:00' : 'Wind down sleep',
      icon: Moon,
      color: '#3b82f6', // blue
      active: isBedtimeActive,
    },
    {
      key: 'timers' as QuickActionKey,
      title: 'App timers',
      subtitle: `${timersCount} limits active`,
      icon: Hourglass,
      color: '#f59e0b', // amber
      active: timersCount > 0,
    },
    {
      key: 'goals' as QuickActionKey,
      title: 'Goals & streaks',
      subtitle: `${streakDays} day streak active`,
      icon: Award,
      color: '#10b981', // emerald
      active: true,
    },
    {
      key: 'eyecare' as QuickActionKey,
      title: 'Protect eyes',
      subtitle: isEyeCareActive ? 'Warm filter ON' : 'Blue light filter',
      icon: Eye,
      color: '#f97316', // orange
      active: isEyeCareActive,
    },
    {
      key: 'dnd' as QuickActionKey,
      title: 'Do not disturb',
      subtitle: isDndActive ? 'Silenced' : 'Silence alerts',
      icon: BellOff,
      color: '#ec4899', // pink
      active: isDndActive,
    },
  ]

  return (
    <div className="mx-4 mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Ways to Disconnect
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon

          return (
            <div
              key={act.key}
              onClick={() => onSelectAction(act.key)}
              className="p-4 rounded-[26px] glass-card glass-card-interactive shadow-sm cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
              role="button"
              tabIndex={0}
              aria-label={`Open ${act.title}: ${act.subtitle}`}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 relative transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: act.color,
                    boxShadow: `0 4px 14px -2px ${act.color}50`
                  }}
                >
                  <Icon size={19} strokeWidth={2.4} />
                  {act.active && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
                  )}
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all"
                />
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {act.title}
                </h5>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {act.subtitle}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
