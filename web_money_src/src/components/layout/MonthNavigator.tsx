import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { ViewRangeType } from '../../types/money';

const RANGE_OPTIONS: { id: ViewRangeType; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'all', label: 'All Time' },
];

export const MonthNavigator: React.FC = () => {
  const {
    dateRange,
    navigatePeriod,
    viewRange,
    setViewRange,
    anchorDate,
    setAnchorDate,
  } = useMoney();

  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  // Month / Year picker helper states
  const currentYear = anchorDate.getFullYear();
  const currentMonth = anchorDate.getMonth();

  const handleSelectMonth = (monthIdx: number) => {
    const updated = new Date(anchorDate);
    updated.setMonth(monthIdx);
    setAnchorDate(updated);
    setIsPickerOpen(false);
  };

  const handleYearChange = (delta: number) => {
    const updated = new Date(anchorDate);
    updated.setFullYear(currentYear + delta);
    setAnchorDate(updated);
  };

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  return (
    <div className="relative z-10 bg-[#090d16] border-b border-slate-800/60 px-3 py-2 flex items-center justify-between select-none">
      {/* Previous Button */}
      <button
        onClick={() => navigatePeriod('prev')}
        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-90 transition-all"
        aria-label="Previous period"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Title & Range Trigger */}
      <button
        onClick={() => setIsPickerOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 active:scale-95 transition-all text-sm font-semibold text-slate-100 font-display"
        aria-label="Open period picker"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
        <span>{dateRange.label}</span>
      </button>

      {/* Next Button */}
      <button
        onClick={() => navigatePeriod('next')}
        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-90 transition-all"
        aria-label="Next period"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Month/Year and Range Popover Picker */}
      {isPickerOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsPickerOpen(false)}
          />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xs bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Range chips */}
            <div className="flex items-center justify-between gap-1 mb-4 pb-3 border-b border-slate-800">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setViewRange(opt.id);
                    if (opt.id === 'all') setIsPickerOpen(false);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    viewRange === opt.id
                      ? 'bg-blue-600 text-white shadow-glow-blue'
                      : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Year Selector */}
            <div className="flex items-center justify-between mb-3 px-2">
              <button
                onClick={() => handleYearChange(-1)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-base font-bold text-white font-display">{currentYear}</span>
              <button
                onClick={() => handleYearChange(1)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 12 Months Grid */}
            <div className="grid grid-cols-4 gap-2">
              {monthNames.map((name, idx) => {
                const isSelected = idx === currentMonth;
                return (
                  <button
                    key={name}
                    onClick={() => handleSelectMonth(idx)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-glow-blue'
                        : 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            {/* Quick Today Jump */}
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  setAnchorDate(new Date());
                  setViewRange('month');
                  setIsPickerOpen(false);
                }}
                className="text-xs text-blue-400 font-semibold hover:underline"
              >
                Current Month
              </button>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
