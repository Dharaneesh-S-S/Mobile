import React from 'react';
import { getMonthDays, isSameDay, isToday, addMonths, subMonths, formatDateToYYYYMMDD } from '../../utils/dateUtils';
import { useCalendar } from '../../context/CalendarContext';

interface DatePickerDropdownProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

export const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  currentDate,
  onSelectDate,
  onClose,
}) => {
  const { events } = useCalendar();
  const [viewMonth, setViewMonth] = React.useState(new Date(currentDate));

  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const weeks = getMonthDays(viewMonth, 0);

  // Month navigation pills: 4 months before to 6 months after
  const monthPills = React.useMemo(() => {
    const list: { label: string; yearLabel?: string; date: Date; isSelected: boolean }[] = [];
    const base = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    for (let offset = -4; offset <= 7; offset++) {
      const d = addMonths(base, offset);
      const isSelected = d.getFullYear() === viewMonth.getFullYear() && d.getMonth() === viewMonth.getMonth();
      const isNewYear = d.getMonth() === 0;
      list.push({
        label: d.toLocaleString('default', { month: 'short' }),
        yearLabel: isNewYear ? `${d.getFullYear()}` : undefined,
        date: d,
        isSelected,
      });
    }
    return list;
  }, [currentDate, viewMonth]);

  // Check event dot density for each date
  const getEventDotsForDate = (date: Date) => {
    const dStr = formatDateToYYYYMMDD(date);
    const dayEvents = events.filter(e => e.startDate <= dStr && e.endDate >= dStr && !e.deletedAt);
    if (dayEvents.length === 0) return null;

    const hasBirthday = dayEvents.some(e => e.type === 'birthday' || e.calendarId === 'cal_birthdays');
    const hasTask = dayEvents.some(e => e.type === 'task' || e.calendarId === 'cal_tasks');
    const hasEvent = dayEvents.some(e => e.type === 'event' || e.calendarId === 'cal_my_calendar' || e.calendarId === 'cal_holidays');

    return (
      <div className="flex items-center justify-center gap-0.5 mt-0.5">
        {hasBirthday && <span className="w-1 h-1 rounded-full bg-[#81c995]" />}
        {hasTask && <span className="w-1 h-1 rounded-full bg-[#19E6C8]" />}
        {hasEvent && <span className="w-1 h-1 rounded-full bg-[#26c6da]" />}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#1b1b1f] border-b border-[#2d2f34] shadow-2xl px-3 py-3 select-none animate-in slide-in-from-top-2 duration-150 z-40">
      <div className="max-w-md mx-auto">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#9aa0a6] mb-2">
          {dayHeaders.map((dh, i) => (
            <div key={i} className="py-0.5">{dh}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {weeks.flat().map((date, idx) => {
            const isSelected = isSameDay(date, currentDate);
            const isCurToday = isToday(date);
            const isCurMonth = date.getMonth() === viewMonth.getMonth();

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectDate(date);
                  onClose();
                }}
                className="flex flex-col items-center justify-center py-1 rounded-full group focus:outline-none"
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-all ${
                    isCurToday
                      ? 'bg-[#a8c7fa] text-[#041e49] font-bold shadow-md'
                      : isSelected
                      ? 'border border-[#a8c7fa] text-[#a8c7fa] font-bold'
                      : isCurMonth
                      ? 'text-[#e3e3e3] group-hover:bg-[#2c2d32]'
                      : 'text-[#5f6368] group-hover:bg-[#2c2d32]/50'
                  }`}
                >
                  {date.getDate()}
                </div>
                {/* Dots indicator */}
                <div className="h-2">
                  {getEventDotsForDate(date)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Horizontal Month Scrolling Selector Pills (Screenshot 10) */}
        <div className="mt-3 pt-2.5 border-t border-[#2d2f34] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {monthPills.map((item, idx) => (
            <React.Fragment key={idx}>
              {item.yearLabel && (
                <span className="text-xs font-bold text-[#9aa0a6] px-2 flex-shrink-0">
                  {item.yearLabel}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setViewMonth(item.date);
                  onSelectDate(new Date(item.date.getFullYear(), item.date.getMonth(), 1));
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all ${
                  item.isSelected
                    ? 'bg-[#a8c7fa] text-[#041e49] font-bold shadow-sm'
                    : 'bg-[#2b2d31] text-[#e3e3e3] hover:bg-[#35383e]'
                }`}
              >
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
