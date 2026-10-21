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
    <div className="min-h-screen bg-neutral-200/60 dark:bg-neutral-950 flex flex-col items-center justify-start sm:py-6 selection:bg-emerald-500/20">
      {/* Optional Desktop Frame Switcher floating button */}
      <div className="hidden sm:flex fixed top-4 right-4 z-50 items-center gap-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 dark:border-neutral-800 shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300">
        <Smartphone size={14} className="text-emerald-500" />
        <span>Phone Bezel:</span>
        <button
          onClick={onToggleFrame}
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
            phoneFrameMode
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          {phoneFrameMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full max-w-[430px] flex flex-col bg-white dark:bg-[#121316] text-gray-900 dark:text-gray-100 min-h-screen sm:min-h-[92vh] sm:max-h-[92vh] transition-all relative overflow-hidden ${
          phoneFrameMode
            ? 'sm:rounded-[48px] phone-shadow-bezel sm:border-[8px] sm:border-neutral-900 sm:ring-1 sm:ring-neutral-700'
            : 'sm:rounded-3xl sm:shadow-2xl sm:border sm:border-gray-200/80 dark:sm:border-neutral-800'
        }`}
      >
        {/* Native Status Bar */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#121316]/95 backdrop-blur-sm px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none text-gray-800 dark:text-gray-200">
          <span>{timeStr}</span>

          {/* Dynamic Island / Punch Hole */}
          {phoneFrameMode && (
            <div className="w-20 h-4 bg-neutral-900 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700 ml-6" />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <span className="text-[10px] tracking-wider font-bold">5G</span>
            <Wifi size={13} strokeWidth={2.4} />
            <Battery size={15} strokeWidth={2.4} className="text-emerald-500" />
          </div>
        </div>

        {/* Scrollable App Body */}
        <div className="flex-1 overflow-y-auto flex flex-col relative">{children}</div>

        {/* Bottom Home Indicator Pill */}
        <div className="shrink-0 py-2 flex justify-center bg-white/90 dark:bg-[#121316]/90 backdrop-blur-sm select-none">
          <div className="w-32 h-1 bg-gray-400/50 dark:bg-neutral-600 rounded-full" />
        </div>
      </div>
    </div>
  )
}
