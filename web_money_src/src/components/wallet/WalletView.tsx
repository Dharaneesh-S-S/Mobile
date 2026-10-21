import React, { useState, useMemo } from 'react';
import {
  Settings,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Wallet as WalletIcon,
  PiggyBank,
  Target,
  Users,
  Repeat,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { Wallet, Budget, Goal, Debt, RecurringRule } from '../../types/money';
import { formatInr, formatCompactInr } from '../../utils/currency';
import { DynamicIcon } from '../common/IconHelper';
import { WalletDetailModal } from './WalletDetailModal';
import { BudgetModal } from './BudgetModal';
import { GoalModal } from './GoalModal';
import { DebtModal } from './DebtModal';
import { RecurringModal } from './RecurringModal';

export const WalletView: React.FC = () => {
  const {
    currentAccount,
    totalAccountBalance,
    isBalanceHidden,
    toggleHideBalance,
    wallets,
    walletBalances,
    budgets,
    goals,
    debts,
    recurringRules,
    filteredRecords,
    openSettings,
    openAccountSwitcher,
    activeWalletForDetail,
    openWalletDetail,
    editingBudget,
    openBudgetModal,
    closeBudgetModal,
    editingGoal,
    openGoalModal,
    closeGoalModal,
    editingDebt,
    openDebtModal,
    closeDebtModal,
    editingRecurring,
    openRecurringModal,
    closeRecurringModal,
    settings,
  } = useMoney();

  // Collapsible section toggles
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Create new wallet simple modal state
  const [isAddWalletOpen, setIsAddWalletOpen] = useState<boolean>(false);

  // Budget calculations: spent in period vs budget amount
  const budgetStats = useMemo(() => {
    return budgets.map((b) => {
      let spentPaise = 0;
      for (const r of filteredRecords) {
        if (r.type === 'expense') {
          if (b.categoryIds.length === 0 || b.categoryIds.includes(r.categoryId)) {
            spentPaise += r.amountPaise;
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
        pct: Math.min(100, pct),
        actualPct: pct,
        remainingPaise,
        isOver,
        isNearLimit,
      };
    });
  }, [budgets, filteredRecords]);

  // Debt totals
  const { totalOwe, totalOwed } = useMemo(() => {
    let owe = 0;
    let owed = 0;
    for (const d of debts) {
      if (!d.isSettled) {
        const paid = (d.payments || []).reduce((a, p) => a + p.amountPaise, 0);
        const rem = Math.max(0, d.amountPaise - paid);
        if (d.type === 'owe') owe += rem;
        else owed += rem;
      }
    }
    return { totalOwe: owe, totalOwed: owed };
  }, [debts]);

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090d16] p-4 space-y-5 overflow-y-auto select-none pb-24">
      {/* 1. Header: Account Switcher & Settings */}
      <div className="flex items-center justify-between">
        <button
          onClick={openAccountSwitcher}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 text-white font-bold text-sm transition-all"
        >
          <span>{currentAccount?.name || 'Personal'}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={openSettings}
          className="p-2.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all"
          title="App Settings"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Account Balance Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
          <span>Net Worth (Total Balance)</span>
          <button
            onClick={toggleHideBalance}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight mt-1">
          {isBalanceHidden ? '₹ ••••••' : formatInr(totalAccountBalance, opts)}
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/70 text-xs text-slate-400">
          <span>{wallets.filter((w) => !w.isArchived).length} Active Wallets</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">All INR Accounts Synced</span>
        </div>
      </div>

      {/* 3. WALLET SECTION (Manage (Count)) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => toggleSection('wallets')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider"
          >
            <WalletIcon className="w-4 h-4 text-blue-400" />
            <span>Wallets ({wallets.filter((w) => !w.isArchived).length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                collapsedSections['wallets'] ? '-rotate-90' : ''
              }`}
            />
          </button>
        </div>

        {!collapsedSections['wallets'] && (
          <div className="grid grid-cols-2 gap-3">
            {wallets
              .filter((w) => !w.isArchived)
              .map((w) => {
                const bal = walletBalances.get(w.id) || 0;
                return (
                  <div
                    key={w.id}
                    onClick={() => openWalletDetail(w)}
                    className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 active:bg-slate-800 border border-slate-800 hover:border-slate-700 cursor-pointer flex flex-col justify-between shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${w.color}22`,
                          border: `1.5px solid ${w.color}`,
                        }}
                      >
                        <DynamicIcon name={w.icon} className="w-4 h-4" color={w.color} />
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {w.type}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-300 truncate">{w.name}</span>
                      <span className="text-sm font-bold text-white font-display mt-0.5">
                        {isBalanceHidden ? '₹ ••••' : formatInr(bal, opts)}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* Dashed Add Wallet Tile */}
            <div
              onClick={() => openWalletDetail({
                id: `wal-${Date.now()}`,
                accountId: currentAccount?.id || 'acc-personal',
                name: 'New Wallet',
                type: 'bank',
                startingBalancePaise: 0,
                color: '#3b82f6',
                icon: 'CreditCard',
                currency: 'INR',
                includeInTotal: true,
                createdAt: new Date().toISOString(),
              })}
              className="p-3.5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 cursor-pointer flex flex-col items-center justify-center min-h-[96px] text-slate-400 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800/60 group-hover:bg-blue-600/20 text-slate-400 group-hover:text-blue-400 flex items-center justify-center mb-1 transition-colors">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-semibold">Add Wallet</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. BUDGET SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => toggleSection('budgets')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider"
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
            className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {!collapsedSections['budgets'] && (
          <div className="space-y-2.5">
            {budgetStats.length === 0 ? (
              <div
                onClick={() => openBudgetModal('new')}
                className="p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Budget</span>
              </div>
            ) : (
              budgetStats.map(({ budget, spentPaise, pct, actualPct, remainingPaise, isOver, isNearLimit }) => {
                const barColor = isOver ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500';
                return (
                  <div
                    key={budget.id}
                    onClick={() => openBudgetModal(budget)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer shadow-sm transition-all"
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
                      <span>{actualPct.toFixed(0)}% spent</span>
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

      {/* 5. GOAL SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => toggleSection('goals')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider"
          >
            <Target className="w-4 h-4 text-purple-400" />
            <span>Savings Goals ({goals.length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                collapsedSections['goals'] ? '-rotate-90' : ''
              }`}
            />
          </button>
          <button
            onClick={() => openGoalModal('new')}
            className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {!collapsedSections['goals'] && (
          <div className="space-y-2.5">
            {goals.length === 0 ? (
              <div
                onClick={() => openGoalModal('new')}
                className="p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Goal</span>
              </div>
            ) : (
              goals.map((g) => {
                const pct = g.targetAmountPaise > 0 ? (g.currentSavedPaise / g.targetAmountPaise) * 100 : 0;
                return (
                  <div
                    key={g.id}
                    onClick={() => openGoalModal(g)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${g.color}22`, border: `1.5px solid ${g.color}` }}
                        >
                          <DynamicIcon name={g.icon} className="w-3.5 h-3.5" color={g.color} />
                        </div>
                        <span className="text-xs font-bold text-slate-100 truncate">{g.name}</span>
                      </div>
                      <span className="text-xs font-bold font-display text-emerald-400">
                        {formatInr(g.currentSavedPaise, opts)} / {formatInr(g.targetAmountPaise, opts)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden my-2">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, pct)}%`, backgroundColor: g.color }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{pct.toFixed(0)}% reached</span>
                      <span>Target: {new Date(g.targetDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 6. DEBT SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => toggleSection('debts')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Debts & Loans ({debts.length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                collapsedSections['debts'] ? '-rotate-90' : ''
              }`}
            />
          </button>
          <button
            onClick={() => openDebtModal('new')}
            className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {!collapsedSections['debts'] && (
          <div className="space-y-2.5">
            {/* Quick summary chips */}
            {debts.length > 0 && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Owed to Me</span>
                  <span className="font-bold text-emerald-400 font-display">
                    {formatInr(totalOwed, opts)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">I Owe</span>
                  <span className="font-bold text-amber-400 font-display">
                    {formatInr(totalOwe, opts)}
                  </span>
                </div>
              </div>
            )}

            {debts.length === 0 ? (
              <div
                onClick={() => openDebtModal('new')}
                className="p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Debt</span>
              </div>
            ) : (
              debts.map((d) => {
                const paid = (d.payments || []).reduce((a, p) => a + p.amountPaise, 0);
                const rem = Math.max(0, d.amountPaise - paid);
                return (
                  <div
                    key={d.id}
                    onClick={() => openDebtModal(d)}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between shadow-sm transition-all"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-100 truncate">{d.person}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            d.type === 'owed'
                              ? 'bg-emerald-600/20 text-emerald-400'
                              : 'bg-amber-600/20 text-amber-400'
                          }`}
                        >
                          {d.type === 'owed' ? 'Receivable' : 'Payable'}
                        </span>
                        {d.isSettled && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                            Settled
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        {d.dueDate ? `Due: ${d.dueDate}` : `Date: ${d.date}`}
                      </span>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`text-xs sm:text-sm font-bold font-display ${
                          d.type === 'owed' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {formatInr(rem, opts)}
                      </span>
                      {paid > 0 && (
                        <span className="text-[10px] text-slate-400">
                          Paid: {formatInr(paid, opts)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 7. RECURRING SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => toggleSection('recurring')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider"
          >
            <Repeat className="w-4 h-4 text-blue-400" />
            <span>Recurring Rules ({recurringRules.length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                collapsedSections['recurring'] ? '-rotate-90' : ''
              }`}
            />
          </button>
          <button
            onClick={() => openRecurringModal('new')}
            className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {!collapsedSections['recurring'] && (
          <div className="space-y-2">
            {recurringRules.length === 0 ? (
              <div
                onClick={() => openRecurringModal('new')}
                className="p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Recurring Rule</span>
              </div>
            ) : (
              recurringRules.map((r) => (
                <div
                  key={r.id}
                  onClick={() => openRecurringModal(r)}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-100 truncate">{r.description}</span>
                    <span className="text-[11px] text-slate-400 capitalize mt-0.5">
                      {r.frequency} • Next: {new Date(r.nextDueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-bold font-display ${
                      r.type === 'income' ? 'text-blue-400' : 'text-red-400'
                    }`}
                  >
                    {r.type === 'income' ? '+' : '-'}
                    {formatInr(r.amountPaise, opts)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Wallet Detail Modal */}
      <WalletDetailModal
        wallet={activeWalletForDetail}
        onClose={() => openWalletDetail(null)}
      />

      {/* Budget Modal */}
      <BudgetModal
        budget={editingBudget}
        onClose={closeBudgetModal}
      />

      {/* Goal Modal */}
      <GoalModal
        goal={editingGoal}
        onClose={closeGoalModal}
      />

      {/* Debt Modal */}
      <DebtModal
        debt={editingDebt}
        onClose={closeDebtModal}
      />

      {/* Recurring Modal */}
      <RecurringModal
        rule={editingRecurring}
        onClose={closeRecurringModal}
      />
    </div>
  );
};
