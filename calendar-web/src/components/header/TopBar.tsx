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
    clearAllData,
  } = useCalendar();

  // Dropdown states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const getHeaderTitle = () => {
    const year = currentDate.getFullYear();
    const month = monthNames[currentDate.getMonth()];
    if (currentView === 'year') {
      return `${year}`;
    }
    if (currentView === 'day') {
      return `${month} ${currentDate.getDate()}, ${year}`;
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
    <header className="h-16 px-3 md:px-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between select-none relative z-30 transition-colors">
      {/* Left side: Hamburger, Logo, Today, Navigation chevrons, Date title */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo & Name */}
        <button
          type="button"
          onClick={goToToday}
          className="flex items-center gap-2.5 group focus:outline-none"
          title="Chronos Calendar - Return to Today"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5"
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
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent hidden sm:inline-block tracking-tight font-sans">
            Chronos
          </span>
        </button>

        {/* Today Button */}
        <button
          type="button"
          onClick={goToToday}
          className="ml-2 md:ml-4 px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-2xs"
        >
          Today
        </button>

        {/* Next / Prev Navigation */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={navigatePrev}
            aria-label="Previous period"
            className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={navigateNext}
            aria-label="Next period"
            className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Date Title with Mini-picker dropdown */}
        <div className="relative" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => setShowDatePicker(prev => !prev)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          >
            <h1 className="text-base md:text-xl font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
              {getHeaderTitle()}
            </h1>
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
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

      {/* Center: Search Box with Advanced Filter toggle */}
      <div className="flex-1 max-w-xl mx-2 md:mx-6 hidden md:block" ref={searchRef}>
        <div className="relative">
          <div className="flex items-center w-full bg-gray-100 dark:bg-gray-800/80 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-md transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search title, description, location, guests..."
              className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
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

      {/* Right side: View Switcher, Help, Settings, Apps Grid, Profile Avatar */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* View Switcher Dropdown */}
        <div className="relative" ref={viewMenuRef}>
          <button
            type="button"
            onClick={() => setShowViewMenu(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span>{currentViewLabel}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showViewMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-white dark:bg-gray-800 p-1.5 shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in zoom-in-95 duration-150">
              {viewOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setCurrentView(option.id);
                    setShowViewMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    currentView === option.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{option.label}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{option.shortcut}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          type="button"
          onClick={openHelp}
          aria-label="Help and keyboard shortcuts"
          title="Help & Shortcuts (?)"
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Settings button */}
        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setShowSettingsMenu(prev => !prev)}
            aria-label="Settings"
            title="Settings"
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <SettingsIcon className="w-5 h-5" />
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
              onClearAll={clearAllData}
              onClose={() => setShowSettingsMenu(false)}
            />
          )}
        </div>

        {/* Apps Grid (Decorative placeholder) */}
        <button
          type="button"
          onClick={() => {
            alert('Chronos Suite Apps: Calendar (active), Tasks (integrated), Notes, Booking Pages.');
          }}
          aria-label="Apps menu"
          title="Chronos Suite Apps"
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:inline-flex"
        >
          <Grid className="w-5 h-5" />
        </button>

        {/* Avatar Profile */}
        <div className="relative ml-1" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-transparent hover:ring-blue-400 transition-all focus:outline-none"
            title="Chronos Account"
          >
            CC
          </button>

          {showProfileMenu && <ProfileMenu onClose={() => setShowProfileMenu(false)} />}
        </div>
      </div>
    </header>
  );
};
