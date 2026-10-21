import React from 'react';
import {
  ChevronDown,
  Eye,
  EyeOff,
  Search,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  FileText,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentAccount,
    totalAccountBalance,
    isBalanceHidden,
    toggleHideBalance,
    chartStyle,
    toggleChartStyle,
    openSearch,
    openAccountSwitcher,
    openMonthlyReport,
    settings,
  } = useMoney();

  // If on wallet tab, Wallet tab renders its own customized balance card, but header can still be neat
  const isWalletTab = activeTab === 'wallet';

  return (
    <header className="px-4 pt-3 pb-2.5 bg-[#090d16]/95 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
      {/* Left: Account & Balance */}
      <div
        onClick={openAccountSwitcher}
        className="flex flex-col cursor-pointer select-none group pr-2"
        role="button"
        tabIndex={0}
        aria-label="Switch account"
      >
        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium group-hover:text-slate-300 transition-colors">
          <span>{currentAccount?.name || 'Personal'}</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
            {isBalanceHidden
              ? '₹ ••••••'
              : formatInr(totalAccountBalance, {
                  showDecimals: settings.showDecimals,
                  useInternationalGrouping: settings.numberGrouping === 'intl',
                })}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleHideBalance();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
            title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
            aria-label={isBalanceHidden ? 'Show balance' : 'Hide balance'}
          >
            {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Right: Tab-specific Action Icons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Printable Statement / Monthly Report */}
        <button
          onClick={openMonthlyReport}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all"
          title="Monthly Statement & Reports"
          aria-label="Monthly Statement"
        >
          <FileText className="w-5 h-5" />
        </button>

        {activeTab === 'transactions' && (
          <>
            <button
              onClick={openSearch}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all"
              title="Search transactions"
              aria-label="Search transactions"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all"
              title="Jump to Calendar view"
              aria-label="Jump to Calendar view"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {activeTab === 'calendar' && (
          <button
            onClick={openSearch}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all"
            title="Search transactions"
            aria-label="Search transactions"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        {activeTab === 'statistics' && (
          <>
            <button
              onClick={toggleChartStyle}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all"
              title={chartStyle === 'donut' ? 'Switch to Bar Chart' : 'Switch to Donut Chart'}
              aria-label="Toggle Chart View"
            >
              {chartStyle === 'donut' ? (
                <BarChart3 className="w-5 h-5 text-blue-400" />
              ) : (
                <PieChart className="w-5 h-5 text-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all"
              title="View Calendar"
              aria-label="View Calendar"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
