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
        className="pointer-events-auto bg-[#051211]/90 backdrop-blur-2xl border border-teal-500/20 px-2 py-1.5 rounded-full shadow-[0_16px_45px_-8px_rgba(0,0,0,0.85)] transition-all"
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
                    ? 'text-[#19E6C8] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div
                  className={`p-1 rounded-full transition-all ${
                    isActive
                      ? 'bg-teal-500/15 text-[#19E6C8] shadow-[0_0_12px_rgba(25,230,200,0.35)]'
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
