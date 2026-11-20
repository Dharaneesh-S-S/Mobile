import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { ViewRangeType } from '../../types/money';
import { DateSelectionModal } from './DateSelectionModal';

// Range selector options without 'All'
const RANGE_OPTIONS: { id: ViewRangeType; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

export const Header: React.FC = () => {
  const {
    activeTab,
    openSearch,
    dateRange,
    navigatePeriod,
    viewRange,
    setViewRange,
    anchorDate,
    setAnchorDate,
    settings,
  } = useMoney();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  return (
    <header className="w-full bg-[#030707]/90 border-b border-teal-500/15 backdrop-blur-2xl shadow-md select-none shrink-0 z-30">
      {/* Primary Navigation Bar (Promoted from secondary sub-bar with Search added) */}
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Period Navigator (Previous, Date Range with Adapted Picker, Next) */}
        {activeTab !== 'wallet' ? (
          <div className="flex items-center gap-1 bg-[#061817]/70 border border-teal-500/20 rounded-xl p-1 backdrop-blur-md">
            <button
              onClick={() => navigatePeriod('prev')}
              className="p-1 rounded-lg text-[#94B5B0] hover:text-white hover:bg-teal-950/50 transition-colors cursor-pointer"
              title="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="px-2.5 py-1 text-xs font-bold text-white hover:text-[#19E6C8] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Select Date / Period"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#19E6C8]" />
              <span>{dateRange.label}</span>
            </button>

            <button
              onClick={() => navigatePeriod('next')}
              className="p-1 rounded-lg text-[#94B5B0] hover:text-white hover:bg-teal-950/50 transition-colors cursor-pointer"
              title="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-sm font-bold text-white font-display flex items-center gap-2 px-1">
            <WalletIcon className="w-4 h-4 text-[#19E6C8]" />
            <span>Wallets & Accounts</span>
          </div>
        )}

        {/* Right Section: Range Selector (Day, Week, Month, Year - NO All option) & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeTab !== 'wallet' && (
            <div className="flex items-center gap-0.5 bg-[#061817]/80 p-1 rounded-xl border border-teal-500/20">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setViewRange(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    viewRange === opt.id
                      ? 'bg-[#19E6C8] text-black font-bold shadow-[0_0_10px_rgba(25,230,200,0.35)]'
                      : 'text-[#94B5B0] hover:text-white hover:bg-teal-950/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Search Bar */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#061817]/80 hover:bg-teal-950/50 border border-teal-500/20 hover:border-teal-400/40 text-xs text-[#94B5B0] hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-sm"
            title="Search transactions (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#19E6C8]" />
            <span className="hidden sm:inline text-[#5B7B76]">Search...</span>
            <kbd className="hidden md:inline text-[9px] font-mono bg-[#030807] px-1.5 py-0.5 rounded text-[#94B5B0] border border-teal-500/20 ml-0.5">
              Ctrl K
            </kbd>
          </button>
        </div>
      </div>

      {/* Adapted Date Selection Modal based on viewRange:
          - Year view: Only year selection appears
          - Month view: Year + 12 Months appear as now
          - Week view: Month selection first, then week selection of that month
          - Day view: Month selection first, then day calendar grid of that month
      */}
      <DateSelectionModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        viewRange={viewRange}
        anchorDate={anchorDate}
        onSelectDate={(newDate) => setAnchorDate(newDate)}
        weekStartsOn={settings.weekStartDay}
      />
    </header>
  );
};
