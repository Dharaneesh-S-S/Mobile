import React, { useState } from 'react';
import { X, Trash2, Bell, PiggyBank } from 'lucide-react';
import { db } from '../../db';
import { Budget } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { rupeesToPaise } from '../../utils/currency';

interface BudgetModalProps {
  budget: Budget | null | 'new';
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ budget, onClose }) => {
  const { currentAccount, categories, showToast } = useMoney();

  const isEditing = budget !== null && budget !== 'new';
  const existingBudget = isEditing ? (budget as Budget) : null;

  const [name, setName] = useState<string>(existingBudget?.name || '');
  const [amountInput, setAmountInput] = useState<string>(
    existingBudget ? (existingBudget.amountPaise / 100).toString() : '20000'
  );
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(existingBudget?.categoryIds || [])
  );
  const [rollover, setRollover] = useState<boolean>(existingBudget?.rollover ?? true);
  const [alertThreshold, setAlertThreshold] = useState<number>(
    existingBudget?.alertThresholdPercent || 80
  );

  if (!budget) return null;

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.size === expenseCategories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(expenseCategories.map((c) => c.id)));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const amountPaise = rupeesToPaise(parseFloat(amountInput) || 0);
    if (amountPaise <= 0) return;

    const payload: Budget = {
      id: existingBudget?.id || `bud-${Date.now()}`,
      accountId: currentAccount?.id || 'acc-personal',
      name: name.trim(),
      amountPaise,
      period,
      categoryIds: Array.from(selectedCategories),
      rollover,
      alertThresholdPercent: alertThreshold,
      createdAt: existingBudget?.createdAt || new Date().toISOString(),
    };

    await db.budgets.put(payload);
    showToast({ type: 'success', text: isEditing ? 'Budget updated' : 'Budget created' });
    onClose();
  };

  const handleDelete = async () => {
    if (!existingBudget) return;
    await db.budgets.delete(existingBudget.id);
    showToast({ type: 'info', text: 'Budget deleted' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-[#061817]/95 border border-teal-500/25 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 z-10 max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-teal-500/10 text-[#19E6C8] border border-teal-500/20">
              <PiggyBank className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              {isEditing ? 'Edit Budget' : 'Add New Budget'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#94B5B0] hover:text-white hover:bg-teal-950/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 py-3">
          {/* Name */}
          <div>
            <label className="text-[11px] font-mono text-[#94B5B0] block mb-1 uppercase font-bold tracking-wider">
              Budget Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monthly Living, Food & Dining"
              required
              className="w-full px-3.5 py-2 rounded-xl bg-[#030707] border border-teal-500/20 text-xs text-white placeholder-[#5B7B76] focus:outline-none focus:border-[#19E6C8]"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-[11px] font-mono text-[#94B5B0] block mb-1 uppercase font-bold tracking-wider">
              Budget Limit (₹)
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#030707] border border-teal-500/20">
              <span className="text-sm font-bold text-[#19E6C8]">₹</span>
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                required
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none font-display"
              />
            </div>
          </div>

          {/* Period */}
          <div>
            <label className="text-[11px] font-mono text-[#94B5B0] block mb-1 uppercase font-bold tracking-wider">
              Period
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    period === p
                      ? 'bg-[#19E6C8] text-black font-bold shadow-[0_0_12px_rgba(25,230,200,0.4)]'
                      : 'bg-[#061817] text-[#94B5B0] hover:text-white border border-teal-500/15'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Threshold Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#94B5B0] flex items-center gap-1 font-mono text-[11px]">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Alert Threshold</span>
              </span>
              <span className="font-bold text-amber-400 font-display font-mono">{alertThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
              className="w-full accent-[#19E6C8]"
            />
          </div>

          {/* Categories Filter */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[11px] font-mono text-[#94B5B0] uppercase font-bold tracking-wider">
                Categories Included
              </span>
              <button
                type="button"
                onClick={handleSelectAllCategories}
                className="text-[#19E6C8] hover:underline text-[11px] font-semibold cursor-pointer"
              >
                {selectedCategories.size === expenseCategories.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-[#030707]/80 rounded-xl border border-teal-500/15">
              {expenseCategories.map((c) => {
                const isSelected = selectedCategories.has(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500/20 border border-teal-500/40 text-[#19E6C8]'
                        : 'bg-[#061817] border border-teal-500/15 text-[#94B5B0] hover:text-white'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
            {selectedCategories.size === 0 && (
              <span className="text-[10px] text-[#5B7B76] mt-1 block">
                (No categories selected = applies to all expense categories)
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 cursor-pointer"
                title="Delete Budget"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#061817] hover:bg-teal-950/40 text-[#94B5B0] hover:text-white border border-teal-500/15 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] text-black text-xs font-bold shadow-[0_0_20px_rgba(25,230,200,0.4)] cursor-pointer transition-all"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
