import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import {
  formatDateToYYYYMMDD,
  formatTimeDisplay,
  isToday,
  expandRecurringEvents,
} from '../../utils/dateUtils';
import { Cake, Sparkles } from 'lucide-react';
import { CalendarEvent } from '../../types/calendar';

export const ScheduleView: React.FC = () => {
  const {
    currentDate,
    events,
    calendars,
    openEventDetails,
    quickToggleTaskCompletion,
    searchQuery,
    settings,
  } = useCalendar();

  // Selected month range
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const rangeStart = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const rangeEnd = new Date(year, month, lastDayOfMonth);

  const visibleCalendarIds = calendars.filter(c => c.isVisible).map(c => c.id);

  const expanded = expandRecurringEvents(events, rangeStart, rangeEnd);

  // Filter events: always exclude completed tasks, and exclude tasks added directly in Tasks (no timeline)
  const filteredEvents = expanded.filter(e => {
    if (e.deletedAt) return false;
    if (!visibleCalendarIds.includes(e.calendarId)) return false;
    if (e.type === 'task' && e.isCompleted) return false;
    if (e.type === 'task' && !e.createdFromCalendar) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const currentMonthTitle = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Group events by date, deduplicating tasks by clean ID
  const grouped = filteredEvents.reduce<Record<string, CalendarEvent[]>>((acc, item) => {
    const key = item.startDate;
    if (!acc[key]) acc[key] = [];
    const itemKey = item.type === 'task' ? `task_${item.id.replace(/^task_/, '')}` : item.id;
    const exists = acc[key].some(
      existing => (existing.type === 'task' ? `task_${existing.id.replace(/^task_/, '')}` : existing.id) === itemKey
    );
    if (!exists) {
      acc[key].push(item);
    }
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="flex-1 overflow-y-auto bg-[#030707] text-[#e3e3e3] select-none pb-20">
      {/* Dynamic Month Hero Illustration Banner */}
      <div className="relative h-44 w-full bg-[#0d1627] overflow-hidden mb-4">
        {/* Night Cityscape Illustration */}
        <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="180" fill="#0d1627" />
          <rect x="40" y="40" width="80" height="140" fill="#152238" />
          <rect x="150" y="30" width="90" height="150" fill="#192a45" />
          <rect x="280" y="45" width="100" height="135" fill="#152238" />
          <rect x="420" y="25" width="90" height="155" fill="#1a2c47" />
          <rect x="0" y="70" width="600" height="110" fill="#3e2321" />
          {[15, 65, 115, 165, 215, 265, 315, 365, 415, 465, 515, 565].map((x, i) => (
            <React.Fragment key={i}>
              <rect
                x={x}
                y="85"
                width="32"
                height="45"
                fill={i % 3 === 0 ? '#ffea79' : i % 2 === 0 ? '#26a69a' : '#1c1b24'}
              />
              <line x1={x + 16} y1="85" x2={x + 16} y2="130" stroke="#3e2321" strokeWidth="2" />
            </React.Fragment>
          ))}
          <rect x="330" y="50" width="40" height="20" rx="3" fill="#1e3a5f" />
          <ellipse cx="560" cy="120" rx="35" ry="50" fill="#2e7d32" />
        </svg>

        {/* Dynamic Month Banner Title */}
        <div className="absolute top-4 left-6 z-10">
          <h2 className="text-xl md:text-2xl font-normal text-white tracking-tight">
            {currentMonthTitle}
          </h2>
        </div>
      </div>

      {/* Empty State */}
      {sortedDates.length === 0 && (
        <div className="text-center py-12 text-[#94B5B0]">
          <p className="text-sm">No events scheduled for {currentMonthTitle}</p>
        </div>
      )}

      {/* Week Sections & Date Items */}
      <div className="space-y-6 px-4">
        {sortedDates.map(dateStr => {
          const dayItems = grouped[dateStr];
          const [y, m, d] = dateStr.split('-').map(Number);
          const dt = new Date(y, m - 1, d);
          const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = dt.getDate();
          const isCurToday = isToday(dt);
          const hasHoliday = dayItems.some(
            item => item.type === 'holiday' || item.calendarId === 'cal_holidays'
          );

          return (
            <div key={dateStr} className="flex items-start gap-4">
              {/* Left Date Column */}
              <div className="flex flex-col items-center flex-shrink-0 w-10 pt-1">
                <span className={`text-xs font-medium ${hasHoliday ? 'text-[#EF4444]' : 'text-[#94B5B0]'}`}>
                  {dayName}
                </span>
                <span
                  className={`text-lg mt-0.5 ${
                    hasHoliday
                      ? 'text-[#EF4444] font-bold'
                      : isCurToday
                      ? 'text-[#19E6C8] font-bold'
                      : 'text-[#F4FFFD] font-normal'
                  }`}
                >
                  {dayNum}
                </span>
              </div>

              {/* Right Event Cards Column */}
              <div className="flex-1 space-y-2">
                {dayItems.map(item => {
                  const isBday = item.type === 'birthday' || item.calendarId === 'cal_birthdays';
                  const isHoliday = item.type === 'holiday' || item.calendarId === 'cal_holidays';
                  const isTask = item.type === 'task' || item.calendarId === 'cal_tasks';

                  // Tasks: Existing Teal design + hollow circle completion indicator
                  if (isTask) {
                    return (
                      <div
                        key={item.id}
                        onClick={() => openEventDetails(item)}
                        style={{
                          backgroundColor: 'rgba(25, 230, 200, 0.2)',
                        }}
                        className="px-4 py-3 rounded-full md:rounded-2xl border border-[#19E6C8] border-l-4 border-l-[#19E6C8] cursor-pointer hover:brightness-110 active:scale-98 transition-all flex items-center justify-between shadow-[0_0_14px_rgba(25,230,200,0.25)]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Hollow circle completion indicator (Requirement #15) */}
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              quickToggleTaskCompletion(item.id);
                            }}
                            className="w-4 h-4 rounded-full border-2 border-[#19E6C8] hover:bg-[#19E6C8]/20 transition-all flex-shrink-0"
                            title="Mark task completed"
                          />
                          <span className="text-sm font-semibold text-white truncate">
                            {item.title}
                          </span>
                        </div>
                        {item.startTime && (
                          <span className="text-xs font-medium text-[#19E6C8] ml-2 flex-shrink-0">
                            {formatTimeDisplay(item.startTime, settings.timeFormat)}
                          </span>
                        )}
                      </div>
                    );
                  }

                  // Birthdays: Pink (#EC4899)
                  if (isBday) {
                    return (
                      <div
                        key={item.id}
                        onClick={() => openEventDetails(item)}
                        style={{
                          backgroundColor: 'rgba(236, 72, 153, 0.18)',
                          borderColor: 'rgba(236, 72, 153, 0.4)',
                          borderLeftColor: '#EC4899',
                          borderLeftWidth: '4px',
                        }}
                        className="px-4 py-3 rounded-full md:rounded-2xl border cursor-pointer hover:brightness-110 active:scale-98 transition-all flex items-center justify-between shadow-[0_0_14px_rgba(236,72,153,0.2)]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Cake className="w-4 h-4 text-[#EC4899] flex-shrink-0" />
                          <span className="text-sm font-semibold text-white truncate">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Holidays: Red (#EF4444)
                  if (isHoliday) {
                    return (
                      <div
                        key={item.id}
                        onClick={() => openEventDetails(item)}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.18)',
                          borderColor: 'rgba(239, 68, 68, 0.4)',
                          borderLeftColor: '#EF4444',
                          borderLeftWidth: '4px',
                        }}
                        className="px-4 py-3 rounded-full md:rounded-2xl border cursor-pointer hover:brightness-110 active:scale-98 transition-all flex items-center justify-between shadow-[0_0_14px_rgba(239,68,68,0.2)]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Sparkles className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
                          <span className="text-sm font-semibold text-white truncate">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Events: Light Blue (#38BDF8)
                  return (
                    <div
                      key={item.id}
                      onClick={() => openEventDetails(item)}
                      style={{
                        backgroundColor: 'rgba(56, 189, 248, 0.18)',
                        borderColor: 'rgba(56, 189, 248, 0.4)',
                        borderLeftColor: '#38BDF8',
                        borderLeftWidth: '4px',
                      }}
                      className="px-4 py-3 rounded-full md:rounded-2xl border cursor-pointer hover:brightness-110 active:scale-98 transition-all flex items-center justify-between shadow-[0_0_14px_rgba(56,189,248,0.2)]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)] flex-shrink-0" />
                        <span className="text-sm font-semibold text-white truncate">
                          {item.title}
                        </span>
                      </div>
                      {item.startTime && (
                        <span className="text-xs font-medium text-[#38BDF8] ml-2 flex-shrink-0">
                          {formatTimeDisplay(item.startTime, settings.timeFormat)}
                          {item.endTime ? ` – ${formatTimeDisplay(item.endTime, settings.timeFormat)}` : ''}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
