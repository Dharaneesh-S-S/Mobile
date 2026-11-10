import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import {
  formatDateToYYYYMMDD,
  isToday,
  addDays,
  expandRecurringEvents,
} from '../../utils/dateUtils';
import { Check, Cake } from 'lucide-react';
import { CalendarEvent } from '../../types/calendar';

export const ScheduleView: React.FC = () => {
  const {
    currentDate,
    events,
    calendars,
    settings,
    openEventDetails,
    setCurrentDate,
    setCurrentView,
    searchQuery,
  } = useCalendar();

  const rangeStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const rangeEnd = addDays(rangeStart, 60);
  const visibleCalendarIds = calendars.filter(c => c.isVisible).map(c => c.id);

  const expanded = expandRecurringEvents(events, rangeStart, rangeEnd);

  const filteredEvents = expanded.filter(e => {
    if (e.deletedAt) return false;
    if (!visibleCalendarIds.includes(e.calendarId)) return false;
    if (!settings.showCompletedTasks && e.type === 'task' && e.isCompleted) return false;

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

  // Group events by date
  const grouped = filteredEvents.reduce<Record<string, CalendarEvent[]>>((acc, item) => {
    const key = item.startDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="flex-1 overflow-y-auto bg-[#030707] text-[#e3e3e3] select-none pb-20">
      {/* Pending Tasks shelf at current date */}
      <div className="px-4 py-3 flex items-start gap-4 border-b border-[#0e2624]">
        <div className="flex flex-col items-center flex-shrink-0 w-10">
          <span className="text-xs text-[#94B5B0] font-medium">Sat</span>
          <div className="w-8 h-8 rounded-full bg-[#19E6C8] text-[#030707] flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(25,230,200,0.5)] mt-0.5">
            31
          </div>
        </div>
        <div className="flex-1 pt-1">
          <div
            onClick={() => {
              setCurrentDate(new Date(2026, 9, 31));
              setCurrentView('day');
            }}
            className="px-3 py-2 rounded-full bg-[#081a18] border border-teal-500/40 border-l-4 border-l-[#19E6C8] text-[#19E6C8] text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-[#0a2421] transition-colors shadow-sm"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>4 pending tasks</span>
          </div>
        </div>
      </div>

      {/* Month Hero Illustration Banner (Screenshot 7 - "November 2026") */}
      <div className="relative h-44 w-full bg-[#0d1627] overflow-hidden my-4">
        {/* Night Cityscape Illustration */}
        <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="180" fill="#0d1627" />
          {/* City buildings background silhouette */}
          <rect x="40" y="40" width="80" height="140" fill="#152238" />
          <rect x="150" y="30" width="90" height="150" fill="#192a45" />
          <rect x="280" y="45" width="100" height="135" fill="#152238" />
          <rect x="420" y="25" width="90" height="155" fill="#1a2c47" />
          {/* Foreground building with windows */}
          <rect x="0" y="70" width="600" height="110" fill="#3e2321" />
          {/* Windows row */}
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
          {/* Water tower and trees */}
          <rect x="330" y="50" width="40" height="20" rx="3" fill="#1e3a5f" />
          <ellipse cx="560" cy="120" rx="35" ry="50" fill="#2e7d32" />
        </svg>

        {/* Month Banner Text */}
        <div className="absolute top-4 left-6 z-10">
          <h2 className="text-xl md:text-2xl font-normal text-white tracking-tight">
            November 2026
          </h2>
        </div>
      </div>

      {/* Week Sections & Date Items (Screenshot 7) */}
      <div className="space-y-6 px-4">
        {sortedDates.map(dateStr => {
          const dayItems = grouped[dateStr];
          const [y, m, d] = dateStr.split('-').map(Number);
          const dt = new Date(y, m - 1, d);
          const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = dt.getDate();
          const isCurToday = isToday(dt);

          return (
            <div key={dateStr} className="flex items-start gap-4">
              {/* Left Date Column */}
              <div className="flex flex-col items-center flex-shrink-0 w-10 pt-1">
                <span className="text-xs text-[#94B5B0] font-medium">{dayName}</span>
                <span
                  className={`text-lg mt-0.5 ${
                    isCurToday ? 'text-[#19E6C8] font-bold' : 'text-[#F4FFFD] font-normal'
                  }`}
                >
                  {dayNum}
                </span>
              </div>

              {/* Right Event Cards Column */}
              <div className="flex-1 space-y-2">
                {dayItems.map(item => {
                  const isBday = item.type === 'birthday' || item.calendarId === 'cal_birthdays';
                  const isTask = item.type === 'task' || item.calendarId === 'cal_tasks';

                  if (isTask) {
                    return (
                      <div
                        key={item.id}
                        onClick={() => openEventDetails(item)}
                        className="px-4 py-2.5 rounded-full bg-[#081a18] border border-teal-500/40 border-l-4 border-l-[#19E6C8] text-[#F4FFFD] text-xs font-semibold flex items-center justify-between cursor-pointer hover:bg-[#0a2421] transition-all shadow-[0_0_12px_rgba(25,230,200,0.15)]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Check className="w-4 h-4 text-[#19E6C8] stroke-[2.5] flex-shrink-0" />
                          <span className={`truncate ${item.isCompleted ? 'line-through text-teal-400/50' : ''}`}>
                            {item.title}
                          </span>
                        </div>
                        {item.startTime && (
                          <span className="text-[11px] text-[#19E6C8] ml-2 flex-shrink-0">
                            {item.startTime}
                          </span>
                        )}
                      </div>
                    );
                  }

                  if (isBday) {
                    /* Birthday Card with festive background (Screenshot 7) */
                    return (
                      <div
                        key={item.id}
                        onClick={() => openEventDetails(item)}
                        className="relative rounded-2xl overflow-hidden p-4 cursor-pointer hover:opacity-95 transition-all shadow-md bg-gradient-to-r from-[#0a2f2b] to-[#123e38] border border-teal-500/30"
                      >
                        <div className="flex items-center gap-2 relative z-10">
                          <Cake className="w-4 h-4 text-[#19E6C8]" />
                          <span className="text-sm font-medium text-white">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  /* Regular Events / Holidays: rounded pill cards with teal background (Screenshot 7) */
                  return (
                    <div
                      key={item.id}
                      onClick={() => openEventDetails(item)}
                      className="px-4 py-3 rounded-2xl bg-[#00897b] hover:bg-[#00796b] text-white text-sm font-medium cursor-pointer shadow-sm transition-all"
                    >
                      <span>{item.title}</span>
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
