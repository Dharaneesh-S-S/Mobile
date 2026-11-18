import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import {
  getMonthDays,
  isToday,
  formatDateToYYYYMMDD,
  expandRecurringEvents,
} from '../../utils/dateUtils';
import { Cake, Sparkles } from 'lucide-react';

export const MonthView: React.FC = () => {
  const {
    currentDate,
    setCurrentDate,
    setCurrentView,
    calendars,
    events,
    settings,
    openEventDetails,
    openEditor,
    quickToggleTaskCompletion,
    searchQuery,
  } = useCalendar();

  const startDay = settings.startWeekOn || 0;
  const rawWeeks = getMonthDays(currentDate, startDay);

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const orderedHeaders = [...dayHeaders.slice(startDay), ...dayHeaders.slice(0, startDay)];

  const firstDay = rawWeeks[0][0];
  const lastWeek = rawWeeks[rawWeeks.length - 1];
  const lastDay = lastWeek[lastWeek.length - 1];

  const visibleCalendarIds = calendars.filter(c => c.isVisible).map(c => c.id);
  const expanded = expandRecurringEvents(events, firstDay, lastDay);

  // Filter events: always exclude completed tasks from the calendar (Requirement #6)
  const filteredEvents = expanded.filter(e => {
    if (e.deletedAt) return false;
    if (!visibleCalendarIds.includes(e.calendarId)) return false;
    if (e.type === 'task' && e.isCompleted) return false;

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

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030707] text-[#e3e3e3] select-none overflow-hidden">
      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 border-b border-[#0e2624] bg-[#030707]">
        {orderedHeaders.map((dh, idx) => (
          <div
            key={idx}
            className="py-2.5 text-center text-xs font-bold text-[#94B5B0] tracking-wider uppercase"
          >
            {dh}
          </div>
        ))}
      </div>

      {/* Month Weeks Grid */}
      <div className="flex-1 grid grid-rows-5 md:grid-rows-6 border-b border-[#0e2624] overflow-y-auto">
        {rawWeeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7 border-b border-[#0e2624] last:border-b-0 min-h-[90px]">
            {week.map((date, dIdx) => {
              const dateStr = formatDateToYYYYMMDD(date);
              const isCurToday = isToday(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();

              const dayEvents = filteredEvents.filter(
                e => e.startDate <= dateStr && e.endDate >= dateStr
              );

              const tasksOnDay = dayEvents.filter(e => e.type === 'task' || e.calendarId === 'cal_tasks');
              const nonTaskEvents = dayEvents.filter(e => e.type !== 'task' && e.calendarId !== 'cal_tasks');

              return (
                <div
                  key={dIdx}
                  onClick={() => {
                    openEditor(null, {
                      startDate: dateStr,
                      endDate: dateStr,
                      type: 'event',
                    });
                  }}
                  className={`border-r border-[#0e2624] last:border-r-0 p-1 flex flex-col justify-start transition-colors relative hover:bg-teal-500/5 cursor-pointer overflow-hidden ${!isCurrentMonth ? 'bg-[#051211]/40' : 'bg-[#030707]'
                    }`}
                >
                  {/* Date Number Header */}
                  <div className="flex items-center justify-center md:justify-start mb-1">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setCurrentDate(date);
                        setCurrentView('day');
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${isCurToday
                        ? 'bg-[#19E6C8] text-[#030707] font-bold shadow-[0_0_12px_rgba(25,230,200,0.5)]'
                        : isCurrentMonth
                          ? 'text-[#F4FFFD] hover:bg-teal-500/15'
                          : 'text-[#4b5563]'
                        }`}
                    >
                      {date.getDate()}
                    </button>
                  </div>

                  {/* Event Chips List */}
                  <div className="flex-1 space-y-1 overflow-hidden">
                    {/* Non-task events (Holidays = Red, Birthdays = Pink, Events = Light Blue) */}
                    {nonTaskEvents.slice(0, 3).map(item => {
                      const isBday = item.type === 'birthday' || item.calendarId === 'cal_birthdays';
                      const isHoliday = item.type === 'holiday' || item.calendarId === 'cal_holidays';

                      const chipBg = isHoliday
                        ? 'rgba(239, 68, 68, 0.18)'
                        : isBday
                          ? 'rgba(236, 72, 153, 0.18)'
                          : 'rgba(56, 189, 248, 0.18)';
                      const chipBorder = isHoliday
                        ? 'rgba(239, 68, 68, 0.4)'
                        : isBday
                          ? 'rgba(236, 72, 153, 0.4)'
                          : 'rgba(56, 189, 248, 0.4)';
                      const accentColor = isHoliday
                        ? '#EF4444'
                        : isBday
                          ? '#EC4899'
                          : '#38BDF8';

                      return (
                        <div
                          key={item.id}
                          onClick={e => {
                            e.stopPropagation();
                            openEventDetails(item, { x: e.clientX, y: e.clientY });
                          }}
                          style={{
                            backgroundColor: chipBg,
                            borderColor: chipBorder,
                            borderLeftColor: accentColor,
                            borderLeftWidth: '3px',
                          }}
                          className="px-2 py-0.5 rounded-full border text-[11px] font-semibold text-white truncate flex items-center gap-1.5 hover:brightness-110 active:scale-98 transition-all"
                          title={item.title}
                        >
                          {isBday && <Cake className="w-3 h-3 text-[#EC4899] flex-shrink-0" />}
                          {isHoliday && <Sparkles className="w-3 h-3 text-[#EF4444] flex-shrink-0" />}
                          {!isBday && !isHoliday && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] flex-shrink-0" />
                          )}
                          <span className="truncate">{item.title}</span>
                        </div>
                      );
                    })}

                    {/* Tasks: Maintained Teal Design with Hollow Circle Completion Indicator (Requirements #15 & #21) */}
                    {tasksOnDay.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        onClick={e => {
                          e.stopPropagation();
                          openEventDetails(task, { x: e.clientX, y: e.clientY });
                        }}
                        style={{
                          backgroundColor: 'rgba(25, 230, 200, 0.2)',
                        }}
                        className="px-2 py-0.5 rounded-full border border-[#19E6C8] border-l-[3px] border-l-[#19E6C8] text-[11px] font-semibold text-white truncate flex items-center gap-1.5 shadow-[0_0_10px_rgba(25,230,200,0.25)] hover:brightness-110 active:scale-98 transition-all"
                        title={task.title}
                      >
                        {/* Hollow circle completion indicator */}
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            quickToggleTaskCompletion(task.id);
                          }}
                          className="w-3 h-3 rounded-full border-[1.5px] border-[#19E6C8] hover:bg-[#19E6C8]/30 transition-all flex-shrink-0"
                          title="Mark completed"
                        />
                        <span className="truncate">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
