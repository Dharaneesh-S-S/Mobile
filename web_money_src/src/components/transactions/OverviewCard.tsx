import React, { useState } from 'react';
import { Info, X, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';

export const OverviewCard: React.FC = () => {
  const { periodIncome, periodExpense, periodNet, settings } = useMoney();
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  const isNetPositive = periodNet >= 0;
  const netColorClass = isNetPositive
    ? settings.showGreenNet
      ? 'text-emerald-400'
      : 'text-white'
    : 'text-red-400';

  return (
    <div className="mx-4 my-2.5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#111827] to-slate-900 border border-slate-800/80 shadow-lg relative overflow-hidden select-none">
      {/* Decorative subtle ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header with info icon */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-medium">
        <span className="tracking-wide uppercase font-semibold text-slate-300">Period Overview</span>
        <button
          onClick={() => setShowInfo((prev) => !prev)}
          className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          title="How totals are calculated"
          aria-label="Info on totals calculation"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Columns: Income, Expense, Total */}
      <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-800/80">
        {/* Income */}
        <div className="flex flex-col items-center px-1">
          <div className="flex items-center gap-1 text-[11px] font-medium text-blue-400 mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>Income</span>
          </div>
          <span className="text-sm sm:text-base font-bold text-blue-400 font-display truncate w-full">
            {formatInr(periodIncome, opts)}
          </span>
        </div>

        {/* Expense */}
        <div className="flex flex-col items-center px-1">
          <div className="flex items-center gap-1 text-[11px] font-medium text-red-400 mb-1">
            <TrendingDown className="w-3 h-3" />
            <span>Expense</span>
          </div>
          <span className="text-sm sm:text-base font-bold text-red-400 font-display truncate w-full">
            {periodExpense > 0 ? `-${formatInr(periodExpense, opts)}` : '₹0'}
          </span>
        </div>

        {/* Total / Net */}
        <div className="flex flex-col items-center px-1">
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 mb-1">
            <Scale className="w-3 h-3 text-slate-400" />
            <span>Total</span>
          </div>
          <span className={`text-sm sm:text-base font-bold font-display truncate w-full ${netColorClass}`}>
            {formatInr(periodNet, opts)}
          </span>
        </div>
      </div>

      {/* Calculation Info Modal */}
      {showInfo && (
        <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between font-semibold text-slate-200 mb-1.5">
            <span>Calculation Rules</span>
            <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="space-y-1 text-slate-400 list-disc pl-4 leading-relaxed">
            <li>Transfers between wallets are excluded from Income and Expense to prevent double-counting.</li>
            <li>Transfer fees (if any) are counted as Expenses under "Fees".</li>
            <li>Total = Total Income - Total Expense.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
