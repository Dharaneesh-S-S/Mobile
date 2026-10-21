import React, { useState, useEffect } from 'react'
import { Search, Replace, ChevronUp, ChevronDown, X, CaseSensitive, WholeWord, Binary } from 'lucide-react'

interface DocumentFindReplaceProps {
  onClose: () => void
  onFind: (query: string, matchCase: boolean, wholeWord: boolean, isRegex: boolean) => number
  onReplace: (query: string, replaceWith: string, matchCase: boolean) => void
  onReplaceAll: (query: string, replaceWith: string, matchCase: boolean) => void
  onNext: () => void
  onPrev: () => void
  matchIndex: number
  totalMatches: number
}

export const DocumentFindReplace: React.FC<DocumentFindReplaceProps> = ({
  onClose,
  onFind,
  onReplace,
  onReplaceAll,
  onNext,
  onPrev,
  matchIndex,
  totalMatches,
}) => {
  const [query, setQuery] = useState('')
  const [replaceWith, setReplaceWith] = useState('')
  const [matchCase, setMatchCase] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [isRegex, setIsRegex] = useState(false)
  const [showReplace, setShowReplace] = useState(true)

  useEffect(() => {
    if (query) {
      onFind(query, matchCase, wholeWord, isRegex)
    }
  }, [query, matchCase, wholeWord, isRegex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter') {
      if (e.shiftKey) {
        onPrev()
      } else {
        onNext()
      }
    }
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      className="absolute top-16 right-6 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 w-80 text-xs text-slate-800 dark:text-slate-200 transition-all animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
          <Search className="w-3.5 h-3.5 text-indigo-500" />
          Find and replace
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Find input */}
      <div className="flex items-center gap-1.5 mb-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find in document..."
          autoFocus
          className="w-full bg-transparent border-none text-xs focus:outline-none text-slate-800 dark:text-slate-200"
        />
        {query && (
          <span className="text-[10px] text-slate-400 shrink-0">
            {totalMatches > 0 ? `${matchIndex + 1} of ${totalMatches}` : '0 of 0'}
          </span>
        )}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onPrev}
            disabled={totalMatches === 0}
            className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
            title="Previous match (Shift+Enter)"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={totalMatches === 0}
            className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
            title="Next match (Enter)"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Replace input */}
      {showReplace && (
        <div className="flex items-center gap-1.5 mb-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
          <Replace className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={replaceWith}
            onChange={(e) => setReplaceWith(e.target.value)}
            placeholder="Replace with..."
            className="w-full bg-transparent border-none text-xs focus:outline-none text-slate-800 dark:text-slate-200"
          />
        </div>
      )}

      {/* Options: Case sensitive, Whole word, Regex */}
      <div className="flex items-center justify-between py-1 text-[11px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMatchCase(!matchCase)}
            className={`p-1 rounded border transition-colors ${matchCase ? 'bg-indigo-100 border-indigo-400 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            title="Match case"
          >
            <CaseSensitive className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setWholeWord(!wholeWord)}
            className={`p-1 rounded border transition-colors ${wholeWord ? 'bg-indigo-100 border-indigo-400 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            title="Whole words only"
          >
            <WholeWord className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsRegex(!isRegex)}
            className={`p-1 rounded border transition-colors ${isRegex ? 'bg-indigo-100 border-indigo-400 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            title="Use regular expression"
          >
            <Binary className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onReplace(query, replaceWith, matchCase)}
            disabled={!query || totalMatches === 0}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded disabled:opacity-40 font-medium"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => onReplaceAll(query, replaceWith, matchCase)}
            disabled={!query || totalMatches === 0}
            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded disabled:opacity-40 font-medium shadow-xs"
          >
            Replace all
          </button>
        </div>
      </div>
    </div>
  )
}
