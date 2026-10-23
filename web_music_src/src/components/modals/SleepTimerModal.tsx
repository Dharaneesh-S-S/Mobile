import React, { useState } from 'react'
import { X, Moon, Clock, PlayCircle, Check, AlertCircle } from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'

export const SleepTimerModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { sleepRemainingSeconds, setSleepTimer, cancelSleepTimer } = useMusic()
  const [customMinutes, setCustomMinutes] = useState<number>(20)

  if (!isOpen) return null

  const presets = [15, 30, 45, 60, 90]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-sm bg-[#051413]/95 border border-teal-500/25 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col text-[#F4FFFD] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-teal-500/15">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-[#19E6C8]" />
            <h3 className="font-extrabold text-base font-display text-[#F4FFFD]">Sleep Timer</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Timer Status if active */}
        {sleepRemainingSeconds !== null ? (
          <div className="p-4 rounded-2xl bg-teal-500/15 border border-teal-400/30 text-center space-y-2">
            <span className="block text-xs font-semibold text-[#2DD4BF]">
              Music will automatically pause in:
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#19E6C8]">
              {formatDuration(sleepRemainingSeconds)}
            </div>
            <p className="text-[11px] text-[#94B5B0]">
              Includes a gentle 30-second volume fade-out.
            </p>
            <button
              type="button"
              onClick={() => {
                cancelSleepTimer()
              }}
              className="mt-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-colors"
            >
              Cancel Sleep Timer
            </button>
          </div>
        ) : (
          /* Presets selection */
          <div className="space-y-3">
            <span className="block text-xs font-bold text-[#94B5B0]">Choose Duration</span>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setSleepTimer(mins)
                    onClose()
                  }}
                  className="py-2.5 px-2 rounded-xl bg-[#030d0c] border border-teal-500/20 hover:border-[#19E6C8] hover:bg-teal-500/15 text-[#F4FFFD] font-bold text-xs transition-colors"
                >
                  {mins} min
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSleepTimer('end-of-track')
                  onClose()
                }}
                className="py-2.5 px-2 rounded-xl bg-[#030d0c] border border-teal-500/20 hover:border-[#19E6C8] hover:bg-teal-500/15 text-[#F4FFFD] font-bold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>End of Track</span>
              </button>
            </div>

            {/* Custom Minutes Slider */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#94B5B0]">
                <span>Custom Duration</span>
                <span className="text-[#19E6C8] font-mono">{customMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                className="w-full accent-[#19E6C8] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => {
                  setSleepTimer(customMinutes)
                  onClose()
                }}
                className="w-full mt-2 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] transition-all active:scale-95"
              >
                Set {customMinutes} min Timer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
