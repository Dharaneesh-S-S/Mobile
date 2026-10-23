import React, { useState, useRef, useEffect } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import {
  getMonthDays,
  isSameDay,
  isToday,
  formatDateToYYYYMMDD,
  formatTimeDisplay,
  getWeekNumber,
  expandRecurringEvents,
} from '../../utils/dateUtils';
import { CalendarEvent } from '../../types/calendar';
import {
  X,
  Video,
  CheckSquare,
  Plane,
  Home,
  Building,
  Clock,
  CalendarRange,
} from 'lucide-react';

export const MonthView: React.FC = () => {
  const {
    currentDate,
    setCurrentDate,
    setCurrentView,
    calendars,
    events,
    settings,
    openEventDetails,
    openQuickCreate,
    updateEvent,
    searchQuery,
    advancedFilters,
  } = useCalendar();

  const [expandedDay, setExpandedDay] = useState<{ date: Date; events: CalendarEvent[]; anchor: { x: number; y: number } } | null>(null);
  const overflowPopoverRef = useRef<HTMLDivElement>(null);

  // Close overflow popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overflowPopoverRef.current && !overflowPopoverRef.current.contains(e.target as Node)) {
        setExpandedDay(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startDay = settings.startWeekOn || 0;
  const rawWeeks = getMonthDays(currentDate, startDay);

  // Filter weeks if showWeekends is false
  const weeks = settings.showWeekends
    ? rawWeeks
    : rawWeeks.map(week => week.filter(d => d.getDay() !== 0 && d.getDay() !== 6));

  const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const orderedHeaders = [...dayHeaders.slice(startDay), ...dayHeaders.slice(0, startDay)];
  const displayHeaders = settings.showWeekends
    ? orderedHeaders
    : orderedHeaders.filter((_, idx) => {
        const actualDay = (startDay + idx) % 7;
        return actualDay !== 0 && actualDay !== 6;
      });

  // Expand recurring events for the whole month view range
  const firstDay = weeks[0][0];
  const lastWeek = weeks[weeks.length - 1];
  const lastDay = lastWeek[lastWeek.length - 1];

  const visibleCalendarIds = calendars.filter(c => c.isVisible).map(c => c.id);
  const expanded = expandRecurringEvents(events, firstDay, lastDay);

  const filteredEvents = expanded.filter(e => {
    if (e.deletedAt) return false;
    if (!visibleCalendarIds.includes(e.calendarId)) return false;
    if (!settings.showCompletedTasks && e.type === 'task' && e.isCompleted) return false;
    if (!settings.showDeclinedEvents && e.guests?.some(g => g.email === 'user@chronos.local' && g.status === 'no')) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.guests?.some(g => g.name?.toLowerCase().includes(q) || g.email.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (advancedFilters) {
      if (advancedFilters.what && !e.title.toLowerCase().includes(advancedFilters.what.toLowerCase())) return false;
      if (advancedFilters.where && !e.location?.toLowerCase().includes(advancedFilters.where.toLowerCase())) return false;
      if (
        advancedFilters.who &&
        !e.guests?.some(
          g =>
            g.name?.toLowerCase().includes(advancedFilters.who!.toLowerCase()) ||
            g.email.toLowerCase().includes(advancedFilters.who!.toLowerCase())
        )
      ) {
        return false;
      }
      if (advancedFilters.hasAttachment && (!e.attachments || e.attachments.length === 0)) return false;
      if (advancedFilters.calendarId && e.calendarId !== advancedFilters.calendarId) return false;
    }

    return true;
  });

  const getCalendar = (calendarId: string) => calendars.find(c => c.id === calendarId);

  // Drag and drop across month days
  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    e.dataTransfer.setData('text/plain', event.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDate = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    const targetEvent = events.find(ev => ev.id === eventId);
    if (!targetEvent) return;

    const targetDateStr = formatDateToYYYYMMDD(targetDate);
    if (targetEvent.startDate === targetDateStr) return;

    updateEvent({
      ...targetEvent,
      startDate: targetDateStr,
      endDate: targetDateStr,
    });
  };

  const maxVisiblePerDay = 3;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 select-none overflow-hidden">
      {/* Day Headers row */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0 z-10">
        {settings.showWeekNumbers && (
          <div className="w-10 p-2 text-center text-[10px] font-semibold text-gray-400 border-r border-gray-200 dark:border-gray-800">
            Wk
          </div>
        )}
        <div
          className="flex-1 grid"
          style={{ gridTemplateColumns: `repeat(${displayHeaders.length}, 1fr)` }}
        >
          {displayHeaders.map((dh, idx) => (
            <div
              key={idx}
              className="py-2 text-center text-[11px] font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-800 last:border-r-0 tracking-wider"
            >
              {dh}
            </div>
          ))}
        </div>
      </div>

      {/* Weeks Grid */}
      <div className="flex-1 grid grid-rows-5 md:grid-rows-6 relative overflow-y-auto">
        {weeks.map((week, wIdx) => {
          const weekNum = getWeekNumber(week[0]);

          return (
            <div key={wIdx} className="flex border-b border-gray-200 dark:border-gray-800 min-h-[90px]">
              {/* Optional Week Number */}
              {settings.showWeekNumbers && (
                <div className="w-10 flex items-start justify-center pt-2 text-[10px] font-mono text-gray-400 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
                  {weekNum}
                </div>
              )}

              {/* Days in this week */}
              <div
                className="flex-1 grid"
                style={{ gridTemplateColumns: `repeat(${week.length}, 1fr)` }}
              >
                {week.map((date, dIdx) => {
                  const dateStr = formatDateToYYYYMMDD(date);
                  const isCurToday = isToday(date);
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();

                  const dayEvents = filteredEvents.filter(
                    e => e.startDate <= dateStr && e.endDate >= dateStr
                  );

                  const visibleItems = dayEvents.slice(0, maxVisiblePerDay);
                  const remainingCount = dayEvents.length - maxVisiblePerDay;

                  return (
                    <div
                      key={dIdx}
                      onDragOver={handleDragOver}
                      onDrop={e => handleDropOnDate(e, date)}
                      onClick={e => {
                        openQuickCreate(dateStr, '09:00', 'event', { x: e.clientX, y: e.clientY });
                      }}
                      className={`border-r border-gray-200 dark:border-gray-800 last:border-r-0 p-1 flex flex-col justify-between transition-colors relative hover:bg-gray-50/60 dark:hover:bg-gray-800/30 cursor-pointer ${
                        !isCurrentMonth ? 'bg-gray-50/40 dark:bg-gray-900/30' : ''
                      }`}
                    >
                      {/* Date number */}
                      <div className="flex items-center justify-between px-1">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setCurrentDate(date);
                            setCurrentView('day');
                          }}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                            isCurToday
                              ? 'bg-[#19E6C8] text-[#030707] font-extrabold shadow-[0_0_15px_rgba(25,230,200,0.4)]'
                              : isCurrentMonth
                              ? 'text-[#F4FFFD] hover:bg-teal-500/10'
                              : 'text-teal-900/40'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      </div>

                      {/* Event Pills */}
                      <div className="flex-1 space-y-1 mt-1">
                        {visibleItems.map(item => {
                          const cal = getCalendar(item.calendarId);
                          const bg = item.colorOverride || cal?.color || '#19E6C8';
                          const isPast =
                            settings.dimPastEvents &&
                            dateStr < formatDateToYYYYMMDD(new Date());

                          return (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={e => handleDragStart(e, item)}
                              onClick={e => {
                                e.stopPropagation();
                                openEventDetails(item, { x: e.clientX, y: e.clientY });
                              }}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#030707] truncate shadow-2xs hover:brightness-105 transition-all flex items-center gap-1 cursor-pointer ${
                                isPast ? 'opacity-55' : ''
                              }`}
                              style={{ backgroundColor: bg }}
                            >
                              {item.startTime && !item.isAllDay && (
                                <span className="opacity-80 text-[10px] font-normal">
                                  {formatTimeDisplay(item.startTime, settings.timeFormat)}
                                </span>
                              )}
                              {item.type === 'task' && <CheckSquare className="w-3 h-3 flex-shrink-0" />}
                              {item.type === 'out_of_office' && <Plane className="w-3 h-3 flex-shrink-0" />}
                              {item.type === 'appointment_schedule' && <CalendarRange className="w-3 h-3 flex-shrink-0" />}
                              {item.videoConference && <Video className="w-3 h-3 flex-shrink-0" />}
                              <span className="truncate">{item.title}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* "+N more" expansion button */}
                      {remainingCount > 0 && (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setExpandedDay({
                              date,
                              events: dayEvents,
                              anchor: { x: e.clientX, y: e.clientY },
                            });
                          }}
                          className="text-[11px] font-bold text-[#19E6C8] hover:bg-teal-500/10 rounded px-1.5 py-0.5 text-left w-fit mt-0.5 transition-colors"
                        >
                          +{remainingCount} more
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overflow "+N more" Popover Dialog */}
      {expandedDay && (
        <div
          ref={overflowPopoverRef}
          className="fixed z-50 w-72 rounded-2xl bg-white dark:bg-gray-800 p-3 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: Math.min(window.innerHeight - 320, expandedDay.anchor.y - 40),
            left: Math.min(window.innerWidth - 300, expandedDay.anchor.x - 60),
          }}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                {dayHeaders[expandedDay.date.getDay()]}
              </p>
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
                {expandedDay.date.getDate()} {expandedDay.date.toLocaleString('default', { month: 'short' })}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setExpandedDay(null)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {expandedDay.events.map(item => {
              const cal = getCalendar(item.calendarId);
              const bg = item.colorOverride || cal?.color || '#3b82f6';

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setExpandedDay(null);
                    openEventDetails(item);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-white shadow-2xs hover:opacity-90 transition-opacity flex items-center justify-between cursor-pointer"
                  style={{ backgroundColor: bg }}
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.startTime && (
                      <span className="text-[10px] opacity-80">
                        {formatTimeDisplay(item.startTime, settings.timeFormat)}
                      </span>
                    )}
                    <span className="truncate">{item.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
