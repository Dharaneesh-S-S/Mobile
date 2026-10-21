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
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-slate-50/70 dark:bg-slate-900/70 border-r border-slate-200/80 dark:border-slate-800/80 p-4 select-none backdrop-blur-md">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-3">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-600/30 ring-1 ring-white/20">
          <Sparkles className="w-5 h-5 drop-shadow" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-purple-600 dark:from-fuchsia-400 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent font-display">
            AuraBeat
          </h1>
          <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider -mt-0.5">
            Music Studio
          </span>
        </div>
      </div>

      {/* Select Folder Quick Action */}
      <button
        type="button"
        onClick={() => setIsImportModalOpen(true)}
        className="w-full mb-4 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-fuchsia-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <FolderOpen className="w-4 h-4" />
        <span>Select Music Folder</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
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
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}

        <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
          Audio Tools
        </div>
        <button
          type="button"
          onClick={() => setIsEqualizerOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span>10-Band EQ</span>
        </button>
        <button
          type="button"
          onClick={() => setIsSleepTimerOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <Moon className="w-4 h-4 text-amber-500" />
          <span>Sleep Timer</span>
        </button>
        <button
          type="button"
          onClick={() => setIsStatsOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <BarChart2 className="w-4 h-4 text-emerald-500" />
          <span>Listening Insights</span>
        </button>
      </nav>

      {/* Bottom Settings Button */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
