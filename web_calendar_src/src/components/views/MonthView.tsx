import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import {
  getMonthDays,
  isSameDay,
  isToday,
  formatDateToYYYYMMDD,
  expandRecurringEvents,
} from '../../utils/dateUtils';
import { CalendarEvent } from '../../types/calendar';
import { Check, Cake, Sparkles } from 'lucide-react';

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

  const getCalendar = (calendarId: string) => calendars.find(c => c.id === calendarId);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030707] text-[#e3e3e3] select-none overflow-hidden">
      {/* Day of Week Headers (Screenshot 2) */}
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

      {/* Month Weeks Grid (Screenshot 2) */}
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

              const tasksOnDay = dayEvents.filter(e => e.type === 'task');
              const nonTaskEvents = dayEvents.filter(e => e.type !== 'task');

              // If 4 or more tasks on this day and day is 31st (matching Screenshot 2):
              const showPendingTasksSummary = tasksOnDay.length >= 4 && !tasksOnDay.every(t => t.isCompleted);

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
                  className={`border-r border-[#0e2624] last:border-r-0 p-1 flex flex-col justify-start transition-colors relative hover:bg-teal-500/5 cursor-pointer overflow-hidden ${
                    !isCurrentMonth ? 'bg-[#051211]/40' : 'bg-[#030707]'
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                        isCurToday
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
                    {/* Non-task events (e.g. Holidays, Birthdays, Events) */}
                    {nonTaskEvents.slice(0, 3).map(item => {
                      const cal = getCalendar(item.calendarId);
                      const isBday = item.type === 'birthday' || item.calendarId === 'cal_birthdays';
                      const isHoliday = item.type === 'holiday' || item.calendarId === 'cal_holidays';
                      const bg = item.colorOverride || cal?.color || (isBday ? '#81c995' : isHoliday ? '#00897b' : '#26c6da');

                      return (
                        <div
                          key={item.id}
                          onClick={e => {
                            e.stopPropagation();
                            openEventDetails(item, { x: e.clientX, y: e.clientY });
                          }}
                          style={{ backgroundColor: bg }}
                          className="px-2 py-0.5 rounded-full text-[11px] font-medium text-white truncate flex items-center gap-1 shadow-2xs hover:opacity-90 active:scale-98 transition-all"
                          title={item.title}
                        >
                          {isBday && <Cake className="w-3 h-3 flex-shrink-0" />}
                          {isHoliday && <Sparkles className="w-3 h-3 flex-shrink-0" />}
                          <span className="truncate">{item.title}</span>
                        </div>
                      );
                    })}

                    {/* Pending tasks summary or individual task chips */}
                    {showPendingTasksSummary ? (
                      <div
                        onClick={e => {
                          e.stopPropagation();
                          setCurrentDate(date);
                          setCurrentView('day');
                        }}
                        className="px-2 py-0.5 rounded-full bg-[#081a18] text-[#19E6C8] border border-teal-500/40 border-l-2 border-l-[#19E6C8] text-[11px] font-medium truncate flex items-center gap-1 shadow-2xs hover:opacity-90 active:scale-98 transition-all"
                        title={`${tasksOnDay.length} pending tasks`}
                      >
                        <Check className="w-3 h-3 stroke-[2.5] flex-shrink-0" />
                        <span className="truncate">{tasksOnDay.length} pending tasks</span>
                      </div>
                    ) : (
                      tasksOnDay.slice(0, 2).map(task => (
                        <div
                          key={task.id}
                          onClick={e => {
                            e.stopPropagation();
                            openEventDetails(task, { x: e.clientX, y: e.clientY });
                          }}
                          className={`px-2 py-0.5 rounded-full bg-[#081a18] text-[#19E6C8] border border-teal-500/40 border-l-2 border-l-[#19E6C8] text-[11px] font-medium truncate flex items-center gap-1 shadow-2xs hover:opacity-90 active:scale-98 transition-all ${
                            task.isCompleted ? 'line-through opacity-60' : ''
                          }`}
                          title={task.title}
                        >
                          <Check className="w-3 h-3 stroke-[2.5] flex-shrink-0" />
                          <span className="truncate">{task.title}</span>
                        </div>
                      ))
                    )}
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
