import React from 'react';
import {
  ReceiptText,
  CalendarDays,
  Plus,
  PieChart,
  Wallet as WalletIcon,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openAddRecord } = useMoney();

  return (
    <nav className="h-18 bg-[#090d16]/95 border-t border-slate-800/90 backdrop-blur-md px-3 flex items-center justify-between shrink-0 relative z-30 select-none pb-safe">
      {/* 1. Transaction Tab */}
      <button
        onClick={() => setActiveTab('transactions')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          activeTab === 'transactions' ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-300'
        }`}
        aria-label="Transactions tab"
      >
        <ReceiptText
          className={`w-5 h-5 transition-transform ${
            activeTab === 'transactions' ? 'scale-110 text-white' : ''
          }`}
        />
        <span className="text-[11px] mt-1 tracking-tight">Transaction</span>
      </button>

      {/* 2. Calendar Tab */}
      <button
        onClick={() => setActiveTab('calendar')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          activeTab === 'calendar' ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-300'
        }`}
        aria-label="Calendar tab"
      >
        <CalendarDays
          className={`w-5 h-5 transition-transform ${
            activeTab === 'calendar' ? 'scale-110 text-white' : ''
          }`}
        />
        <span className="text-[11px] mt-1 tracking-tight">Calendar</span>
      </button>

      {/* 3. Center Action Button (+) */}
      <div className="flex-1 flex items-center justify-center -translate-y-4">
        <button
          onClick={() => openAddRecord()}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-blue-600/50 border-4 border-[#090d16] transition-all duration-200"
          aria-label="Add transaction"
        >
          <Plus className="w-7 h-7 stroke-[2.6]" />
        </button>
      </div>

      {/* 4. Statistic Tab */}
      <button
        onClick={() => setActiveTab('statistics')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          activeTab === 'statistics' ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-300'
        }`}
        aria-label="Statistic tab"
      >
        <PieChart
          className={`w-5 h-5 transition-transform ${
            activeTab === 'statistics' ? 'scale-110 text-white' : ''
          }`}
        />
        <span className="text-[11px] mt-1 tracking-tight">Statistic</span>
      </button>

      {/* 5. Wallet Tab */}
      <button
        onClick={() => setActiveTab('wallet')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
          activeTab === 'wallet' ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-300'
        }`}
        aria-label="Wallet tab"
      >
        <WalletIcon
          className={`w-5 h-5 transition-transform ${
            activeTab === 'wallet' ? 'scale-110 text-white' : ''
          }`}
        />
        <span className="text-[11px] mt-1 tracking-tight">Wallet</span>
      </button>
    </nav>
  );
};
