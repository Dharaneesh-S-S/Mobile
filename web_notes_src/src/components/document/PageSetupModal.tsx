import React, { useState } from 'react'
import { PageSetup } from '../../types'
import { X, Sliders, Check } from 'lucide-react'

interface PageSetupModalProps {
  initialSetup?: PageSetup
  onSave: (setup: PageSetup) => void
  onClose: () => void
}

const DEFAULT_SETUP: PageSetup = {
  paperSize: 'A4',
  orientation: 'portrait',
  margins: { top: 1, right: 1, bottom: 1, left: 1 },
  pageColor: '#ffffff',
  headerText: '',
  footerText: '',
  showPageNumbers: true,
}

const PAGE_COLORS = [
  '#ffffff', '#fafafa', '#f8fafc', '#fefce8', '#f0fdf4', '#eff6ff', '#fdf2f8', '#1e293b'
]

export const PageSetupModal: React.FC<PageSetupModalProps> = ({
  initialSetup = DEFAULT_SETUP,
  onSave,
  onClose,
}) => {
  const [setup, setSetup] = useState<PageSetup>(initialSetup)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(setup)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden text-slate-800 dark:text-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Page Setup</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Orientation */}
          <div>
            <label className="block font-medium mb-1.5 text-slate-700 dark:text-slate-300">Orientation</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSetup(s => ({ ...s, orientation: 'portrait' }))}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  setup.orientation === 'portrait'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setSetup(s => ({ ...s, orientation: 'landscape' }))}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  setup.orientation === 'landscape'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Landscape
              </button>
            </div>
          </div>

          {/* Paper Size */}
          <div>
            <label className="block font-medium mb-1.5 text-slate-700 dark:text-slate-300">Paper Size</label>
            <select
              value={setup.paperSize}
              onChange={(e) => setSetup(s => ({ ...s, paperSize: e.target.value as any }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="Letter">Letter (8.5 × 11 in)</option>
              <option value="Legal">Legal (8.5 × 14 in)</option>
            </select>
          </div>

          {/* Margins */}
          <div>
            <label className="block font-medium mb-1.5 text-slate-700 dark:text-slate-300">Margins (inches)</label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Top</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="3"
                  value={setup.margins.top}
                  onChange={(e) => setSetup(s => ({ ...s, margins: { ...s.margins, top: parseFloat(e.target.value) || 1 } }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 text-center text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Bottom</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="3"
                  value={setup.margins.bottom}
                  onChange={(e) => setSetup(s => ({ ...s, margins: { ...s.margins, bottom: parseFloat(e.target.value) || 1 } }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 text-center text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Left</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="3"
                  value={setup.margins.left}
                  onChange={(e) => setSetup(s => ({ ...s, margins: { ...s.margins, left: parseFloat(e.target.value) || 1 } }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 text-center text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Right</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="3"
                  value={setup.margins.right}
                  onChange={(e) => setSetup(s => ({ ...s, margins: { ...s.margins, right: parseFloat(e.target.value) || 1 } }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 text-center text-xs"
                />
              </div>
            </div>
          </div>

          {/* Page Color */}
          <div>
            <label className="block font-medium mb-1.5 text-slate-700 dark:text-slate-300">Page Color</label>
            <div className="flex items-center gap-2">
              {PAGE_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSetup(s => ({ ...s, pageColor: c }))}
                  className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                >
                  {setup.pageColor === c && (
                    <Check className={`w-3.5 h-3.5 ${c === '#ffffff' || c === '#fafafa' ? 'text-slate-900' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Header & Footer Text */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block font-medium mb-1 text-slate-700 dark:text-slate-300">Header Text</label>
              <input
                type="text"
                value={setup.headerText || ''}
                onChange={(e) => setSetup(s => ({ ...s, headerText: e.target.value }))}
                placeholder="Optional document header..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-slate-700 dark:text-slate-300">Footer Text</label>
              <input
                type="text"
                value={setup.footerText || ''}
                onChange={(e) => setSetup(s => ({ ...s, footerText: e.target.value }))}
                placeholder="Optional document footer..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={setup.showPageNumbers ?? true}
                onChange={(e) => setSetup(s => ({ ...s, showPageNumbers: e.target.checked }))}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700 dark:text-slate-300">Show page numbers in footer</span>
            </label>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-colors"
            >
              Apply Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
