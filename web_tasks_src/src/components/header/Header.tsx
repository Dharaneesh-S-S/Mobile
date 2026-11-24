import React, { useState } from 'react';
import {
  Menu,
  Check,
  Search,
  X,
} from 'lucide-react';
import { useTasks } from '../../context/TasksContext';

interface HeaderProps {
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Header: React.FC<HeaderProps> = ({ searchInputRef }) => {
  const {
    toggleSidebar,
    searchQuery,
    setSearchQuery,
  } = useTasks();

  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className="h-14 flex-shrink-0 bg-[#051211]/90 backdrop-blur-xl border-b border-teal-500/20 flex items-center justify-between px-4 text-[#F4FFFD] select-none z-30">
      {/* Left: Hamburger menu + Logo + "Tasks" */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-teal-500/10 text-[#94B5B0] hover:text-[#F4FFFD] transition"
          title="Main menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          {/* Neon Cyan circular checkmark logo */}
          <div className="w-8 h-8 rounded-xl bg-[#19E6C8] flex items-center justify-center text-[#030707] shadow-[0_0_15px_rgba(25,230,200,0.4)] flex-shrink-0">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#F4FFFD] font-display">
            Tasks
          </span>
        </div>
      </div>

      {/* Center: Search Bar (when active or on desktop) */}
      <div className="flex-1 max-w-lg mx-4 hidden md:block">
        <div className="flex items-center bg-[#081a18]/80 hover:bg-[#0a2421] focus-within:bg-[#0a2421] rounded-full px-4 py-2 border border-teal-500/20 focus-within:border-[#19E6C8] focus-within:ring-2 focus-within:ring-[#19E6C8]/20 transition">
          <Search className="w-4 h-4 text-teal-400/60 mr-3 flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-transparent border-none outline-none text-sm text-[#F4FFFD] placeholder:text-teal-400/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-0.5 rounded-full hover:bg-teal-500/20 text-teal-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Action Icons: Mobile search */}
      <div className="flex items-center gap-1">
        {/* Mobile search button */}
        <div className="md:hidden">
          {isSearchActive ? (
            <div className="absolute top-2 left-16 right-16 z-50 flex items-center bg-[#051211] rounded-full px-3 py-1.5 border border-[#19E6C8] shadow-lg">
              <Search className="w-4 h-4 text-[#19E6C8] mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full bg-transparent border-none outline-none text-xs text-[#F4FFFD]"
              />
              <button onClick={() => setIsSearchActive(false)}>
                <X className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchActive(true)}
              className="p-2 rounded-full hover:bg-teal-500/10 text-[#94B5B0] hover:text-[#F4FFFD] transition"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
