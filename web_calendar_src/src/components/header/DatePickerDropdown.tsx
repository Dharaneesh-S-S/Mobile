import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthDays, isSameDay, isToday, addMonths, subMonths } from '../../utils/dateUtils';

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
  const [viewMonth, setViewMonth] = useState(new Date(currentDate));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const weeks = getMonthDays(viewMonth, 0);

  return (
    <div className="absolute top-full left-0 mt-2 z-50 w-72 rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
          {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMonth(prev => subMonths(prev, 1))}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMonth(prev => addMonths(prev, 1))}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400 mb-2">
        {dayHeaders.map((dh, i) => (
          <div key={i} className="py-0.5">{dh}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((date, idx) => {
          const isSelected = isSameDay(date, currentDate);
          const isCurrentToday = isToday(date);
          const isCurrentMonth = date.getMonth() === viewMonth.getMonth();

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelectDate(date);
                onClose();
              }}
              className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : isCurrentToday
                  ? 'border border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : isCurrentMonth
                  ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
        <button
          type="button"
          onClick={() => {
            const today = new Date();
            onSelectDate(today);
            setViewMonth(today);
            onClose();
          }}
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          Today
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
