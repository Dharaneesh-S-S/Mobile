import React, { useState, useEffect } from 'react'
import { Wifi, BatteryMedium, Signal } from 'lucide-react'

export const PhoneFrame: React.FC<{ children: React.ReactNode; isEnabled: boolean }> = ({
  children,
  isEnabled,
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      setCurrentTimeStr(`${hours}:${minutes.toString().padStart(2, '0')}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [])

  if (!isEnabled) {
    return <>{children}</>
  }

  return (
    <div className="hidden lg:flex min-h-screen bg-slate-950/90 items-center justify-center p-6 py-8">
      {/* Phone Hardware Mockup Bezel */}
      <div className="relative w-[420px] h-[870px] bg-slate-900 border-[10px] border-slate-800 rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
        {/* Hardware Status Bar (Punch Hole Camera & Clock) */}
        <div className="h-9 w-full bg-slate-900 text-slate-300 px-6 flex items-center justify-between text-xs font-semibold select-none z-40 shrink-0">
          <span>{currentTimeStr || '9:41'}</span>
          {/* Punch-hole camera */}
          <div className="w-3.5 h-3.5 rounded-full bg-black ring-2 ring-slate-800 shrink-0" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Inner Phone Screen App Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-900">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="h-5 w-full bg-slate-900 flex items-center justify-center shrink-0 z-40">
          <div className="w-32 h-1 rounded-full bg-slate-600/80" />
        </div>
      </div>
    </div>
  )
}
