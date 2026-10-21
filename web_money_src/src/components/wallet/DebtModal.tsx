import React, { useState } from 'react';
import { X, UserCheck, Trash2, Plus, CheckCircle, Clock } from 'lucide-react';
import { db } from '../../db';
import { Debt, DebtPayment } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { formatInr, rupeesToPaise } from '../../utils/currency';

interface DebtModalProps {
  debt: Debt | null | 'new';
  onClose: () => void;
}

export const DebtModal: React.FC<DebtModalProps> = ({ debt, onClose }) => {
  const { currentAccount, showToast, settings } = useMoney();

  const isEditing = debt !== null && debt !== 'new';
  const existingDebt = isEditing ? (debt as Debt) : null;

  const [type, setType] = useState<'owe' | 'owed'>(existingDebt?.type || 'owed');
  const [person, setPerson] = useState<string>(existingDebt?.person || '');
  const [amountInput, setAmountInput] = useState<string>(
    existingDebt ? (existingDebt.amountPaise / 100).toString() : '2000'
  );
  const [date, setDate] = useState<string>(
    existingDebt?.date || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState<string>(existingDebt?.dueDate || '');
  const [interestRate, setInterestRate] = useState<string>(
    existingDebt?.interestRate ? existingDebt.interestRate.toString() : ''
  );
  const [note, setNote] = useState<string>(existingDebt?.note || '');

  // Partial repayment form
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');

  if (!debt) return null;

  const totalAmountPaise = rupeesToPaise(parseFloat(amountInput) || 0);
  const totalPaidPaise = (existingDebt?.payments || []).reduce((acc, p) => acc + p.amountPaise, 0);
  const remainingPaise = Math.max(0, totalAmountPaise - totalPaidPaise);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person.trim()) return;

    const payload: Debt = {
      id: existingDebt?.id || `debt-${Date.now()}`,
      accountId: currentAccount?.id || 'acc-personal',
      type,
      person: person.trim(),
      amountPaise: totalAmountPaise,
      date,
      dueDate: dueDate || undefined,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      note: note.trim() || undefined,
      payments: existingDebt?.payments || [],
      isSettled: existingDebt ? remainingPaise === 0 : false,
      createdAt: existingDebt?.createdAt || new Date().toISOString(),
    };

    await db.debts.put(payload);
    showToast({ type: 'success', text: isEditing ? 'Debt record updated' : 'Debt record created' });
    onClose();
  };

  const handleAddPayment = async () => {
    if (!existingDebt || !paymentAmount) return;
    const paidPaise = rupeesToPaise(parseFloat(paymentAmount) || 0);
    if (paidPaise <= 0) return;

    const newPayment: DebtPayment = {
      id: `pay-${Date.now()}`,
      amountPaise: paidPaise,
      dateTime: new Date().toISOString(),
      note: paymentNote.trim() || undefined,
    };

    const updatedPayments = [...(existingDebt.payments || []), newPayment];
    const newRemaining = Math.max(0, existingDebt.amountPaise - updatedPayments.reduce((a, p) => a + p.amountPaise, 0));

    await db.debts.update(existingDebt.id, {
      payments: updatedPayments,
      isSettled: newRemaining === 0,
    });

    showToast({ type: 'success', text: `Logged payment of ₹${parseFloat(paymentAmount).toLocaleString('en-IN')}` });
    setShowPaymentForm(false);
    setPaymentAmount('');
    setPaymentNote('');
    onClose();
  };

  const handleToggleSettled = async () => {
    if (!existingDebt) return;
    const nextStatus = !existingDebt.isSettled;
    await db.debts.update(existingDebt.id, { isSettled: nextStatus });
    showToast({ type: 'info', text: nextStatus ? 'Marked as settled' : 'Marked as open' });
    onClose();
  };

  const handleDelete = async () => {
    if (!existingDebt) return;
    await db.debts.delete(existingDebt.id);
    showToast({ type: 'info', text: 'Debt record deleted' });
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
            {isEditing ? 'Debt Record' : 'Add Debt / Loan'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3">
          {/* Debt Type Selector: "I Owe" vs "Owed to Me" */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setType('owed')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                type === 'owed'
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Owed to Me (Receivable)
            </button>
            <button
              type="button"
              onClick={() => setType('owe')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                type === 'owe'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              I Owe (Payable)
            </button>
          </div>

          {/* If editing, show status & remaining badge */}
          {isEditing && existingDebt && (
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Remaining Balance</span>
                <div className="text-xl font-bold font-display text-white mt-0.5">
                  {formatInr(remainingPaise, opts)}
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleSettled}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  existingDebt.isSettled
                    ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/50'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {existingDebt.isSettled ? 'Settled ✓' : 'Mark Settled'}
              </button>
            </div>
          )}

          {/* Partial payment button & form */}
          {isEditing && !existingDebt?.isSettled && (
            <div>
              {showPaymentForm ? (
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                  <span className="text-xs font-semibold text-slate-200">Record Partial Payment</span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700">
                    <span className="text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Amount"
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Note (e.g. Google Pay partial)"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(false)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddPayment}
                      className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-glow-blue"
                    >
                      Add Payment
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Partial Repayment</span>
                </button>
              )}
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSave} className="space-y-3">
            {/* Person Name */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Person Name</label>
              <input
                type="text"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                placeholder="e.g. Rahul Sharma, Landlord, Office Colleague"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            {/* Total Amount */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Total Amount (₹)</label>
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

            {/* Dates Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Loan Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Due Date (Optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Note (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g. Goa trip split, Emergency cash"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
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
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
