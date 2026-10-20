import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import {
  formatDateToYYYYMMDD,
  formatTimeDisplay,
  isToday,
  addDays,
  expandRecurringEvents,
} from '../../utils/dateUtils';
import {
  Calendar as CalIcon,
  Video,
  MapPin,
  Clock,
  CheckSquare,
  Plane,
  CalendarRange,
  Users,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const {
    currentDate,
    events,
    calendars,
    settings,
    openEventDetails,
    searchQuery,
    advancedFilters,
  } = useCalendar();

  // Show 30 days starting from currentDate
  const rangeStart = currentDate;
  const rangeEnd = addDays(currentDate, 30);
  const visibleCalendarIds = calendars.filter(c => c.isVisible).map(c => c.id);

  const expanded = expandRecurringEvents(events, rangeStart, rangeEnd);

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

  // Group events by date string
  const grouped = filteredEvents.reduce<Record<string, typeof filteredEvents>>((acc, item) => {
    const key = item.startDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  const getCalendar = (calendarId: string) => calendars.find(c => c.id === calendarId);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white dark:bg-gray-900 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {sortedDates.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <CalIcon className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
              No events scheduled
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Click on "Create" or select another view to schedule appointments.
            </p>
          </div>
        ) : (
          sortedDates.map(dateStr => {
            const dateObj = new Date(dateStr + 'T00:00:00');
            const isCurToday = isToday(dateObj);
            const items = grouped[dateStr].sort((a, b) => {
              if (a.isAllDay && !b.isAllDay) return -1;
              if (!a.isAllDay && b.isAllDay) return 1;
              return (a.startTime || '').localeCompare(b.startTime || '');
            });

            return (
              <div
                key={dateStr}
                className="flex flex-col md:flex-row gap-4 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                {/* Date header badge */}
                <div className="w-32 flex-shrink-0 flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold transition-all ${
                      isCurToday
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold leading-none opacity-80">
                      {dateObj.toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-base leading-none mt-1">{dateObj.getDate()}</span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {dateObj.toLocaleString('default', { weekday: 'short' })}
                    </p>
                    {isCurToday && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Today
                      </span>
                    )}
                  </div>
                </div>

                {/* Event items for this date */}
                <div className="flex-1 space-y-2">
                  {items.map(item => {
                    const cal = getCalendar(item.calendarId);
                    const color = item.colorOverride || cal?.color || '#3b82f6';

                    return (
                      <div
                        key={item.id}
                        onClick={e => openEventDetails(item, { x: e.clientX, y: e.clientY })}
                        className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className="w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0 ring-4 ring-white dark:ring-gray-800"
                            style={{ backgroundColor: color }}
                          />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {item.type === 'task' && <CheckSquare className="w-3.5 h-3.5 text-amber-500" />}
                              {item.type === 'focus_time' && <Clock className="w-3.5 h-3.5 text-indigo-500" />}
                              {item.type === 'out_of_office' && <Plane className="w-3.5 h-3.5 text-purple-500" />}
                              {item.type === 'appointment_schedule' && (
                                <CalendarRange className="w-3.5 h-3.5 text-rose-500" />
                              )}
                              <h4
                                className={`text-sm font-semibold truncate ${
                                  item.isCompleted
                                    ? 'line-through text-gray-400'
                                    : 'text-gray-900 dark:text-gray-100'
                                }`}
                              >
                                {item.title}
                              </h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                                <Clock className="w-3 h-3" />
                                {item.isAllDay
                                  ? 'All day'
                                  : `${formatTimeDisplay(item.startTime, settings.timeFormat)} – ${formatTimeDisplay(
                                      item.endTime,
                                      settings.timeFormat
                                    )}`}
                              </span>

                              {item.location && (
                                <span className="flex items-center gap-1 truncate max-w-xs">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{item.location}</span>
                                </span>
                              )}

                              {item.guests && item.guests.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {item.guests.length} guests
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right action: Join Video Call button */}
                        {item.videoConference && (
                          <a
                            href={item.videoConference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors flex-shrink-0"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join</span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
