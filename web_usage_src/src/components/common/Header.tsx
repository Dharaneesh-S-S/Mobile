import React from 'react'
import {
  Settings,
  HeartPulse,
  Sun,
  Moon,
  Award,
  LayoutDashboard,
  BarChart3,
  Zap,
  Clock,
  Smartphone,
  Laptop,
} from 'lucide-react'
import { NavigationTab } from './BottomNavigation'

interface HeaderProps {
  title?: string
  subtitle?: string
  currentTab?: NavigationTab
  onSelectTab?: (tab: NavigationTab) => void
  phoneFrameMode?: boolean
  onToggleFrame?: () => void
  onOpenSettings: () => void
  onOpenGoals?: () => void
  theme: 'light' | 'dark' | 'system'
  onToggleTheme: () => void
  isScrolled?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Digital Wellbeing',
  subtitle = 'ZenPulse Wellness & Balance',
  currentTab = 'dashboard',
  onSelectTab,
  phoneFrameMode = false,
  onToggleFrame,
  onOpenSettings,
  onOpenGoals,
  theme,
  onToggleTheme,
  isScrolled = false,
}) => {
  const desktopTabs: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'focus', label: 'Focus Mode', icon: Zap },
    { id: 'timers', label: 'App Timers', icon: Clock },
    { id: 'goals', label: 'Goals', icon: Award },
  ]

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-200 px-3 sm:px-4 ${
        isScrolled
          ? 'bg-slate-50/90 dark:bg-[#090D16]/90 backdrop-blur-xl shadow-sm border-b border-slate-200/70 dark:border-white/[0.06] py-2.5 sm:py-3'
          : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-[0_4px_16px_rgba(16,185,129,0.35)] shrink-0 ring-1 ring-white/20">
            <HeartPulse size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h1
              className={`font-display font-extrabold tracking-tight text-slate-900 dark:text-white transition-all ${
                isScrolled ? 'text-lg' : 'text-xl sm:text-2xl'
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

        {/* Desktop Navigation Tabs (Visible on md+ screens when not locked in phone bezel) */}
        {!phoneFrameMode && onSelectTab && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-300/40 dark:border-white/[0.06] backdrop-blur-md">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = currentTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon size={14} strokeWidth={2.4} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Device Mockup Toggle on desktop */}
          {onToggleFrame && (
            <button
              onClick={onToggleFrame}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border ${
                phoneFrameMode
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 bg-slate-200/50 dark:bg-white/[0.04] border-slate-300/50 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.08]'
              }`}
              title="Toggle between full-width responsive laptop view and phone mockup preview"
            >
              {phoneFrameMode ? <Smartphone size={14} /> : <Laptop size={14} />}
              <span>{phoneFrameMode ? 'Phone Frame' : 'Laptop View'}</span>
            </button>
          )}

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

