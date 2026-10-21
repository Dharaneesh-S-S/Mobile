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
      className={`sticky top-0 z-30 transition-all duration-200 px-5 ${
        isScrolled
          ? 'bg-slate-50/90 dark:bg-[#090D16]/90 backdrop-blur-xl shadow-sm border-b border-slate-200/70 dark:border-white/[0.06] py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-[0_4px_16px_rgba(16,185,129,0.35)] shrink-0 ring-1 ring-white/20">
            <HeartPulse size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h1
              className={`font-display font-extrabold tracking-tight text-slate-900 dark:text-white transition-all ${
                isScrolled ? 'text-lg' : 'text-2xl'
              }`}
            >
              {title}
            </h1>
            {!isScrolled && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5">
          {onOpenGoals && (
            <button
              onClick={onOpenGoals}
              className="p-2 rounded-2xl text-amber-500 hover:bg-amber-500/10 dark:hover:bg-amber-500/15 border border-transparent hover:border-amber-500/20 transition-all active:scale-95"
              title="Goals & Achievements"
              aria-label="Goals & Achievements"
            >
              <Award size={19} strokeWidth={2.2} />
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.08] border border-transparent hover:border-slate-300/60 dark:hover:border-white/10 transition-all active:scale-95"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.08] border border-transparent hover:border-slate-300/60 dark:hover:border-white/10 transition-all active:scale-95"
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={19} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </header>
  )
}
