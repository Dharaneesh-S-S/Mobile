import React from 'react'
import { LayoutDashboard, BarChart2, Moon, Hourglass, Award } from 'lucide-react'

export type NavigationTab = 'dashboard' | 'insights' | 'focus' | 'timers' | 'goals'

interface BottomNavigationProps {
  currentTab: NavigationTab
  onSelectTab: (tab: NavigationTab) => void
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'dashboard' as const, label: 'Home', icon: LayoutDashboard },
    { id: 'insights' as const, label: 'Insights', icon: BarChart2 },
    { id: 'focus' as const, label: 'Modes', icon: Moon },
    { id: 'timers' as const, label: 'Timers', icon: Hourglass },
    { id: 'goals' as const, label: 'Goals', icon: Award },
  ]

  return (
    <nav
      className="sticky bottom-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-gray-200/60 dark:border-neutral-800/80 px-2 py-1.5 transition-colors"
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
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl relative transition-all duration-150 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-all ${
                  isActive ? 'bg-emerald-100/70 dark:bg-emerald-950/60 scale-105' : ''
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
