import React, { useState, useEffect, useMemo } from 'react';
import {
  getMonthDays,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addDays,
  formatDateToYYYYMMDD,
} from '../../utils/dateUtils';
import { useCalendar } from '../../context/CalendarContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerDropdownProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

export const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  currentDate,
  onSelectDate,
  onClose,
}) => {
  const { currentView, events, settings } = useCalendar();
  const [viewDate, setViewDate] = useState<Date>(new Date(currentDate));

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const currentYear = viewDate.getFullYear();
  const currentMonthIdx = viewDate.getMonth();

  // Navigation handlers
  const prevMonth = () => setViewDate(prev => subMonths(prev, 1));
  const nextMonth = () => setViewDate(prev => addMonths(prev, 1));
  const prevYear = () => setViewDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  const nextYear = () => setViewDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));

  // Event dots indicator for day view
  const getEventDotsForDate = (date: Date) => {
    const dStr = formatDateToYYYYMMDD(date);
    const dayEvents = events.filter(e => e.startDate <= dStr && e.endDate >= dStr && !e.deletedAt);
    if (dayEvents.length === 0) return null;

    const hasBirthday = dayEvents.some(e => e.type === 'birthday' || e.calendarId === 'cal_birthdays');
    const hasTask = dayEvents.some(e => (e.type === 'task' || e.calendarId === 'cal_tasks') && !e.isCompleted);
    const hasEvent = dayEvents.some(e => e.type === 'event' || e.calendarId === 'cal_my_calendar' || e.calendarId === 'cal_holidays');

    return (
      <div className="flex items-center justify-center gap-0.5 mt-0.5">
        {hasBirthday && <span className="w-1 h-1 rounded-full bg-[#EC4899]" />}
        {hasTask && <span className="w-1 h-1 rounded-full bg-[#19E6C8]" />}
        {hasEvent && <span className="w-1 h-1 rounded-full bg-[#38BDF8]" />}
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 1. MONTH VIEW DROPDOWN: Display only month names without dates
   * ------------------------------------------------------------- */
  const renderMonthViewContent = () => {
    return (
      <div className="space-y-3">
        {/* Year Header with Chevrons */}
        <div className="flex items-center justify-between px-2 pb-1 border-b border-[#0e2624]">
          <span className="text-sm font-bold text-[#F4FFFD]">{currentYear}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevYear}
              className="p-1 rounded-full text-[#94B5B0] hover:text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
              title="Previous Year"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextYear}
              className="p-1 rounded-full text-[#94B5B0] hover:text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
              title="Next Year"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 12 Months Grid */}
        <div className="grid grid-cols-3 gap-2">
          {monthNames.map((name, idx) => {
            const isSelected =
              currentDate.getFullYear() === currentYear &&
              currentDate.getMonth() === idx;
            const isCurrentMonth =
              new Date().getFullYear() === currentYear &&
              new Date().getMonth() === idx;

            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onSelectDate(new Date(currentYear, idx, 1));
                  onClose();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center ${isSelected
                  ? 'bg-[#19E6C8] text-[#030707] font-bold shadow-[0_0_12px_rgba(25,230,200,0.4)]'
                  : isCurrentMonth
                    ? 'border border-[#19E6C8] text-[#19E6C8] hover:bg-teal-500/10'
                    : 'text-[#e3e3e3] bg-[#081a18] hover:bg-teal-500/10 hover:text-white border border-[#0e2624]'
                  }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 2. WEEK VIEW DROPDOWN: Month name + corresponding week numbers
   * ------------------------------------------------------------- */
  const renderWeekViewContent = () => {
    const rawWeeks = getMonthDays(viewDate, settings.startWeekOn || 0);

    return (
      <div className="space-y-3">
        {/* Month & Year Header */}
        <div className="flex items-center justify-between px-2 pb-1 border-b border-[#0e2624]">
          <span className="text-sm font-bold text-[#F4FFFD]">
            {monthNames[currentMonthIdx]} {currentYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-full text-[#94B5B0] hover:text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-full text-[#94B5B0] hover:text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of Weeks */}
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {rawWeeks.map((week, idx) => {
            const startDay = week[0];
            const endDay = week[week.length - 1];
            const weekNum = idx + 1;

            const isCurrentWeek =
              currentDate >= startDay &&
              currentDate <= addDays(endDay, 1);

            const startStr = `${shortMonthNames[startDay.getMonth()]} ${startDay.getDate()}`;
            const endStr = `${shortMonthNames[endDay.getMonth()]} ${endDay.getDate()}`;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectDate(startDay);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${isCurrentWeek
                  ? 'bg-[#19E6C8] text-[#030707] font-bold shadow-[0_0_10px_rgba(25,230,200,0.3)]'
                  : 'bg-[#081a18] text-[#e3e3e3] hover:bg-teal-500/10 border border-[#0e2624]'
                  }`}
              >
                <span className="font-semibold">Week {weekNum}</span>
                <span className={isCurrentWeek ? 'text-[#030707] font-medium' : 'text-[#94B5B0]'}>
                  {startStr} – {endStr}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 3. 3-DAY VIEW DROPDOWN: Display only 3 days at a time
   * ------------------------------------------------------------- */
  const renderThreeDayViewContent = () => {
    // Generate 3-day chunks for the active month
    const totalDaysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
    const threeDayChunks: { start: Date; end: Date; label: string }[] = [];

    for (let day = 1; day <= totalDaysInMonth; day += 3) {
      const s = new Date(currentYear, currentMonthIdx, day);
      const endDayNum = Math.min(day + 2, totalDaysInMonth);
      const e = new Date(currentYear, currentMonthIdx, endDayNum);
      const label = `${shortMonthNames[currentMonthIdx]} ${day} – ${shortMonthNames[currentMonthIdx]} ${endDayNum}`;
      threeDayChunks.push({ start: s, end: e, label });
    }

    return (
      <div className="space-y-3">
        {/* Month Header */}
        <div className="flex items-center justify-between px-2 pb-1 border-b border-[#0e2624]">
          <span className="text-sm font-bold text-[#F4FFFD]">
            {monthNames[currentMonthIdx]} {currentYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-full text-[#94B5B0] hover:text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-full text-[#94B5B0] hover:text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3-day blocks grid */}
        <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto">
          {threeDayChunks.map((chunk, idx) => {
            const isSelected =
              currentDate >= chunk.start &&
              currentDate <= addDays(chunk.end, 1);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectDate(chunk.start);
                  onClose();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all ${isSelected
                  ? 'bg-[#19E6C8] text-[#030707] font-bold shadow-[0_0_10px_rgba(25,230,200,0.3)]'
                  : 'bg-[#081a18] text-[#e3e3e3] hover:bg-teal-500/10 border border-[#0e2624]'
                  }`}
              >
                {chunk.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 4. DAY VIEW DROPDOWN: Display entire month with dates
   * ------------------------------------------------------------- */
  const renderDayViewContent = () => {
    const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const weeks = getMonthDays(viewDate, 0);

    return (
      <div className="space-y-2">
        {/* Month Header with Navigation */}
        <div className="flex items-center justify-between px-2 pb-1 border-b border-[#0e2624]">
          <span className="text-sm font-bold text-[#F4FFFD]">
            {monthNames[currentMonthIdx]} {currentYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-full text-[#94B5B0] hover:text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-full text-[#94B5B0] hover:text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#94B5B0] mb-1">
          {dayHeaders.map((dh, i) => (
            <div key={i} className="py-0.5">{dh}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {weeks.flat().map((date, idx) => {
            const isSelected = isSameDay(date, currentDate);
            const isCurToday = isToday(date);
            const isCurMonth = date.getMonth() === viewDate.getMonth();

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectDate(date);
                  onClose();
                }}
                className="flex flex-col items-center justify-center py-1 rounded-full group focus:outline-none"
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-all ${isCurToday
                    ? 'bg-[#19E6C8] text-[#030707] font-bold shadow-[0_0_10px_rgba(25,230,200,0.5)]'
                    : isSelected
                      ? 'border border-[#19E6C8] text-[#19E6C8] font-bold'
                      : isCurMonth
                        ? 'text-[#e3e3e3] group-hover:bg-teal-500/15'
                        : 'text-[#4b5563] group-hover:bg-teal-500/5'
                    }`}
                >
                  {date.getDate()}
                </div>
                <div className="h-2">
                  {getEventDotsForDate(date)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Click-outside backdrop overlay to ensure dropdown can always be closed cleanly */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs"
        onClick={onClose}
      />

      <div className="absolute top-14 left-0 right-0 z-50 bg-[#051211] border-b border-[#0e2624] shadow-2xl px-4 py-3 select-none animate-in slide-in-from-top-2 duration-150">
        <div className="max-w-md mx-auto">
          {currentView === 'month' && renderMonthViewContent()}
          {(currentView === 'week' || currentView === 'four_day') && renderWeekViewContent()}
          {currentView === 'three_day' && renderThreeDayViewContent()}
          {(currentView === 'day' || currentView === 'schedule' || currentView === 'year') && renderDayViewContent()}
        </div>
      </div>
    </>
  );
};
