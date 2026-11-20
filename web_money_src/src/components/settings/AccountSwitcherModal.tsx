import React, { useState } from 'react';
import { X, Check, Plus, Edit2, Trash2 } from 'lucide-react';
import { db } from '../../db';
import { Account } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';

export const AccountSwitcherModal: React.FC = () => {
  const {
    isAccountSwitcherOpen,
    closeAccountSwitcher,
    accounts,
    currentAccount,
    setCurrentAccountId,
    showToast,
  } = useMoney();

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newAccountName, setNewAccountName] = useState<string>('');
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  if (!isAccountSwitcherOpen) return null;

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;

    const newAcc: Account = {
      id: `acc-${Date.now()}`,
      name: newAccountName.trim(),
      createdAt: new Date().toISOString(),
    };

    await db.accounts.put(newAcc);
    setCurrentAccountId(newAcc.id);
    showToast({ type: 'success', text: `Switched to ${newAcc.name}` });
    setNewAccountName('');
    setIsAddingNew(false);
  };

  const handleRenameAccount = async (id: string) => {
    if (!editingName.trim()) return;
    await db.accounts.update(id, { name: editingName.trim() });
    showToast({ type: 'success', text: 'Account renamed' });
    setEditingAccountId(null);
  };

  const handleDeleteAccount = async (id: string, name: string) => {
    if (accounts.length <= 1) {
      showToast({ type: 'warning', text: 'You must have at least one account' });
      return;
    }
    const confirm = window.confirm(`Delete account "${name}" and all its records?`);
    if (!confirm) return;

    await db.accounts.delete(id);
    // Delete associated records, wallets, etc.
    await db.records.where('accountId').equals(id).delete();
    await db.wallets.where('accountId').equals(id).delete();

    const remaining = accounts.filter((a) => a.id !== id);
    setCurrentAccountId(remaining[0].id);
    showToast({ type: 'info', text: `Deleted account "${name}"` });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={closeAccountSwitcher} />
      <div className="w-full sm:max-w-md bg-[#061817]/95 border border-teal-500/25 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 max-h-[85vh] flex flex-col backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15 shrink-0">
          <div>
            <h3 className="text-base font-bold text-white font-display">Switch Account</h3>
            <p className="text-xs text-[#94B5B0]">Manage multiple ledgers (Personal, Work, Family)</p>
          </div>
          <button onClick={closeAccountSwitcher} className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-2 py-3">
          {accounts.map((acc) => {
            const isSelected = acc.id === currentAccount?.id;
            return (
              <div
                key={acc.id}
                onClick={() => {
                  setCurrentAccountId(acc.id);
                  closeAccountSwitcher();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-950/40 border-teal-500/50 shadow-glow-teal'
                    : 'glass-card border-teal-500/15 hover:border-teal-500/30'
                }`}
              >
                {editingAccountId === acc.id ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 flex-1 mr-2"
                  >
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-[#030707] border border-teal-500/25 text-xs text-white flex-1"
                    />
                    <button
                      onClick={() => handleRenameAccount(acc.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#19E6C8] text-[#030707] text-xs font-bold cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-white truncate">{acc.name}</span>
                    {acc.isDefault && (
                      <span className="text-[10px] text-[#19E6C8] bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setEditingAccountId(acc.id);
                      setEditingName(acc.name);
                    }}
                    className="p-1.5 rounded-lg text-[#94B5B0] hover:text-[#19E6C8] hover:bg-teal-950/40 cursor-pointer"
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {accounts.length > 1 && (
                    <button
                      onClick={() => handleDeleteAccount(acc.id, acc.name)}
                      className="p-1.5 rounded-lg text-[#94B5B0] hover:text-[#FF6B6B] hover:bg-teal-950/40 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#19E6C8] text-[#030707] flex items-center justify-center ml-1 font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Account Drawer */}
          {isAddingNew ? (
            <form onSubmit={handleCreateAccount} className="p-3 bg-[#030707] rounded-2xl border border-teal-500/20 space-y-2">
              <span className="text-xs font-semibold text-white">New Account Name</span>
              <input
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="e.g. Business, Family, Freelance"
                autoFocus
                className="w-full px-3 py-2 rounded-xl bg-[#061817] border border-teal-500/25 text-xs text-white placeholder-[#5B7B76] focus:border-[#19E6C8] outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-1.5 rounded-xl bg-[#061817] border border-teal-500/15 text-xs font-semibold text-[#94B5B0] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 rounded-xl bg-[#19E6C8] text-xs font-bold text-[#030707] shadow-glow-teal hover:bg-[#19E6C8]/90 cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-2.5 rounded-2xl border-2 border-dashed border-teal-500/20 hover:border-teal-500/40 text-xs font-semibold text-[#94B5B0] hover:text-[#19E6C8] flex items-center justify-center gap-1.5 transition-all mt-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
