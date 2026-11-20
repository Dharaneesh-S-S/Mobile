import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Eye,
  EyeOff,
  Plus,
  Wallet as WalletIcon,
  PiggyBank,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';
import { DynamicIcon } from '../common/IconHelper';
import { WalletDetailModal } from './WalletDetailModal';

export const WalletView: React.FC = () => {
  const {
    totalAccountBalance,
    isBalanceHidden,
    toggleHideBalance,
    wallets,
    walletBalances,
    budgets,
    filteredRecords,
    activeWalletForDetail,
    openWalletDetail,
    openBudgetModal,
    settings,
  } = useMoney();

  // Collapsible section toggles
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Budget calculations: spent in period vs budget amount
  const budgetStats = useMemo(() => {
    return budgets.map((b) => {
      let spentPaise = 0;
      let transactionCount = 0;
      for (const r of filteredRecords) {
        if (r.type === 'expense') {
          const hasBudgetIds = Array.isArray(r.budgetIds);
          const isExplicit = hasBudgetIds && r.budgetIds!.includes(b.id);
          const isCategoryMatch =
            !hasBudgetIds &&
            (b.categoryIds.length === 0 || b.categoryIds.includes(r.categoryId));

          if (isExplicit || isCategoryMatch) {
            spentPaise += r.amountPaise;
            transactionCount++;
          }
        }
      }
      const pct = b.amountPaise > 0 ? (spentPaise / b.amountPaise) * 100 : 0;
      const remainingPaise = Math.max(0, b.amountPaise - spentPaise);
      const isOver = spentPaise > b.amountPaise;
      const isNearLimit = pct >= b.alertThresholdPercent;

      return {
        budget: b,
        spentPaise,
        transactionCount,
        pct: Math.min(100, pct),
        actualPct: pct,
        remainingPaise,
        isOver,
        isNearLimit,
      };
    });
  }, [budgets, filteredRecords]);

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090d16] p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto select-none pb-24">
      {/* 1. Account Balance Hero Card (Net Worth) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-950 border border-teal-500/20 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
          <span className="uppercase tracking-wider font-semibold">Net Worth (Total Balance)</span>
          <button
            onClick={toggleHideBalance}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
          >
            {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight mt-1">
          {isBalanceHidden ? '₹ ••••••' : formatInr(totalAccountBalance, opts)}
        </div>
      </div>

      {/* 2. WALLET SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => toggleSection('wallets')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer"
          >
            <WalletIcon className="w-4 h-4 text-[#19E6C8]" />
            <span>Wallets ({wallets.filter((w) => !w.isArchived).length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                collapsedSections['wallets'] ? '-rotate-90' : ''
              }`}
            />
          </button>
        </div>

        {!collapsedSections['wallets'] && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wallets
              .filter((w) => !w.isArchived)
              .map((w) => {
                const bal = walletBalances.get(w.id) || 0;
                return (
                  <div
                    key={w.id}
                    onClick={() => openWalletDetail(w)}
                    className="p-4 rounded-3xl bg-slate-900 hover:bg-slate-850 active:bg-slate-800 border border-slate-800 hover:border-teal-500/30 cursor-pointer flex flex-col justify-between shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{
                          backgroundColor: `${w.color}22`,
                          border: `1.5px solid ${w.color}`,
                        }}
                      >
                        <DynamicIcon name={w.icon} className="w-5 h-5" color={w.color} />
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                        {w.type}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-300 truncate">{w.name}</span>
                      <span className="text-base sm:text-lg font-black text-white font-display mt-0.5">
                        {isBalanceHidden ? '₹ ••••' : formatInr(bal, opts)}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* Dashed Add Wallet Tile */}
            <div
              onClick={() =>
                openWalletDetail({
                  id: `wal-${Date.now()}`,
                  accountId: wallets[0]?.accountId || 'acc-personal',
                  name: 'New Wallet',
                  type: 'bank',
                  startingBalancePaise: 0,
                  color: '#10b981',
                  icon: 'CreditCard',
                  currency: 'INR',
                  includeInTotal: true,
                  createdAt: new Date().toISOString(),
                })
              }
              className="p-4 rounded-3xl border-2 border-dashed border-slate-800 hover:border-teal-500/40 hover:bg-slate-900/40 cursor-pointer flex flex-col items-center justify-center min-h-[108px] text-slate-400 hover:text-white transition-all group"
            >
              <div className="w-9 h-9 rounded-2xl bg-slate-800/60 group-hover:bg-teal-500/20 text-slate-400 group-hover:text-[#19E6C8] flex items-center justify-center mb-1 transition-colors">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-semibold">Add Wallet</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. BUDGET SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => toggleSection('budgets')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer"
          >
            <PiggyBank className="w-4 h-4 text-emerald-400" />
            <span>Budgets ({budgets.length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                collapsedSections['budgets'] ? '-rotate-90' : ''
              }`}
            />
          </button>
          <button
            onClick={() => openBudgetModal('new')}
            className="text-xs text-[#19E6C8] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {!collapsedSections['budgets'] && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetStats.length === 0 ? (
              <div
                onClick={() => openBudgetModal('new')}
                className="col-span-full p-6 rounded-3xl border-2 border-dashed border-slate-800 hover:border-teal-500/40 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-slate-400 hover:text-white transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Set Monthly Budget</span>
              </div>
            ) : (
              budgetStats.map(({ budget, spentPaise, transactionCount, pct, actualPct, remainingPaise, isOver, isNearLimit }) => {
                const barColor = isOver ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500';
                return (
                  <div
                    key={budget.id}
                    onClick={() => openBudgetModal(budget)}
                    className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-100">{budget.name}</span>
                      <span className="text-xs font-bold font-display text-slate-300">
                        {formatInr(spentPaise, opts)} / {formatInr(budget.amountPaise, opts)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden my-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{actualPct.toFixed(0)}% spent{transactionCount > 0 ? ` (${transactionCount} txns)` : ''}</span>
                      <span className={isOver ? 'text-red-400 font-bold' : 'text-emerald-400 font-medium'}>
                        {isOver
                          ? `Over by ${formatInr(spentPaise - budget.amountPaise, opts)}`
                          : `${formatInr(remainingPaise, opts)} left`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Wallet Detail Modal */}
      <WalletDetailModal
        wallet={activeWalletForDetail}
        onClose={() => openWalletDetail(null)}
      />
    </div>
  );
};
