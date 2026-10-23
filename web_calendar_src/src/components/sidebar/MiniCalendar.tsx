import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthDays, isSameDay, isToday, addMonths, subMonths, getWeekStart } from '../../utils/dateUtils';
import { useCalendar } from '../../context/CalendarContext';

export const MiniCalendar: React.FC = () => {
  const { currentDate, setCurrentDate, settings } = useCalendar();
  const [viewDate, setViewDate] = useState<Date>(new Date(currentDate));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Reorder day letters if week starts on Monday or Saturday
  const startDay = settings.startWeekOn || 0;
  const orderedDayLetters = [...dayLetters.slice(startDay), ...dayLetters.slice(0, startDay)];

  const weeks = getMonthDays(viewDate, startDay);
  const selectedWeekStart = getWeekStart(currentDate, startDay);

  return (
    <div className="px-3 py-2 select-none">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#F4FFFD]">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setViewDate(prev => subMonths(prev, 1))}
            className="p-1 rounded-full text-teal-400/60 hover:text-white hover:bg-teal-500/10 transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewDate(prev => addMonths(prev, 1))}
            className="p-1 rounded-full text-teal-400/60 hover:text-white hover:bg-teal-500/10 transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-teal-400/50 mb-1">
        {orderedDayLetters.map((d, i) => (
          <div key={i} className="py-0.5">{d}</div>
        ))}
      </div>

      <div className="space-y-0.5">
        {weeks.map((week, wIdx) => {
          const isCurrentWeek = isSameDay(getWeekStart(week[0], startDay), selectedWeekStart);

          return (
            <div
              key={wIdx}
              className={`grid grid-cols-7 gap-1 rounded-full transition-colors ${
                isCurrentWeek ? 'bg-teal-500/10' : ''
              }`}
            >
              {week.map((date, dIdx) => {
                const isSelected = isSameDay(date, currentDate);
                const isCurToday = isToday(date);
                const isCurrentMonth = date.getMonth() === viewDate.getMonth();

                return (
                  <button
                    key={dIdx}
                    type="button"
                    onClick={() => {
                      setCurrentDate(date);
                      setViewDate(new Date(date));
                    }}
                    className={`h-7 w-7 mx-auto flex items-center justify-center rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#19E6C8] text-[#030707] font-extrabold shadow-[0_0_15px_rgba(25,230,200,0.4)]'
                        : isCurToday
                        ? 'text-[#19E6C8] font-bold border border-[#19E6C8]'
                        : isCurrentMonth
                        ? 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD]'
                        : 'text-teal-900/40 hover:bg-teal-500/5'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
