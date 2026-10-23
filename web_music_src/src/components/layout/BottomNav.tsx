import React from 'react'
import {
  Home, Music2, ListMusic, Disc, Mic2, Radio, Folder
} from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { NavTab } from '../../types/music'

interface TabConfig {
  id: NavTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const ALL_TABS: TabConfig[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tracks', label: 'Tracks', icon: Music2 },
  { id: 'playlists', label: 'Playlists', icon: ListMusic },
  { id: 'albums', label: 'Albums', icon: Disc },
  { id: 'artists', label: 'Artists', icon: Mic2 },
  { id: 'genres', label: 'Genres', icon: Radio },
  { id: 'folders', label: 'Folders', icon: Folder },
]

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, settings } = useMusic()

  const allowedTabs = settings.activeTabs || ['home', 'tracks', 'playlists', 'albums', 'artists', 'genres', 'folders']
  const visibleTabs = ALL_TABS.filter(t => allowedTabs.includes(t.id))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#051211]/95 backdrop-blur-md border-t border-teal-500/15 px-2 py-1.5 select-none transition-colors md:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#19E6C8] font-bold scale-105'
                  : 'text-[#94B5B0] hover:text-[#F4FFFD] font-medium'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#19E6C8] shadow-[0_0_8px_rgba(25,230,200,0.8)]" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
