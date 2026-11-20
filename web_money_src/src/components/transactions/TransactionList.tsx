import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Copy,
  Layers,
  FolderSync,
  X,
  PlusCircle,
  CheckCheck,
  TrendingDown,
  Wallet as WalletIcon,
  ArrowRightLeft,
  PieChart,
  Sparkles,
  PiggyBank,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { Record } from '../../types/money';
import { OverviewCard } from './OverviewCard';
import { TransactionStatisticsGraph } from './TransactionStatisticsGraph';
import { TransactionRow } from './TransactionRow';
import { formatTransactionDateTime } from '../../utils/dateUtils';
import { formatInr } from '../../utils/currency';

interface DayGroup {
  dayKey: string;
  dayNumber: string;
  weekdayStr: string;
  monthYearStr: string;
  records: Record[];
  dayNetPaise: number;
}

export const TransactionList: React.FC = () => {
  const {
    filteredRecords,
    records,
    periodExpense,
    openAddRecord,
    bulkDeleteRecords,
    bulkUpdateRecords,
    updateRecord,
    duplicateRecord,
    categories,
    wallets,
    walletBalances,
    budgets,
    showToast,
    settings,
  } = useMoney();

  // Multi-select state
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Category and Wallet change picker modal for bulk actions
  const [bulkCategoryPickerOpen, setBulkCategoryPickerOpen] = useState<boolean>(false);
  const [bulkWalletPickerOpen, setBulkWalletPickerOpen] = useState<boolean>(false);
  const [bulkBudgetPickerOpen, setBulkBudgetPickerOpen] = useState<boolean>(false);

  // Group records by day
  const dayGroups = useMemo(() => {
    const groupsMap = new Map<string, DayGroup>();

    for (const r of filteredRecords) {
      const { dayNumber, weekdayStr, monthYearStr } = formatTransactionDateTime(r.dateTime);
      const dayKey = r.dateTime.split('T')[0];

      if (!groupsMap.has(dayKey)) {
        groupsMap.set(dayKey, {
          dayKey,
          dayNumber,
          weekdayStr,
          monthYearStr,
          records: [],
          dayNetPaise: 0,
        });
      }

      const grp = groupsMap.get(dayKey)!;
      grp.records.push(r);

      // Add to day's net total (income - expense - fee)
      if (r.type === 'income') {
        grp.dayNetPaise += r.amountPaise;
      } else if (r.type === 'expense') {
        grp.dayNetPaise -= r.amountPaise;
      } else if (r.type === 'transfer' && r.feePaise) {
        grp.dayNetPaise -= r.feePaise;
      }
    }

    return Array.from(groupsMap.values());
  }, [filteredRecords]);

  // Desktop Intelligence: Top Expense Categories
  const topExpenseCategories = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filteredRecords) {
      if (r.type === 'expense') {
        map.set(r.categoryId, (map.get(r.categoryId) || 0) + r.amountPaise);
      }
    }
    return Array.from(map.entries())
      .map(([catId, amountPaise]) => {
        const cat = categories.find((c) => c.id === catId);
        return {
          category: cat || { name: 'Others', color: '#64748b' },
          amountPaise,
          percentage: periodExpense > 0 ? Math.round((amountPaise / periodExpense) * 100) : 0,
        };
      })
      .sort((a, b) => b.amountPaise - a.amountPaise)
      .slice(0, 5);
  }, [filteredRecords, categories, periodExpense]);

  // Desktop Intelligence: Key stats
  const desktopInsights = useMemo(() => {
    const expenseRecords = filteredRecords.filter((r) => r.type === 'expense');
    const maxExpense = expenseRecords.reduce((max, r) => (r.amountPaise > max ? r.amountPaise : max), 0);
    const avgExpense = expenseRecords.length > 0 ? Math.round(periodExpense / expenseRecords.length) : 0;
    return {
      totalCount: filteredRecords.length,
      maxExpense,
      avgExpense,
    };
  }, [filteredRecords, periodExpense]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) setIsSelectMode(false);
      return next;
    });
  };

  const handleLongPress = (id: string) => {
    setIsSelectMode(true);
    setSelectedIds(new Set([id]));
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length) {
      setSelectedIds(new Set());
      setIsSelectMode(false);
    } else {
      setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    await bulkDeleteRecords(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handleBulkDuplicate = async () => {
    for (const id of Array.from(selectedIds)) {
      const rec = filteredRecords.find((r) => r.id === id);
      if (rec) await duplicateRecord(rec);
    }
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handleBulkCategoryChange = async (catId: string) => {
    await bulkUpdateRecords(Array.from(selectedIds), { categoryId: catId });
    setBulkCategoryPickerOpen(false);
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handleBulkWalletChange = async (walId: string) => {
    await bulkUpdateRecords(Array.from(selectedIds), { walletId: walId });
    setBulkWalletPickerOpen(false);
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handleBulkBudgetAssign = async (budgetId: string) => {
    for (const id of Array.from(selectedIds)) {
      const rec = records.find((r) => r.id === id);
      const existing = rec?.budgetIds || [];
      const updated = existing.includes(budgetId)
        ? existing.filter((b) => b !== budgetId)
        : [...existing, budgetId];
      await updateRecord(id, { budgetIds: updated });
    }
    showToast({ type: 'success', text: `Updated budgets for ${selectedIds.size} records` });
    setBulkBudgetPickerOpen(false);
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent overflow-y-auto px-0 md:px-6 py-0 md:py-4">
      {/* 1. Period Overview Cards (4 Cards across on desktop) */}
      <OverviewCard />

      {/* 2. Responsive Split Body: Left 8 Cols (List), Right 4 Cols (Desktop Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        {/* Left Column: Transactions Timeline */}
        <div className="lg:col-span-8 flex flex-col min-w-0">
          {/* Financial Statistics Graph placed above transactions (replaces Quick Add) */}
          <TransactionStatisticsGraph />

          {/* Bulk Action Bar (when selecting items) */}
          {isSelectMode && (
            <div className="mx-4 md:mx-0 mb-3 px-4 py-2.5 glass-card bg-[#061817]/90 border border-teal-500/30 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-150 shadow-[0_0_20px_rgba(25,230,200,0.15)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-[#19E6C8] hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>
                    {selectedIds.size === filteredRecords.length ? 'Deselect All' : 'Select All'}
                  </span>
                </button>
                <span className="text-xs text-[#94B5B0] font-mono">
                  ({selectedIds.size} selected)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setBulkCategoryPickerOpen(true)}
                  className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-[#19E6C8] border border-teal-500/20 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Change Category"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Category</span>
                </button>

                <button
                  onClick={() => setBulkWalletPickerOpen(true)}
                  className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-[#19E6C8] border border-teal-500/20 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Change Wallet"
                >
                  <FolderSync className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Wallet</span>
                </button>

                <button
                  onClick={() => setBulkBudgetPickerOpen(true)}
                  className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-[#19E6C8] border border-teal-500/20 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Assign Budget"
                >
                  <PiggyBank className="w-3.5 h-3.5 text-[#19E6C8]" />
                  <span className="hidden sm:inline">Budget</span>
                </button>

                <button
                  onClick={handleBulkDuplicate}
                  className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-[#19E6C8] border border-teal-500/20 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Duplicate selected"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleBulkDelete}
                  className="p-1.5 rounded-lg bg-[#FF6B6B]/15 hover:bg-[#FF6B6B]/30 text-[#FF6B6B] border border-[#FF6B6B]/30 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Delete selected"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Transactions List or Empty State */}
          {filteredRecords.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center select-none glass-card rounded-3xl mx-4 md:mx-0 border border-teal-500/20">
              <div className="w-20 h-20 rounded-3xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center mb-4 text-[#19E6C8] shadow-[0_0_25px_rgba(25,230,200,0.2)]">
                <PlusCircle className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-[#F4FFFD]">No records in this period</h3>
              <p className="text-xs text-[#94B5B0] max-w-xs mt-1 mb-6 leading-relaxed">
                Log your income, expenses, or transfers using the button below.
              </p>
              <button
                onClick={() => openAddRecord()}
                className="px-5 py-2.5 rounded-full bg-[#19E6C8] hover:bg-[#2DD4BF] active:scale-95 text-[#030807] text-xs font-bold shadow-[0_0_20px_rgba(25,230,200,0.4)] transition-all cursor-pointer"
              >
                Add Your First Record
              </button>
            </div>
          ) : (
            <div className="space-y-4 pb-16">
              {dayGroups.map((grp) => {
                const isDayNetPos = grp.dayNetPaise >= 0;
                const dayNetColor = isDayNetPos ? 'text-[#19E6C8] text-glow-teal' : 'text-[#FF6B6B] text-glow-coral';
                const dayNetText = isDayNetPos
                  ? `+${formatInr(grp.dayNetPaise, opts)}`
                  : `-${formatInr(Math.abs(grp.dayNetPaise), opts)}`;

                return (
                  <div
                    key={grp.dayKey}
                    className="glass-card rounded-2xl border border-teal-500/15 overflow-hidden mx-4 md:mx-0 shadow-sm"
                  >
                    {/* Day Header */}
                    <div className="px-4 py-2.5 bg-[#061817]/80 border-b border-teal-500/15 flex items-center justify-between select-none backdrop-blur-md">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-2xl font-black text-[#F4FFFD] font-display leading-none">
                          {grp.dayNumber}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-[#94B5B0] font-medium">
                          <span className="font-bold text-white">{grp.weekdayStr}</span>
                          <span className="text-[#5B7B76]">•</span>
                          <span className="text-[#94B5B0]">{grp.monthYearStr}</span>
                        </div>
                      </div>

                      <span className={`text-xs sm:text-sm font-bold font-mono ${dayNetColor}`}>
                        {dayNetText}
                      </span>
                    </div>

                    {/* Day's Records */}
                    <div className="divide-y divide-teal-500/10">
                      {grp.records.map((r) => (
                        <TransactionRow
                          key={r.id}
                          record={r}
                          isSelectMode={isSelectMode}
                          isSelected={selectedIds.has(r.id)}
                          onToggleSelect={handleToggleSelect}
                          onLongPress={handleLongPress}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Desktop Intelligence Sidebar (Visible on Laptop/Desktop) */}
        <div className="hidden lg:flex flex-col gap-5 lg:col-span-4 select-none">
          {/* 1. Top Spending Categories Card */}
          <div className="p-4 rounded-3xl glass-card border border-teal-500/15 shadow-lg">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-[#F4FFFD] uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-[#19E6C8]" />
                Top Spending
              </span>
              <span className="text-[11px] text-[#5B7B76] font-mono">This Period</span>
            </div>

            {topExpenseCategories.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#5B7B76]">
                No expense data recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {topExpenseCategories.map((item) => (
                  <div key={item.category.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px]"
                          style={{ backgroundColor: item.category.color, boxShadow: `0 0 8px ${item.category.color}80` }}
                        />
                        <span className="text-[#94B5B0] font-medium">{item.category.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[#5B7B76] text-[11px]">{item.percentage}%</span>
                        <span className="font-bold text-[#F4FFFD]">
                          {formatInr(item.amountPaise, { showDecimals: false })}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-[#030707] border border-teal-500/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 shadow-[0_0_8px]"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.category.color,
                          boxShadow: `0 0 8px ${item.category.color}`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Wallets Quick Balances Snapshot */}
          <div className="p-4 rounded-3xl glass-card border border-teal-500/15 shadow-lg">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-[#F4FFFD] uppercase tracking-wider flex items-center gap-1.5">
                <WalletIcon className="w-3.5 h-3.5 text-[#19E6C8]" />
                Wallets & Accounts
              </span>
              <button
                onClick={() => openAddRecord({ type: 'transfer' })}
                className="text-[11px] text-[#19E6C8] hover:text-[#2DD4BF] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Transfer</span>
              </button>
            </div>

            <div className="space-y-2">
              {wallets.map((w) => {
                const bal = walletBalances.get(w.id) ?? w.startingBalancePaise;
                const isNegative = bal < 0;
                return (
                  <div
                    key={w.id}
                    className="p-2.5 rounded-2xl bg-[#061817]/60 border border-teal-500/15 flex items-center justify-between hover:border-teal-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_6px]"
                        style={{ backgroundColor: w.color, boxShadow: `0 0 6px ${w.color}80` }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#F4FFFD]">{w.name}</div>
                        <div className="text-[10px] text-[#5B7B76] uppercase font-mono">{w.type}</div>
                      </div>
                    </div>
                    <div
                      className={`text-xs font-bold font-mono ${
                        isNegative ? 'text-[#FF6B6B] text-glow-coral' : 'text-[#F4FFFD]'
                      }`}
                    >
                      {formatInr(bal, opts)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Monthly Metrics & Average Spend */}
          <div className="p-4 rounded-3xl glass-card border border-teal-500/20 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-[#19E6C8] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#19E6C8]" />
              <span className="tracking-wide">Spending Insights</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-[#061817]/70 border border-teal-500/15">
                <div className="text-[10px] font-mono text-[#94B5B0] uppercase">Avg Expense</div>
                <div className="text-sm font-bold font-mono text-[#F4FFFD] mt-0.5">
                  {formatInr(desktopInsights.avgExpense, { showDecimals: false })}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#061817]/70 border border-teal-500/15">
                <div className="text-[10px] font-mono text-[#94B5B0] uppercase">Peak Expense</div>
                <div className="text-sm font-bold font-mono text-[#FF6B6B] mt-0.5">
                  {formatInr(desktopInsights.maxExpense, { showDecimals: false })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Category Picker Modal */}
      {bulkCategoryPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#061817]/95 border border-teal-500/25 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[80vh] flex flex-col backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-teal-500/15">
              <h4 className="text-sm font-bold text-white">Select New Category</h4>
              <button
                onClick={() => setBulkCategoryPickerOpen(false)}
                className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleBulkCategoryChange(c.id)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-teal-950/40 flex items-center gap-3 text-xs text-[#F4FFFD] transition-colors cursor-pointer"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Wallet Picker Modal */}
      {bulkWalletPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#061817]/95 border border-teal-500/25 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[80vh] flex flex-col backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-teal-500/15">
              <h4 className="text-sm font-bold text-white">Select New Wallet</h4>
              <button
                onClick={() => setBulkWalletPickerOpen(false)}
                className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {wallets.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleBulkWalletChange(w.id)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-teal-950/40 flex items-center gap-3 text-xs text-[#F4FFFD] transition-colors cursor-pointer"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: w.color }}
                  />
                  <span>{w.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Budget Picker Modal */}
      {bulkBudgetPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#061817]/95 border border-teal-500/25 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[80vh] flex flex-col backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-teal-500/15">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-[#19E6C8]" />
                <span>Toggle Budget for Selection</span>
              </h4>
              <button
                onClick={() => setBulkBudgetPickerOpen(false)}
                className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {budgets.length === 0 ? (
                <p className="text-xs text-[#5B7B76] py-4 text-center">No budgets created yet.</p>
              ) : (
                budgets.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleBulkBudgetAssign(b.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-teal-950/40 flex items-center justify-between text-xs text-[#F4FFFD] transition-colors cursor-pointer"
                  >
                    <span className="font-semibold">{b.name}</span>
                    <span className="text-[10px] text-[#94B5B0] uppercase font-mono">{b.period}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
