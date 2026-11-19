import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import {
  getMonthDays,
  isToday,
  formatDateToYYYYMMDD,
  expandRecurringEvents,
} from '../../utils/dateUtils';
import { formatMoneyCompact, formatMoneyFull } from '../../utils/moneyIntegration';
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
    moneyStats,
    openMoneyDetails,
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

  // Filter events: always exclude completed tasks, and exclude tasks added directly in Tasks (no timeline)
  const filteredEvents = expanded.filter(e => {
    if (e.deletedAt) return false;
    const isHoliday = e.type === 'holiday' || e.calendarId === 'cal_holidays' || (e.title && e.title.toLowerCase().includes('holiday'));
    const holidayCal = calendars.find(c => c.id === 'cal_holidays');
    if (isHoliday && holidayCal && !holidayCal.isVisible) return false;
    if (!isHoliday && !visibleCalendarIds.includes(e.calendarId)) return false;
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

              // Deduplicate tasks on day by clean ID
              const tasksOnDayRaw = dayEvents.filter(e => e.type === 'task' || e.calendarId === 'cal_tasks');
              const tasksOnDay = Array.from(
                new Map(tasksOnDayRaw.map(t => [t.id.replace(/^task_/, ''), t])).values()
              );
              const nonTaskEvents = dayEvents.filter(e => e.type !== 'task' && e.calendarId !== 'cal_tasks');
              const hasHoliday = dayEvents.some(
                e => e.type === 'holiday' || e.calendarId === 'cal_holidays' || (e.title && e.title.toLowerCase().includes('holiday'))
              );

              // Take up to 3 events/tasks for display on the month cell
              const maxEventsToShow = 3;
              const displayedNonTasks = nonTaskEvents.slice(0, maxEventsToShow);
              const remainingSlots = maxEventsToShow - displayedNonTasks.length;
              const displayedTasks = tasksOnDay.slice(0, Math.max(0, remainingSlots));
              const displayedCount = displayedNonTasks.length + displayedTasks.length;

              const moneyForDay = moneyStats[dateStr];
              const hasMoney = !!moneyForDay && moneyForDay.count > 0;

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
                  className={`border-r border-[#0e2624] last:border-r-0 p-1 flex flex-col justify-start transition-colors relative cursor-pointer overflow-hidden ${
                    hasHoliday
                      ? 'bg-red-950/40 border-t-2 border-t-[#EF4444] hover:bg-red-950/60 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]'
                      : !isCurrentMonth
                      ? 'bg-[#051211]/40 hover:bg-teal-500/5'
                      : 'bg-[#030707] hover:bg-teal-500/5'
                  }`}
                >
                  {/* Date Number Header */}
                  <div className="flex items-center justify-between mb-1">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setCurrentDate(date);
                        setCurrentView('day');
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        hasHoliday
                          ? isCurToday
                            ? 'bg-[#EF4444] text-white font-extrabold shadow-[0_0_14px_rgba(239,68,68,0.8)] ring-2 ring-[#19E6C8]'
                            : 'bg-[#EF4444] text-white font-extrabold shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                          : isCurToday
                          ? 'bg-[#19E6C8] text-[#030707] font-bold shadow-[0_0_12px_rgba(25,230,200,0.5)]'
                          : isCurrentMonth
                          ? 'text-[#F4FFFD] hover:bg-teal-500/15'
                          : 'text-[#4b5563]'
                      }`}
                    >
                      {date.getDate()}
                    </button>

                    {/* When 3 events are displayed: do not disturb the 3 events, just display the total amount (total income - total expense) */}
                    {hasMoney && displayedCount === 3 && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          openMoneyDetails(dateStr);
                        }}
                        className={`text-[10px] font-bold font-display px-1.5 py-0.5 rounded cursor-pointer transition-all hover:scale-105 ${
                          moneyForDay.netPaise >= 0
                            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                            : 'text-red-400 bg-red-950/60 border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.25)]'
                        }`}
                        title={`Total: ${formatMoneyFull(moneyForDay.netPaise, true)} (Click to view)`}
                      >
                        {formatMoneyCompact(moneyForDay.netPaise, true)}
                      </button>
                    )}
                  </div>

                  {/* Event Chips List */}
                  <div className="flex-1 space-y-1 overflow-hidden">
                    {/* Non-task events (Holidays = Red, Birthdays = Pink, Events = Emerald Green) */}
                    {displayedNonTasks.map(item => {
                      const isBday = item.type === 'birthday' || item.calendarId === 'cal_birthdays';
                      const isHoliday = item.type === 'holiday' || item.calendarId === 'cal_holidays';

                      const chipBg = isHoliday
                        ? 'rgba(239, 68, 68, 0.18)'
                        : isBday
                          ? 'rgba(236, 72, 153, 0.18)'
                          : 'rgba(16, 185, 129, 0.18)';
                      const chipBorder = isHoliday
                        ? 'rgba(239, 68, 68, 0.4)'
                        : isBday
                          ? 'rgba(236, 72, 153, 0.4)'
                          : 'rgba(16, 185, 129, 0.4)';
                      const accentColor = isHoliday
                        ? '#EF4444'
                        : isBday
                          ? '#EC4899'
                          : '#10B981';

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
                            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                          )}
                          <span className="truncate">{item.title}</span>
                        </div>
                      );
                    })}

                    {/* Tasks: Maintained Teal Design with Hollow Circle Completion Indicator */}
                    {displayedTasks.map(task => (
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

                    {/* When 2, 1, or 0 events/tasks are displayed: display Total Income, Total Expense, and Total Amount */}
                    {hasMoney && displayedCount < 3 && (
                      <div
                        onClick={e => {
                          e.stopPropagation();
                          openMoneyDetails(dateStr);
                        }}
                        className="mt-1 px-1.5 py-1 rounded-md bg-[#051413]/70 border border-emerald-500/20 hover:border-emerald-400/50 text-[10px] font-display flex flex-col gap-0.5 cursor-pointer transition-all hover:bg-[#071c1a]"
                        title="Click to view financial details"
                      >
                        <div className="flex items-center justify-between leading-tight">
                          <span className="text-[9px] text-[#94B5B0] font-medium">Income</span>
                          <span className="text-emerald-400 font-semibold truncate">
                            +{formatMoneyCompact(moneyForDay.incomePaise)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between leading-tight">
                          <span className="text-[9px] text-[#94B5B0] font-medium">Expense</span>
                          <span className="text-red-400 font-semibold truncate">
                            {moneyForDay.expensePaise > 0 ? `-${formatMoneyCompact(moneyForDay.expensePaise)}` : '₹0'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-teal-500/15 pt-0.5 leading-tight font-bold">
                          <span className="text-[9px] text-slate-300">Total</span>
                          <span className={`truncate ${moneyForDay.netPaise >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatMoneyCompact(moneyForDay.netPaise, true)}
                          </span>
                        </div>
                      </div>
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
