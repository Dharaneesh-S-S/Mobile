import React, { useState, useEffect } from 'react';
import {
  Menu,
  ChevronDown,
  Search,
  X,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { DatePickerDropdown } from './DatePickerDropdown';
import { formatDateToYYYYMMDD, expandRecurringEvents } from '../../utils/dateUtils';

export const TopBar: React.FC = () => {
  const {
    currentDate,
    toggleSidebar,
    goToToday,
    setCurrentDate,
    setCurrentView,
    events,
    searchQuery,
    setSearchQuery,
  } = useCalendar();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Close dropdown or search on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDatePicker(false);
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('schedule');

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    // Search across events (expanding recurring events in a ±2 year window)
    const now = new Date();
    const searchStart = new Date(now.getFullYear() - 1, 0, 1);
    const searchEnd = new Date(now.getFullYear() + 2, 11, 31);
    const allInstances = expandRecurringEvents(events, searchStart, searchEnd);

    const matches = allInstances.filter(item => {
      if (item.deletedAt) return false;
      if (item.type === 'task' && item.isCompleted) return false;
      if (item.type === 'task' && item.createdFromCalendar === false) return false;
      return (
        item.title.toLowerCase().includes(trimmed) ||
        item.description?.toLowerCase().includes(trimmed) ||
        item.location?.toLowerCase().includes(trimmed)
      );
    });

    if (matches.length > 0) {
      const todayStr = formatDateToYYYYMMDD(new Date());
      // Sort matches: prefer upcoming matches first, then past matches
      const upcoming = matches
        .filter(m => m.startDate >= todayStr)
        .sort((a, b) => a.startDate.localeCompare(b.startDate));
      const past = matches
        .filter(m => m.startDate < todayStr)
        .sort((a, b) => b.startDate.localeCompare(a.startDate));

      const best = upcoming[0] || past[0] || matches[0];
      if (best && best.startDate) {
        const [y, m, d] = best.startDate.split('-').map(Number);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          setCurrentDate(new Date(y, m - 1, d));
        }

        setTimeout(() => {
          const el = document.getElementById(`schedule-date-${best.startDate}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentMonthName = monthNames[currentDate.getMonth()];
  const todayDateNum = new Date().getDate();

  return (
    <div className="relative z-50">
      <header className="h-14 px-3 md:px-4 bg-[#030707] border-b border-[#0e2624] flex items-center justify-between select-none relative z-50 transition-colors text-[#F4FFFD]">
        {/* Left side: Hamburger + Month dropdown */}
        <div className="flex items-center gap-2">
          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Navigation drawer"
            title="Main menu"
            className="p-2 rounded-full text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#19E6C8] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Month Dropdown Button */}
          <button
            type="button"
            onClick={() => setShowDatePicker(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-teal-500/10 transition-colors focus:outline-none"
            title="Select month"
          >
            <span className="text-xl md:text-2xl font-semibold tracking-tight text-[#F4FFFD]">
              {currentMonthName}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#19E6C8] transition-transform duration-200 ${
                showDatePicker ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Right side: Search, Today icon (User Profile Icon removed per requirement #20) */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            type="button"
            onClick={() => {
              setShowSearch(prev => {
                const next = !prev;
                if (next) {
                  setCurrentView('schedule');
                  if (searchQuery) {
                    executeSearch(searchQuery);
                  }
                }
                return next;
              });
            }}
            aria-label="Search"
            title="Search"
            className={`p-2 rounded-full transition-colors ${
              showSearch
                ? 'bg-teal-500/20 text-[#19E6C8]'
                : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#19E6C8]'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Today Button: Calendar page square icon with today's day number inside */}
          <button
            type="button"
            onClick={goToToday}
            aria-label="Today"
            title={`Today (${todayDateNum})`}
            className="p-1 rounded-lg text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
          >
            <div className="w-6 h-6 border-2 border-current rounded-md flex flex-col items-center justify-center font-bold text-[10px] leading-none pt-0.5">
              <span>{todayDateNum}</span>
            </div>
          </button>
        </div>
      </header>

      {/* Independent Search Input Bar */}
      {showSearch && (
        <form
          onSubmit={e => {
            e.preventDefault();
            executeSearch(searchQuery);
          }}
          className="px-3 py-2 bg-[#051211] border-b border-teal-500/20 flex items-center gap-2 relative z-50 animate-in slide-in-from-top-1 duration-150"
        >
          <Search className="w-4 h-4 text-teal-400/60 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => executeSearch(e.target.value)}
            placeholder="Search events, birthdays, tasks..."
            className="flex-1 bg-[#081a18] rounded-full px-3.5 py-1.5 text-xs text-[#F4FFFD] border border-teal-500/30 focus:outline-none focus:border-[#19E6C8]"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
              }}
              className="p-1 text-[#94B5B0] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}
            className="px-2 py-1 text-[#19E6C8] hover:text-white text-xs font-semibold"
          >
            Done
          </button>
        </form>
      )}

      {/* Dynamic Month/View Picker Dropdown */}
      {showDatePicker && (
        <DatePickerDropdown
          currentDate={currentDate}
          onSelectDate={date => {
            setCurrentDate(date);
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};
