import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
  ArrowLeft,
} from 'lucide-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isSameDay,
} from 'date-fns';
import { ViewRangeType } from '../../types/money';

interface DateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewRange: ViewRangeType;
  anchorDate: Date;
  onSelectDate: (date: Date) => void;
  weekStartsOn?: 0 | 1;
}

export const DateSelectionModal: React.FC<DateSelectionModalProps> = ({
  isOpen,
  onClose,
  viewRange,
  anchorDate,
  onSelectDate,
  weekStartsOn = 0,
}) => {
  // Working year & month inside picker
  const [targetYear, setTargetYear] = useState<number>(anchorDate.getFullYear());
  const [targetMonth, setTargetMonth] = useState<number>(anchorDate.getMonth());

  // Decade start year for Year view
  const [decadeStartYear, setDecadeStartYear] = useState<number>(() => {
    return Math.floor(anchorDate.getFullYear() / 12) * 12;
  });

  // Step state for 'week' and 'day' views:
  // Starts on 'month' as requested, then proceeds to 'week' or 'day'
  const [step, setStep] = useState<'month' | 'detail'>('month');

  // Reset internal states whenever the modal opens or anchorDate/viewRange changes
  useEffect(() => {
    if (isOpen) {
      setTargetYear(anchorDate.getFullYear());
      setTargetMonth(anchorDate.getMonth());
      setDecadeStartYear(Math.floor(anchorDate.getFullYear() / 12) * 12);
      // For week and day: always follow the month process first
      setStep('month');
    }
  }, [isOpen, anchorDate, viewRange]);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // 12-Year range for Year View
  const yearsList = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 12; i++) {
      list.push(decadeStartYear + i);
    }
    return list;
  }, [decadeStartYear]);

  // Weeks of the selected target month
  const weeksList = useMemo(() => {
    if (viewRange !== 'week') return [];
    const firstDay = new Date(targetYear, targetMonth, 1);
    const lastDay = new Date(targetYear, targetMonth + 1, 0);

    const list: {
      weekIndex: number;
      startDate: Date;
      endDate: Date;
      label: string;
      isCurrentAnchorWeek: boolean;
    }[] = [];

    let curr = startOfWeek(firstDay, { weekStartsOn });
    let weekIndex = 1;

    while (curr <= lastDay) {
      const s = curr;
      const e = endOfWeek(curr, { weekStartsOn });

      if (e >= firstDay && s <= lastDay) {
        const isCurrentAnchorWeek =
          anchorDate.getTime() >= s.getTime() &&
          anchorDate.getTime() <= e.getTime() &&
          anchorDate.getFullYear() === targetYear;

        list.push({
          weekIndex,
          startDate: new Date(s),
          endDate: new Date(e),
          label: `${format(s, 'd MMM')} - ${format(e, 'd MMM')}`,
          isCurrentAnchorWeek,
        });
        weekIndex++;
      }

      curr = addWeeks(curr, 1);
    }

    return list;
  }, [viewRange, targetYear, targetMonth, weekStartsOn, anchorDate]);

  // Days of the selected target month
  const daysGrid = useMemo(() => {
    if (viewRange !== 'day') return { emptyDays: 0, days: [] };
    const firstDay = new Date(targetYear, targetMonth, 1);
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    const firstDayOfWeek = firstDay.getDay(); // 0 = Sun
    const emptyDays =
      weekStartsOn === 0 ? firstDayOfWeek : (firstDayOfWeek + 6) % 7;

    const days: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    return { emptyDays, days };
  }, [viewRange, targetYear, targetMonth, weekStartsOn]);

  const weekdays =
    weekStartsOn === 0
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (!isOpen) return null;

  // Handler when a month is clicked
  const handleMonthClick = (mIdx: number) => {
    setTargetMonth(mIdx);
    if (viewRange === 'month') {
      // In month mode, selecting month completes the selection
      const newDate = new Date(targetYear, mIdx, 1);
      onSelectDate(newDate);
      onClose();
    } else if (viewRange === 'week' || viewRange === 'day') {
      // In week or day mode, proceed to the week/day selection step
      setStep('detail');
    }
  };

  // Handler when a year is clicked in Year view
  const handleYearClick = (year: number) => {
    const newDate = new Date(year, 0, 1);
    onSelectDate(newDate);
    onClose();
  };

  // Handler when a week is clicked
  const handleWeekClick = (startDate: Date) => {
    onSelectDate(startDate);
    onClose();
  };

  // Handler when a day is clicked
  const handleDayClick = (dayNum: number) => {
    const newDate = new Date(targetYear, targetMonth, dayNum);
    onSelectDate(newDate);
    onClose();
  };

  const handleResetToday = () => {
    const today = new Date();
    onSelectDate(today);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm sm:max-w-md bg-[#040e0d]/95 border border-teal-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 animate-in zoom-in-95 duration-150 select-none my-auto">
        {/* ========================================================= */}
        {/* VIEW 1: YEAR SELECTION (Only the year appears to be selected) */}
        {/* ========================================================= */}
        {viewRange === 'year' && (
          <div>
            {/* Decade Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-teal-500/15">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#19E6C8]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
                  Select Year
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDecadeStartYear((prev) => prev - 12)}
                  className="p-1.5 rounded-lg text-[#94B5B0] hover:text-white hover:bg-teal-950/50 transition-colors cursor-pointer"
                  title="Previous decade"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs font-bold text-[#94B5B0] px-1">
                  {decadeStartYear} – {decadeStartYear + 11}
                </span>
                <button
                  type="button"
                  onClick={() => setDecadeStartYear((prev) => prev + 12)}
                  className="p-1.5 rounded-lg text-[#94B5B0] hover:text-white hover:bg-teal-950/50 transition-colors cursor-pointer"
                  title="Next decade"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 ml-1 text-[#94B5B0] hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 12-Year Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {yearsList.map((y) => {
                const isSelected = anchorDate.getFullYear() === y;
                const isThisYear = new Date().getFullYear() === y;

                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => handleYearClick(y)}
                    className={`py-3 rounded-2xl text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#19E6C8] text-black font-extrabold shadow-[0_0_15px_rgba(25,230,200,0.45)]'
                        : isThisYear
                        ? 'bg-[#061817] text-[#19E6C8] border border-teal-500/40 hover:bg-teal-950/60'
                        : 'bg-[#061817]/60 text-[#94B5B0] hover:text-white hover:bg-teal-950/40 border border-teal-500/10'
                    }`}
                  >
                    {y}
                    {isThisYear && !isSelected && (
                      <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[#19E6C8]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: MONTH SELECTION (Or Step 1 for Week & Day) */}
        {/* ========================================================= */}
        {(viewRange === 'month' ||
          ((viewRange === 'week' || viewRange === 'day') && step === 'month')) && (
          <div>
            {/* Year Navigator Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-teal-500/15">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#19E6C8]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
                  {viewRange === 'month'
                    ? 'Select Month'
                    : viewRange === 'week'
                    ? 'Step 1: Choose Month for Week'
                    : 'Step 1: Choose Month for Day'}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTargetYear((y) => y - 1)}
                  className="p-1.5 rounded-lg text-[#94B5B0] hover:text-white hover:bg-teal-950/50 transition-colors cursor-pointer"
                  title="Previous year"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-sm font-bold text-white px-1">
                  {targetYear}
                </span>
                <button
                  type="button"
                  onClick={() => setTargetYear((y) => y + 1)}
                  className="p-1.5 rounded-lg text-[#94B5B0] hover:text-white hover:bg-teal-950/50 transition-colors cursor-pointer"
                  title="Next year"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 ml-1 text-[#94B5B0] hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 12 Months Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {monthNames.map((m, idx) => {
                const isSelected =
                  anchorDate.getMonth() === idx &&
                  anchorDate.getFullYear() === targetYear;
                const isCurrentMonth =
                  new Date().getMonth() === idx &&
                  new Date().getFullYear() === targetYear;

                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMonthClick(idx)}
                    className={`py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#19E6C8] text-black font-extrabold shadow-[0_0_15px_rgba(25,230,200,0.45)]'
                        : isCurrentMonth
                        ? 'bg-[#061817] text-[#19E6C8] border border-teal-500/40 hover:bg-teal-950/60'
                        : 'bg-[#061817]/60 text-[#94B5B0] hover:text-white hover:bg-teal-950/40 border border-teal-500/10'
                    }`}
                  >
                    {m}
                    {isCurrentMonth && !isSelected && (
                      <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[#19E6C8]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: WEEK SELECTION (Step 2: Choose which week of month) */}
        {/* ========================================================= */}
        {viewRange === 'week' && step === 'detail' && (
          <div>
            {/* Header with Back button to re-choose month */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-teal-500/15">
              <button
                type="button"
                onClick={() => setStep('month')}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#19E6C8] hover:text-[#2DD4BF] transition-colors cursor-pointer"
                title="Back to Month Selection"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Month</span>
              </button>

              <div className="text-center">
                <span className="text-xs sm:text-sm font-bold text-white font-display">
                  {fullMonthNames[targetMonth]} {targetYear}
                </span>
                <span className="text-[10px] text-[#94B5B0] block">
                  Select Week
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#94B5B0] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Weeks in the Selected Month */}
            <div className="space-y-2 max-h-72 sm:max-h-80 overflow-y-auto pr-1">
              {weeksList.map((wk) => (
                <button
                  key={wk.weekIndex}
                  type="button"
                  onClick={() => handleWeekClick(wk.startDate)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer ${
                    wk.isCurrentAnchorWeek
                      ? 'bg-[#19E6C8] text-black font-extrabold shadow-[0_0_15px_rgba(25,230,200,0.4)]'
                      : 'bg-[#061817]/70 text-[#94B5B0] hover:text-white hover:bg-teal-950/50 border border-teal-500/15'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold ${
                        wk.isCurrentAnchorWeek
                          ? 'bg-black text-[#19E6C8]'
                          : 'bg-teal-500/10 text-[#19E6C8] border border-teal-500/20'
                      }`}
                    >
                      W{wk.weekIndex}
                    </span>
                    <span className="font-semibold">Week {wk.weekIndex}</span>
                  </div>
                  <span
                    className={`font-mono text-[11px] sm:text-xs ${
                      wk.isCurrentAnchorWeek ? 'text-black font-bold' : 'text-[#94B5B0]'
                    }`}
                  >
                    {wk.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: DAY SELECTION (Step 2: Choose which day of month) */}
        {/* ========================================================= */}
        {viewRange === 'day' && step === 'detail' && (
          <div>
            {/* Header with Back button to re-choose month */}
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-teal-500/15">
              <button
                type="button"
                onClick={() => setStep('month')}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#19E6C8] hover:text-[#2DD4BF] transition-colors cursor-pointer"
                title="Back to Month Selection"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Month</span>
              </button>

              <div className="text-center">
                <span className="text-xs sm:text-sm font-bold text-white font-display">
                  {fullMonthNames[targetMonth]} {targetYear}
                </span>
                <span className="text-[10px] text-[#94B5B0] block">
                  Select Day
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#94B5B0] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Row */}
            <div className="grid grid-cols-7 text-center mb-1.5 text-[10px] sm:text-xs font-bold text-[#94B5B0]">
              {weekdays.map((wd) => (
                <div key={wd} className="py-1">
                  {wd.slice(0, 2)}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
              {/* Empty leading cells */}
              {Array.from({ length: daysGrid.emptyDays }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8 w-8 sm:h-9 sm:w-9 mx-auto" />
              ))}

              {/* Day cells */}
              {daysGrid.days.map((dayNum) => {
                const dayDate = new Date(targetYear, targetMonth, dayNum);
                const isSelected = isSameDay(dayDate, anchorDate);
                const isToday = isSameDay(dayDate, new Date());

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleDayClick(dayNum)}
                    className={`h-8 w-8 sm:h-9 sm:w-9 mx-auto rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#19E6C8] text-black font-extrabold shadow-[0_0_12px_rgba(25,230,200,0.5)]'
                        : isToday
                        ? 'bg-[#061817] text-[#19E6C8] border border-teal-500/50 hover:bg-teal-950/60'
                        : 'text-[#94B5B0] hover:text-white hover:bg-teal-950/50'
                    }`}
                  >
                    {dayNum}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#19E6C8]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Shortcut */}
        <div className="mt-4 pt-3 border-t border-teal-500/15 flex items-center justify-between text-xs">
          <span className="text-[#5B7B76]">
            Mode: <strong className="text-[#94B5B0] capitalize">{viewRange}</strong>
          </span>
          <button
            type="button"
            onClick={handleResetToday}
            className="font-semibold text-[#19E6C8] hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            Reset to Today
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
