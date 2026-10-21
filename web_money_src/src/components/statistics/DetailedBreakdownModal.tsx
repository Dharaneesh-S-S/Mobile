import React from 'react';
import { X, TrendingUp, TrendingDown, Calendar, Hash, Percent, Award } from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';

interface DetailedBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DetailedBreakdownModal: React.FC<DetailedBreakdownModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    filteredRecords,
    periodIncome,
    periodExpense,
    periodNet,
    dateRange,
    settings,
  } = useMoney();

  if (!isOpen) return null;

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  // 1. Calculate number of days in interval
  const diffDays = Math.max(
    1,
    Math.ceil(
      (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  // 2. Daily average spending
  const dailyAverageExpense = Math.round(periodExpense / diffDays);

  // 3. Highest spending day
  const dailyExpenseMap = new Map<string, number>();
  for (const r of filteredRecords) {
    if (r.type === 'expense') {
      const day = r.dateTime.split('T')[0];
      dailyExpenseMap.set(day, (dailyExpenseMap.get(day) || 0) + r.amountPaise);
    }
  }

  let highestDayStr = 'None';
  let highestDayAmount = 0;
  for (const [day, amt] of dailyExpenseMap.entries()) {
    if (amt > highestDayAmount) {
      highestDayAmount = amt;
      highestDayStr = day;
    }
  }

  // 4. Number of transactions
  const transactionCount = filteredRecords.length;

  // 5. Savings rate (%)
  const savingsRate =
    periodIncome > 0
      ? Math.max(0, Math.round(((periodIncome - periodExpense) / periodIncome) * 100))
      : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-display">Period Financial Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">{dateRange.label}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          {/* Daily Average */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Daily Avg Expense</span>
            </div>
            <span className="text-base font-bold text-slate-100 font-display">
              {formatInr(dailyAverageExpense, opts)}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Across {diffDays} days</span>
          </div>

          {/* Savings Rate */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span>Savings Rate</span>
            </div>
            <span className="text-base font-bold text-emerald-400 font-display">
              {savingsRate}%
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Of total earnings saved</span>
          </div>

          {/* Highest Spending Day */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span>Highest Day</span>
            </div>
            <span className="text-base font-bold text-red-400 font-display">
              {highestDayAmount > 0 ? formatInr(highestDayAmount, opts) : '₹0'}
            </span>
            <span className="text-[10px] text-slate-400 truncate mt-0.5">
              {highestDayStr}
            </span>
          </div>

          {/* Total Transactions */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Hash className="w-4 h-4 text-blue-400" />
              <span>Total Records</span>
            </div>
            <span className="text-base font-bold text-slate-100 font-display">
              {transactionCount}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Logged entries</span>
          </div>
        </div>

        {/* Cash Flow Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Total Earned</span>
            <span className="text-blue-400 font-bold font-display">{formatInr(periodIncome, opts)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Total Spent</span>
            <span className="text-red-400 font-bold font-display">-{formatInr(periodExpense, opts)}</span>
          </div>
          <div className="h-px bg-slate-800 my-1" />
          <div className="flex justify-between items-center text-slate-200 font-bold">
            <span>Net Saved / Surplus</span>
            <span className={periodNet >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {formatInr(periodNet, opts)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
