import React from 'react'
import { HelpCircle, X, Command } from 'lucide-react'

interface ShortcutsHelpModalProps {
  onClose: () => void
}

export const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({ onClose }) => {
  const homeShortcuts = [
    { key: 'C', desc: 'Create a new quick note' },
    { key: 'L', desc: 'Create a new checklist' },
    { key: '/', desc: 'Focus search bar' },
    { key: 'J / K', desc: 'Navigate next / previous note' },
    { key: 'E', desc: 'Archive selected note' },
    { key: '#', desc: 'Send selected note to Trash' },
    { key: 'Ctrl + Enter', desc: 'Save and close editor' },
    { key: '?', desc: 'Show this keyboard shortcuts guide' },
  ]

  const editorShortcuts = [
    { key: 'Ctrl + B', desc: 'Bold' },
    { key: 'Ctrl + I', desc: 'Italic' },
    { key: 'Ctrl + U', desc: 'Underline' },
    { key: 'Ctrl + K', desc: 'Insert link' },
    { key: 'Ctrl + F / H', desc: 'Find and Replace' },
    { key: 'Ctrl + P', desc: 'Print document' },
    { key: 'Ctrl + Alt + 1-6', desc: 'Headings 1 to 6' },
    { key: 'Ctrl + Shift + 7', desc: 'Numbered list' },
    { key: 'Ctrl + Shift + 8', desc: 'Bulleted list' },
    { key: 'Ctrl + \\', desc: 'Clear formatting' },
    { key: 'Ctrl + Alt + M', desc: 'Insert comment' },
    { key: 'Tab / Shift + Tab', desc: 'Indent / Outdent list item' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#051211] rounded-2xl shadow-2xl border border-teal-500/20 w-full max-w-lg overflow-hidden text-[#F4FFFD]">
        <div className="px-5 py-3.5 border-b border-teal-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Command className="w-4 h-4 text-[#19E6C8]" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-teal-500/10 text-teal-400/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Home shortcuts */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-[11px] mb-2 text-[#19E6C8]">
              Navigation & Home
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {homeShortcuts.map(s => (
                <div key={s.key} className="flex items-center justify-between p-2 rounded-xl bg-[#081a18] border border-teal-500/15">
                  <span className="text-[#94B5B0]">{s.desc}</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#030707] border border-teal-500/30 font-mono text-[10px] shadow-2xs font-bold text-[#19E6C8]">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Editor shortcuts */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-[11px] mb-2 text-[#19E6C8]">
              Document & Note Editor
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {editorShortcuts.map(s => (
                <div key={s.key} className="flex items-center justify-between p-2 rounded-xl bg-[#081a18] border border-teal-500/15">
                  <span className="text-[#94B5B0]">{s.desc}</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#030707] border border-teal-500/30 font-mono text-[10px] shadow-2xs font-bold text-[#19E6C8]">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-teal-500/15 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-white text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] hover:bg-slate-100 transition-all active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
