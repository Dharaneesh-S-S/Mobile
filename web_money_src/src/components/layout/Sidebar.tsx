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
  Palette,
  ExternalLink,
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
  const budgetPercent =
    totalBudgetPaise > 0
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
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-full bg-[#030807]/95 border-r border-teal-500/15 backdrop-blur-2xl p-4 select-none justify-between z-30">
      {/* Top Part: Branding + Account Card + Action + Navigation */}
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#19E6C8] to-[#0D9488] p-[1px] shadow-[0_0_20px_rgba(25,230,200,0.4)] flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#030807] rounded-[15px] flex items-center justify-center font-display font-black text-[#19E6C8] text-lg">
              ₹
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-white font-display">
                RupeeFlow
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-teal-500/10 text-[#19E6C8] border border-teal-500/30">
                PRO
              </span>
            </div>
            <span className="block text-[11px] text-[#94B5B0] font-medium -mt-0.5">
              Money Studio
            </span>
          </div>
        </div>

        {/* Account Selector & Total Balance Card */}
        <div
          onClick={openAccountSwitcher}
          className="p-3.5 rounded-2xl bg-[#061817]/70 border border-teal-500/20 hover:border-teal-400/40 cursor-pointer transition-all duration-200 group relative overflow-hidden shadow-lg"
          role="button"
          tabIndex={0}
          title="Switch Account"
        >
          <div className="flex items-center justify-between text-[11px] text-[#94B5B0] font-medium">
            <div className="flex items-center gap-1 group-hover:text-white transition-colors">
              <span>{currentAccount?.name || 'Personal'}</span>
              <ChevronDown className="w-3 h-3 text-[#5B7B76] group-hover:translate-y-0.5 transition-transform" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleHideBalance();
              }}
              className="text-[#5B7B76] hover:text-[#19E6C8] p-0.5 transition-colors"
              title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
            >
              {isBalanceHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-xl font-black font-display text-white mt-1.5 tracking-tight text-glow-teal">
            {isBalanceHidden ? '₹ ••••••' : formatInr(totalAccountBalance, opts)}
          </div>
        </div>

        {/* Primary "+ New Transaction" White Pill Action Button */}
        <button
          onClick={() => openAddRecord()}
          className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] hover:shadow-[0_0_30px_rgba(25,230,200,0.3)] flex items-center justify-center gap-2 transition-all active:scale-95 group cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Transaction</span>
          <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded text-black/70 ml-auto font-mono">
            N
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1 pt-1">
          <div className="text-[10px] font-bold text-[#5B7B76] uppercase tracking-wider px-3 mb-1 font-mono">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-500/10 text-[#19E6C8] border border-teal-500/30 shadow-[0_0_15px_rgba(25,230,200,0.15)]'
                    : 'text-[#94B5B0] hover:text-white hover:bg-teal-950/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#19E6C8] drop-shadow-[0_0_6px_#19E6C8]' : 'text-[#5B7B76]'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#061817] text-[#94B5B0] border border-teal-500/15">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Monthly Budget Mini Widget */}
        {totalBudgetPaise > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#061817]/70 border border-teal-500/15">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-[#94B5B0] font-medium">Monthly Budget</span>
              <span
                className={`font-bold font-mono ${
                  budgetPercent >= 90 ? 'text-[#FF6B6B]' : 'text-[#19E6C8]'
                }`}
              >
                {budgetPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#030807] rounded-full overflow-hidden border border-teal-500/20">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetPercent >= 90
                    ? 'bg-[#FF6B6B] shadow-[0_0_8px_#FF6B6B]'
                    : budgetPercent >= 75
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : 'bg-[#19E6C8] shadow-[0_0_8px_#19E6C8]'
                }`}
                style={{ width: `${Math.min(100, budgetPercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#5B7B76] mt-1 font-mono">
              <span>{formatInr(periodExpense, { showDecimals: false })}</span>
              <span>{formatInr(totalBudgetPaise, { showDecimals: false })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions: Welcome Page, Styleguide, Report, Categories, Settings */}
      <div className="border-t border-teal-500/15 pt-3 space-y-1">
        <button
          onClick={() => setActiveTab('welcome')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
            activeTab === 'welcome'
              ? 'bg-teal-500/10 text-[#19E6C8] border border-teal-500/20'
              : 'text-[#94B5B0] hover:text-white hover:bg-teal-950/30'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#19E6C8]" />
          <span>Product Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('styleguide')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
            activeTab === 'styleguide'
              ? 'bg-teal-500/10 text-[#19E6C8] border border-teal-500/20'
              : 'text-[#94B5B0] hover:text-white hover:bg-teal-950/30'
          }`}
        >
          <Palette className="w-4 h-4 text-[#19E6C8]" />
          <span>Design Styleguide</span>
        </button>

        <button
          onClick={openMonthlyReport}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#94B5B0] hover:text-white hover:bg-teal-950/30 transition-colors"
        >
          <FileText className="w-4 h-4 text-[#5B7B76]" />
          <span>Monthly Statement</span>
        </button>

        <button
          onClick={openCategoryManager}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#94B5B0] hover:text-white hover:bg-teal-950/30 transition-colors"
        >
          <Tags className="w-4 h-4 text-[#5B7B76]" />
          <span>Categories & Icons</span>
        </button>

        <button
          onClick={openSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#94B5B0] hover:text-white hover:bg-teal-950/30 transition-colors"
        >
          <SettingsIcon className="w-4 h-4 text-[#5B7B76]" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
