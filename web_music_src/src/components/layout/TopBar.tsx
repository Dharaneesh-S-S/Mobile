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
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 select-none transition-colors">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Brand or Current Section Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-fuchsia-600/30 ring-1 ring-white/20">
            <Sparkles className="w-4 h-4 drop-shadow" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-purple-600 dark:from-fuchsia-400 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent font-display">
              AuraBeat
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950/60 text-fuchsia-700 dark:text-fuchsia-300 uppercase tracking-wider text-[10px]">
              {tabTitles[activeTab] || 'Music'}
            </span>
          </div>
        </div>

        {/* Center: Search input when active */}
        {isSearchActive && (
          <div className="flex-1 max-w-md mx-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-1.5 border border-transparent focus-within:border-fuchsia-500/50 focus-within:ring-2 focus-within:ring-fuchsia-500/20">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                id="music-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks, albums, artists..."
                className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Add Folder Shortcut button */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-sm shadow-fuchsia-500/25 transition-all active:scale-95"
            title="Select Music Folder"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Select Folder</span>
          </button>

          {/* Search Toggle */}
          <button
            type="button"
            onClick={onToggleSearch}
            className={`p-2 rounded-xl transition-colors ${
              isSearchActive
                ? 'bg-fuchsia-100 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Search (/)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Desktop Phone Frame Toggle */}
          <button
            type="button"
            onClick={() => updateSettings({ phoneFrame: !settings.phoneFrame })}
            className={`hidden lg:flex p-2 rounded-xl transition-colors ${
              settings.phoneFrame
                ? 'bg-fuchsia-100 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
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
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 text-xs text-slate-700 dark:text-slate-200">
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsImportModalOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    <FolderOpen className="w-4 h-4 text-fuchsia-500" />
                    <span>Select Music Folder</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsEqualizerOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                    <span>10-Band Equalizer</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsSleepTimerOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    <Moon className="w-4 h-4 text-amber-500" />
                    <span>Sleep Timer</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsStatsOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    <BarChart2 className="w-4 h-4 text-emerald-500" />
                    <span>Listening Insights</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsEditTabsOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    <CheckSquare className="w-4 h-4 text-purple-500" />
                    <span>Edit Tab List</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setIsSettingsOpen(true)
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
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
