import React, { useState } from 'react'
import {
  Search, SlidersHorizontal, MoreVertical, Smartphone,
  FolderOpen, Moon, Activity, BarChart2, Settings,
  Sparkles, X, Shuffle, Play, CheckSquare, Music
} from 'lucide-react'
import { useMusic } from '../../context/MusicContext'

interface TopBarProps {
  onToggleSearch: () => void
  isSearchActive: boolean
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSearch, isSearchActive }) => {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    settings,
    updateSettings,
    setIsEqualizerOpen,
    setIsSleepTimerOpen,
    setIsSettingsOpen,
    setIsStatsOpen,
    setIsImportModalOpen,
    setIsEditTabsOpen,
    selectedTrackIds,
    setSelectedTrackIds,
  } = useMusic()

  const [showOverflowMenu, setShowOverflowMenu] = useState(false)

  const tabTitles: Record<string, string> = {
    home: 'Home',
    tracks: 'Tracks',
    playlists: 'Playlists',
    albums: 'Albums',
    artists: 'Artists',
    genres: 'Genres',
    folders: 'Folders',
  }

  return (
    <header className="sticky top-0 z-30 bg-[#051211]/90 backdrop-blur-xl border-b border-teal-500/15 px-4 py-3 select-none transition-colors">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Brand or Current Section Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-[#19E6C8] border border-teal-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(25,230,200,0.3)] ring-1 ring-teal-400/20">
            <Sparkles className="w-4 h-4 drop-shadow" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#F4FFFD] font-display">
              AuraBeat
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-[#19E6C8] border border-teal-400/40 uppercase tracking-wider text-[10px]">
              {tabTitles[activeTab] || 'Music'}
            </span>
          </div>
        </div>

        {/* Center: Search input when active */}
        {isSearchActive && (
          <div className="flex-1 max-w-md mx-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="relative flex items-center bg-[#081a18]/80 rounded-full px-3 py-1.5 border border-teal-500/20 focus-within:border-[#19E6C8] focus-within:ring-2 focus-within:ring-[#19E6C8]/20">
              <Search className="w-4 h-4 text-teal-400/60 mr-2 shrink-0" />
              <input
                id="music-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks, albums, artists..."
                className="w-full bg-transparent text-xs text-[#F4FFFD] placeholder:text-teal-400/50 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-teal-400/60 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Add Folder Shortcut button */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] hover:bg-slate-100 transition-all active:scale-95"
            title="Select Music Folder"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Select Folder</span>
          </button>

          {/* Search Toggle */}
          <button
            type="button"
            onClick={onToggleSearch}
            className={`p-2 rounded-full transition-colors ${
              isSearchActive
                ? 'bg-teal-500/20 text-[#19E6C8] border border-teal-400/40'
                : 'hover:bg-teal-500/10 text-[#94B5B0] hover:text-[#F4FFFD]'
            }`}
            title="Search (/)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Desktop Phone Frame Toggle */}
          <button
            type="button"
            onClick={() => updateSettings({ phoneFrame: !settings.phoneFrame })}
            className={`hidden lg:flex p-2 rounded-full transition-colors ${
              settings.phoneFrame
                ? 'bg-teal-500/20 text-[#19E6C8] border border-teal-400/40'
                : 'hover:bg-teal-500/10 text-[#94B5B0] hover:text-[#F4FFFD]'
            }`}
            title={settings.phoneFrame ? 'Exit phone frame' : 'Show phone frame mockup'}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Equalizer Quick Shortcut */}
          <button
            type="button"
            onClick={() => setIsEqualizerOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="10-Band Equalizer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Overflow Menu ⋮ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOverflowMenu(!showOverflowMenu)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showOverflowMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowOverflowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-[#051413]/95 backdrop-blur-xl border border-teal-500/25 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 text-xs text-[#F4FFFD]">
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsImportModalOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-teal-500/10 hover:text-[#19E6C8] font-medium transition-colors"
                  >
                    <FolderOpen className="w-4 h-4 text-[#19E6C8]" />
                    <span>Select Music Folder</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsEqualizerOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-teal-500/10 hover:text-[#19E6C8] font-medium transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#2DD4BF]" />
                    <span>10-Band Equalizer</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsSleepTimerOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-teal-500/10 hover:text-[#19E6C8] font-medium transition-colors"
                  >
                    <Moon className="w-4 h-4 text-[#19E6C8]" />
                    <span>Sleep Timer</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsStatsOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-teal-500/10 hover:text-[#19E6C8] font-medium transition-colors"
                  >
                    <BarChart2 className="w-4 h-4 text-[#2DD4BF]" />
                    <span>Listening Insights</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsEditTabsOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-teal-500/10 hover:text-[#19E6C8] font-medium transition-colors"
                  >
                    <CheckSquare className="w-4 h-4 text-[#19E6C8]" />
                    <span>Edit Tab List</span>
                  </button>
                  <div className="my-1 border-t border-teal-500/15" />
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsSettingsOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-teal-500/10 hover:text-[#19E6C8] font-medium transition-colors"
                  >
                    <Settings className="w-4 h-4 text-teal-400/80" />
                    <span>Settings</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
