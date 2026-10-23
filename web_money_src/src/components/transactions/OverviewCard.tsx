import React, { useState } from 'react';
import { Info, X, TrendingUp, TrendingDown, Scale, Target, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';
import { GlassCard, ProgressBar } from '../ui';

export const OverviewCard: React.FC = () => {
  const { periodIncome, periodExpense, periodNet, budgets, settings } = useMoney();
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  const isNetPositive = periodNet >= 0;
  const netColorClass = isNetPositive
    ? 'text-[#19E6C8] text-glow-teal'
    : 'text-[#FF6B6B] text-glow-coral';

  const savingsRate = periodIncome > 0
    ? Math.max(0, Math.min(100, Math.round((periodNet / periodIncome) * 100)))
    : 0;

  const totalBudgetPaise = budgets.reduce((acc, b) => acc + b.amountPaise, 0);
  const budgetSpentPct = totalBudgetPaise > 0
    ? Math.min(100, Math.round((periodExpense / totalBudgetPaise) * 100))
    : 0;

  return (
    <div className="mx-2 md:mx-0 my-3 select-none">
      {/* 4-Card Futuristic Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Net Cash Flow / Savings Card (Spotlight Featured Card) */}
        <div className="glass-card-featured rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-[#94B5B0] mb-1.5">
            <span className="font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19E6C8] shadow-[0_0_8px_#19E6C8] animate-pulse" />
              Net Savings
            </span>
            <div className="p-1.5 rounded-xl bg-teal-500/10 text-[#19E6C8] border border-teal-500/20">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl lg:text-3xl font-black font-display truncate tracking-tight ${netColorClass}`}>
            {formatInr(periodNet, opts)}
          </div>
          <div className="mt-2 text-[11px] text-[#94B5B0] flex items-center justify-between font-medium">
            <span>Savings Rate:</span>
            <span className="font-bold text-[#19E6C8] font-mono">{savingsRate}%</span>
          </div>
        </div>

        {/* 2. Income Card */}
        <div className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:border-teal-400/40 transition-all">
          <div className="flex items-center justify-between text-xs text-[#94B5B0] mb-1.5">
            <span className="font-bold uppercase tracking-wider text-[#94B5B0] flex items-center gap-1.5 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19E6C8]" />
              Inflow
            </span>
            <div className="p-1.5 rounded-xl bg-teal-500/10 text-[#19E6C8] border border-teal-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#19E6C8] font-display truncate text-glow-teal">
            {formatInr(periodIncome, opts)}
          </div>
          <div className="mt-2 text-[11px] text-[#5B7B76] flex items-center gap-1 font-medium font-mono">
            <ArrowUpRight className="w-3 h-3 text-[#19E6C8]" />
            <span>Salary & Deposits</span>
          </div>
        </div>

        {/* 3. Expense Card */}
        <div className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#FF6B6B]/40 transition-all">
          <div className="flex items-center justify-between text-xs text-[#94B5B0] mb-1.5">
            <span className="font-bold uppercase tracking-wider text-[#94B5B0] flex items-center gap-1.5 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />
              Outflow
            </span>
            <div className="p-1.5 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#FF6B6B] font-display truncate text-glow-coral">
            {periodExpense > 0 ? `-${formatInr(periodExpense, opts)}` : '₹0'}
          </div>
          <div className="mt-2 text-[11px] text-[#5B7B76] flex items-center gap-1 font-medium font-mono">
            <ArrowDownRight className="w-3 h-3 text-[#FF6B6B]" />
            <span>Spent this period</span>
          </div>
        </div>

        {/* 4. Budget Pace Card */}
        <div className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:border-teal-400/30 transition-all">
          <div className="flex items-center justify-between text-xs text-[#94B5B0] mb-1.5">
            <span className="font-bold uppercase tracking-wider text-[#94B5B0] flex items-center gap-1.5 font-mono text-[10px]">
              <Target className="w-3.5 h-3.5 text-[#19E6C8]" />
              Budget Pace
            </span>
            <button
              onClick={() => setShowInfo((p) => !p)}
              className="text-[#5B7B76] hover:text-[#19E6C8] p-0.5 transition-colors cursor-pointer"
              title="Calculation rules"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="text-xl sm:text-2xl font-black text-white font-display">
              {budgetSpentPct}%
            </div>
            <div className="text-[11px] text-[#5B7B76] font-mono">
              {totalBudgetPaise > 0 ? `of ${formatInr(totalBudgetPaise, { showDecimals: false })}` : 'No budget set'}
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2">
            <ProgressBar value={budgetSpentPct} variant="dynamic" size="sm" />
          </div>
        </div>
      </div>

      {/* Info Popout */}
      {showInfo && (
        <div className="mt-3 p-4 rounded-2xl bg-[#061817]/90 border border-teal-500/20 text-xs text-[#94B5B0] backdrop-blur-xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between font-semibold text-white mb-1.5">
            <span>Calculation Rules</span>
            <button onClick={() => setShowInfo(false)} className="text-[#5B7B76] hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="space-y-1 text-[#5B7B76] list-disc pl-4 leading-relaxed">
            <li>Transfers between wallets are excluded from Income and Expense to prevent double-counting.</li>
            <li>Transfer fees (if any) are counted as Expenses under "Fees".</li>
            <li>Net Cash Flow = Total Inflows - Total Outflows.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
