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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden text-slate-800 dark:text-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Command className="w-4 h-4 text-indigo-600" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Home shortcuts */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 text-indigo-600 dark:text-indigo-400">
              Navigation & Home
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {homeShortcuts.map(s => (
                <div key={s.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-300">{s.desc}</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px] shadow-2xs font-semibold text-slate-800 dark:text-slate-200">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Editor shortcuts */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 text-indigo-600 dark:text-indigo-400">
              Document & Note Editor
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {editorShortcuts.map(s => (
                <div key={s.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-300">{s.desc}</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px] shadow-2xs font-semibold text-slate-800 dark:text-slate-200">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
