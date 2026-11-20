import React, { useState } from 'react';
import {
  X,
  Edit2,
  Trash2,
  Archive,
  Plus,
  Scale,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { db } from '../../db';
import { Wallet, WalletType } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { DynamicIcon, COLOR_PALETTE } from '../common/IconHelper';
import { formatInr, rupeesToPaise } from '../../utils/currency';
import { TransactionRow } from '../transactions/TransactionRow';

interface WalletDetailModalProps {
  wallet: Wallet | null;
  onClose: () => void;
}

export const WalletDetailModal: React.FC<WalletDetailModalProps> = ({ wallet, onClose }) => {
  const {
    walletBalances,
    records,
    showToast,
    addRecord,
    settings,
  } = useMoney();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showAdjustBalance, setShowAdjustBalance] = useState<boolean>(false);

  // Edit fields
  const [name, setName] = useState<string>(wallet?.name || '');
  const [type, setType] = useState<WalletType>(wallet?.type || 'cash');
  const [color, setColor] = useState<string>(wallet?.color || '#10b981');
  const [icon, setIcon] = useState<string>(wallet?.icon || 'CreditCard');
  const [includeInTotal, setIncludeInTotal] = useState<boolean>(wallet?.includeInTotal ?? true);
  const [newActualBalance, setNewActualBalance] = useState<string>('');

  if (!wallet) return null;

  const currentBalancePaise = walletBalances.get(wallet.id) || 0;

  // Filter records for this wallet
  const walletRecords = records
    .filter((r) => r.walletId === wallet.id || r.toWalletId === wallet.id)
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  // In / Out totals
  let totalIn = 0;
  let totalOut = 0;
  for (const r of walletRecords) {
    if (r.walletId === wallet.id) {
      if (r.type === 'income') totalIn += r.amountPaise;
      else if (r.type === 'expense') totalOut += r.amountPaise;
      else if (r.type === 'transfer') totalOut += r.amountPaise + (r.feePaise || 0);
    }
    if (r.toWalletId === wallet.id && r.type === 'transfer') {
      totalIn += r.amountPaise;
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await db.wallets.update(wallet.id, {
      name: name.trim(),
      type,
      color,
      icon,
      includeInTotal,
    });

    showToast({ type: 'success', text: 'Wallet updated' });
    setIsEditing(false);
  };

  const handleAdjustBalance = async () => {
    const targetPaise = rupeesToPaise(parseFloat(newActualBalance) || 0);
    const diff = targetPaise - currentBalancePaise;

    if (diff === 0) {
      setShowAdjustBalance(false);
      return;
    }

    // Create an adjustment record
    await addRecord({
      accountId: wallet.accountId,
      type: diff > 0 ? 'income' : 'expense',
      amountPaise: Math.abs(diff),
      dateTime: new Date().toISOString(),
      description: 'Balance Adjustment',
      categoryId: diff > 0 ? 'cat-inc-9' : 'cat-exp-15', // Others
      walletId: wallet.id,
      memo: `Adjusted balance to ₹${parseFloat(newActualBalance).toLocaleString('en-IN')}`,
    });

    showToast({ type: 'success', text: 'Balance adjusted' });
    setShowAdjustBalance(false);
    setNewActualBalance('');
  };

  const handleDeleteWallet = async () => {
    if (walletRecords.length > 0) {
      const confirm = window.confirm(
        `Wallet has ${walletRecords.length} transactions. Delete wallet anyway?`
      );
      if (!confirm) return;
    }
    await db.wallets.delete(wallet.id);
    showToast({ type: 'info', text: `Deleted wallet ${wallet.name}` });
    onClose();
  };

  const handleToggleArchive = async () => {
    await db.wallets.update(wallet.id, { isArchived: !wallet.isArchived });
    showToast({
      type: 'info',
      text: wallet.isArchived ? 'Wallet restored' : 'Wallet archived',
    });
    onClose();
  };

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-[#061817]/95 border border-teal-500/25 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 z-10 max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
              style={{
                backgroundColor: `${wallet.color}22`,
                border: `1.5px solid ${wallet.color}`,
                boxShadow: `0 0 16px ${wallet.color}28`,
              }}
            >
              <DynamicIcon name={wallet.icon} className="w-5 h-5" color={wallet.color} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">{wallet.name}</h3>
              <p className="text-[11px] text-[#94B5B0] capitalize font-mono">{wallet.type} Wallet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#94B5B0] hover:text-white hover:bg-teal-950/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3">
          {/* Balance Display Card */}
          <div className="glass-card-featured rounded-3xl p-4 sm:p-5 flex items-center justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] text-[#94B5B0] uppercase font-mono font-bold tracking-wider">
                Current Balance
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-display text-glow-teal mt-0.5 tracking-tight">
                {formatInr(currentBalancePaise, opts)}
              </div>
            </div>
            <button
              onClick={() => {
                setNewActualBalance((currentBalancePaise / 100).toString());
                setShowAdjustBalance((prev) => !prev);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-[#19E6C8] border border-teal-500/25 text-xs font-bold transition-all shadow-[0_0_12px_rgba(25,230,200,0.15)] cursor-pointer"
            >
              Adjust
            </button>
          </div>

          {/* Adjust Balance Drawer */}
          {showAdjustBalance && (
            <div className="p-3.5 bg-[#030807]/90 rounded-2xl border border-teal-500/25 space-y-2">
              <span className="text-xs font-bold text-white font-mono">Set Actual Balance</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#19E6C8]">₹</span>
                <input
                  type="number"
                  value={newActualBalance}
                  onChange={(e) => setNewActualBalance(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-[#061817] border border-teal-500/30 text-xs text-white focus:outline-none focus:border-[#19E6C8]"
                />
                <button
                  onClick={handleAdjustBalance}
                  className="px-4 py-1.5 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] text-black text-xs font-bold shadow-[0_0_15px_rgba(25,230,200,0.3)] cursor-pointer transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* In / Out Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-[#19E6C8] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#94B5B0] font-mono font-medium">Total In</span>
                <span className="text-xs sm:text-sm font-black text-[#19E6C8] font-display text-glow-teal truncate">
                  {formatInr(totalIn, opts)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF6B6B]/20 text-[#FF6B6B] flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#94B5B0] font-mono font-medium">Total Out</span>
                <span className="text-xs sm:text-sm font-black text-[#FF6B6B] font-display text-glow-coral truncate">
                  {totalOut > 0 ? `-${formatInr(totalOut, opts)}` : '₹0'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form or Wallet Settings */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3 p-4 bg-[#030807]/90 rounded-2xl border border-teal-500/20">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Edit Wallet</h4>
              <div>
                <label className="text-[11px] text-[#94B5B0] block mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#061817] border border-teal-500/25 text-xs text-white focus:outline-none focus:border-[#19E6C8]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#94B5B0] block mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as WalletType)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#061817] border border-teal-500/25 text-xs text-white focus:outline-none focus:border-[#19E6C8]"
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Account</option>
                  <option value="upi">UPI / E-Wallet</option>
                  <option value="credit">Credit Card</option>
                  <option value="meal">Meal Card</option>
                  <option value="savings">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#94B5B0] block mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'ring-2 ring-white scale-110 shadow-lg' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-[#94B5B0]">Include in total net worth</span>
                <input
                  type="checkbox"
                  checked={includeInTotal}
                  onChange={(e) => setIncludeInTotal(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#19E6C8]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 rounded-xl bg-[#061817] text-xs font-semibold text-[#94B5B0] hover:text-white border border-teal-500/15 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] text-black text-xs font-bold shadow-[0_0_15px_rgba(25,230,200,0.3)] transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2.5 rounded-xl bg-[#061817] hover:bg-teal-950/40 text-xs font-bold text-[#19E6C8] border border-teal-500/20 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(25,230,200,0.1)] cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
              <button
                onClick={handleToggleArchive}
                className="p-2.5 rounded-xl bg-[#061817] hover:bg-teal-950/40 text-[#94B5B0] hover:text-white border border-teal-500/20 transition-all cursor-pointer"
                title={wallet.isArchived ? 'Restore' : 'Archive'}
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteWallet}
                className="p-2.5 rounded-xl bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/20 transition-all cursor-pointer"
                title="Delete Wallet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Transactions for this wallet */}
          <div>
            <h4 className="text-[10px] font-bold text-[#94B5B0] uppercase tracking-wider font-mono mb-2">
              Recent Transactions ({walletRecords.length})
            </h4>
            <div className="divide-y divide-teal-500/10 max-h-56 overflow-y-auto rounded-2xl bg-[#030807]/70 border border-teal-500/15">
              {walletRecords.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5B7B76]">
                  No records logged for this wallet.
                </div>
              ) : (
                walletRecords.slice(0, 15).map((r) => (
                  <TransactionRow
                    key={r.id}
                    record={r}
                    isSelectMode={false}
                    isSelected={false}
                    onToggleSelect={() => {}}
                    onLongPress={() => {}}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
