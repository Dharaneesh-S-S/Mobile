import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  HelpCircle,
  Settings as SettingsIcon,
  Grid,
  X,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { ViewType } from '../../types/calendar';
import { DatePickerDropdown } from './DatePickerDropdown';
import { AdvancedSearchPanel } from './AdvancedSearchPanel';
import { SettingsDropdown } from './SettingsDropdown';
import { ProfileMenu } from './ProfileMenu';

export const TopBar: React.FC = () => {
  const {
    currentDate,
    currentView,
    sidebarOpen,
    calendars,
    settings,
    searchQuery,
    advancedFilters,
    setCurrentDate,
    setCurrentView,
    goToToday,
    navigateNext,
    navigatePrev,
    toggleSidebar,
    setSearchQuery,
    setAdvancedFilters,
    openSettings,
    openHelp,
    toggleTheme,
    seedDemoData,
    clearDemoData,
    clearAllData,
  } = useCalendar();

  // Dropdown states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Refs for click outside
  const datePickerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (datePickerRef.current && !datePickerRef.current.contains(target)) {
        setShowDatePicker(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowAdvancedSearch(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setShowSettingsMenu(false);
      }
      if (viewMenuRef.current && !viewMenuRef.current.contains(target)) {
        setShowViewMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format header title
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const getHeaderTitle = (isCompact = false) => {
    const year = currentDate.getFullYear();
    const month = isCompact
      ? currentDate.toLocaleString('default', { month: 'short' })
      : monthNames[currentDate.getMonth()];
    if (currentView === 'year') {
      return `${year}`;
    }
    if (currentView === 'day') {
      return isCompact ? `${month} ${currentDate.getDate()}` : `${month} ${currentDate.getDate()}, ${year}`;
    }
    return `${month} ${year}`;
  };

  const viewOptions: { id: ViewType; label: string; shortcut: string }[] = [
    { id: 'day', label: 'Day', shortcut: 'D' },
    { id: 'week', label: 'Week', shortcut: 'W' },
    { id: 'month', label: 'Month', shortcut: 'M' },
    { id: 'year', label: 'Year', shortcut: 'Y' },
    { id: 'schedule', label: 'Schedule', shortcut: 'A' },
    { id: 'four_day', label: '4 days', shortcut: 'X' },
  ];

  const currentViewLabel = viewOptions.find(v => v.id === currentView)?.label || 'Week';

  return (
    <>
      <header className="h-14 md:h-16 px-2 md:px-5 border-b border-teal-500/15 bg-[#051211]/95 backdrop-blur-xl flex items-center justify-between select-none relative z-30 transition-colors text-[#F4FFFD]">
        {/* Left side: Hamburger, Logo (hidden on mobile), Today, Navigation chevrons, Date title */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-0 flex-shrink">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="p-1.5 md:p-2 rounded-full text-teal-400/70 hover:bg-teal-500/10 hover:text-white transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo & Name (hidden on mobile phones to prevent button crowding) */}
          <button
            type="button"
            onClick={goToToday}
            className="hidden sm:flex items-center gap-2 group focus:outline-none flex-shrink-0"
            title="Chronos Calendar - Return to Today"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-2xl bg-teal-500/20 text-[#19E6C8] border border-teal-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(25,230,200,0.3)] ring-1 ring-teal-400/20 group-hover:scale-105 transition-transform">
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="4" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <circle cx="12" cy="15" r="2" fill="currentColor" />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-extrabold text-[#F4FFFD] hidden md:inline-block tracking-tight font-display">
              Chronos
            </span>
          </button>

          {/* Today Button */}
          <button
            type="button"
            onClick={goToToday}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-teal-500/30 text-xs sm:text-sm font-bold text-[#19E6C8] hover:bg-teal-500/10 transition-colors shadow-2xs flex-shrink-0"
          >
            Today
          </button>

          {/* Next / Prev Navigation */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              type="button"
              onClick={navigatePrev}
              aria-label="Previous period"
              className="p-1 md:p-1.5 rounded-full text-teal-400/70 hover:bg-teal-500/10 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              type="button"
              onClick={navigateNext}
              aria-label="Next period"
              className="p-1 md:p-1.5 rounded-full text-teal-400/70 hover:bg-teal-500/10 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Date Title with Mini-picker dropdown */}
          <div className="relative min-w-0 flex-shrink" ref={datePickerRef}>
            <button
              type="button"
              onClick={() => setShowDatePicker(prev => !prev)}
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-xl hover:bg-teal-500/10 transition-colors group min-w-0"
            >
              <h1 className="text-xs sm:text-base md:text-xl font-bold text-[#F4FFFD] truncate">
                <span className="hidden sm:inline">{getHeaderTitle(false)}</span>
                <span className="sm:hidden">{getHeaderTitle(true)}</span>
              </h1>
              <ChevronDown className="w-3.5 h-3.5 text-teal-400/60 group-hover:text-white transition-colors flex-shrink-0" />
            </button>

            {showDatePicker && (
              <DatePickerDropdown
                currentDate={currentDate}
                onSelectDate={d => setCurrentDate(d)}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </div>
        </div>

        {/* Center: Search Box with Advanced Filter toggle (desktop only) */}
        <div className="flex-1 max-w-xl mx-2 md:mx-6 hidden md:block" ref={searchRef}>
          <div className="relative">
            <div className="flex items-center w-full bg-[#081a18] rounded-full px-3.5 py-1.5 border border-teal-500/20 focus-within:border-[#19E6C8] focus-within:ring-2 focus-within:ring-[#19E6C8]/20 transition-all">
              <Search className="w-4 h-4 text-teal-400/60 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search title, description, location, guests..."
                className="w-full bg-transparent text-sm text-[#F4FFFD] placeholder-teal-400/40 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 text-teal-400/60 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(prev => !prev)}
                aria-label="Advanced search filters"
                className={`p-1.5 ml-1 rounded-lg transition-colors ${
                  advancedFilters
                    ? 'bg-teal-500/20 text-[#19E6C8]'
                    : 'text-teal-400/60 hover:text-white hover:bg-teal-500/10'
                }`}
                title="Advanced search filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {showAdvancedSearch && (
              <AdvancedSearchPanel
                calendars={calendars}
                currentFilters={advancedFilters}
                onApplyFilters={filters => {
                  setAdvancedFilters(filters);
                  if (filters?.query) setSearchQuery(filters.query);
                }}
                onClose={() => setShowAdvancedSearch(false)}
              />
            )}
          </div>
        </div>

        {/* Right side: Mobile Search Toggle, View Switcher, Settings, Profile Avatar */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
          {/* Mobile search toggle button */}
          <button
            type="button"
            onClick={() => setShowMobileSearch(prev => !prev)}
            aria-label="Search"
            title="Search"
            className="md:hidden p-1.5 rounded-full text-teal-400/70 hover:bg-teal-500/10 hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* View Switcher Dropdown */}
          <div className="relative" ref={viewMenuRef}>
            <button
              type="button"
              onClick={() => setShowViewMenu(prev => !prev)}
              className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-teal-500/20 bg-[#081a18] text-xs sm:text-sm font-semibold text-[#F4FFFD] hover:bg-teal-500/10 transition-colors"
            >
              <span>{currentViewLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-teal-400/60" />
            </button>

            {showViewMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-44 sm:w-48 rounded-2xl bg-[#051211] p-1.5 shadow-2xl border border-teal-500/20 z-50 animate-in fade-in zoom-in-95 duration-150">
                {viewOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setCurrentView(option.id);
                      setShowViewMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      currentView === option.id
                        ? 'bg-teal-500/20 text-[#19E6C8] font-bold'
                        : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD]'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-[10px] text-teal-400/60 font-mono">{option.shortcut}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Help button (desktop only, accessible in settings on mobile) */}
          <button
            type="button"
            onClick={openHelp}
            aria-label="Help and keyboard shortcuts"
            title="Help & Shortcuts (?)"
            className="hidden sm:inline-flex p-2 rounded-full text-teal-400/70 hover:bg-teal-500/10 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Settings button - ALWAYS visible! */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setShowSettingsMenu(prev => !prev)}
              aria-label="Settings"
              title="Settings"
              className="p-1.5 md:p-2 rounded-full text-teal-400/70 hover:bg-teal-500/10 hover:text-white transition-colors"
            >
              <SettingsIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {showSettingsMenu && (
              <SettingsDropdown
                settings={settings}
                onOpenSettings={tab => openSettings(tab)}
                onOpenTrash={() => openSettings('trash')}
                onOpenDensityColor={() => openSettings('general')}
                onOpenShortcuts={openHelp}
                onToggleTheme={toggleTheme}
                onResetDemo={seedDemoData}
                onClearDemo={clearDemoData}
                onClearAll={clearAllData}
                onClose={() => setShowSettingsMenu(false)}
              />
            )}
          </div>

          {/* Avatar Profile */}
          <div className="relative ml-0.5" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-500/20 text-[#19E6C8] border border-teal-400/40 flex items-center justify-center text-[11px] sm:text-xs font-bold ring-2 ring-transparent hover:ring-teal-400 transition-all focus:outline-none"
              title="Chronos Account"
            >
              CC
            </button>

            {showProfileMenu && <ProfileMenu onClose={() => setShowProfileMenu(false)} />}
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-3 py-2 bg-[#051211] border-b border-teal-500/20 flex items-center gap-2 z-20 animate-in slide-in-from-top duration-150">
          <Search className="w-4 h-4 text-teal-400/60 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search events, tasks, notes..."
            className="flex-1 bg-[#081a18] rounded-xl px-3 py-1.5 text-xs text-[#F4FFFD] border border-teal-500/20 focus:outline-none focus:border-[#19E6C8]"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-teal-400/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            className="p-1.5 text-teal-400/70 hover:text-white text-xs font-bold"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
};
