import React from 'react'
import { X, Keyboard } from 'lucide-react'

export const ShortcutsHelpModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause' },
    { key: '← / →', desc: 'Seek 5 seconds back / forward' },
    { key: 'Shift + ← / →', desc: 'Previous / Next track' },
    { key: '↑ / ↓', desc: 'Volume up / down' },
    { key: 'M', desc: 'Mute / Unmute' },
    { key: 'S', desc: 'Toggle Shuffle' },
    { key: 'R', desc: 'Cycle Repeat (Off / All / One)' },
    { key: 'L', desc: 'Like (Favorite) current track' },
    { key: 'Q', desc: 'Open / Close Play Queue' },
    { key: 'N', desc: 'Expand / Minimize Now Playing' },
    { key: '/', desc: 'Focus instant Search' },
    { key: '?', desc: 'Show this keyboard help' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-sm bg-[#051413]/95 border border-teal-500/25 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col text-[#F4FFFD] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-teal-500/15">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#19E6C8]" />
            <h3 className="font-extrabold text-base font-display text-[#F4FFFD]">Keyboard Shortcuts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5 text-xs max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-[#030d0c] border border-teal-500/20"
            >
              <kbd className="px-2 py-0.5 rounded-md bg-[#081f1d] text-[#19E6C8] font-mono font-bold text-[11px] border border-teal-500/30">
                {s.key}
              </kbd>
              <span className="text-[#94B5B0] font-medium text-right">
                {s.desc}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end border-t border-teal-500/15">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-[#04100F] text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.22)] transition-all active:scale-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
