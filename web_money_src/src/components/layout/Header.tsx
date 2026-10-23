import React, { useState } from 'react';
import {
  ReceiptText,
  CalendarDays,
  PieChart,
  Wallet as WalletIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  Plus,
  FileText,
  Settings as SettingsIcon,
  Calendar as CalendarIcon,
  RotateCcw,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';
import { ViewRangeType } from '../../types/money';

const RANGE_OPTIONS: { id: ViewRangeType; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'all', label: 'All' },
];

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentAccount,
    totalAccountBalance,
    isBalanceHidden,
    toggleHideBalance,
    openSearch,
    openAddRecord,
    openAccountSwitcher,
    openMonthlyReport,
    openSettings,
    dateRange,
    navigatePeriod,
    viewRange,
    setViewRange,
    anchorDate,
    setAnchorDate,
    filteredRecords,
    settings,
  } = useMoney();

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  const navTabs = [
    { id: 'transactions' as const, label: 'Transactions', icon: ReceiptText, count: filteredRecords.length },
    { id: 'calendar' as const, label: 'Calendar', icon: CalendarDays },
    { id: 'statistics' as const, label: 'Analytics', icon: PieChart },
    { id: 'wallet' as const, label: 'Wallets', icon: WalletIcon },
  ];

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  return (
    <header className="w-full bg-[#030707]/90 border-b border-teal-500/15 backdrop-blur-2xl shadow-md select-none shrink-0 z-30">
      {/* Main Top Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Desktop Left: Section Title & Subtitle */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                {activeTab === 'transactions' && 'Transactions'}
                {activeTab === 'calendar' && 'Calendar Breakdown'}
                {activeTab === 'statistics' && 'Analytics & Reports'}
                {activeTab === 'wallet' && 'Wallets & Accounts'}
                {activeTab === 'welcome' && 'Product Overview'}
                {activeTab === 'styleguide' && 'Design Styleguide'}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-[#19E6C8] border border-teal-500/25 font-mono shadow-[0_0_10px_rgba(25,230,200,0.15)]">
                {activeTab === 'transactions' && `${filteredRecords.length} Records`}
                {activeTab === 'calendar' && dateRange.label}
                {activeTab === 'statistics' && viewRange.toUpperCase()}
                {activeTab === 'wallet' && 'Balances'}
                {activeTab === 'welcome' && 'SHOWCASE'}
                {activeTab === 'styleguide' && 'TOKENS'}
              </span>
            </div>
            <p className="text-[11px] text-[#94B5B0] font-medium -mt-0.5">
              {activeTab === 'transactions' && 'Income, expense, and daily cash flow stream'}
              {activeTab === 'calendar' && 'Daily financial overview and activity schedule'}
              {activeTab === 'statistics' && 'Visual charts, spending trends, and category distribution'}
              {activeTab === 'wallet' && 'Multi-account management, debts, and savings goals'}
              {activeTab === 'welcome' && 'Futuristic fintech experience & feature showcase'}
              {activeTab === 'styleguide' && 'Design tokens, glass surfaces, buttons, and metrics'}
            </p>
          </div>
        </div>

        {/* Mobile Left: Branding & Account Balance (visible only on mobile < md) */}
        <div className="flex md:hidden items-center gap-2.5 shrink-0">
          {/* Logo */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#19E6C8] to-[#0D9488] p-[1px] shadow-[0_0_15px_rgba(25,230,200,0.4)] flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#030807] rounded-full flex items-center justify-center font-display font-black text-[#19E6C8] text-sm">
              ₹
            </div>
          </div>

          {/* Account Switcher & Balance Pill */}
          <div
            onClick={openAccountSwitcher}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#061817]/80 border border-teal-500/20 hover:border-teal-400/40 cursor-pointer transition-all group"
            role="button"
            tabIndex={0}
            title="Switch Account"
          >
            <div className="flex items-center gap-1 text-[#94B5B0] text-[11px] font-semibold">
              <span className="max-w-[70px] truncate">{currentAccount?.name || 'Personal'}</span>
              <ChevronDown className="w-3 h-3 text-[#5B7B76]" />
            </div>

            <div className="h-3 w-[1px] bg-teal-500/20" />

            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white font-display tracking-tight text-glow-teal">
                {isBalanceHidden ? '₹••••' : formatInr(totalAccountBalance, opts)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHideBalance();
                }}
                className="text-[#5B7B76] hover:text-[#19E6C8] p-0.5 transition-colors"
                title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
              >
                {isBalanceHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Period Navigator (on desktop) & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Period Navigator (visible on md+) */}
          {activeTab !== 'wallet' && activeTab !== 'welcome' && activeTab !== 'styleguide' && (
            <div className="hidden md:flex items-center gap-1 bg-[#061817]/70 border border-teal-500/20 rounded-full p-1 backdrop-blur-md">
              <button
                onClick={() => navigatePeriod('prev')}
                className="p-1 rounded-full text-[#94B5B0] hover:text-white hover:bg-teal-950/50 transition-colors"
                title="Previous period"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMonthPickerOpen((p) => !p)}
                className="px-2.5 py-0.5 text-xs font-bold text-slate-200 hover:text-[#19E6C8] flex items-center gap-1.5 transition-colors"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-[#19E6C8]" />
                <span>{dateRange.label}</span>
              </button>

              <button
                onClick={() => navigatePeriod('next')}
                className="p-1 rounded-full text-[#94B5B0] hover:text-white hover:bg-teal-950/50 transition-colors"
                title="Next period"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Range Selector Dropdown/Pills on desktop */}
              <div className="flex items-center gap-0.5 border-l border-teal-500/20 pl-1 ml-0.5">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setViewRange(opt.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                      viewRange === opt.id
                        ? 'bg-[#19E6C8] text-black font-bold shadow-[0_0_10px_rgba(25,230,200,0.4)]'
                        : 'text-[#94B5B0] hover:text-white hover:bg-teal-950/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={openSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#061817]/70 hover:bg-teal-950/50 border border-teal-500/20 text-[#94B5B0] hover:text-white text-xs transition-all backdrop-blur-md cursor-pointer"
            title="Search transactions (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#5B7B76]" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden xl:inline text-[9px] font-mono bg-[#030807] px-1 py-0.5 rounded text-[#94B5B0] border border-teal-500/20">
              Ctrl K
            </kbd>
          </button>

          {/* Primary "+ New" White Pill Button */}
          <button
            onClick={() => openAddRecord()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] hover:shadow-[0_0_25px_rgba(25,230,200,0.3)] transition-all active:scale-95 cursor-pointer"
            title="New Transaction (Shortcut: N)"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">New Record</span>
          </button>

          {/* Monthly Report Button */}
          <button
            onClick={openMonthlyReport}
            className="p-2 rounded-full bg-[#061817]/70 hover:bg-teal-950/50 border border-teal-500/20 text-[#94B5B0] hover:text-white transition-colors cursor-pointer"
            title="Monthly Statement & PDF"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={openSettings}
            className="p-2 rounded-full bg-[#061817]/70 hover:bg-teal-950/50 border border-teal-500/20 text-[#94B5B0] hover:text-white transition-colors cursor-pointer"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-Bar for Mobile or Compact View: Period Navigator & Range Selector */}
      {activeTab !== 'wallet' && (
        <div className="lg:hidden px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between gap-2">
          {/* Previous / Next and Date label */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigatePeriod('prev')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMonthPickerOpen((p) => !p)}
              className="text-xs font-bold text-slate-200 px-2 py-0.5 rounded hover:bg-slate-800 flex items-center gap-1.5"
            >
              <CalendarIcon className="w-3 h-3 text-blue-400" />
              <span>{dateRange.label}</span>
            </button>
            <button
              onClick={() => navigatePeriod('next')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Range Selector */}
          <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-xl border border-slate-800">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setViewRange(opt.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                  viewRange === opt.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Month Picker Modal / Dropdown */}
      {isMonthPickerOpen && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-40 z-50 bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl w-72 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-white">
            <button
              onClick={() => {
                const updated = new Date(anchorDate);
                updated.setFullYear(anchorDate.getFullYear() - 1);
                setAnchorDate(updated);
              }}
              className="p-1 hover:bg-slate-800 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>{anchorDate.getFullYear()}</span>
            <button
              onClick={() => {
                const updated = new Date(anchorDate);
                updated.setFullYear(anchorDate.getFullYear() + 1);
                setAnchorDate(updated);
              }}
              className="p-1 hover:bg-slate-800 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {monthNames.map((m, idx) => {
              const isSelected = anchorDate.getMonth() === idx;
              return (
                <button
                  key={m}
                  onClick={() => {
                    const updated = new Date(anchorDate);
                    updated.setMonth(idx);
                    setAnchorDate(updated);
                    setIsMonthPickerOpen(false);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-glow-blue'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
