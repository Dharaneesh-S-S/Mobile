import React from 'react'
import { LayoutDashboard, BarChart2, Moon, Hourglass, Award } from 'lucide-react'

export type NavigationTab = 'dashboard' | 'insights' | 'focus' | 'timers' | 'goals'

interface BottomNavigationProps {
  currentTab: NavigationTab
  onSelectTab: (tab: NavigationTab) => void
  phoneFrameMode?: boolean
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  phoneFrameMode = false,
}) => {
  const tabs = [
    { id: 'dashboard' as const, label: 'Home', icon: LayoutDashboard },
    { id: 'insights' as const, label: 'Insights', icon: BarChart2 },
    { id: 'focus' as const, label: 'Modes', icon: Moon },
    { id: 'timers' as const, label: 'Timers', icon: Hourglass },
    { id: 'goals' as const, label: 'Goals', icon: Award },
  ]

  return (
    <div
      className={`${
        phoneFrameMode ? 'block' : 'md:hidden'
      } sticky bottom-0 z-40 px-3 pb-2 pt-1 pointer-events-none transition-all`}
    >
      <nav
        className="pointer-events-auto bg-white/85 dark:bg-[#101726]/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.1] px-2 py-1.5 rounded-full shadow-[0_12px_36px_-6px_rgba(0,0,0,0.2)] dark:shadow-[0_16px_45px_-8px_rgba(0,0,0,0.75)] transition-all"
        aria-label="Bottom Navigation"
      >
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full relative transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1 rounded-full transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : ''
                  }`}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
