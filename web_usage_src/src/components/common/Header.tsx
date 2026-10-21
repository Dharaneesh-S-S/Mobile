import React from 'react'
import { Settings, HeartPulse, Sun, Moon, Award } from 'lucide-react'

interface HeaderProps {
  title?: string
  subtitle?: string
  onOpenSettings: () => void
  onOpenGoals?: () => void
  theme: 'light' | 'dark' | 'system'
  onToggleTheme: () => void
  isScrolled?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Digital Wellbeing',
  subtitle = 'ZenPulse Wellness & Balance',
  onOpenSettings,
  onOpenGoals,
  theme,
  onToggleTheme,
  isScrolled = false,
}) => {
  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-neutral-800 py-3'
          : 'bg-transparent py-4'
      } px-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <HeartPulse size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h1
              className={`font-extrabold tracking-tight text-gray-900 dark:text-gray-100 transition-all ${
                isScrolled ? 'text-lg' : 'text-2xl'
              }`}
            >
              {title}
            </h1>
            {!isScrolled && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1">
          {onOpenGoals && (
            <button
              onClick={onOpenGoals}
              className="p-2.5 rounded-2xl text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
              title="Goals & Achievements"
              aria-label="Goals & Achievements"
            >
              <Award size={20} />
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-neutral-800 transition-colors"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-neutral-800 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
