import React from 'react'
import { Menu, Search, X } from 'lucide-react'
import { NoteViewMode } from '../../types'

interface HeaderProps {
  onToggleSidebar: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  viewMode?: NoteViewMode
  onToggleViewMode?: () => void
  onOpenSettings?: () => void
  onCreateQuickNote?: () => void
  onCreateChecklist?: () => void
  onCreateDrawing?: () => void
  onCreateDocument?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#051211]/90 backdrop-blur-xl border-b border-teal-500/20 px-3 md:px-6 py-2.5 flex items-center justify-between gap-3 shadow-2xs select-none text-[#F4FFFD]">
      {/* Left: Hamburger menu toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-teal-500/10 text-teal-400 hover:text-white transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Full-text Search Bar */}
      <div className="flex-1 max-w-2xl mx-auto">
        <div className="relative flex items-center bg-[#081a18]/80 hover:bg-[#0a2421] focus-within:bg-[#0a2421] focus-within:ring-2 focus-within:ring-[#19E6C8]/25 rounded-full px-3.5 py-2 transition-all border border-teal-500/20 focus-within:border-[#19E6C8]">
          <Search className="w-4 h-4 text-teal-400/60 shrink-0 mr-2" />
          <input
            id="main-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or labels..."
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

      {/* Right spacer to balance layout */}
      <div className="w-9 shrink-0 hidden sm:block" />
    </header>
  )
}
