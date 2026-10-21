import React, { useState, useEffect } from 'react'
import { Wifi, Battery, Smartphone } from 'lucide-react'

interface PhoneFrameProps {
  children: React.ReactNode
  phoneFrameMode: boolean
  onToggleFrame?: () => void
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  phoneFrameMode,
  onToggleFrame,
}) => {
  const [timeStr, setTimeStr] = useState('9:41')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const hrs = now.getHours()
      const mins = now.getMinutes()
      setTimeStr(`${hrs % 12 || 12}:${mins < 10 ? '0' : ''}${mins}`)
    }
    update()
    const timer = setInterval(update, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#06080F] flex flex-col items-center justify-start sm:py-6 relative overflow-x-hidden ambient-mesh selection:bg-emerald-500/20">
      {/* Ambient background glowing light orbs */}
      <div className="hidden sm:block absolute top-12 left-1/2 -translate-x-[360px] w-96 h-96 rounded-full bg-emerald-500/[0.07] dark:bg-emerald-500/[0.12] blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute top-48 left-1/2 translate-x-[120px] w-[420px] h-[420px] rounded-full bg-teal-500/[0.06] dark:bg-indigo-500/[0.1] blur-3xl pointer-events-none" />

      {/* Desktop Frame Switcher floating badge */}
      <div className="hidden sm:flex fixed top-4 right-4 z-50 items-center gap-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 shadow-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
        <Smartphone size={14} className="text-emerald-500" />
        <span>Phone Bezel:</span>
        <button
          onClick={onToggleFrame}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
            phoneFrameMode
              ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {phoneFrameMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full max-w-[430px] flex flex-col bg-slate-50/95 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 min-h-screen sm:min-h-[92vh] sm:max-h-[92vh] transition-all relative overflow-hidden ${
          phoneFrameMode
            ? 'sm:rounded-[48px] phone-shadow-bezel sm:border-[10px] sm:border-[#161B26] sm:ring-1 sm:ring-white/10'
            : 'sm:rounded-[36px] sm:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.18)] dark:sm:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] sm:border sm:border-slate-200/90 dark:sm:border-white/[0.08]'
        }`}
      >
        {/* Native Status Bar */}
        <div className="sticky top-0 z-40 bg-slate-50/90 dark:bg-[#090D16]/90 backdrop-blur-xl px-6 pt-3 pb-1.5 flex items-center justify-between text-xs font-semibold select-none text-slate-800 dark:text-slate-200 border-b border-transparent dark:border-white/[0.03]">
          <span className="font-bold tracking-tight">{timeStr}</span>

          {/* Dynamic Island / Punch Hole */}
          {phoneFrameMode && (
            <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700 ml-6" />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="text-[10px] tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400">5G</span>
            <Wifi size={13} strokeWidth={2.4} />
            <Battery size={15} strokeWidth={2.4} className="text-emerald-500" />
          </div>
        </div>

        {/* Scrollable App Body */}
        <div className="flex-1 overflow-y-auto flex flex-col relative no-scrollbar">{children}</div>

        {/* Bottom Home Indicator Pill */}
        <div className="shrink-0 py-2.5 flex justify-center bg-slate-50/80 dark:bg-[#090D16]/80 backdrop-blur-xl select-none">
          <div className="w-32 h-1 bg-slate-400/40 dark:bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  )
}
