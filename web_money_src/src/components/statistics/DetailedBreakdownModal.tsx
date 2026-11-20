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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-[#061817]/95 border border-teal-500/25 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 z-10 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15">
          <div>
            <h3 className="text-base font-bold text-white font-display">Period Financial Breakdown</h3>
            <p className="text-xs text-[#94B5B0] mt-0.5">{dateRange.label}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          {/* Daily Average */}
          <div className="p-3.5 rounded-2xl bg-[#030707] border border-teal-500/15 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-[#94B5B0] mb-1 font-mono uppercase font-bold text-[10px]">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Avg Expense</span>
            </div>
            <span className="text-base font-bold text-white font-mono">
              {formatInr(dailyAverageExpense, opts)}
            </span>
            <span className="text-[10px] text-[#5B7B76] mt-0.5 font-mono">Across {diffDays} days</span>
          </div>

          {/* Savings Rate */}
          <div className="p-3.5 rounded-2xl bg-[#030707] border border-teal-500/15 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-[#94B5B0] mb-1 font-mono uppercase font-bold text-[10px]">
              <Percent className="w-3.5 h-3.5 text-[#19E6C8]" />
              <span>Savings Rate</span>
            </div>
            <span className="text-base font-bold text-[#19E6C8] font-mono text-glow-teal">
              {savingsRate}%
            </span>
            <span className="text-[10px] text-[#5B7B76] mt-0.5 font-mono">Of total earnings saved</span>
          </div>

          {/* Highest Spending Day */}
          <div className="p-3.5 rounded-2xl bg-[#030707] border border-teal-500/15 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-[#94B5B0] mb-1 font-mono uppercase font-bold text-[10px]">
              <TrendingDown className="w-3.5 h-3.5 text-[#FF6B6B]" />
              <span>Highest Day</span>
            </div>
            <span className="text-base font-bold text-[#FF6B6B] font-mono text-glow-coral">
              {highestDayAmount > 0 ? formatInr(highestDayAmount, opts) : '₹0'}
            </span>
            <span className="text-[10px] text-[#5B7B76] truncate mt-0.5 font-mono">
              {highestDayStr}
            </span>
          </div>

          {/* Total Transactions */}
          <div className="p-3.5 rounded-2xl bg-[#030707] border border-teal-500/15 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-[#94B5B0] mb-1 font-mono uppercase font-bold text-[10px]">
              <Hash className="w-3.5 h-3.5 text-[#19E6C8]" />
              <span>Total Records</span>
            </div>
            <span className="text-base font-bold text-white font-mono">
              {transactionCount}
            </span>
            <span className="text-[10px] text-[#5B7B76] mt-0.5 font-mono">Logged entries</span>
          </div>
        </div>

        {/* Cash Flow Summary Card */}
        <div className="p-4 rounded-2xl bg-[#030707] border border-teal-500/20 space-y-2.5 text-xs font-mono">
          <div className="flex justify-between items-center text-[#94B5B0]">
            <span>Total Earned</span>
            <span className="text-[#19E6C8] font-bold text-glow-teal">{formatInr(periodIncome, opts)}</span>
          </div>
          <div className="flex justify-between items-center text-[#94B5B0]">
            <span>Total Spent</span>
            <span className="text-[#FF6B6B] font-bold text-glow-coral">-{formatInr(periodExpense, opts)}</span>
          </div>
          <div className="h-px bg-teal-500/15 my-1" />
          <div className="flex justify-between items-center text-white font-bold">
            <span>Net Saved / Surplus</span>
            <span className={periodNet >= 0 ? 'text-[#19E6C8] text-glow-teal' : 'text-[#FF6B6B] text-glow-coral'}>
              {formatInr(periodNet, opts)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
