import React from 'react'
import { X, FileText, Clock, BookOpen, Layers } from 'lucide-react'

interface WordCountModalProps {
  content: string
  selectedText?: string
  onClose: () => void
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  content,
  selectedText = '',
  onClose,
}) => {
  // Extract plain text from HTML
  const tmp = document.createElement('div')
  tmp.innerHTML = content
  const text = tmp.textContent || tmp.innerText || ''

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const charactersWithSpaces = text.length
  const charactersWithoutSpaces = text.replace(/\s+/g, '').length
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length
  const estimatedPages = Math.max(1, Math.ceil(words / 300))
  const readingTimeMin = Math.max(1, Math.ceil(words / 200))

  // Selected metrics
  const selWords = selectedText.trim() ? selectedText.trim().split(/\s+/).length : 0
  const selChars = selectedText.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden text-slate-800 dark:text-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Word Count Statistics</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Main cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-center">
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 block mb-0.5">Total Words</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{words.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-center">
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 block mb-0.5">Characters</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{charactersWithSpaces.toLocaleString()}</span>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-b border-slate-100 dark:border-slate-800 py-1">
            <div className="flex justify-between py-2 text-slate-600 dark:text-slate-300">
              <span>Characters (without spaces)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{charactersWithoutSpaces.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600 dark:text-slate-300">
              <span>Paragraphs</span>
              <span className="font-semibold text-slate-900 dark:text-white">{paragraphs}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600 dark:text-slate-300 items-center">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-slate-400" /> Estimated Pages</span>
              <span className="font-semibold text-slate-900 dark:text-white">{estimatedPages} {estimatedPages === 1 ? 'page' : 'pages'}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600 dark:text-slate-300 items-center">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Reading Time</span>
              <span className="font-semibold text-slate-900 dark:text-white">~{readingTimeMin} min</span>
            </div>
          </div>

          {/* Selection Stats if any */}
          {selWords > 0 && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
              <div className="font-medium text-slate-900 dark:text-white mb-1">Current Selection</div>
              <div className="flex justify-between">
                <span>Selected words: <strong>{selWords}</strong></span>
                <span>Selected characters: <strong>{selChars}</strong></span>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
