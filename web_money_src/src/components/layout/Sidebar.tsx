import React from 'react';
import {
  ReceiptText,
  CalendarDays,
  PieChart,
  Wallet as WalletIcon,
  Plus,
  FileText,
  Tags,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openAddRecord,
    currentAccount,
    totalAccountBalance,
    isBalanceHidden,
    toggleHideBalance,
    openAccountSwitcher,
    openMonthlyReport,
    openSettings,
    openCategoryManager,
    periodExpense,
    budgets,
    filteredRecords,
    settings,
  } = useMoney();

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  // Monthly budget calculation
  const totalBudgetPaise = budgets.reduce((acc, b) => acc + b.amountPaise, 0);
  const budgetPercent = totalBudgetPaise > 0
    ? Math.min(100, Math.round((periodExpense / totalBudgetPaise) * 100))
    : 0;

  const navItems = [
    {
      id: 'transactions' as const,
      label: 'Transactions',
      icon: ReceiptText,
      badge: filteredRecords.length,
    },
    {
      id: 'calendar' as const,
      label: 'Calendar',
      icon: CalendarDays,
    },
    {
      id: 'statistics' as const,
      label: 'Analytics & Stats',
      icon: PieChart,
    },
    {
      id: 'wallet' as const,
      label: 'Wallets & Accounts',
      icon: WalletIcon,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-full bg-[#0a0f1d] border-r border-slate-800/80 p-4 select-none justify-between">
      {/* Top Part: Branding + Account Card + Action + Navigation */}
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-glow-blue flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-display font-black text-blue-400 text-lg">
              ₹
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-white font-display">
                RupeeFlow
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
            <span className="block text-[11px] text-slate-400 font-medium -mt-0.5">
              Money Studio
            </span>
          </div>
        </div>

        {/* Account Selector & Total Balance Card */}
        <div
          onClick={openAccountSwitcher}
          className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
          role="button"
          tabIndex={0}
          title="Switch Account"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-1 group-hover:text-slate-200 transition-colors">
              <span>{currentAccount?.name || 'Personal'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleHideBalance();
              }}
              className="text-slate-500 hover:text-slate-300 p-0.5"
              title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
            >
              {isBalanceHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-lg font-black font-display text-white mt-1 tracking-tight">
            {isBalanceHidden ? '₹ ••••••' : formatInr(totalAccountBalance, opts)}
          </div>
        </div>

        {/* Primary "+ New Record" Action Button */}
        <button
          onClick={() => openAddRecord()}
          className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-blue flex items-center justify-center gap-2 transition-all active:scale-95 group"
        >
          <Plus className="w-4 h-4 stroke-[2.8]" />
          <span>New Transaction</span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded text-blue-200 ml-auto font-mono">
            N
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1 pt-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Monthly Budget Mini Widget */}
        {totalBudgetPaise > 0 && (
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-slate-400 font-medium">Monthly Budget</span>
              <span className={`font-bold font-mono ${budgetPercent >= 90 ? 'text-red-400' : 'text-slate-300'}`}>
                {budgetPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetPercent >= 90
                    ? 'bg-red-500'
                    : budgetPercent >= 75
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, budgetPercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>{formatInr(periodExpense, { showDecimals: false })}</span>
              <span>{formatInr(totalBudgetPaise, { showDecimals: false })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions: Report, Categories, Settings */}
      <div className="border-t border-slate-800/80 pt-3 space-y-1">
        <button
          onClick={openMonthlyReport}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
        >
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Monthly Statement</span>
        </button>

        <button
          onClick={openCategoryManager}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
        >
          <Tags className="w-4 h-4 text-slate-400" />
          <span>Categories & Icons</span>
        </button>

        <button
          onClick={openSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
        >
          <SettingsIcon className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
