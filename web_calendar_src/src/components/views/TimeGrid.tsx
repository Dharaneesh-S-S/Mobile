import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { CalendarEvent } from '../../types/calendar';
import {
  getDayHours,
  formatTimeDisplay,
  formatDateToYYYYMMDD,
  isSameDay,
  isToday,
  calculateEventPositions,
  snapTo15Minutes,
  getTimeStrFromMinutes,
  getMinutesFromTimeStr,
  expandRecurringEvents,
} from '../../utils/dateUtils';
import {
  Check,
  Cake,
  Clock,
  Video,
  MapPin,
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
    updateEvent,
    quickToggleTaskCompletion,
    searchQuery,
  } = useCalendar();

  const hours = getDayHours();
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [currentTimeMins, setCurrentTimeMins] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  // Track dragging state
  const [dragState, setDragState] = useState<{
    event: CalendarEvent;
    type: 'move' | 'resize';
    startY: number;
    initialStartMins: number;
    initialEndMins: number;
    currentStartMins: number;
    currentEndMins: number;
    currentDayIndex: number;
    dayWidth: number;
    hourHeight: number;
  } | null>(null);

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
      {/* Top Days Header (Screenshots 5, 12, 13) */}
      <div className="flex border-b border-[#0e2624] bg-[#030707] flex-shrink-0 z-10">
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
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurDayToday
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

      {/* All-Day Items Shelf / Pending Tasks (Screenshots 5, 12, 13) */}
      <div className="flex border-b border-[#0e2624] bg-[#051211] flex-shrink-0 min-h-[38px]">
        <div className="w-14 md:w-16 p-1 flex items-center justify-end pr-2 text-[10px] font-medium text-[#94B5B0] border-r border-[#0e2624] flex-shrink-0">
          all-day
        </div>
        <div className="flex-1 grid min-w-0" style={{ gridTemplateColumns: `repeat(${numDays}, minmax(0, 1fr))` }}>
          {days.map((day, idx) => {
            const dateStr = formatDateToYYYYMMDD(day);
            const allDayItems = filteredEvents.filter(
              e => (e.isAllDay || !e.startTime) && e.startDate <= dateStr && e.endDate >= dateStr
            );
            const tasksOnDay = allDayItems.filter(e => e.type === 'task');
            const nonTasks = allDayItems.filter(e => e.type !== 'task');

            const hasPendingTasks = tasksOnDay.length > 0 && !tasksOnDay.every(t => t.isCompleted);

            return (
              <div
                key={idx}
                className="p-1 border-r border-[#0e2624] last:border-r-0 space-y-1 min-w-0 overflow-hidden flex flex-col justify-start"
              >
                {/* Pending Tasks Pill (Screenshots 5, 12, 13) */}
                {hasPendingTasks && (
                  <div
                    onClick={e => {
                      e.stopPropagation();
                      openEventDetails(tasksOnDay[0], { x: e.clientX, y: e.clientY });
                    }}
                    className="w-full px-2 py-0.5 rounded-full bg-[#081a18] border border-teal-500/40 border-l-2 border-l-[#19E6C8] text-[#19E6C8] text-[11px] font-medium truncate flex items-center gap-1 shadow-2xs cursor-pointer hover:opacity-90"
                  >
                    <Check className="w-3 h-3 stroke-[2.5] flex-shrink-0" />
                    <span className="truncate">{tasksOnDay.length} pending task{tasksOnDay.length > 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Non-task all-day events (e.g. Holidays, Birthdays, Events) */}
                {nonTasks.slice(0, 3).map(item => {
                  const cal = getCalendar(item.calendarId);
                  const isBday = item.type === 'birthday' || item.calendarId === 'cal_birthdays';
                  const isHoliday = item.type === 'holiday' || item.calendarId === 'cal_holidays';
                  const bg = item.colorOverride || cal?.color || (isBday ? '#81c995' : isHoliday ? '#00897b' : '#26c6da');

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        openEventDetails(item, { x: e.clientX, y: e.clientY });
                      }}
                      className="w-full text-left px-2 py-0.5 rounded-full text-[11px] font-medium text-white truncate flex items-center gap-1 shadow-2xs hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: bg }}
                    >
                      {isBday && <Cake className="w-3 h-3 flex-shrink-0" />}
                      {isHoliday && <Sparkles className="w-3 h-3 flex-shrink-0" />}
                      <span className="truncate">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Grid Scrollable Area (Screenshots 5, 12, 13) */}
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

                {/* Neon Cyan Current Time Line */}
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
                  const cal = getCalendar(e.calendarId);
                  const isTask = e.type === 'task' || e.calendarId === 'cal_tasks';
                  const bg = e.colorOverride || (isTask ? '#19E6C8' : cal?.color || '#19E6C8');

                  return (
                    <div
                      key={e.id}
                      onClick={ev => {
                        ev.stopPropagation();
                        openEventDetails(e, { x: ev.clientX, y: ev.clientY });
                      }}
                      className={`absolute px-2.5 py-1 cursor-pointer transition-all overflow-hidden select-none hover:brightness-110 flex flex-col justify-center items-center text-center ${
                        isTask
                          ? 'rounded-full bg-[#081a18]/90 border border-[#19E6C8] border-l-4 border-l-[#19E6C8] shadow-[0_0_12px_rgba(25,230,200,0.25)]'
                          : 'rounded-xl border border-l-4 shadow-sm'
                      }`}
                      style={{
                        top: `${p.topPercent}%`,
                        height: `${p.heightPercent}%`,
                        minHeight: '26px',
                        left: `${p.leftPercent}%`,
                        width: `${p.widthPercent}%`,
                        ...(isTask
                          ? { backgroundColor: 'rgba(25, 230, 200, 0.2)', borderColor: '#19E6C8', borderLeftWidth: '4px' }
                          : { backgroundColor: `${bg}33`, borderColor: bg, borderLeftWidth: '4px' }),
                      }}
                      title={`${e.title} (${formatTimeDisplay(e.startTime, settings.timeFormat)} – ${formatTimeDisplay(e.endTime, settings.timeFormat)})`}
                    >
                      <div className="w-full min-w-0 flex flex-col items-center justify-center text-center">
                        <p className="text-xs font-semibold text-white truncate text-center leading-normal w-full">
                          {e.title}
                        </p>
                        {p.heightPercent >= 3.5 && (
                          <p className="text-[10px] text-[#94B5B0] truncate text-center mt-0.5 leading-none w-full">
                            {formatTimeDisplay(e.startTime, settings.timeFormat)} – {formatTimeDisplay(e.endTime, settings.timeFormat)}
                          </p>
                        )}
                      </div>
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
