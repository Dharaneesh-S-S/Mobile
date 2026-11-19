import React from 'react';
import {
  ReceiptText,
  Plus,
  Wallet as WalletIcon,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openAddRecord } = useMoney();
  const isActivityActive = activeTab === 'transactions' || activeTab === 'statistics';

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 select-none pb-safe pointer-events-none flex justify-center">
      <nav className="pointer-events-auto w-full max-w-sm h-16 rounded-full bg-[#061817]/85 border border-teal-500/25 backdrop-blur-2xl px-6 flex items-center justify-between shadow-[0_15px_40px_rgba(0,0,0,0.85)] relative">
        {/* 1. Transactions & Stats Tab */}
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            isActivityActive
              ? 'text-[#19E6C8] font-bold'
              : 'text-[#94B5B0] hover:text-white'
          }`}
          aria-label="Activity and Statistics tab"
        >
          <ReceiptText
            className={`w-5 h-5 transition-transform ${
              isActivityActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(25,230,200,0.6)]' : ''
            }`}
          />
          <span className="text-[10px] mt-0.5 tracking-tight">Activity & Stats</span>
          {isActivityActive && (
            <span className="w-1 h-1 rounded-full bg-[#19E6C8] mt-0.5 shadow-[0_0_6px_#19E6C8]" />
          )}
        </button>

        {/* 2. Center Glowing Action Button (+) */}
        <div className="flex-shrink-0 px-3 -translate-y-3">
          <button
            onClick={() => openAddRecord()}
            className="w-12 h-12 rounded-full bg-[#19E6C8] hover:bg-[#2DD4BF] active:scale-95 text-[#030807] flex items-center justify-center shadow-[0_0_25px_rgba(25,230,200,0.55)] border-2 border-[#030807] transition-all duration-200"
            aria-label="Add transaction"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* 3. Wallet Tab */}
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'wallet'
              ? 'text-[#19E6C8] font-bold'
              : 'text-[#94B5B0] hover:text-white'
          }`}
          aria-label="Wallet tab"
        >
          <WalletIcon
            className={`w-5 h-5 transition-transform ${
              activeTab === 'wallet' ? 'scale-110 drop-shadow-[0_0_8px_rgba(25,230,200,0.6)]' : ''
            }`}
          />
          <span className="text-[10px] mt-0.5 tracking-tight">Wallets</span>
          {activeTab === 'wallet' && (
            <span className="w-1 h-1 rounded-full bg-[#19E6C8] mt-0.5 shadow-[0_0_6px_#19E6C8]" />
          )}
        </button>
      </nav>
    </div>
  );
};
