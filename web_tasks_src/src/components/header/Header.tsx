import React, { useState } from 'react';
import {
  Menu,
  Check,
  Search,
  HelpCircle,
  Settings,
  Grid,
  Sun,
  Moon,
  Laptop,
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
    setShowShortcutsHelp,
    setShowSettingsModal,
    settings,
    updateSettings,
  } = useTasks();

  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleCycleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: next });
  };

  return (
    <header className="h-14 flex-shrink-0 bg-[#131314] dark:bg-[#131314] border-b border-[#282a2c] flex items-center justify-between px-4 text-[#e3e3e3] select-none z-30">
      {/* Left: Hamburger menu + Logo + "Tasks" */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition"
          title="Main menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          {/* Blue circular checkmark logo */}
          <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="text-xl font-normal tracking-tight text-[#e3e3e3]">
            Tasks
          </span>
        </div>
      </div>

      {/* Center: Search Bar (when active or on desktop) */}
      <div className="flex-1 max-w-lg mx-4 hidden md:block">
        <div className="flex items-center bg-[#1e1f20] hover:bg-[#282a2c] focus-within:bg-[#282a2c] rounded-full px-4 py-2 border border-transparent focus-within:border-[#8ab4f8] transition">
          <Search className="w-4 h-4 text-[#8e918f] mr-3 flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-transparent border-none outline-none text-sm text-[#e3e3e3] placeholder-[#8e918f]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-0.5 rounded-full hover:bg-[#333537] text-[#8e918f] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Action Icons: Help, Settings, Grid, Avatar */}
      <div className="flex items-center gap-1">
        {/* Mobile search button */}
        <div className="md:hidden">
          {isSearchActive ? (
            <div className="absolute top-2 left-16 right-16 z-50 flex items-center bg-[#1e1f20] rounded-full px-3 py-1.5 border border-[#8ab4f8]">
              <Search className="w-4 h-4 text-[#8e918f] mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full bg-transparent border-none outline-none text-xs text-[#e3e3e3]"
              />
              <button onClick={() => setIsSearchActive(false)}>
                <X className="w-4 h-4 text-[#8e918f]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchActive(true)}
              className="p-2 rounded-full hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={handleCycleTheme}
          className="p-2 rounded-full hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition"
          title={`Theme: ${settings.theme}`}
        >
          {settings.theme === 'light' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-[#8ab4f8]" />
          )}
        </button>

        {/* Help icon */}
        <button
          onClick={() => setShowShortcutsHelp(true)}
          className="p-2 rounded-full hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition"
          title="Support & keyboard shortcuts (?)"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Settings icon */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 rounded-full hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* 9-dots Grid icon */}
        <button
          className="p-2 rounded-full hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition hidden sm:inline-flex"
          title="Google apps"
        >
          <Grid className="w-5 h-5" />
        </button>

        {/* Profile Avatar */}
        <div className="ml-1 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-transparent hover:ring-[#8ab4f8] transition">
            D
          </div>
        </div>
      </div>
    </header>
  );
};
