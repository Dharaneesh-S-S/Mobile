import React, { useState } from 'react'
import {
  Menu, Search, LayoutGrid, List, Settings, Cloud,
  Sparkles, Plus, CheckSquare, PenTool, FileText, X,
  User, CheckCircle2, SlidersHorizontal
} from 'lucide-react'
import { NoteViewMode } from '../../types'

interface HeaderProps {
  onToggleSidebar: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  viewMode: NoteViewMode
  onToggleViewMode: () => void
  onOpenSettings: () => void
  onCreateQuickNote: () => void
  onCreateChecklist: () => void
  onCreateDrawing: () => void
  onCreateDocument: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
  viewMode,
  onToggleViewMode,
  onOpenSettings,
  onCreateQuickNote,
  onCreateChecklist,
  onCreateDrawing,
  onCreateDocument,
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 md:px-6 py-2.5 flex items-center justify-between gap-3 shadow-2xs select-none">
      {/* Left: Hamburger & Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer">
          {/* Custom AuraNotes Brand Logo: Glowing Quill + Note Emblem */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 drop-shadow" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-amber-300 bg-clip-text text-transparent">
              AuraNotes
            </span>
            <span className="block text-[9px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
              Studio
            </span>
          </div>
        </div>
      </div>

      {/* Center: Full-text Search Bar */}
      <div className="flex-1 max-w-2xl mx-2">
        <div className="relative flex items-center bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-500/50 rounded-2xl px-3.5 py-2 transition-all border border-transparent focus-within:border-indigo-400/50">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
          <input
            id="main-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, checklists, documents, or labels..."
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
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

      {/* Right Controls: "+" Create button, Grid/List toggle, Sync status, Settings, User avatar */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Create "+" Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-sm shadow-indigo-500/25 transition-all active:scale-95"
            title="Create new item"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Create</span>
          </button>

          {showCreateMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs animate-in zoom-in-95">
              <button
                onClick={() => { onCreateQuickNote(); setShowCreateMenu(false) }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Take a note...</div>
                  <div className="text-[10px] text-slate-400">Quick capture card</div>
                </div>
              </button>

              <button
                onClick={() => { onCreateChecklist(); setShowCreateMenu(false) }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">New checklist</div>
                  <div className="text-[10px] text-slate-400">Tasks with checkboxes</div>
                </div>
              </button>

              <button
                onClick={() => { onCreateDrawing(); setShowCreateMenu(false) }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 flex items-center justify-center">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">New drawing</div>
                  <div className="text-[10px] text-slate-400">Vector canvas sketch</div>
                </div>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

              <button
                onClick={() => { onCreateDocument(); setShowCreateMenu(false) }}
                className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2.5 text-indigo-700 dark:text-indigo-400"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">New document</div>
                  <div className="text-[10px] opacity-80">Full-scale Word editor</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <button
          type="button"
          onClick={onToggleViewMode}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title={viewMode === 'grid' ? 'Switch to List view' : 'Switch to Grid view'}
        >
          {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
        </button>

        {/* Sync Status (Mock IndexedDB) */}
        <div
          className="hidden lg:flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 font-medium"
          title="All notes stored locally in IndexedDB"
        >
          <Cloud className="w-3.5 h-3.5" />
          <span className="text-[10px]">Synced</span>
        </div>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-500/30 hover:scale-105 transition-transform"
            title="User Profile"
          >
            A
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 text-xs">
              <div className="font-semibold text-slate-900 dark:text-white">AuraNotes User</div>
              <div className="text-[10px] text-slate-400">Offline Profile (No Backend)</div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-1">
                <button
                  onClick={() => { onOpenSettings(); setShowProfileMenu(false) }}
                  className="text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
