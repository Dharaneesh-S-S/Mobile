import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Search,
  FileText,
  Smartphone,
  TrendingUp,
  TrendingDown,
  RotateCcw,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';
import { ViewRangeType } from '../../types/money';

const RANGE_OPTIONS: { id: ViewRangeType; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'all', label: 'All' },
];

export const DesktopTopBar: React.FC = () => {
  const {
    activeTab,
    dateRange,
    navigatePeriod,
    viewRange,
    setViewRange,
    anchorDate,
    setAnchorDate,
    periodIncome,
    periodExpense,
    periodNet,
    openSearch,
    openMonthlyReport,
    settings,
    updateSettings,
  } = useMoney();

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  const isNetPositive = periodNet >= 0;
  const netColorClass = isNetPositive ? 'text-emerald-400' : 'text-red-400';

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  return (
    <header className="h-16 px-6 bg-[#090d16]/95 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Period Navigator & Range Selector */}
      <div className="flex items-center gap-4">
        {activeTab !== 'wallet' && (
          <>
            {/* Prev / Next & Date Label */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => navigatePeriod('prev')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Previous period"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMonthPickerOpen((p) => !p)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-white hover:text-blue-400 transition-colors"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>{dateRange.label}</span>
              </button>

              <button
                onClick={() => navigatePeriod('next')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Next period"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Jump to current date shortcut */}
            <button
              onClick={() => setAnchorDate(new Date())}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1"
              title="Jump to today"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Current</span>
            </button>

            {/* Range Pills (Day / Week / Month / Year / All) */}
            <div className="hidden lg:flex items-center gap-0.5 bg-slate-900/80 border border-slate-800/80 p-1 rounded-xl">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setViewRange(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    viewRange === opt.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Center: Live Period Flow Summary Pills */}
      {activeTab !== 'wallet' && (
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
            <span className="flex items-center gap-1 text-blue-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Income:</span>
            </span>
            <span className="font-bold font-display text-blue-400">
              {formatInr(periodIncome, opts)}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
            <span className="flex items-center gap-1 text-red-400 font-medium">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Expense:</span>
            </span>
            <span className="font-bold font-display text-red-400">
              {periodExpense > 0 ? `-${formatInr(periodExpense, opts)}` : '₹0'}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
            <span className="text-slate-400 font-medium">Net:</span>
            <span className={`font-bold font-display ${netColorClass}`}>
              {formatInr(periodNet, opts)}
            </span>
          </div>
        </div>
      )}

      {/* Right: Search, Currency Badge & Actions */}
      <div className="flex items-center gap-2.5">
        {/* Search Bar Input Trigger */}
        <button
          onClick={openSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all"
          title="Search transactions (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden md:inline text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
            Ctrl K
          </kbd>
        </button>

        {/* Currency Tag */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
          <span>₹ INR</span>
        </div>

        {/* Monthly Report Quick Trigger */}
        <button
          onClick={openMonthlyReport}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Print Monthly Report"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Switch to Phone Mockup Frame */}
        <button
          onClick={() => updateSettings({ isPhoneFrameEnabled: true })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          title="Switch to Mobile Phone frame preview"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden lg:inline">Phone Frame</span>
        </button>
      </div>

      {/* Quick Month Picker Dropdown */}
      {isMonthPickerOpen && (
        <div className="absolute top-16 left-6 z-50 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl w-72 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-white">
            <button
              onClick={() => {
                const updated = new Date(anchorDate);
                updated.setFullYear(anchorDate.getFullYear() - 1);
                setAnchorDate(updated);
              }}
              className="p-1 hover:bg-slate-800 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>{anchorDate.getFullYear()}</span>
            <button
              onClick={() => {
                const updated = new Date(anchorDate);
                updated.setFullYear(anchorDate.getFullYear() + 1);
                setAnchorDate(updated);
              }}
              className="p-1 hover:bg-slate-800 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {monthNames.map((m, idx) => {
              const isSelected = anchorDate.getMonth() === idx;
              return (
                <button
                  key={m}
                  onClick={() => {
                    const updated = new Date(anchorDate);
                    updated.setMonth(idx);
                    setAnchorDate(updated);
                    setIsMonthPickerOpen(false);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-glow-blue'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
