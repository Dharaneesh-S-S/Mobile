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
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { Record } from '../../types/money';
import { OverviewCard } from './OverviewCard';
import { QuickAddBar } from './QuickAddBar';
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
    periodExpense,
    openAddRecord,
    bulkDeleteRecords,
    bulkUpdateRecords,
    duplicateRecord,
    categories,
    wallets,
    walletBalances,
    settings,
  } = useMoney();

  // Multi-select state
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Category and Wallet change picker modal for bulk actions
  const [bulkCategoryPickerOpen, setBulkCategoryPickerOpen] = useState<boolean>(false);
  const [bulkWalletPickerOpen, setBulkWalletPickerOpen] = useState<boolean>(false);

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

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090d16] overflow-y-auto px-0 md:px-6 py-0 md:py-4">
      {/* 1. Period Overview Cards (4 Cards across on desktop) */}
      <OverviewCard />

      {/* 2. Responsive Split Body: Left 8 Cols (List), Right 4 Cols (Desktop Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        {/* Left Column: Transactions Timeline */}
        <div className="lg:col-span-8 flex flex-col min-w-0">
          {/* Quick Add Bar */}
          <div className="mb-3">
            <QuickAddBar />
          </div>

          {/* Bulk Action Bar (when selecting items) */}
          {isSelectMode && (
            <div className="mx-4 md:mx-0 mb-3 px-4 py-2.5 bg-blue-950/80 border border-blue-800/80 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1.5"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>
                    {selectedIds.size === filteredRecords.length ? 'Deselect All' : 'Select All'}
                  </span>
                </button>
                <span className="text-xs text-blue-200 font-mono">
                  ({selectedIds.size} selected)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setBulkCategoryPickerOpen(true)}
                  className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs flex items-center gap-1"
                  title="Change Category"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Category</span>
                </button>

                <button
                  onClick={() => setBulkWalletPickerOpen(true)}
                  className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs flex items-center gap-1"
                  title="Change Wallet"
                >
                  <FolderSync className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Wallet</span>
                </button>

                <button
                  onClick={handleBulkDuplicate}
                  className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs flex items-center gap-1"
                  title="Duplicate selected"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleBulkDelete}
                  className="p-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 text-xs flex items-center gap-1"
                  title="Delete selected"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Transactions List or Empty State */}
          {filteredRecords.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center select-none bg-slate-900/30 border border-slate-800/60 rounded-3xl mx-4 md:mx-0">
              <div className="w-20 h-20 rounded-3xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center mb-4 text-blue-400 shadow-inner">
                <PlusCircle className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-slate-200">No records in this period</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1 mb-6 leading-relaxed">
                Log your income, expenses, or transfers using the button below.
              </p>
              <button
                onClick={() => openAddRecord()}
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-glow-blue transition-all"
              >
                Add Your First Record
              </button>
            </div>
          ) : (
            <div className="space-y-4 pb-16">
              {dayGroups.map((grp) => {
                const isDayNetPos = grp.dayNetPaise >= 0;
                const dayNetColor = isDayNetPos ? 'text-blue-400' : 'text-red-400';
                const dayNetText = isDayNetPos
                  ? `+${formatInr(grp.dayNetPaise, opts)}`
                  : `-${formatInr(Math.abs(grp.dayNetPaise), opts)}`;

                return (
                  <div
                    key={grp.dayKey}
                    className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden mx-4 md:mx-0 shadow-sm"
                  >
                    {/* Day Header */}
                    <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/60 flex items-center justify-between select-none">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-2xl font-black text-slate-100 font-display leading-none">
                          {grp.dayNumber}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <span className="font-bold text-slate-200">{grp.weekdayStr}</span>
                          <span className="text-slate-500">•</span>
                          <span>{grp.monthYearStr}</span>
                        </div>
                      </div>

                      <span className={`text-xs sm:text-sm font-bold font-display ${dayNetColor}`}>
                        {dayNetText}
                      </span>
                    </div>

                    {/* Day's Records */}
                    <div className="divide-y divide-slate-800/40">
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
          <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-blue-400" />
                Top Spending
              </span>
              <span className="text-[11px] text-slate-500 font-mono">This Period</span>
            </div>

            {topExpenseCategories.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No expense data recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {topExpenseCategories.map((item) => (
                  <div key={item.category.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.category.color }}
                        />
                        <span className="text-slate-300 font-medium">{item.category.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400 text-[11px]">{item.percentage}%</span>
                        <span className="font-bold text-slate-200">
                          {formatInr(item.amountPaise, { showDecimals: false })}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.category.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Wallets Quick Balances Snapshot */}
          <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <WalletIcon className="w-3.5 h-3.5 text-emerald-400" />
                Wallets & Accounts
              </span>
              <button
                onClick={() => openAddRecord({ type: 'transfer' })}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
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
                    className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between hover:border-slate-700/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: w.color }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{w.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{w.type}</div>
                      </div>
                    </div>
                    <div
                      className={`text-xs font-bold font-display ${
                        isNegative ? 'text-red-400' : 'text-slate-100'
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
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-[#10192e] border border-blue-900/30 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Spending Insights</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="text-[10px] text-slate-400">Avg Expense</div>
                <div className="text-sm font-bold font-display text-slate-200 mt-0.5">
                  {formatInr(desktopInsights.avgExpense, { showDecimals: false })}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="text-[10px] text-slate-400">Peak Expense</div>
                <div className="text-sm font-bold font-display text-slate-200 mt-0.5">
                  {formatInr(desktopInsights.maxExpense, { showDecimals: false })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Category Picker Modal */}
      {bulkCategoryPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white">Select New Category</h4>
              <button
                onClick={() => setBulkCategoryPickerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleBulkCategoryChange(c.id)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-3 text-xs text-slate-200"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white">Select New Wallet</h4>
              <button
                onClick={() => setBulkWalletPickerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {wallets.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleBulkWalletChange(w.id)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-3 text-xs text-slate-200"
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
    </div>
  );
};
