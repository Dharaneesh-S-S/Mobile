import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { settings, updateSettings } = useMoney();
  const isFrameOn = settings.isPhoneFrameEnabled;

  const toggleFrame = () => {
    updateSettings({ isPhoneFrameEnabled: !isFrameOn });
  };

  return (
    <div className="min-h-screen w-full bg-[#05070c] flex items-center justify-center p-0 md:p-6 transition-all duration-300">
      {/* Desktop Floating Frame Toggle */}
      <div className="hidden md:flex fixed top-4 right-4 z-40 items-center gap-2 bg-slate-900/90 border border-slate-700/70 rounded-full px-3 py-1.5 shadow-xl backdrop-blur-md">
        <span className="text-xs text-slate-400 font-medium">Layout:</span>
        <button
          onClick={toggleFrame}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            isFrameOn
              ? 'bg-blue-600 text-white shadow-glow-blue'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Toggle phone mockup frame"
        >
          {isFrameOn ? (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Frame (420px)</span>
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Expanded View</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full min-h-screen md:min-h-0 relative flex flex-col bg-[#090d16] text-slate-100 transition-all duration-300 ${
          isFrameOn
            ? 'md:max-w-[420px] md:h-[890px] md:rounded-[44px] md:shadow-[0_25px_70px_rgba(0,0,0,0.85)] md:border-[10px] md:border-[#1e293b] md:overflow-hidden md:ring-1 md:ring-slate-700/50'
            : 'max-w-2xl md:rounded-3xl md:border md:border-slate-800 md:shadow-2xl md:my-6 md:min-h-[850px] md:overflow-hidden'
        }`}
      >
        {/* Dynamic Island / Speaker cutout on frame */}
        {isFrameOn && (
          <div className="hidden md:flex justify-center items-center pt-3 pb-1 shrink-0 z-30 bg-[#090d16]">
            <div className="w-24 h-4 bg-slate-950 rounded-full border border-slate-800/80 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-blue-900/50" />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
