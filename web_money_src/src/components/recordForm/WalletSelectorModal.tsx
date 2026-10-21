import React from 'react';
import { ArrowLeft, Check, Plus, Settings } from 'lucide-react';
import { Wallet } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { DynamicIcon } from '../common/IconHelper';
import { formatInr } from '../../utils/currency';

interface WalletSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWalletId: string;
  onSelectWallet: (wallet: Wallet) => void;
  excludedWalletId?: string; // e.g. for transfers, cannot select the same "from" wallet
  title?: string;
}

export const WalletSelectorModal: React.FC<WalletSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedWalletId,
  onSelectWallet,
  excludedWalletId,
  title = 'Select wallet',
}) => {
  const { wallets, walletBalances, setActiveTab, settings } = useMoney();

  if (!isOpen) return null;

  const includedWallets = wallets.filter(
    (w) => w.includeInTotal && !w.isArchived && w.id !== excludedWalletId
  );
  const excludedWallets = wallets.filter(
    (w) => !w.includeInTotal && !w.isArchived && w.id !== excludedWalletId
  );

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  const renderWalletItem = (w: Wallet) => {
    const isSelected = w.id === selectedWalletId;
    const balancePaise = walletBalances.get(w.id) || 0;

    return (
      <div
        key={w.id}
        onClick={() => {
          onSelectWallet(w);
          onClose();
        }}
        className={`flex items-center justify-between px-5 py-3 hover:bg-slate-800/40 active:bg-slate-800 cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-900/15' : ''
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
            style={{
              backgroundColor: `${w.color}22`,
              border: `1.5px solid ${w.color}`,
            }}
          >
            <DynamicIcon name={w.icon} className="w-5 h-5" color={w.color} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-100 truncate">{w.name}</span>
            <span className="text-xs text-slate-400 font-display">
              {formatInr(balancePaise, opts)}
            </span>
          </div>
        </div>

        {/* Radio Check */}
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-blue-600 text-white shadow-glow-blue'
              : 'border border-slate-700 bg-slate-800/50'
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16] flex flex-col text-slate-100 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 -ml-1 rounded-lg text-slate-400 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-base font-bold text-white font-display">{title}</h2>
        </div>

        <button
          onClick={() => {
            onClose();
            setActiveTab('wallet');
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          title="Manage wallets"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Wallets Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Section: Included in total */}
        {includedWallets.length > 0 && (
          <div className="py-2">
            <div className="px-5 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Included in Total
            </div>
            <div className="divide-y divide-slate-800/40">
              {includedWallets.map(renderWalletItem)}
            </div>
          </div>
        )}

        {/* Section: Excluded from total */}
        {excludedWallets.length > 0 && (
          <div className="py-2 border-t border-slate-800/80">
            <div className="px-5 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Excluded from Total
            </div>
            <div className="divide-y divide-slate-800/40">
              {excludedWallets.map(renderWalletItem)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
