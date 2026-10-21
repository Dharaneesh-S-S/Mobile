import React, { useState } from 'react';
import { X, Repeat, Trash2, Calendar, Clock, Check } from 'lucide-react';
import { db } from '../../db';
import { RecurringRule, RecurringFrequency, TransactionType } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { formatInr, rupeesToPaise } from '../../utils/currency';
import { calculateNextDueDate } from '../../utils/recurring';

interface RecurringModalProps {
  rule: RecurringRule | null | 'new';
  onClose: () => void;
}

export const RecurringModal: React.FC<RecurringModalProps> = ({ rule, onClose }) => {
  const { currentAccount, categories, wallets, showToast, settings } = useMoney();

  const isEditing = rule !== null && rule !== 'new';
  const existingRule = isEditing ? (rule as RecurringRule) : null;

  const [type, setType] = useState<TransactionType>(existingRule?.type || 'expense');
  const [description, setDescription] = useState<string>(existingRule?.description || '');
  const [amountInput, setAmountInput] = useState<string>(
    existingRule ? (existingRule.amountPaise / 100).toString() : '5000'
  );
  const [categoryId, setCategoryId] = useState<string>(
    existingRule?.categoryId || categories[0]?.id || ''
  );
  const [walletId, setWalletId] = useState<string>(
    existingRule?.walletId || wallets[0]?.id || ''
  );
  const [frequency, setFrequency] = useState<RecurringFrequency>(
    existingRule?.frequency || 'monthly'
  );
  const [dayOfMonth, setDayOfMonth] = useState<number>(existingRule?.dayOfMonth || 1);
  const [startDate, setStartDate] = useState<string>(
    existingRule?.startDate || new Date().toISOString()
  );
  const [endType, setEndType] = useState<'never' | 'date' | 'count'>(
    existingRule?.endType || 'never'
  );
  const [endDate, setEndDate] = useState<string>(existingRule?.endDate || '');
  const [endCount, setEndCount] = useState<string>(
    existingRule?.endCount ? existingRule.endCount.toString() : '12'
  );
  const [autoAdd, setAutoAdd] = useState<boolean>(existingRule?.autoAdd ?? true);

  if (!rule) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const amountPaise = rupeesToPaise(parseFloat(amountInput) || 0);
    if (amountPaise <= 0) return;

    const dummyRule: RecurringRule = {
      id: existingRule?.id || `rec-rule-${Date.now()}`,
      accountId: currentAccount?.id || 'acc-personal',
      type,
      amountPaise,
      description: description.trim(),
      categoryId,
      walletId,
      startDate,
      frequency,
      dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
      endType,
      endDate: endType === 'date' ? endDate : undefined,
      endCount: endType === 'count' ? parseInt(endCount) : undefined,
      executionCount: existingRule?.executionCount || 0,
      nextDueDate: existingRule?.nextDueDate || new Date().toISOString(),
      autoAdd,
      createdAt: existingRule?.createdAt || new Date().toISOString(),
    };

    if (!existingRule) {
      dummyRule.nextDueDate = calculateNextDueDate(dummyRule, new Date()).toISOString();
    }

    await db.recurringRules.put(dummyRule);
    showToast({
      type: 'success',
      text: isEditing ? 'Recurring rule updated' : 'Recurring rule created',
    });
    onClose();
  };

  const handleDelete = async () => {
    if (!existingRule) return;
    await db.recurringRules.delete(existingRule.id);
    showToast({ type: 'info', text: 'Recurring rule deleted' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white font-display">
              {isEditing ? 'Edit Recurring Rule' : 'Add Recurring Rule'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 py-3">
          {/* Type */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['expense', 'income', 'transfer'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-1.5 rounded-lg capitalize transition-all ${
                  type === t
                    ? t === 'income'
                      ? 'bg-blue-600 text-white'
                      : t === 'expense'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700 text-white'
                    : 'text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Monthly Salary, House Rent, Netflix"
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Amount (₹)</label>
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

          {/* Frequency */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Day of Month if Monthly */}
          {frequency === 'monthly' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Day of Month (1 - 31)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          )}

          {/* Category & Wallet */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Wallet</label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Auto-add toggle */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200">Auto-add Transactions</span>
              <p className="text-[10px] text-slate-500">Automatically logs on due date without prompt</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoAdd((prev) => !prev)}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                autoAdd ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  autoAdd ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-xl bg-red-600/20 text-red-400"
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
              Save Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
