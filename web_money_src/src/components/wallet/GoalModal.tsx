import React, { useState } from 'react';
import { X, Target, Trash2, Plus, Minus, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../../db';
import { Goal } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { DynamicIcon, COLOR_PALETTE } from '../common/IconHelper';
import { formatInr, rupeesToPaise } from '../../utils/currency';

interface GoalModalProps {
  goal: Goal | null | 'new';
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ goal, onClose }) => {
  const { currentAccount, wallets, addRecord, showToast, settings } = useMoney();

  const isEditing = goal !== null && goal !== 'new';
  const existingGoal = isEditing ? (goal as Goal) : null;

  const [name, setName] = useState<string>(existingGoal?.name || '');
  const [targetAmountInput, setTargetAmountInput] = useState<string>(
    existingGoal ? (existingGoal.targetAmountPaise / 100).toString() : '50000'
  );
  const [currentSavedInput, setCurrentSavedInput] = useState<string>(
    existingGoal ? (existingGoal.currentSavedPaise / 100).toString() : '0'
  );
  const [targetDate, setTargetDate] = useState<string>(
    existingGoal?.targetDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
  );
  const [color, setColor] = useState<string>(existingGoal?.color || '#10b981');
  const [icon, setIcon] = useState<string>(existingGoal?.icon || 'Target');
  const [walletId, setWalletId] = useState<string>(existingGoal?.walletId || wallets[0]?.id || '');

  // Contribution state
  const [contributionMode, setContributionMode] = useState<'add' | 'withdraw' | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>('');

  if (!goal) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const targetAmountPaise = rupeesToPaise(parseFloat(targetAmountInput) || 0);
    const currentSavedPaise = rupeesToPaise(parseFloat(currentSavedInput) || 0);

    const payload: Goal = {
      id: existingGoal?.id || `goal-${Date.now()}`,
      accountId: currentAccount?.id || 'acc-personal',
      name: name.trim(),
      targetAmountPaise,
      currentSavedPaise,
      targetDate,
      icon,
      color,
      walletId,
      createdAt: existingGoal?.createdAt || new Date().toISOString(),
    };

    await db.goals.put(payload);
    showToast({ type: 'success', text: isEditing ? 'Goal updated' : 'Goal created' });
    onClose();
  };

  const handleApplyContribution = async () => {
    if (!existingGoal || !contributionAmount) return;
    const deltaPaise = rupeesToPaise(parseFloat(contributionAmount) || 0);
    if (deltaPaise <= 0) return;

    const newSaved =
      contributionMode === 'add'
        ? existingGoal.currentSavedPaise + deltaPaise
        : Math.max(0, existingGoal.currentSavedPaise - deltaPaise);

    await db.goals.update(existingGoal.id, { currentSavedPaise: newSaved });

    // Also record transaction entry in linked wallet
    if (walletId) {
      await addRecord({
        accountId: existingGoal.accountId,
        type: contributionMode === 'add' ? 'expense' : 'income',
        amountPaise: deltaPaise,
        dateTime: new Date().toISOString(),
        description: `Goal: ${existingGoal.name} (${contributionMode === 'add' ? 'Deposit' : 'Withdrawal'})`,
        categoryId: 'cat-inc-5', // Investment / Savings
        walletId,
      });
    }

    if (newSaved >= existingGoal.targetAmountPaise) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showToast({ type: 'success', text: `Congratulations! Goal "${existingGoal.name}" reached!` });
    } else {
      showToast({
        type: 'success',
        text: `${contributionMode === 'add' ? 'Added' : 'Withdrew'} ₹${parseFloat(contributionAmount).toLocaleString('en-IN')}`,
      });
    }

    setContributionMode(null);
    setContributionAmount('');
    onClose();
  };

  const handleDelete = async () => {
    if (!existingGoal) return;
    await db.goals.delete(existingGoal.id);
    showToast({ type: 'info', text: 'Goal deleted' });
    onClose();
  };

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <h3 className="text-base font-bold text-white font-display">
            {isEditing ? 'Goal Details' : 'Add Savings Goal'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contribution Drawer */}
        {contributionMode ? (
          <div className="py-4 space-y-3">
            <h4 className="text-sm font-bold text-white">
              {contributionMode === 'add' ? 'Deposit towards goal' : 'Withdraw from goal'}
            </h4>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700">
              <span className="text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                autoFocus
                placeholder="Amount in Rupees"
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setContributionMode(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyContribution}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-glow-blue"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 py-3">
            {/* Quick Actions if editing */}
            {isEditing && existingGoal && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setContributionMode('add')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Deposit Funds</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContributionMode('withdraw')}
                  className="flex-1 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Minus className="w-4 h-4" />
                  <span>Withdraw</span>
                </button>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Goal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vacation to Ladakh, New Laptop, Emergency Fund"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            {/* Target Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  value={targetAmountInput}
                  onChange={(e) => setTargetAmountInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-display"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Current Saved (₹)</label>
                <input
                  type="number"
                  value={currentSavedInput}
                  onChange={(e) => setCurrentSavedInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-display"
                />
              </div>
            </div>

            {/* Target Date */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            {/* Linked Wallet */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Linked Wallet for Deposits</label>
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

            {/* Color Palette */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Color Theme</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTE.slice(0, 10).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
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
                Save Goal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
