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
    <header className="w-full bg-[#0a0f1d] border-b border-slate-800/90 shadow-md select-none shrink-0 z-30">
      {/* Main Top Bar */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Branding & Account Balance */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-glow-blue flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-display font-black text-blue-400 text-base">
                ₹
              </div>
            </div>
            <div className="hidden xl:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white tracking-tight font-display">
                  RupeeFlow
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  INR
                </span>
              </div>
            </div>
          </div>

          {/* Account Switcher & Balance Pill */}
          <div
            onClick={openAccountSwitcher}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
            role="button"
            tabIndex={0}
            title="Switch Account"
          >
            <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold group-hover:text-slate-200 transition-colors">
              <span>{currentAccount?.name || 'Personal'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:translate-y-0.5 transition-transform" />
            </div>

            <div className="h-4 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black text-white font-display tracking-tight">
                {isBalanceHidden ? '₹ ••••••' : formatInr(totalAccountBalance, opts)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHideBalance();
                }}
                className="text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
                title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
              >
                {isBalanceHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Center: Navigation Tabs (Desktop & Tablet: >= md) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 shrink-0">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-glow-blue'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Period Navigator (on desktop) & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Period Navigator (visible on lg+) */}
          {activeTab !== 'wallet' && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-950/70 border border-slate-800 rounded-xl p-0.5">
              <button
                onClick={() => navigatePeriod('prev')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
                title="Previous period"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMonthPickerOpen((p) => !p)}
                className="px-2 py-1 text-xs font-bold text-slate-200 hover:text-blue-400 flex items-center gap-1.5 transition-colors"
              >
                <CalendarIcon className="w-3 h-3 text-blue-400" />
                <span>{dateRange.label}</span>
              </button>

              <button
                onClick={() => navigatePeriod('next')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
                title="Next period"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={openSearch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all"
            title="Search transactions (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden xl:inline text-[9px] font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-400 border border-slate-700">
              Ctrl K
            </kbd>
          </button>

          {/* Primary "+ New" Button */}
          <button
            onClick={() => openAddRecord()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-blue transition-all active:scale-95"
            title="New Transaction (Shortcut: N)"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
            <span className="hidden sm:inline">New Record</span>
          </button>

          {/* Monthly Report Button */}
          <button
            onClick={openMonthlyReport}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Monthly Statement & PDF"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={openSettings}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-colors"
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
