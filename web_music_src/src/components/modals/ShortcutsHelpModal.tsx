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
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-white space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-fuchsia-400" />
            <h3 className="font-extrabold text-base font-display">Keyboard Shortcuts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5 text-xs max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/60"
            >
              <kbd className="px-2 py-0.5 rounded-md bg-slate-800 text-fuchsia-400 font-mono font-bold text-[11px] border border-slate-700">
                {s.key}
              </kbd>
              <span className="text-slate-300 font-medium text-right">
                {s.desc}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
