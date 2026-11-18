import React, { useState, useEffect, useRef } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import {
  getDayHours,
  formatTimeDisplay,
  formatDateToYYYYMMDD,
  isToday,
  calculateEventPositions,
  expandRecurringEvents,
} from '../../utils/dateUtils';
import {
  Cake,
  Sparkles,
} from 'lucide-react';

interface TimeGridProps {
  days: Date[];
  numDays: number;
}

export const TimeGrid: React.FC<TimeGridProps> = ({ days, numDays }) => {
  const {
    events,
    calendars,
    settings,
    openEditor,
    openEventDetails,
    quickToggleTaskCompletion,
    searchQuery,
  } = useCalendar();

  const hours = getDayHours();
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);

  const [currentTimeMins, setCurrentTimeMins] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  // Calculate scrollbar width for exact alignment between header/all-day and scrollable timeline
  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el) return;
    const updateScrollbar = () => {
      const sw = el.offsetWidth - el.clientWidth;
      setScrollbarWidth(sw);
    };
    updateScrollbar();
    window.addEventListener('resize', updateScrollbar);
    return () => window.removeEventListener('resize', updateScrollbar);
  }, []);

  // Update current time indicator every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeMins(now.getHours() * 60 + now.getMinutes());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Filter visible events & expand recurrence
  const visibleCalendarIds = calendars.filter(c => c.isVisible).map(c => c.id);
  const rangeStart = days[0];
  const rangeEnd = days[days.length - 1];

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

  // Scroll to roughly 9 AM or current time on mount
  useEffect(() => {
    if (gridContainerRef.current) {
      const targetMins = Math.max(0, (currentTimeMins || 540) - 120);
      const scrollY = (targetMins / 60) * 56;
      gridContainerRef.current.scrollTop = scrollY;
    }
  }, []);

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030707] text-[#e3e3e3] select-none overflow-hidden">
      {/* Top Days Header (Compensated with scrollbar width for exact timeline alignment) */}
      <div
        className="flex border-b border-[#0e2624] bg-[#030707] flex-shrink-0 z-10"
        style={{ paddingRight: `${scrollbarWidth}px` }}
      >
        {/* Time gutter spacer */}
        <div className="w-14 md:w-16 flex-shrink-0 border-r border-[#0e2624] flex items-center justify-center text-[10px] font-semibold text-[#94B5B0]">
          GMT
        </div>

        {/* Column day titles */}
        <div className="flex-1 grid min-w-0" style={{ gridTemplateColumns: `repeat(${numDays}, minmax(0, 1fr))` }}>
          {days.map((day, idx) => {
            const isCurDayToday = isToday(day);

            return (
              <div
                key={idx}
                className="py-2.5 px-1 text-center border-r border-[#0e2624] last:border-r-0 min-w-0"
              >
                <div className={`text-xs font-bold tracking-wider uppercase ${isCurDayToday ? 'text-[#19E6C8]' : 'text-[#94B5B0]'}`}>
                  {dayHeaders[day.getDay()]}
                </div>
                <div className="mt-1 flex items-center justify-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCurDayToday
                      ? 'bg-[#19E6C8] text-[#030707] shadow-[0_0_12px_rgba(25,230,200,0.5)]'
                      : 'text-[#F4FFFD]'
                      }`}
                  >
                    {day.getDate()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All-Day Items Shelf / Pending Tasks (Compensated for exact alignment with timeline) */}
      <div
        className="flex border-b border-[#0e2624] bg-[#051211] flex-shrink-0 min-h-[38px]"
        style={{ paddingRight: `${scrollbarWidth}px` }}
      >
        <div
          onClick={() => {
            const firstDate = formatDateToYYYYMMDD(days[0] || new Date());
            openEditor(null, {
              startDate: firstDate,
              endDate: firstDate,
              isAllDay: true,
              type: 'event',
            });
          }}
          className="w-14 md:w-16 p-1 flex items-center justify-end pr-2 text-[10px] font-medium text-[#94B5B0] border-r border-[#0e2624] flex-shrink-0 cursor-pointer hover:bg-teal-500/5 hover:text-[#19E6C8] transition-colors"
          title="Click to add all-day event"
        >
          all-day
        </div>
        <div className="flex-1 grid min-w-0" style={{ gridTemplateColumns: `repeat(${numDays}, minmax(0, 1fr))` }}>
          {days.map((day, idx) => {
            const dateStr = formatDateToYYYYMMDD(day);
            const allDayItems = filteredEvents.filter(
              e => (e.isAllDay || !e.startTime) && e.startDate <= dateStr && e.endDate >= dateStr
            );
            const tasksOnDay = allDayItems.filter(e => e.type === 'task' || e.calendarId === 'cal_tasks');
            const nonTasks = allDayItems.filter(e => e.type !== 'task' && e.calendarId !== 'cal_tasks');

            return (
              <div
                key={idx}
                onClick={() => {
                  openEditor(null, {
                    startDate: dateStr,
                    endDate: dateStr,
                    isAllDay: true,
                    type: 'event',
                  });
                }}
                className="p-1 border-r border-[#0e2624] last:border-r-0 space-y-1 min-w-0 overflow-hidden flex flex-col justify-start cursor-pointer hover:bg-teal-500/5 transition-colors h-full min-h-[38px]"
                title="Click to add all-day event"
              >
                {/* All-Day Tasks: Rendered with details click handler & hollow circle (Requirements #15, #21, #24) */}
                {tasksOnDay.map(task => (
                  <div
                    key={task.id}
                    onClick={e => {
                      e.stopPropagation();
                      openEventDetails(task, { x: e.clientX, y: e.clientY });
                    }}
                    style={{
                      backgroundColor: 'rgba(25, 230, 200, 0.2)',
                    }}
                    className="w-full px-2 py-0.5 rounded-full border border-[#19E6C8] border-l-2 border-l-[#19E6C8] text-white text-[11px] font-medium truncate flex items-center gap-1.5 shadow-2xs cursor-pointer hover:brightness-110 active:scale-98 transition-all"
                    title={task.title}
                  >
                    {/* Hollow circle completion indicator */}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        quickToggleTaskCompletion(task.id);
                      }}
                      className="w-2.5 h-2.5 rounded-full border border-[#19E6C8] hover:bg-[#19E6C8]/40 transition-all flex-shrink-0"
                      title="Mark task completed"
                    />
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}

                {/* Non-task all-day events (Holidays = Red, Birthdays = Pink, Events = Light Blue) */}
                {nonTasks.slice(0, 3).map(item => {
                  const isBday = item.type === 'birthday' || item.calendarId === 'cal_birthdays';
                  const isHoliday = item.type === 'holiday' || item.calendarId === 'cal_holidays';

                  const chipBg = isHoliday
                    ? 'rgba(239, 68, 68, 0.2)'
                    : isBday
                      ? 'rgba(236, 72, 153, 0.2)'
                      : 'rgba(56, 189, 248, 0.2)';
                  const chipBorder = isHoliday
                    ? '#EF4444'
                    : isBday
                      ? '#EC4899'
                      : '#38BDF8';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        openEventDetails(item, { x: e.clientX, y: e.clientY });
                      }}
                      className="w-full text-left px-2 py-0.5 rounded-full text-[11px] font-medium text-white truncate flex items-center gap-1 shadow-2xs hover:opacity-90 transition-opacity border border-l-2"
                      style={{
                        backgroundColor: chipBg,
                        borderColor: `${chipBorder}66`,
                        borderLeftColor: chipBorder,
                      }}
                    >
                      {isBday && <Cake className="w-3 h-3 text-[#EC4899] flex-shrink-0" />}
                      {isHoliday && <Sparkles className="w-3 h-3 text-[#EF4444] flex-shrink-0" />}
                      {!isBday && !isHoliday && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] flex-shrink-0" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Grid Scrollable Area */}
      <div
        ref={gridContainerRef}
        className="flex-1 overflow-y-auto relative flex min-w-0 bg-[#030707]"
      >
        {/* Hour Labels Column */}
        <div className="w-14 md:w-16 flex-shrink-0 border-r border-[#0e2624] select-none bg-[#030707] z-10">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-14 relative flex items-start justify-end pr-2 border-b border-transparent"
            >
              {hour !== 0 && (
                <span className="text-[11px] text-[#94B5B0] -translate-y-2.5">
                  {formatTimeDisplay(`${hour}:00`, settings.timeFormat)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Day Columns Grid */}
        <div
          className="flex-1 grid relative min-w-0"
          style={{ gridTemplateColumns: `repeat(${numDays}, minmax(0, 1fr))` }}
        >
          {days.map((day, dayIdx) => {
            const dateStr = formatDateToYYYYMMDD(day);
            const isCurDayToday = isToday(day);
            const dayEvents = filteredEvents.filter(
              e => !e.isAllDay && e.startTime && e.startDate <= dateStr && e.endDate >= dateStr
            );
            const positioned = calculateEventPositions(dayEvents);

            return (
              <div
                key={dayIdx}
                className="border-r border-[#0e2624] last:border-r-0 relative min-w-0"
              >
                {/* Hourly slots */}
                {hours.map(hour => (
                  <div
                    key={hour}
                    onClick={() => {
                      const timeStr = `${hour < 10 ? `0${hour}` : hour}:00`;
                      openEditor(null, {
                        startDate: dateStr,
                        endDate: dateStr,
                        startTime: timeStr,
                        endTime: `${hour + 1 < 10 ? `0${hour + 1}` : hour + 1}:00`,
                        isAllDay: false,
                        type: 'event',
                      });
                    }}
                    className="h-14 border-b border-[#0a1e1d] hover:bg-teal-500/5 cursor-pointer transition-colors relative"
                  />
                ))}

                {/* Current Time Indicator */}
                {isCurDayToday && (
                  <div
                    className="absolute inset-x-0 z-20 pointer-events-none flex items-center"
                    style={{
                      top: `${(currentTimeMins / (24 * 60)) * 100}%`,
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#19E6C8] -ml-1.5 shadow-[0_0_10px_rgba(25,230,200,0.9)]" />
                    <div className="flex-1 h-[2px] bg-[#19E6C8] shadow-[0_0_8px_rgba(25,230,200,0.7)]" />
                  </div>
                )}

                {/* Positioned Events for this day */}
                {positioned.map(p => {
                  const e = p.event;
                  const isTask = e.type === 'task' || e.calendarId === 'cal_tasks';
                  const isBday = e.type === 'birthday' || e.calendarId === 'cal_birthdays';
                  const isHoliday = e.type === 'holiday' || e.calendarId === 'cal_holidays';

                  const accentColor = isTask
                    ? '#19E6C8'
                    : isHoliday
                      ? '#EF4444'
                      : isBday
                        ? '#EC4899'
                        : '#38BDF8';

                  const bg = isTask
                    ? 'rgba(25, 230, 200, 0.2)'
                    : isHoliday
                      ? 'rgba(239, 68, 68, 0.2)'
                      : isBday
                        ? 'rgba(236, 72, 153, 0.2)'
                        : 'rgba(56, 189, 248, 0.2)';

                  return (
                    <div
                      key={e.id}
                      onClick={ev => {
                        ev.stopPropagation();
                        openEventDetails(e, { x: ev.clientX, y: ev.clientY });
                      }}
                      className={`absolute px-2.5 py-1 cursor-pointer transition-all overflow-hidden select-none hover:brightness-110 flex flex-col justify-center items-center text-center ${isTask
                        ? 'rounded-full border border-[#19E6C8] border-l-4 border-l-[#19E6C8] shadow-[0_0_12px_rgba(25,230,200,0.25)]'
                        : 'rounded-xl border border-l-4 shadow-sm'
                        }`}
                      style={{
                        top: `${p.topPercent}%`,
                        height: `${p.heightPercent}%`,
                        minHeight: '26px',
                        left: `${p.leftPercent}%`,
                        width: `${p.widthPercent}%`,
                        backgroundColor: bg,
                        borderColor: accentColor,
                        borderLeftColor: accentColor,
                        borderLeftWidth: '4px',
                      }}
                      title={`${e.title} (${formatTimeDisplay(e.startTime, settings.timeFormat)} – ${formatTimeDisplay(e.endTime, settings.timeFormat)})`}
                    >
                      <div className="w-full min-w-0 flex items-center justify-center gap-1.5">
                        {/* If task, show hollow circle indicator */}
                        {isTask && (
                          <button
                            type="button"
                            onClick={ev => {
                              ev.stopPropagation();
                              quickToggleTaskCompletion(e.id);
                            }}
                            className="w-3 h-3 rounded-full border border-[#19E6C8] hover:bg-[#19E6C8]/40 transition-all flex-shrink-0"
                            title="Mark task completed"
                          />
                        )}
                        <p className="text-xs font-semibold text-white truncate text-center leading-normal">
                          {e.title}
                        </p>
                      </div>
                      {p.heightPercent >= 3.5 && (
                        <p className="text-[10px] text-[#94B5B0] truncate text-center mt-0.5 leading-none w-full">
                          {formatTimeDisplay(e.startTime, settings.timeFormat)} – {formatTimeDisplay(e.endTime, settings.timeFormat)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
