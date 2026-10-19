import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { getMonthDays, isSameDay, isToday, formatDateToYYYYMMDD } from '../../utils/dateUtils';

export const YearView: React.FC = () => {
  const { currentDate, setCurrentDate, setCurrentView, events, settings } = useCalendar();
  const year = currentDate.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const startDay = settings.startWeekOn || 0;
  const orderedLetters = [...dayLetters.slice(startDay), ...dayLetters.slice(0, startDay)];

  const eventDates = new Set(
    events.filter(e => !e.deletedAt && e.startDate.startsWith(`${year}`)).map(e => e.startDate)
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white dark:bg-gray-900 select-none">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
          {year}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {monthNames.map((monthName, mIdx) => {
            const firstDateOfMonth = new Date(year, mIdx, 1);
            const weeks = getMonthDays(firstDateOfMonth, startDay);

            return (
              <div
                key={mIdx}
                className="p-3 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
              >
                <button
                  type="button"
                  onClick={() => {
                    setCurrentDate(firstDateOfMonth);
                    setCurrentView('month');
                  }}
                  className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 mb-2 block"
                >
                  {monthName}
                </button>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-400 mb-1">
                  {orderedLetters.map((dl, i) => (
                    <div key={i}>{dl}</div>
                  ))}
                </div>

                <div className="space-y-0.5">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="grid grid-cols-7 gap-1">
                      {week.map((date, dIdx) => {
                        const isCurMonth = date.getMonth() === mIdx;
                        const isCurToday = isToday(date);
                        const isSelected = isSameDay(date, currentDate);
                        const dateStr = formatDateToYYYYMMDD(date);
                        const hasEvent = eventDates.has(dateStr);

                        return (
                          <button
                            key={dIdx}
                            type="button"
                            onClick={() => {
                              setCurrentDate(date);
                              setCurrentView('day');
                            }}
                            className={`h-6 w-6 mx-auto rounded-full flex flex-col items-center justify-center text-[11px] font-medium transition-all relative ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold'
                                : isCurToday
                                ? 'border border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                                : isCurMonth
                                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                : 'text-gray-300 dark:text-gray-700'
                            }`}
                          >
                            <span>{date.getDate()}</span>
                            {hasEvent && isCurMonth && !isSelected && (
                              <span className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
