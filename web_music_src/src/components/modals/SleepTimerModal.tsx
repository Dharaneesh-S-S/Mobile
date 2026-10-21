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
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base font-display">Sleep Timer</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Timer Status if active */}
        {sleepRemainingSeconds !== null ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
            <span className="block text-xs font-semibold text-amber-300">
              Music will automatically pause in:
            </span>
            <div className="text-3xl font-extrabold font-mono text-amber-400">
              {formatDuration(sleepRemainingSeconds)}
            </div>
            <p className="text-[11px] text-slate-400">
              Includes a gentle 30-second volume fade-out.
            </p>
            <button
              type="button"
              onClick={() => {
                cancelSleepTimer()
              }}
              className="mt-2 px-4 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-colors"
            >
              Cancel Sleep Timer
            </button>
          </div>
        ) : (
          /* Presets selection */
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-400">Choose Duration</span>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setSleepTimer(mins)
                    onClose()
                  }}
                  className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-fuchsia-600 hover:text-white text-slate-200 font-bold text-xs transition-colors"
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
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-fuchsia-600 hover:text-white text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>End of Track</span>
              </button>
            </div>

            {/* Custom Minutes Slider */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Custom Duration</span>
                <span className="text-fuchsia-400 font-mono">{customMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                className="w-full accent-fuchsia-500 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => {
                  setSleepTimer(customMinutes)
                  onClose()
                }}
                className="w-full mt-2 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs shadow-md shadow-fuchsia-600/30 transition-all"
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
