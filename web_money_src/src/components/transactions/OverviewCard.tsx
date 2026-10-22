import React, { useState } from 'react';
import { Info, X, TrendingUp, TrendingDown, Scale, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';

export const OverviewCard: React.FC = () => {
  const { periodIncome, periodExpense, periodNet, budgets, settings } = useMoney();
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

  const savingsRate = periodIncome > 0
    ? Math.max(0, Math.min(100, Math.round((periodNet / periodIncome) * 100)))
    : 0;

  const totalBudgetPaise = budgets.reduce((acc, b) => acc + b.amountPaise, 0);
  const budgetSpentPct = totalBudgetPaise > 0
    ? Math.min(100, Math.round((periodExpense / totalBudgetPaise) * 100))
    : 0;

  return (
    <div className="mx-4 md:mx-0 my-3">
      {/* Desktop 4-Card Executive Grid (Mobile converts to 3-column / 4-card responsive) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 select-none">
        {/* 1. Income Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0e1626] to-slate-900 border border-blue-900/30 shadow-lg relative overflow-hidden group hover:border-blue-700/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Income
            </span>
            <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-blue-400 font-display truncate">
            {formatInr(periodIncome, opts)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3 text-blue-400" />
            <span>Cash inflows</span>
          </div>
        </div>

        {/* 2. Expense Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#180f14] to-slate-900 border border-red-900/30 shadow-lg relative overflow-hidden group hover:border-red-700/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Expenses
            </span>
            <div className="p-1 rounded-lg bg-red-500/10 text-red-400">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-red-400 font-display truncate">
            {periodExpense > 0 ? `-${formatInr(periodExpense, opts)}` : '₹0'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <ArrowDownRight className="w-3 h-3 text-red-400" />
            <span>Spent this period</span>
          </div>
        </div>

        {/* 3. Net Savings Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1c18] to-slate-900 border border-emerald-900/30 shadow-lg relative overflow-hidden group hover:border-emerald-700/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Net Cash Flow
            </span>
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-base sm:text-xl lg:text-2xl font-black font-display truncate ${netColorClass}`}>
            {formatInr(periodNet, opts)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span>Savings Rate:</span>
            <span className="font-bold text-emerald-400 font-mono">{savingsRate}%</span>
          </div>
        </div>

        {/* 4. Budget Pace Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#131726] to-slate-900 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              Budget Status
            </span>
            <button
              onClick={() => setShowInfo((p) => !p)}
              className="text-slate-500 hover:text-white p-0.5"
              title="Calculation rules"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-base sm:text-xl lg:text-2xl font-black text-slate-200 font-display">
              {budgetSpentPct}%
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {totalBudgetPaise > 0 ? `of ${formatInr(totalBudgetPaise, { showDecimals: false })}` : 'No budget set'}
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetSpentPct >= 90
                  ? 'bg-red-500'
                  : budgetSpentPct >= 75
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, budgetSpentPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Info popout */}
      {showInfo && (
        <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 animate-in fade-in duration-150">
          <div className="flex items-center justify-between font-semibold text-slate-200 mb-1.5">
            <span>Calculation Rules</span>
            <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="space-y-1 text-slate-400 list-disc pl-4 leading-relaxed">
            <li>Transfers between wallets are excluded from Income and Expense to prevent double-counting.</li>
            <li>Transfer fees (if any) are counted as Expenses under "Fees".</li>
            <li>Net Cash Flow = Total Inflows - Total Outflows.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
