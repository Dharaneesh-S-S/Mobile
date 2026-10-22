import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2,
  Plus,
  ReceiptText,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { getCalendarGridDays } from '../../utils/dateUtils';
import { formatCompactInr, formatInr } from '../../utils/currency';
import { DayDetailsSheet } from './DayDetailsSheet';
import { DynamicIcon } from '../common/IconHelper';

export const CalendarView: React.FC = () => {
  const {
    anchorDate,
    navigatePeriod,
    records,
    periodIncome,
    periodExpense,
    periodNet,
    openAddRecord,
    categories,
    wallets,
    settings,
  } = useMoney();

  // Desktop active day state (defaults to today or anchorDate)
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
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

  // Records for selected day on desktop
  const selectedDayKey = selectedDay.toISOString().split('T')[0];
  const selectedDayRecords = useMemo(() => {
    return records.filter((r) => r.dateTime.startsWith(selectedDayKey));
  }, [records, selectedDayKey]);

  const selectedDayStats = dailyStatsMap.get(selectedDayKey) || {
    income: 0,
    expense: 0,
    net: 0,
    count: 0,
  };

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    // On mobile screens, also open the bottom sheet
    if (window.innerWidth < 1024) {
      setSelectedDayForSheet(date);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090d16] p-4 md:p-6 max-w-7xl w-full mx-auto overflow-y-auto select-none pb-20">
      {/* 1. Header Balance Strip */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-md mb-4 text-center">
        <div>
          <span className="text-[11px] text-blue-400 font-semibold block mb-0.5">Income</span>
          <span className="text-xs sm:text-base font-bold text-blue-400 font-display truncate block">
            {formatInr(periodIncome, opts)}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-red-400 font-semibold block mb-0.5">Expense</span>
          <span className="text-xs sm:text-base font-bold text-red-400 font-display truncate block">
            {periodExpense > 0 ? `-${formatInr(periodExpense, opts)}` : '₹0'}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-300 font-semibold block mb-0.5">Total</span>
          <span
            className={`text-xs sm:text-base font-bold font-display truncate block ${
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

      {/* 2. Main Desktop Split Grid (Calendar on Left, Day Inspector on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Calendar Grid */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg flex flex-col">
          {/* Calendar Toolbar */}
          <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-800 bg-slate-900">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
              Monthly Calendar
            </span>

            <button
              onClick={() => setIsCompact((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              {isCompact ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              <span>{isCompact ? 'Standard' : 'Compact'}</span>
            </button>
          </div>

          {/* Weekdays Header */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/70 text-center py-2 text-xs font-bold">
            {weekdays.map((day, idx) => {
              const isSun = weekStartsOn === 0 ? idx === 0 : idx === 6;
              return (
                <div key={day} className={isSun ? 'text-red-400' : 'text-slate-400'}>
                  {day}
                </div>
              );
            })}
          </div>

          {/* Month Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/60">
            {gridDays.map((item) => {
              const dayKey = item.date.toISOString().split('T')[0];
              const stats = dailyStatsMap.get(dayKey);
              const hasActivity = !!stats && stats.count > 0;
              const isSelected = selectedDayKey === dayKey;

              const isFirstDay = item.dayNumber === 1;
              const monthLabel = isFirstDay ? `${item.date.getMonth() + 1}/1` : item.dayNumber;
              const isSun = item.date.getDay() === 0;

              return (
                <div
                  key={dayKey}
                  onClick={() => handleDayClick(item.date)}
                  className={`min-h-[75px] sm:min-h-[88px] p-1.5 flex flex-col justify-between cursor-pointer hover:bg-blue-600/10 transition-all relative ${
                    !item.isCurrentMonth ? 'opacity-30 bg-slate-950/40' : ''
                  } ${
                    isSelected
                      ? 'bg-blue-950/30 ring-2 ring-blue-500 ring-inset'
                      : item.isToday
                      ? 'bg-slate-800/30'
                      : ''
                  }`}
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
                      <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter hidden sm:inline">
                        Today
                      </span>
                    )}
                  </div>

                  {/* 3 Stacked Activity Numbers (Income, Expense, Net) */}
                  {hasActivity ? (
                    <div
                      className={`flex flex-col items-end w-full leading-tight ${
                        isCompact ? 'space-y-0 text-[10px]' : 'space-y-0.5 text-[11px]'
                      }`}
                    >
                      {stats.income > 0 ? (
                        <span className="text-blue-400 font-semibold font-display truncate">
                          +{formatCompactInr(stats.income, settings.compactCalendarFormat)}
                        </span>
                      ) : null}

                      {stats.expense > 0 ? (
                        <span className="text-red-400 font-semibold font-display truncate">
                          -{formatCompactInr(stats.expense, settings.compactCalendarFormat)}
                        </span>
                      ) : null}

                      <span
                        className={`font-bold font-display truncate ${
                          stats.net >= 0 ? 'text-slate-200' : 'text-red-400'
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
        </div>

        {/* Right Column (4 cols): Selected Day Inspector (Visible on Laptop/Desktop) */}
        <div className="hidden lg:flex flex-col gap-4 lg:col-span-4 select-none">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
            {/* Day Header */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Selected Day
                </span>
                <h3 className="text-base font-black text-white font-display">
                  {selectedDay.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </h3>
              </div>

              <button
                onClick={() => openAddRecord({ date: selectedDay.toISOString().split('T')[0] })}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue transition-all"
                title="Add transaction on this day"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Stats Summary Strip */}
            <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 mb-4">
              <div>
                <span className="text-[10px] text-blue-400 font-medium block">Income</span>
                <span className="text-xs font-bold text-blue-400 font-display">
                  {formatInr(selectedDayStats.income, { showDecimals: false })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-red-400 font-medium block">Expense</span>
                <span className="text-xs font-bold text-red-400 font-display">
                  {selectedDayStats.expense > 0 ? `-${formatInr(selectedDayStats.expense, { showDecimals: false })}` : '₹0'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 font-medium block">Net</span>
                <span
                  className={`text-xs font-bold font-display ${
                    selectedDayStats.net >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {formatInr(selectedDayStats.net, { showDecimals: false })}
                </span>
              </div>
            </div>

            {/* List of Transactions on Selected Day */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Transactions ({selectedDayRecords.length})
              </span>

              {selectedDayRecords.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/40">
                  No records for this day.
                </div>
              ) : (
                selectedDayRecords.map((r) => {
                  const cat = categories.find((c) => c.id === r.categoryId);
                  const wal = wallets.find((w) => w.id === r.walletId);
                  const isExp = r.type === 'expense';
                  const isInc = r.type === 'income';

                  return (
                    <div
                      key={r.id}
                      onClick={() => openAddRecord({ recordToEdit: r })}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cat?.color || '#3b82f6'}20`, color: cat?.color || '#3b82f6' }}
                        >
                          <DynamicIcon name={cat?.icon || 'Receipt'} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-200 truncate">
                            {r.description || cat?.name}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{wal?.name}</span>
                            {r.memo && (
                              <>
                                <span>•</span>
                                <span className="truncate">{r.memo}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold font-display ml-2 shrink-0 ${
                          isInc ? 'text-blue-400' : isExp ? 'text-red-400' : 'text-slate-300'
                        }`}
                      >
                        {isInc ? `+${formatInr(r.amountPaise, opts)}` : isExp ? `-${formatInr(r.amountPaise, opts)}` : formatInr(r.amountPaise, opts)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet for Mobile Selected Day */}
      <DayDetailsSheet
        date={selectedDayForSheet}
        onClose={() => setSelectedDayForSheet(null)}
      />
    </div>
  );
};
