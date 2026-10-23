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
  Video,
  MapPin,
  Clock,
  CheckSquare,
  Square,
  Plane,
  Home,
  Building,
  CalendarRange,
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
    openQuickCreate,
    openEventDetails,
    updateEvent,
    quickToggleTaskCompletion,
    activeOverlaidPeople,
    searchQuery,
    advancedFilters,
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

  // Click-drag creation state on empty grid
  const [creationDrag, setCreationDrag] = useState<{
    dayIndex: number;
    startMins: number;
    currentMins: number;
  } | null>(null);

  // Update current time indicator every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeMins(now.getHours() * 60 + now.getMinutes());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Measure scrollbar width of gridContainerRef to keep Days Header & All-day shelf perfectly aligned with the day columns
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);

  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el) return;
    const updateScrollbar = () => {
      const sw = el.offsetWidth - el.clientWidth;
      setScrollbarWidth(sw > 0 ? sw : 0);
    };
    updateScrollbar();
    window.addEventListener('resize', updateScrollbar);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollbar) : null;
    ro?.observe(el);
    return () => {
      window.removeEventListener('resize', updateScrollbar);
      ro?.disconnect();
    };
  }, []);

  // Filter visible events & expand recurrence
  const visibleCalendarIds = calendars.filter(c => c.isVisible).map(c => c.id);
  const rangeStart = days[0];
  const rangeEnd = days[days.length - 1];

  const expanded = expandRecurringEvents(events, rangeStart, rangeEnd);

  const filteredEvents = expanded.filter(e => {
    if (e.deletedAt) return false;
    if (!visibleCalendarIds.includes(e.calendarId)) return false;

    // View options filters
    if (!settings.showCompletedTasks && e.type === 'task' && e.isCompleted) return false;
    if (!settings.showDeclinedEvents && e.guests?.some(g => g.email === 'user@chronos.local' && g.status === 'no')) {
      return false;
    }

    // Search query & advanced filters
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
      if (
        advancedFilters.doesntHave &&
        (e.title.toLowerCase().includes(advancedFilters.doesntHave.toLowerCase()) ||
          e.description?.toLowerCase().includes(advancedFilters.doesntHave.toLowerCase()))
      ) {
        return false;
      }
      if (advancedFilters.hasAttachment && (!e.attachments || e.attachments.length === 0)) return false;
      if (advancedFilters.calendarId && e.calendarId !== advancedFilters.calendarId) return false;
    }

    return true;
  });

  const getCalendar = (calendarId: string) => calendars.find(c => c.id === calendarId);

  // Drag handlers
  const handleMouseDownOnEvent = (
    e: React.MouseEvent,
    event: CalendarEvent,
    type: 'move' | 'resize',
    dayIndex: number
  ) => {
    e.stopPropagation();
    if (e.button !== 0) return; // only left click

    const grid = gridContainerRef.current;
    if (!grid) return;

    const hourEl = grid.querySelector('[data-hour-row]');
    const hourHeight = hourEl ? hourEl.getBoundingClientRect().height : 52;
    const dayCols = grid.querySelectorAll('[data-day-column]');
    const dayWidth = dayCols[0] ? dayCols[0].getBoundingClientRect().width : 100;

    const startMins = getMinutesFromTimeStr(event.startTime);
    let endMins = getMinutesFromTimeStr(event.endTime);
    if (endMins <= startMins) endMins = startMins + 30;

    setDragState({
      event,
      type,
      startY: e.clientY,
      initialStartMins: startMins,
      initialEndMins: endMins,
      currentStartMins: startMins,
      currentEndMins: endMins,
      currentDayIndex: dayIndex,
      dayWidth,
      hourHeight,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragState) {
      const deltaY = e.clientY - dragState.startY;
      const deltaMins = snapTo15Minutes((deltaY / dragState.hourHeight) * 60);

      if (dragState.type === 'move') {
        const duration = dragState.initialEndMins - dragState.initialStartMins;
        let newStart = Math.max(0, Math.min(24 * 60 - duration, dragState.initialStartMins + deltaMins));
        let newEnd = newStart + duration;

        // Detect column from clientX
        let targetDayIdx = dragState.currentDayIndex;
        const grid = gridContainerRef.current;
        if (grid) {
          const dayCols = grid.querySelectorAll('[data-day-column]');
          dayCols.forEach((col, idx) => {
            const rect = col.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right) {
              targetDayIdx = idx;
            }
          });
        }

        setDragState(prev => prev ? {
          ...prev,
          currentStartMins: newStart,
          currentEndMins: newEnd,
          currentDayIndex: targetDayIdx,
        } : null);
      } else if (dragState.type === 'resize') {
        let newEnd = Math.max(dragState.initialStartMins + 15, Math.min(24 * 60, dragState.initialEndMins + deltaMins));
        setDragState(prev => prev ? {
          ...prev,
          currentEndMins: newEnd,
        } : null);
      }
    } else if (creationDrag) {
      const grid = gridContainerRef.current;
      if (!grid) return;
      const rect = grid.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const hourEl = grid.querySelector('[data-hour-row]');
      const hourHeight = hourEl ? hourEl.getBoundingClientRect().height : 52;
      const targetMins = snapTo15Minutes((relativeY / (hourHeight * 24)) * 24 * 60);

      setCreationDrag(prev => prev ? {
        ...prev,
        currentMins: Math.max(0, Math.min(24 * 60, targetMins)),
      } : null);
    }
  }, [dragState, creationDrag]);

  const handleMouseUp = useCallback(() => {
    if (dragState) {
      const targetDay = days[dragState.currentDayIndex];
      const targetDateStr = formatDateToYYYYMMDD(targetDay);
      const newStartTime = getTimeStrFromMinutes(dragState.currentStartMins);
      const newEndTime = getTimeStrFromMinutes(dragState.currentEndMins);

      // Only update if time or date actually changed
      if (
        dragState.event.startDate !== targetDateStr ||
        dragState.event.startTime !== newStartTime ||
        dragState.event.endTime !== newEndTime
      ) {
        updateEvent({
          ...dragState.event,
          startDate: targetDateStr,
          endDate: targetDateStr,
          startTime: newStartTime,
          endTime: newEndTime,
        });
      }
      setDragState(null);
    } else if (creationDrag) {
      const targetDay = days[creationDrag.dayIndex];
      const targetDateStr = formatDateToYYYYMMDD(targetDay);
      const start = Math.min(creationDrag.startMins, creationDrag.currentMins);
      const end = Math.max(creationDrag.startMins + 30, Math.max(creationDrag.startMins, creationDrag.currentMins));

      openQuickCreate(
        targetDateStr,
        getTimeStrFromMinutes(start),
        'event',
        undefined
      );
      setCreationDrag(null);
    }
  }, [dragState, creationDrag, days, updateEvent, openQuickCreate]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Click on grid cell
  const handleGridSlotClick = (day: Date, hour: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const dateStr = formatDateToYYYYMMDD(day);
    const timeStr = `${hour < 10 ? `0${hour}` : hour}:00`;
    openQuickCreate(dateStr, timeStr, 'event', { x: e.clientX, y: e.clientY });
  };

  const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030707] text-[#F4FFFD] select-none overflow-hidden">
      {/* Top Days Header */}
      <div className="flex border-b border-teal-500/15 bg-[#051211]/90 flex-shrink-0 z-10 shadow-2xs">
        {/* Time zone gutter label */}
        <div className="w-12 md:w-20 p-1 md:p-2 flex flex-col justify-end items-end pr-1.5 md:pr-3 border-r border-teal-500/15 flex-shrink-0">
          <span className="text-[9px] md:text-[10px] text-teal-400/60 font-semibold uppercase tracking-wider">
            {settings.timeFormat === '24h' ? '24h' : 'GMT'}
          </span>
        </div>

        {/* Column day titles */}
        <div className="flex-1 grid min-w-0" style={{ gridTemplateColumns: `repeat(${numDays}, minmax(0, 1fr))` }}>
          {days.map((day, idx) => {
            const isCurDayToday = isToday(day);

            return (
              <div
                key={idx}
                className={`py-1.5 md:py-2 px-0.5 md:px-1 text-center border-r border-teal-500/15 transition-colors min-w-0 overflow-hidden ${
                  isCurDayToday ? 'bg-teal-500/10' : ''
                }`}
              >
                <div className="text-[10px] md:text-[11px] font-bold text-teal-400/60 tracking-wider uppercase truncate">
                  {dayHeaders[day.getDay()]}
                </div>
                <div className="mt-0.5 md:mt-1 flex items-center justify-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-base font-extrabold transition-all ${
                      isCurDayToday
                        ? 'bg-[#19E6C8] text-[#030707] shadow-[0_0_20px_rgba(25,230,200,0.4)]'
                        : 'text-[#F4FFFD] hover:bg-teal-500/10'
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scrollbar compensation spacer */}
        {scrollbarWidth > 0 && (
          <div style={{ width: `${scrollbarWidth}px` }} className="flex-shrink-0 bg-[#051211]/90" />
        )}
      </div>

      {/* All-Day Items Shelf */}
      <div className="flex border-b border-teal-500/15 bg-[#051211]/60 flex-shrink-0 min-h-[36px]">
        <div className="w-12 md:w-20 p-1 md:p-1.5 flex items-center justify-end pr-1.5 md:pr-3 text-[9px] md:text-[10px] font-bold text-teal-400/60 border-r border-teal-500/15 flex-shrink-0">
          all-day
        </div>
        <div className="flex-1 grid min-w-0" style={{ gridTemplateColumns: `repeat(${numDays}, minmax(0, 1fr))` }}>
          {days.map((day, idx) => {
            const dateStr = formatDateToYYYYMMDD(day);
            const allDayItems = filteredEvents.filter(
              e => (e.isAllDay || !e.startTime) && e.startDate <= dateStr && e.endDate >= dateStr
            );
            const maxVisible = 2;
            const visibleItems = allDayItems.slice(0, maxVisible);
            const hiddenCount = allDayItems.length - maxVisible;

            return (
              <div
                key={idx}
                className="p-0.5 md:p-1 border-r border-teal-500/15 space-y-1 min-h-[36px] min-w-0 overflow-hidden flex flex-col justify-start"
              >
                {visibleItems.map(item => {
                  const cal = getCalendar(item.calendarId);
                  const bg = item.colorOverride || cal?.color || '#19E6C8';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      title={item.title}
                      onClick={e => {
                        e.stopPropagation();
                        openEventDetails(item, { x: e.clientX, y: e.clientY });
                      }}
                      className="w-full text-left px-1.5 md:px-2 py-0.5 rounded-md text-[10px] md:text-[11px] font-semibold text-[#030707] shadow-2xs hover:opacity-90 flex items-center gap-1 transition-opacity min-w-0 overflow-hidden"
                      style={{ backgroundColor: bg }}
                    >
                      {item.type === 'task' && <CheckSquare className="w-3 h-3 flex-shrink-0" />}
                      {item.type === 'out_of_office' && <Plane className="w-3 h-3 flex-shrink-0" />}
                      {item.type === 'working_location' && (
                        item.workingLocation === 'home' ? <Home className="w-3 h-3 flex-shrink-0" /> : <Building className="w-3 h-3 flex-shrink-0" />
                      )}
                      <span className="truncate min-w-0 flex-1 block">{item.title}</span>
                    </button>
                  );
                })}
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      if (allDayItems[maxVisible]) {
                        openEventDetails(allDayItems[maxVisible], { x: e.clientX, y: e.clientY });
                      }
                    }}
                    className="text-[9px] md:text-[10px] text-teal-400/80 hover:text-[#19E6C8] font-bold text-left px-1 truncate block hover:underline"
                    title={`${hiddenCount} more all-day event${hiddenCount > 1 ? 's' : ''}`}
                  >
                    +{hiddenCount} more
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Scrollbar compensation spacer */}
        {scrollbarWidth > 0 && (
          <div style={{ width: `${scrollbarWidth}px` }} className="flex-shrink-0 bg-[#051211]/60" />
        )}
      </div>

      {/* Hourly Grid Scrollable Area */}
      <div
        ref={gridContainerRef}
        className="flex-1 overflow-y-auto relative flex min-w-0"
        style={{ scrollbarGutter: 'stable' }}
      >
        {/* Hour Labels Column */}
        <div className="w-12 md:w-20 flex-shrink-0 border-r border-teal-500/15 select-none bg-[#051211]/90 z-10">
          {hours.map(hour => (
            <div
              key={hour}
              data-hour-row
              className="h-14 relative flex items-start justify-end pr-1.5 md:pr-3 border-b border-transparent"
            >
              {hour !== 0 && (
                <span className="text-[9px] md:text-[11px] text-teal-400/60 font-semibold -translate-y-2.5">
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
                data-day-column
                className={`relative border-r border-teal-500/15 min-w-0 overflow-hidden ${
                  isCurDayToday ? 'bg-teal-500/5' : ''
                }`}
              >
                {/* 24 Hour slot lines */}
                {hours.map(hour => (
                  <div
                    key={hour}
                    onClick={e => handleGridSlotClick(day, hour, e)}
                    className="h-14 border-b border-teal-500/10 hover:bg-teal-500/5 cursor-pointer transition-colors relative group"
                  >
                    <div className="absolute inset-x-0 top-1/2 border-b border-dotted border-teal-500/10 pointer-events-none" />
                  </div>
                ))}

                {/* Red Current Time Line Indicator */}
                {isCurDayToday && (
                  <div
                    className="absolute inset-x-0 z-20 pointer-events-none flex items-center"
                    style={{
                      top: `${(currentTimeMins / (24 * 60)) * 100}%`,
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#19E6C8] -ml-1.5 shadow-[0_0_8px_#19E6C8]" />
                    <div className="flex-1 h-[2px] bg-[#19E6C8] shadow-[0_0_6px_#19E6C8]" />
                  </div>
                )}

                {/* Live dragged ghost preview if dragged into this column from another date */}
                {dragState && dragState.type === 'move' && dragState.currentDayIndex === dayIdx && dragState.event.startDate !== dateStr && (
                  <div
                    className="absolute inset-x-1 rounded-xl p-2 z-40 ring-2 ring-[#19E6C8] bg-teal-950/70 border-2 border-[#19E6C8] shadow-xl pointer-events-none transition-all flex flex-col justify-between overflow-hidden"
                    style={{
                      top: `${(dragState.currentStartMins / (24 * 60)) * 100}%`,
                      height: `${((dragState.currentEndMins - dragState.currentStartMins) / (24 * 60)) * 100}%`,
                    }}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-teal-200 truncate">
                        {dragState.event.title}
                      </p>
                      <p className="text-[11px] font-semibold text-[#19E6C8] mt-0.5">
                        {formatTimeDisplay(getTimeStrFromMinutes(dragState.currentStartMins), settings.timeFormat)} – {formatTimeDisplay(getTimeStrFromMinutes(dragState.currentEndMins), settings.timeFormat)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Positioned Events for this day */}
                {positioned.map(p => {
                  const e = p.event;
                  const cal = getCalendar(e.calendarId);
                  const bg = e.colorOverride || cal?.color || '#19E6C8';
                  const isDraggingThis = dragState?.event.id === e.id;
                  const isDraggedToAnotherDay = isDraggingThis && dragState?.currentDayIndex !== dayIdx;

                  // Dim past events if setting enabled
                  const eventEndMins = getMinutesFromTimeStr(e.endTime);
                  const isPast =
                    settings.dimPastEvents &&
                    (dateStr < formatDateToYYYYMMDD(new Date()) ||
                      (isCurDayToday && eventEndMins < currentTimeMins));

                  const top = isDraggingThis ? (dragState.currentStartMins / (24 * 60)) * 100 : p.topPercent;
                  const height = isDraggingThis
                    ? ((dragState.currentEndMins - dragState.currentStartMins) / (24 * 60)) * 100
                    : p.heightPercent;

                  return (
                    <div
                      key={e.id}
                      onMouseDown={ev => handleMouseDownOnEvent(ev, e, 'move', dayIdx)}
                      onClick={ev => {
                        ev.stopPropagation();
                        openEventDetails(e, { x: ev.clientX, y: ev.clientY });
                      }}
                      className={`absolute rounded-xl p-2 cursor-pointer shadow-xs transition-all overflow-hidden flex flex-col justify-between border select-none group ${
                        isDraggedToAnotherDay
                          ? 'opacity-20 pointer-events-none'
                          : isDraggingThis
                          ? 'z-30 opacity-80 scale-102 ring-2 ring-[#19E6C8]'
                          : 'z-10 hover:shadow-md hover:brightness-105'
                      } ${isPast ? 'opacity-55' : ''}`}
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                        left: `${p.leftPercent}%`,
                        width: `${p.widthPercent}%`,
                        backgroundColor: `${bg}18`, // Soft background tint
                        borderColor: bg,
                        borderLeftWidth: '4px',
                      }}
                    >
                      {/* Top row: Title & Time */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {e.type === 'task' ? (
                            <button
                              type="button"
                              onClick={ev => {
                                ev.stopPropagation();
                                quickToggleTaskCompletion(e.id);
                              }}
                              className="text-teal-400/80 hover:text-[#19E6C8]"
                            >
                              {e.isCompleted ? (
                                <CheckSquare className="w-3.5 h-3.5 text-[#19E6C8]" />
                              ) : (
                                <Square className="w-3.5 h-3.5" />
                              )}
                            </button>
                          ) : e.type === 'focus_time' ? (
                            <Clock className="w-3 h-3 text-[#19E6C8] flex-shrink-0" />
                          ) : e.type === 'out_of_office' ? (
                            <Plane className="w-3 h-3 text-purple-400 flex-shrink-0" />
                          ) : e.type === 'appointment_schedule' ? (
                            <CalendarRange className="w-3 h-3 text-rose-400 flex-shrink-0" />
                          ) : null}

                          <p
                            className={`text-xs font-semibold truncate ${
                              e.isCompleted ? 'line-through text-teal-400/40' : 'text-[#F4FFFD]'
                            }`}
                          >
                            {e.title}
                          </p>
                        </div>

                        <p className="text-[11px] font-medium text-teal-400/70 truncate mt-0.5">
                          {formatTimeDisplay(e.startTime, settings.timeFormat)} – {formatTimeDisplay(e.endTime, settings.timeFormat)}
                        </p>
                      </div>

                      {/* Bottom row badges: Video call or location */}
                      {(e.videoConference || e.location) && (
                        <div className="flex items-center gap-2 text-[10px] text-teal-400/70 truncate mt-1">
                          {e.videoConference && (
                            <span className="flex items-center gap-1 text-[#19E6C8] font-medium">
                              <Video className="w-3 h-3" /> Meet
                            </span>
                          )}
                          {e.location && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{e.location}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bottom resize drag handle */}
                      <div
                        onMouseDown={ev => handleMouseDownOnEvent(ev, e, 'resize', dayIdx)}
                        className="absolute bottom-0 inset-x-0 h-2 cursor-s-resize hover:bg-white/10 transition-colors"
                        title="Drag to adjust duration"
                      />
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
