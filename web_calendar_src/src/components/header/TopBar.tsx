import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ChevronDown,
  Search,
  X,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { DatePickerDropdown } from './DatePickerDropdown';
import { ProfileMenu } from './ProfileMenu';

export const TopBar: React.FC = () => {
  const {
    currentDate,
    currentView,
    toggleSidebar,
    goToToday,
    setCurrentDate,
    searchQuery,
    setSearchQuery,
  } = useCalendar();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const todayDateNum = new Date().getDate();

  return (
    <>
      <header className="h-14 px-3 md:px-4 bg-[#030707] border-b border-[#0e2624] flex items-center justify-between select-none relative z-30 transition-colors text-[#F4FFFD]">
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

          {/* Month Dropdown Button (Screenshots 2 & 10) */}
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

        {/* Right side: Search, Today icon, Avatar Profile (NO task button per user request!) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Button */}
          <button
            type="button"
            onClick={() => setShowSearch(prev => !prev)}
            aria-label="Search"
            title="Search"
            className="p-2 rounded-full text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#19E6C8] transition-colors"
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

          {/* User Profile Avatar */}
          <div className="relative ml-1" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="w-8 h-8 rounded-full overflow-hidden border border-teal-500/40 focus:outline-none ring-2 ring-transparent hover:ring-[#19E6C8] transition-all flex items-center justify-center bg-[#081a18]"
              title="Profile"
            >
              <div className="w-full h-full bg-gradient-to-tr from-[#0b332f] to-[#19E6C8] flex items-center justify-center text-xs font-bold text-[#030707]">
                P
              </div>
            </button>

            {showProfileMenu && <ProfileMenu onClose={() => setShowProfileMenu(false)} />}
          </div>
        </div>
      </header>

      {/* Inline Month Picker Dropdown (Screenshot 10) */}
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

      {/* Search Input Bar (when search icon is pressed) */}
      {showSearch && (
        <div className="px-3 py-2 bg-[#051211] border-b border-teal-500/20 flex items-center gap-2 z-20 animate-in slide-in-from-top-1 duration-150">
          <Search className="w-4 h-4 text-teal-400/60 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search events, birthdays, tasks..."
            className="flex-1 bg-[#081a18] rounded-full px-3.5 py-1.5 text-xs text-[#F4FFFD] border border-teal-500/30 focus:outline-none focus:border-[#19E6C8]"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-[#94B5B0] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSearch(false)}
            className="px-2 py-1 text-[#19E6C8] hover:text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      )}
    </>
  );
};
