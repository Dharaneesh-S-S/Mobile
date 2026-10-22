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
  Smartphone,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';

export const DesktopSidebar: React.FC = () => {
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
    periodIncome,
    periodExpense,
    budgets,
    filteredRecords,
    settings,
    updateSettings,
  } = useMoney();

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  // Calculate overall monthly budget progress
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
      id: 'statistics' as const,
      label: 'Analytics & Stats',
      icon: PieChart,
    },
    {
      id: 'calendar' as const,
      label: 'Calendar & Schedule',
      icon: CalendarDays,
    },
    {
      id: 'wallet' as const,
      label: 'Wallets & Accounts',
      icon: WalletIcon,
    },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col shrink-0 select-none z-30">
      {/* 1. App Header / Branding */}
      <div className="p-4 border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-glow-blue flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-display font-black text-blue-400 text-lg">
              ₹
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-white tracking-tight font-display">
                RupeeFlow
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Personal Money Studio</p>
          </div>
        </div>

        {/* Account Selector Pill */}
        <div
          onClick={openAccountSwitcher}
          className="mt-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 cursor-pointer transition-all group"
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
          <div className="text-lg font-black font-display text-white mt-0.5 tracking-tight">
            {isBalanceHidden ? '₹ ••••••' : formatInr(totalAccountBalance, opts)}
          </div>
        </div>
      </div>

      {/* 2. Primary "+ New Record" Action Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => openAddRecord()}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-blue flex items-center justify-center gap-2 transition-all active:scale-98 group"
        >
          <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
          </div>
          <span>New Transaction</span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded text-blue-200 ml-auto font-mono">
            N
          </span>
        </button>
      </div>

      {/* 3. Main Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
              <Icon
                className={`w-4 h-4 transition-transform ${
                  isActive ? 'scale-110 text-blue-400' : 'text-slate-400'
                }`}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Monthly Budget Mini Gauge */}
        {totalBudgetPaise > 0 && (
          <div className="mx-1 mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
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
      </nav>

      {/* 4. Bottom Utilities & View Switcher */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <button
          onClick={openMonthlyReport}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
        >
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Monthly PDF Report</span>
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

        {/* Phone Frame Toggle */}
        <div className="pt-2 border-t border-slate-800/60 mt-1">
          <button
            onClick={() => updateSettings({ isPhoneFrameEnabled: true })}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all"
            title="Switch to Mobile Phone mockup frame"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>Phone Frame (420px)</span>
            </div>
            <span className="text-[10px] text-slate-500">Preview</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
