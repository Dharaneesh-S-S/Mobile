import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, Plus, PiggyBank, Search, X } from 'lucide-react';
import { Budget } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';

interface BudgetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBudgetIds: string[];
  onToggleBudget: (budgetId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const BudgetSelectorModal: React.FC<BudgetSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedBudgetIds,
  onToggleBudget,
  onSelectAll,
  onClearAll,
}) => {
  const { budgets, filteredRecords, openBudgetModal, settings } = useMoney();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  // Calculate spent amount for each budget in current period
  const budgetStats = useMemo(() => {
    return budgets.map((b) => {
      let spentPaise = 0;
      for (const r of filteredRecords) {
        if (r.type === 'expense') {
          const hasBudgetIds = Array.isArray(r.budgetIds);
          const isExplicit = hasBudgetIds && r.budgetIds!.includes(b.id);
          const isCategoryMatch =
            !hasBudgetIds &&
            (b.categoryIds.length === 0 || b.categoryIds.includes(r.categoryId));

          if (isExplicit || isCategoryMatch) {
            spentPaise += r.amountPaise;
          }
        }
      }
      const pct = b.amountPaise > 0 ? (spentPaise / b.amountPaise) * 100 : 0;
      const remainingPaise = Math.max(0, b.amountPaise - spentPaise);
      const isOver = spentPaise > b.amountPaise;

      return {
        budget: b,
        spentPaise,
        remainingPaise,
        pct: Math.min(100, pct),
        actualPct: pct,
        isOver,
      };
    });
  }, [budgets, filteredRecords]);

  if (!isOpen) return null;

  const filteredStats = budgetStats.filter(({ budget }) =>
    budget.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16] flex flex-col text-slate-100 animate-in slide-in-from-right duration-200 select-none">
      {/* Top Header */}
      <div className="px-4 py-3.5 border-b border-teal-500/15 flex items-center justify-between shrink-0 bg-[#061817]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1.5 rounded-xl text-[#94B5B0] hover:text-white hover:bg-teal-950/40 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-[#19E6C8]" />
              <span>Select Budgets</span>
            </h2>
            <p className="text-[11px] text-[#94B5B0]">
              Multiple budgets can be selected for this transaction
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] text-black font-bold text-xs shadow-[0_0_15px_rgba(25,230,200,0.3)] transition-all cursor-pointer"
        >
          Done ({selectedBudgetIds.length})
        </button>
      </div>

      {/* Toolbar: Search, Select All, Clear All, Add Budget */}
      <div className="p-4 border-b border-teal-500/10 space-y-3 bg-[#030807]/60">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5B7B76]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search budgets..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#19E6C8]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-[#19E6C8] border border-teal-500/25 font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <button
            type="button"
            onClick={() => openBudgetModal('new')}
            className="text-[#19E6C8] hover:underline font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Budget</span>
          </button>
        </div>
      </div>

      {/* Budget List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredStats.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#19E6C8] flex items-center justify-center mx-auto shadow-inner">
              <PiggyBank className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">No budgets found</p>
              <p className="text-xs text-[#94B5B0] mt-1 max-w-xs mx-auto">
                {searchQuery
                  ? 'No budget matches your search query.'
                  : 'Create a budget to track spending limits across categories.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBudgetModal('new')}
              className="px-4 py-2 rounded-xl bg-teal-500/20 text-[#19E6C8] border border-teal-500/30 text-xs font-semibold hover:bg-teal-500/30 transition-all cursor-pointer"
            >
              + Create First Budget
            </button>
          </div>
        ) : (
          filteredStats.map(({ budget, spentPaise, remainingPaise, pct, actualPct, isOver }) => {
            const isSelected = selectedBudgetIds.includes(budget.id);
            const barColor = isOver
              ? 'bg-[#FF6B6B] shadow-[0_0_8px_#FF6B6B]'
              : 'bg-[#19E6C8] shadow-[0_0_8px_#19E6C8]';

            return (
              <div
                key={budget.id}
                onClick={() => onToggleBudget(budget.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                  isSelected
                    ? 'bg-teal-500/10 border-teal-500/50 shadow-[0_0_20px_rgba(25,230,200,0.15)]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#19E6C8] text-black shadow-[0_0_10px_rgba(25,230,200,0.5)]'
                          : 'border border-slate-700 bg-slate-800/60'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-white truncate">
                        {budget.name}
                      </span>
                      <span className="text-[10px] text-[#94B5B0] capitalize">
                        {budget.period} budget
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-xs font-bold font-display text-white">
                      {formatInr(spentPaise, opts)} / {formatInr(budget.amountPaise, opts)}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-medium ${
                        isOver ? 'text-[#FF6B6B]' : 'text-[#19E6C8]'
                      }`}
                    >
                      {isOver
                        ? `Over by ${formatInr(spentPaise - budget.amountPaise, opts)}`
                        : `${formatInr(remainingPaise, opts)} remaining`}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-teal-500/15 bg-[#061817]/90 flex items-center justify-between">
        <span className="text-xs text-[#94B5B0] font-medium font-mono">
          {selectedBudgetIds.length} of {budgets.length} budget(s) selected
        </span>
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] text-black font-bold text-xs shadow-[0_0_20px_rgba(25,230,200,0.4)] transition-all cursor-pointer"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};
