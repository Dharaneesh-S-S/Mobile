import React, { useState } from 'react';
import { X, Trash2, Bell, AlertTriangle } from 'lucide-react';
import { db } from '../../db';
import { Budget } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { rupeesToPaise, paiseToRupees } from '../../utils/currency';

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <h3 className="text-base font-bold text-white font-display">
            {isEditing ? 'Edit Budget' : 'Add New Budget'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 py-3">
          {/* Name */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Budget Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monthly Living, Food & Dining"
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Budget Limit (₹)</label>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700">
              <span className="text-sm font-bold text-slate-400">₹</span>
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
            <label className="text-xs text-slate-400 block mb-1">Period</label>
            <div className="grid grid-cols-3 gap-2">
              {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    period === p
                      ? 'bg-blue-600 text-white shadow-glow-blue'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
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
              <span className="text-slate-400 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Alert Threshold</span>
              </span>
              <span className="font-bold text-amber-400 font-display">{alertThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Categories Filter */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">Categories Included</span>
              <button
                type="button"
                onClick={handleSelectAllCategories}
                className="text-blue-400 hover:underline text-[11px]"
              >
                {selectedCategories.size === expenseCategories.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800">
              {expenseCategories.map((c) => {
                const isSelected = selectedCategories.has(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-blue-600/30 border border-blue-500 text-blue-200'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
            {selectedCategories.size === 0 && (
              <span className="text-[10px] text-slate-500 mt-1 block">
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
                className="p-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400"
                title="Delete Budget"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-glow-blue"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
