import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { getCalendarGridDays } from '../../utils/dateUtils';
import { formatCompactInr, formatInr } from '../../utils/currency';
import { DayDetailsSheet } from './DayDetailsSheet';

export const CalendarView: React.FC = () => {
  const {
    anchorDate,
    navigatePeriod,
    records,
    periodIncome,
    periodExpense,
    periodNet,
    settings,
  } = useMoney();

  const [selectedDayForSheet, setSelectedDayForSheet] = useState<Date | null>(null);
  const [isCompact, setIsCompact] = useState<boolean>(false);

  const weekStartsOn = settings.weekStartDay; // 0=Sun, 1=Mon

  // Weekday column titles
  const weekdays = weekStartsOn === 0
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Days in month grid
  const gridDays = useMemo(() => {
    return getCalendarGridDays(anchorDate, weekStartsOn);
  }, [anchorDate, weekStartsOn]);

  // Aggregate daily records: Map<dayKey, { income, expense, net, count }>
  const dailyStatsMap = useMemo(() => {
    const map = new Map<string, { income: number; expense: number; net: number; count: number }>();

    for (const r of records) {
      const dayKey = r.dateTime.split('T')[0];
      if (!map.has(dayKey)) {
        map.set(dayKey, { income: 0, expense: 0, net: 0, count: 0 });
      }
      const item = map.get(dayKey)!;
      item.count++;

      if (r.type === 'income') {
        item.income += r.amountPaise;
        item.net += r.amountPaise;
      } else if (r.type === 'expense') {
        item.expense += r.amountPaise;
        item.net -= r.amountPaise;
      } else if (r.type === 'transfer' && r.feePaise) {
        item.expense += r.feePaise;
        item.net -= r.feePaise;
      }
    }

    return map;
  }, [records]);

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090d16] select-none overflow-y-auto">
      {/* 1. Summary Strip at top */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Income:</span>
          <span className="font-bold text-blue-400 font-display">
            {formatInr(periodIncome, opts)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Expense:</span>
          <span className="font-bold text-red-400 font-display">
            {periodExpense > 0 ? `-${formatInr(periodExpense, opts)}` : '₹0'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Total:</span>
          <span
            className={`font-bold font-display ${
              periodNet >= 0
                ? settings.showGreenNet
                  ? 'text-emerald-400'
                  : 'text-white'
                : 'text-red-400'
            }`}
          >
            {formatInr(periodNet, opts)}
          </span>
        </div>
      </div>

      {/* Mode bar: Compact toggle */}
      <div className="px-4 py-1.5 flex items-center justify-end border-b border-slate-800/40">
        <button
          onClick={() => setIsCompact((prev) => !prev)}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors"
        >
          {isCompact ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          <span>{isCompact ? 'Standard Mode' : 'Compact Mode'}</span>
        </button>
      </div>

      {/* 2. Weekdays Header Row */}
      <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/40 text-center py-1.5 text-xs font-semibold shrink-0">
        {weekdays.map((day, idx) => {
          const isSun = weekStartsOn === 0 ? idx === 0 : idx === 6;
          return (
            <div
              key={day}
              className={`${isSun ? 'text-red-400' : 'text-slate-400'}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 3. Month Grid Cells */}
      <div className="grid grid-cols-7 auto-rows-fr flex-1 divide-x divide-y divide-slate-800/50 border-b border-slate-800">
        {gridDays.map((item, idx) => {
          const dayKey = item.date.toISOString().split('T')[0];
          const stats = dailyStatsMap.get(dayKey);
          const hasActivity = !!stats && stats.count > 0;

          // First day of month label: e.g. "9/1" or "10/1"
          const isFirstDay = item.dayNumber === 1;
          const monthLabel = isFirstDay ? `${item.date.getMonth() + 1}/1` : item.dayNumber;

          // Check if Sunday for date color
          const isSun = item.date.getDay() === 0;

          return (
            <div
              key={dayKey}
              onClick={() => setSelectedDayForSheet(item.date)}
              className={`min-h-[72px] sm:min-h-[84px] p-1 flex flex-col justify-between cursor-pointer hover:bg-slate-800/30 active:bg-slate-800/50 transition-colors relative ${
                !item.isCurrentMonth ? 'opacity-35 bg-slate-950/40' : ''
              } ${item.isToday ? 'ring-1.5 ring-blue-500 rounded-sm bg-blue-950/10' : ''}`}
            >
              {/* Date Number at top left */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-bold leading-none ${
                    item.isToday
                      ? 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-display'
                      : isSun
                      ? 'text-red-400'
                      : item.isCurrentMonth
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {monthLabel}
                </span>

                {item.isToday && (
                  <span className="text-[9px] font-semibold text-blue-400 uppercase tracking-tighter">
                    Today
                  </span>
                )}
              </div>

              {/* 3 Stacked Activity Numbers (Income, Expense, Net) */}
              {hasActivity ? (
                <div className={`flex flex-col items-end w-full leading-tight ${isCompact ? 'space-y-0 text-[10px]' : 'space-y-0.5 text-[11px]'}`}>
                  {/* Income: blue. If 0 income on active day, shows "0" in blue */}
                  <span className="text-blue-400 font-semibold font-display truncate">
                    {stats.income > 0
                      ? formatCompactInr(stats.income, settings.compactCalendarFormat)
                      : '0'}
                  </span>

                  {/* Expense: red with minus */}
                  {stats.expense > 0 ? (
                    <span className="text-red-400 font-semibold font-display truncate">
                      -{formatCompactInr(stats.expense, settings.compactCalendarFormat)}
                    </span>
                  ) : null}

                  {/* Net: white/emerald */}
                  <span
                    className={`font-bold font-display truncate ${
                      stats.net >= 0 ? 'text-slate-100' : 'text-red-400'
                    }`}
                  >
                    {formatCompactInr(stats.net, settings.compactCalendarFormat)}
                  </span>
                </div>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet for selected day */}
      <DayDetailsSheet
        date={selectedDayForSheet}
        onClose={() => setSelectedDayForSheet(null)}
      />
    </div>
  );
};
