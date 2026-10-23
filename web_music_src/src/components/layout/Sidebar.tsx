import React from 'react'
import {
  Home, Music2, ListMusic, Disc, Mic2, Radio, Folder,
  FolderOpen, Heart, SlidersHorizontal, Moon, BarChart2,
  Sparkles, Settings, HardDrive
} from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { NavTab } from '../../types/music'

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    settings,
    setIsImportModalOpen,
    setIsEqualizerOpen,
    setIsSleepTimerOpen,
    setIsStatsOpen,
    setIsSettingsOpen,
  } = useMusic()

  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tracks', label: 'Tracks', icon: Music2 },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'albums', label: 'Albums', icon: Disc },
    { id: 'artists', label: 'Artists', icon: Mic2 },
    { id: 'genres', label: 'Genres', icon: Radio },
    { id: 'folders', label: 'Folders', icon: Folder },
  ]

  const allowedTabs = settings.activeTabs || ['home', 'tracks', 'playlists', 'albums', 'artists', 'genres', 'folders']
  const visibleTabs = tabs.filter(t => allowedTabs.includes(t.id))

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-[#051211]/90 border-r border-teal-500/15 p-4 select-none backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-3">
        <div className="w-9 h-9 rounded-2xl bg-teal-500/20 text-[#19E6C8] border border-teal-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(25,230,200,0.3)] ring-1 ring-teal-400/20">
          <Sparkles className="w-5 h-5 drop-shadow" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-[#F4FFFD] font-display">
            AuraBeat
          </h1>
          <span className="block text-[10px] uppercase font-semibold text-teal-400/80 tracking-wider -mt-0.5">
            Music Studio
          </span>
        </div>
      </div>

      {/* Select Folder Quick Action */}
      <button
        type="button"
        onClick={() => setIsImportModalOpen(true)}
        className="w-full mb-4 py-2.5 px-3 rounded-full bg-[#19E6C8] hover:bg-[#2DD4BF] text-[#04100F] font-extrabold text-xs shadow-[0_0_20px_rgba(25,230,200,0.35)] flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <FolderOpen className="w-4 h-4" />
        <span>Select Music Folder</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-teal-400/60 uppercase tracking-wider px-3 mb-1">
          Library
        </div>
        {visibleTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#19E6C8] text-[#04100F] shadow-[0_0_20px_rgba(25,230,200,0.35)] font-extrabold'
                  : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}

        <div className="pt-4 text-[10px] font-bold text-teal-400/60 uppercase tracking-wider px-3 mb-1">
          Audio Tools
        </div>
        <button
          type="button"
          onClick={() => setIsEqualizerOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#19E6C8]" />
          <span>10-Band EQ</span>
        </button>
        <button
          type="button"
          onClick={() => setIsSleepTimerOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-all"
        >
          <Moon className="w-4 h-4 text-[#2DD4BF]" />
          <span>Sleep Timer</span>
        </button>
        <button
          type="button"
          onClick={() => setIsStatsOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-all"
        >
          <BarChart2 className="w-4 h-4 text-[#19E6C8]" />
          <span>Listening Insights</span>
        </button>
      </nav>

      {/* Bottom Settings Button */}
      <div className="pt-3 border-t border-teal-500/15">
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-all"
        >
          <Settings className="w-4 h-4 text-teal-400/80" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
