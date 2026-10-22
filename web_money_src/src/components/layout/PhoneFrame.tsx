import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopTopBar } from './DesktopTopBar';
import { Header } from './Header';
import { MonthNavigator } from './MonthNavigator';
import { BottomNav } from './BottomNav';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { settings, updateSettings, activeTab } = useMoney();
  const isFrameOn = settings.isPhoneFrameEnabled;

  const toggleFrame = () => {
    updateSettings({ isPhoneFrameEnabled: !isFrameOn });
  };

  // 1. Phone Frame Preview Mode (Simulated 420px mobile mockup for testing)
  if (isFrameOn) {
    return (
      <div className="min-h-screen w-full bg-[#05070c] flex items-center justify-center p-0 md:p-6 transition-all duration-300">
        {/* Desktop Floating Frame Toggle */}
        <div className="hidden md:flex fixed top-4 right-4 z-50 items-center gap-2 bg-slate-900/95 border border-slate-700/80 rounded-full px-3 py-1.5 shadow-2xl backdrop-blur-md">
          <span className="text-xs text-slate-400 font-medium">Layout:</span>
          <button
            onClick={toggleFrame}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-glow-blue transition-all"
            title="Switch back to Laptop Dashboard"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Switch to Laptop Dashboard</span>
          </button>
        </div>

        {/* 420px Phone Mockup Container */}
        <div className="w-full min-h-screen md:min-h-0 md:max-w-[420px] md:h-[890px] md:rounded-[48px] md:shadow-[0_25px_70px_rgba(0,0,0,0.85)] md:border-[10px] md:border-[#1e293b] md:overflow-hidden md:ring-1 md:ring-slate-700/50 relative flex flex-col bg-[#090d16] text-slate-100">
          {/* Dynamic Island / Hardware bezel */}
          <div className="hidden md:flex justify-center items-center pt-3 pb-1 shrink-0 z-30 bg-[#090d16]">
            <div className="w-24 h-4 bg-slate-950 rounded-full border border-slate-800/80 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-blue-900/50" />
            </div>
          </div>

          {/* Mobile Header & Navigator inside Phone Frame */}
          <Header />
          {activeTab !== 'wallet' && <MonthNavigator />}

          {/* Content Body */}
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
            {children}
          </div>

          {/* Mobile Bottom Nav */}
          <BottomNav />
        </div>
      </div>
    );
  }

  // 2. DEFAULT FOR LAPTOP / DESKTOP: Full Executive Workspace Dashboard
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070b14] text-slate-100 font-sans antialiased">
      {/* Desktop Sidebar (hidden on mobile, visible on md+) */}
      <div className="hidden md:flex h-full">
        <DesktopSidebar />
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        {/* Desktop Top Bar (hidden on mobile, visible on md+) */}
        <div className="hidden md:block">
          <DesktopTopBar />
        </div>

        {/* Mobile Header & Month Navigator (visible on mobile only) */}
        <div className="md:hidden">
          <Header />
          {activeTab !== 'wallet' && <MonthNavigator />}
        </div>

        {/* Main Content Area: Spacious & Scrollable */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto relative">
          {children}
        </main>

        {/* Mobile Bottom Navigation (visible on mobile only) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};
