import React, { useState, useEffect } from 'react';
import { useMoney, MoneyProvider } from './context/MoneyContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { TransactionList } from './components/transactions/TransactionList';
import { CalendarView } from './components/calendar/CalendarView';
import { StatisticView } from './components/statistics/StatisticView';
import { WalletView } from './components/wallet/WalletView';
import { AddRecordModal } from './components/recordForm/AddRecordModal';
import { SearchModal } from './components/transactions/SearchModal';
import { CategoryManagerModal } from './components/recordForm/CategoryManagerModal';
import { AccountSwitcherModal } from './components/settings/AccountSwitcherModal';
import { MonthlyReportModal } from './components/settings/MonthlyReportModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { PasscodeLock } from './components/common/PasscodeLock';
import { Sparkles, ArrowRight } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openAddRecord,
    openSearch,
    isLocked,
    unlockApp,
    settings,
    records,
    loadDemoData,
    updateSettings,
    isCategoryManagerOpen,
    closeCategoryManager,
  } = useMoney();

  // Desktop Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Shortcut: "N" or "n" for New Transaction
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openAddRecord();
      }

      // Shortcut: "Ctrl+K" or "/" for Search
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || e.key === '/') {
        e.preventDefault();
        openSearch();
      }

      // Numeric shortcuts: 1-4 for Tabs
      if (e.key === '1') setActiveTab('transactions');
      if (e.key === '2') setActiveTab('calendar');
      if (e.key === '3') setActiveTab('statistics');
      if (e.key === '4') setActiveTab('wallet');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAddRecord, openSearch, setActiveTab]);

  // First launch banner / prompt
  const [dismissFirstLaunch, setDismissFirstLaunch] = useState<boolean>(false);
  const showFirstLaunchPrompt =
    !dismissFirstLaunch &&
    !settings.hasSeededData &&
    records.length === 0;

  if (isLocked && settings.isPasscodeEnabled && settings.passcode) {
    return <PasscodeLock storedPasscode={settings.passcode} onSuccess={unlockApp} />;
  }

  return (
    <div className="w-full h-screen min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans antialiased overflow-hidden select-none">
      {/* 1. Universal Top Header (Adapts automatically to screen width) */}
      <Header />

      {/* 2. Main Content View Area (Fills 100% width and height, fluidly responsive) */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto relative w-full">
        {activeTab === 'transactions' && <TransactionList />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'statistics' && <StatisticView />}
        {activeTab === 'wallet' && <WalletView />}
      </main>

      {/* 3. Mobile Bottom Navigation (Only visible on mobile / narrow screens < md) */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      {/* Global Modals */}
      <AddRecordModal />
      <SearchModal />
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={closeCategoryManager}
      />
      <AccountSwitcherModal />
      <MonthlyReportModal />
      <SettingsModal />

      {/* First Launch Modal */}
      {showFirstLaunchPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto shadow-glow-blue">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-display">Welcome to RupeeFlow</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Personal Money Studio for Indian Rupee (₹). Would you like to start fresh or explore with 2 months of sample rupee records?
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={async () => {
                  await loadDemoData();
                  setDismissFirstLaunch(true);
                }}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Load Sample Data (2 Months)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setDismissFirstLaunch(true);
                  updateSettings({ hasSeededData: true });
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MoneyProvider>
      <MainAppContent />
    </MoneyProvider>
  );
};
export default App;
