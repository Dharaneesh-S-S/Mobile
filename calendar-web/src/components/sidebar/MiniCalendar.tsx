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
        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setViewDate(prev => subMonths(prev, 1))}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewDate(prev => addMonths(prev, 1))}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-400 mb-1">
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
                isCurrentWeek ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''
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
                    className={`h-7 w-7 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : isCurToday
                        ? 'text-blue-600 dark:text-blue-400 font-bold border border-blue-600 dark:border-blue-400'
                        : isCurrentMonth
                        ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-700/60'
                        : 'text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
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
