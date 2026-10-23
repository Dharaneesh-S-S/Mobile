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
      active: isFocusActive,
    },
    {
      key: 'bedtime' as QuickActionKey,
      title: 'Bedtime mode',
      subtitle: isBedtimeActive ? 'Scheduled 23:00' : 'Wind down sleep',
      icon: Moon,
      active: isBedtimeActive,
    },
    {
      key: 'timers' as QuickActionKey,
      title: 'App timers',
      subtitle: `${timersCount} limits active`,
      icon: Hourglass,
      active: timersCount > 0,
    },
    {
      key: 'goals' as QuickActionKey,
      title: 'Goals & streaks',
      subtitle: `${streakDays} day streak active`,
      icon: Award,
      active: true,
    },
    {
      key: 'eyecare' as QuickActionKey,
      title: 'Protect eyes',
      subtitle: isEyeCareActive ? 'Warm filter ON' : 'Blue light filter',
      icon: Eye,
      active: isEyeCareActive,
    },
    {
      key: 'dnd' as QuickActionKey,
      title: 'Do not disturb',
      subtitle: isDndActive ? 'Silenced' : 'Silence alerts',
      icon: BellOff,
      active: isDndActive,
    },
  ]

  return (
    <div className="mx-4 mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400/80">
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
              className="p-4 rounded-[26px] bg-[#051211]/85 border border-teal-500/20 hover:border-teal-500/40 hover:bg-[#08221f] shadow-sm cursor-pointer flex flex-col justify-between group active:scale-[0.98] transition-all"
              role="button"
              tabIndex={0}
              aria-label={`Open ${act.title}: ${act.subtitle}`}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#19E6C8] bg-teal-500/10 border border-teal-500/25 shrink-0 relative transition-transform group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(25,230,200,0.3)]"
                >
                  <Icon size={19} strokeWidth={2.4} />
                  {act.active && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#19E6C8] border-2 border-[#030707] shadow-[0_0_8px_rgba(25,230,200,0.8)] animate-pulse" />
                  )}
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-500 group-hover:text-[#19E6C8] group-hover:translate-x-0.5 transition-all"
                />
              </div>

              <div>
                <h5 className="text-xs font-bold text-white group-hover:text-[#19E6C8] transition-colors">
                  {act.title}
                </h5>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
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
