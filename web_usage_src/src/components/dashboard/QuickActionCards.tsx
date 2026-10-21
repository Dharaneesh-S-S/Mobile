import React from 'react'
import {
  Zap,
  Moon,
  Hourglass,
  ShieldCheck,
  Eye,
  BellOff,
  ChevronRight,
} from 'lucide-react'

export type QuickActionKey =
  | 'focus'
  | 'bedtime'
  | 'timers'
  | 'parental'
  | 'eyecare'
  | 'dnd'

interface QuickActionCardsProps {
  onSelectAction: (key: QuickActionKey) => void
  isFocusActive?: boolean
  isBedtimeActive?: boolean
  timersCount?: number
  isEyeCareActive?: boolean
  isDndActive?: boolean
  isParentalLocked?: boolean
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  onSelectAction,
  isFocusActive = false,
  isBedtimeActive = true,
  timersCount = 3,
  isEyeCareActive = false,
  isDndActive = false,
  isParentalLocked = false,
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
      key: 'parental' as QuickActionKey,
      title: 'Parental controls',
      subtitle: isParentalLocked ? 'Device locked' : 'Family controls',
      icon: ShieldCheck,
      color: '#10b981', // emerald
      active: isParentalLocked,
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
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
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
              className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between group active:scale-98"
              role="button"
              tabIndex={0}
              aria-label={`Open ${act.title}: ${act.subtitle}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0"
                  style={{ backgroundColor: act.color }}
                >
                  <Icon size={18} strokeWidth={2.4} />
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 dark:text-neutral-600 group-hover:text-emerald-500 transition-colors"
                />
              </div>

              <div>
                <h5 className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {act.title}
                </h5>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
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
