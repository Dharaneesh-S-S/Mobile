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
    <div className="flex-1 flex flex-col min-h-0 bg-transparent px-3 sm:px-6 md:px-8 py-3 md:py-5 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto select-none pb-28">
      {/* 1. Account Balance Hero Card (Net Worth) */}
      <div className="glass-card-featured rounded-3xl p-5 sm:p-7 relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-[#94B5B0] mb-2">
          <span className="font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#19E6C8] shadow-[0_0_10px_#19E6C8] animate-pulse" />
            Net Worth (Total Balance)
          </span>
          <button
            onClick={toggleHideBalance}
            className="p-2 rounded-xl bg-teal-500/10 text-[#94B5B0] hover:text-[#19E6C8] border border-teal-500/20 hover:border-teal-400/40 transition-all cursor-pointer"
            title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
          >
            {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight text-glow-teal mt-1">
          {isBalanceHidden ? '₹ ••••••' : formatInr(totalAccountBalance, opts)}
        </div>
      </div>

      {/* 2. WALLET SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => toggleSection('wallets')}
            className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono cursor-pointer group"
          >
            <div className="p-1.5 rounded-xl bg-teal-500/10 text-[#19E6C8] border border-teal-500/20 group-hover:border-teal-500/40 transition-colors">
              <WalletIcon className="w-4 h-4" />
            </div>
            <span>Wallets ({wallets.filter((w) => !w.isArchived).length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#5B7B76] transition-transform ${
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
                    className="glass-card rounded-3xl p-5 hover:border-teal-400/40 hover:shadow-[0_0_30px_rgba(25,230,200,0.18)] cursor-pointer flex flex-col justify-between transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${w.color}22`,
                          border: `1.5px solid ${w.color}`,
                          boxShadow: `0 0 16px ${w.color}28`,
                        }}
                      >
                        <DynamicIcon name={w.icon} className="w-5 h-5" color={w.color} />
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-[#19E6C8] border border-teal-500/25">
                        {w.type}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-[#94B5B0] truncate group-hover:text-white transition-colors">
                        {w.name}
                      </span>
                      <span className="text-xl font-black text-white font-display mt-0.5 tracking-tight group-hover:text-[#19E6C8] group-hover:text-glow-teal transition-all">
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
              className="rounded-3xl border-2 border-dashed border-teal-500/20 hover:border-[#19E6C8] hover:bg-teal-500/5 cursor-pointer flex flex-col items-center justify-center min-h-[120px] text-[#94B5B0] hover:text-[#19E6C8] transition-all group p-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#061817] border border-teal-500/20 group-hover:border-[#19E6C8] text-[#5B7B76] group-hover:text-[#19E6C8] flex items-center justify-center mb-1.5 transition-all group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(25,230,200,0.3)]">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold font-mono">Add Wallet</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. BUDGET SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => toggleSection('budgets')}
            className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono cursor-pointer group"
          >
            <div className="p-1.5 rounded-xl bg-teal-500/10 text-[#19E6C8] border border-teal-500/20 group-hover:border-teal-500/40 transition-colors">
              <PiggyBank className="w-4 h-4" />
            </div>
            <span>Budgets ({budgets.length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#5B7B76] transition-transform ${
                collapsedSections['budgets'] ? '-rotate-90' : ''
              }`}
            />
          </button>
          <button
            onClick={() => openBudgetModal('new')}
            className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 text-[#19E6C8] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(25,230,200,0.15)]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Budget</span>
          </button>
        </div>

        {!collapsedSections['budgets'] && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetStats.length === 0 ? (
              <div
                onClick={() => openBudgetModal('new')}
                className="col-span-full p-8 rounded-3xl border-2 border-dashed border-teal-500/20 hover:border-[#19E6C8] hover:bg-teal-500/5 flex flex-col items-center justify-center gap-2 cursor-pointer text-[#94B5B0] hover:text-[#19E6C8] transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#061817] border border-teal-500/20 group-hover:border-[#19E6C8] text-[#5B7B76] group-hover:text-[#19E6C8] flex items-center justify-center mb-1 transition-all group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(25,230,200,0.3)]">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold font-mono">+ Set Monthly Budget</span>
              </div>
            ) : (
              budgetStats.map(({ budget, spentPaise, transactionCount, pct, actualPct, remainingPaise, isOver, isNearLimit }) => {
                const barColor = isOver
                  ? 'bg-[#FF6B6B] shadow-[0_0_10px_#FF6B6B]'
                  : isNearLimit
                  ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                  : 'bg-[#19E6C8] shadow-[0_0_10px_#19E6C8]';

                return (
                  <div
                    key={budget.id}
                    onClick={() => openBudgetModal(budget)}
                    className="glass-card rounded-3xl p-5 hover:border-teal-400/40 hover:shadow-[0_0_30px_rgba(25,230,200,0.15)] cursor-pointer shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white group-hover:text-[#19E6C8] transition-colors">
                        {budget.name}
                      </span>
                      <span className="text-xs font-bold font-mono text-[#94B5B0]">
                        <span className="text-white">{formatInr(spentPaise, opts)}</span> / {formatInr(budget.amountPaise, opts)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#030807] border border-teal-500/20 overflow-hidden my-2.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#5B7B76]">
                      <span>{actualPct.toFixed(0)}% spent{transactionCount > 0 ? ` (${transactionCount} txns)` : ''}</span>
                      <span className={isOver ? 'text-[#FF6B6B] font-bold' : 'text-[#19E6C8] font-medium'}>
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
