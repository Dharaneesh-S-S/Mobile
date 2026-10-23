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
    <header className="sticky top-0 z-30 bg-[#051211]/90 backdrop-blur-xl border-b border-teal-500/20 px-3 md:px-6 py-2.5 flex items-center justify-between gap-3 shadow-2xs select-none text-[#F4FFFD]">
      {/* Left: Hamburger & Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-teal-500/10 text-teal-400 hover:text-white transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer">
          {/* Custom AuraNotes Brand Logo: Neon Cyan Emblem */}
          <div className="w-9 h-9 rounded-xl bg-[#19E6C8] flex items-center justify-center text-[#030707] shadow-[0_0_15px_rgba(25,230,200,0.4)]">
            <Sparkles className="w-5 h-5 drop-shadow" />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-base tracking-tight text-[#F4FFFD] font-display">
              AuraNotes
            </span>
            <span className="block text-[9px] uppercase tracking-wider font-semibold text-teal-400 -mt-1">
              Studio
            </span>
          </div>
        </div>
      </div>

      {/* Center: Full-text Search Bar */}
      <div className="flex-1 max-w-2xl mx-2">
        <div className="relative flex items-center bg-[#081a18]/80 hover:bg-[#0a2421] focus-within:bg-[#0a2421] focus-within:ring-2 focus-within:ring-[#19E6C8]/25 rounded-full px-3.5 py-2 transition-all border border-teal-500/20 focus-within:border-[#19E6C8]">
          <Search className="w-4 h-4 text-teal-400/60 shrink-0 mr-2" />
          <input
            id="main-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, checklists, documents, or labels..."
            className="w-full bg-transparent text-xs text-[#F4FFFD] placeholder:text-teal-400/50 focus:outline-none"
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

      {/* Right Controls: "+" Create button, Grid/List toggle, Sync status, Settings, User avatar */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Create "+" Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] transition-all active:scale-95"
            title="Create new item"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden md:inline">Create</span>
          </button>

          {showCreateMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#051211]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-teal-500/20 py-1.5 z-50 text-xs animate-in zoom-in-95 text-[#F4FFFD]">
              <button
                onClick={() => { onCreateQuickNote(); setShowCreateMenu(false) }}
                className="w-full text-left px-3.5 py-2 hover:bg-teal-500/15 flex items-center gap-2.5 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-[#19E6C8] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#F4FFFD]">Take a note...</div>
                  <div className="text-[10px] text-teal-400/60">Quick capture card</div>
                </div>
              </button>

              <button
                onClick={() => { onCreateChecklist(); setShowCreateMenu(false) }}
                className="w-full text-left px-3.5 py-2 hover:bg-teal-500/15 flex items-center gap-2.5 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-[#19E6C8] flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#F4FFFD]">New checklist</div>
                  <div className="text-[10px] text-teal-400/60">Tasks with checkboxes</div>
                </div>
              </button>

              <button
                onClick={() => { onCreateDrawing(); setShowCreateMenu(false) }}
                className="w-full text-left px-3.5 py-2 hover:bg-teal-500/15 flex items-center gap-2.5 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-[#19E6C8] flex items-center justify-center">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#F4FFFD]">New drawing</div>
                  <div className="text-[10px] text-teal-400/60">Vector canvas sketch</div>
                </div>
              </button>

              <div className="my-1 border-t border-teal-500/20" />

              <button
                onClick={() => { onCreateDocument(); setShowCreateMenu(false) }}
                className="w-full text-left px-3.5 py-2 hover:bg-teal-500/15 flex items-center gap-2.5 text-[#19E6C8] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-[#19E6C8] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">New document</div>
                  <div className="text-[10px] text-teal-400/60">Full-scale Word editor</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <button
          type="button"
          onClick={onToggleViewMode}
          className="p-2 rounded-xl hover:bg-teal-500/10 text-teal-400 hover:text-white transition-colors"
          title={viewMode === 'grid' ? 'Switch to List view' : 'Switch to Grid view'}
        >
          {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
        </button>

        {/* Sync Status (Mock IndexedDB) */}
        <div
          className="hidden lg:flex items-center gap-1.5 text-[#19E6C8] text-xs px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 font-bold"
          title="All notes stored locally in IndexedDB"
        >
          <Cloud className="w-3.5 h-3.5" />
          <span className="text-[10px]">Synced</span>
        </div>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl hover:bg-teal-500/10 text-teal-400 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/40 text-[#19E6C8] font-bold text-xs flex items-center justify-center ring-2 ring-transparent hover:ring-[#19E6C8] transition-all shadow-[0_0_12px_rgba(25,230,200,0.25)]"
            title="User Profile"
          >
            A
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#051211]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-teal-500/20 p-3 z-50 text-xs text-[#F4FFFD]">
              <div className="font-bold text-[#F4FFFD]">AuraNotes User</div>
              <div className="text-[10px] text-teal-400/60">Offline Profile (No Backend)</div>
              <div className="mt-2 pt-2 border-t border-teal-500/20 flex flex-col gap-1">
                <button
                  onClick={() => { onOpenSettings(); setShowProfileMenu(false) }}
                  className="text-left px-2 py-1.5 rounded-lg hover:bg-teal-500/15 text-teal-300"
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
