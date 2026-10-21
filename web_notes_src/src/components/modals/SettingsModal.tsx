import React, { useState } from 'react'
import { UserSettings } from '../../types'
import { Settings, X, Moon, Sun, Monitor, Trash2, Download, RefreshCw, Sparkles, Check } from 'lucide-react'

interface SettingsModalProps {
  settings: UserSettings
  onUpdateSettings: (settings: Partial<UserSettings>) => void
  onClearDemoData: () => Promise<void>
  onDeleteAllData: () => Promise<void>
  onExportAllData: () => void
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClearDemoData,
  onDeleteAllData,
  onExportAllData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'editor' | 'data'>('general')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden text-slate-800 dark:text-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Settings className="w-4 h-4 text-indigo-600" />
            <span>Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`pb-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'editor'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Editor & Notes
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`pb-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'data'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Storage & Data
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Theme Selector */}
              <div>
                <label className="block font-medium mb-1.5 text-slate-700 dark:text-slate-300">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'light' })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'light'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'dark' })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'dark'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'system' })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'system'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Default Note Size */}
              <div>
                <label className="block font-medium mb-1 text-slate-700 dark:text-slate-300">Default Note Size</label>
                <select
                  value={settings.defaultNoteSize}
                  onChange={(e) => onUpdateSettings({ defaultNoteSize: e.target.value as any })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs"
                >
                  <option value="quick">Quick Note (Google Keep-style card)</option>
                  <option value="document">Document (Word-style large canvas)</option>
                </select>
              </div>

              {/* Link Previews */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Display Link Previews</div>
                  <div className="text-[11px] text-slate-400">Render preview chips for pasted URLs</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.displayLinkPreviews}
                  onChange={(e) => onUpdateSettings({ displayLinkPreviews: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-4">
              {/* Default Page Size */}
              <div>
                <label className="block font-medium mb-1 text-slate-700 dark:text-slate-300">Default Document Paper Size</label>
                <select
                  value={settings.defaultPageSize}
                  onChange={(e) => onUpdateSettings({ defaultPageSize: e.target.value as any })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs"
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="Letter">Letter (8.5 × 11 in)</option>
                  <option value="Legal">Legal (8.5 × 14 in)</option>
                </select>
              </div>

              {/* Move Checked to Bottom */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Move Checked Items to Bottom</div>
                  <div className="text-[11px] text-slate-400">Automatically group completed checklist tasks</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.moveCheckedToBottom}
                  onChange={(e) => onUpdateSettings({ moveCheckedToBottom: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>

              {/* Spellcheck */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Spellcheck & Underlines</div>
                  <div className="text-[11px] text-slate-400">Enable browser spellchecker in editors</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.spellcheck}
                  onChange={(e) => onUpdateSettings({ spellcheck: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                <div className="font-medium text-indigo-900 dark:text-indigo-300 mb-0.5">IndexedDB Zero-Backend Storage</div>
                <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80">
                  All notes, drawing vectors, comments, and image blobs are saved locally in your browser's IndexedDB. No remote servers are used.
                </p>
              </div>

              {/* Export all */}
              <button
                type="button"
                onClick={onExportAllData}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-indigo-600" /> Export All Notes (.JSON)
                  </div>
                  <div className="text-[11px] text-slate-400">Download complete offline backup file</div>
                </div>
              </button>

              {/* Clear demo data */}
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Clear all pre-seeded demo notes? Your custom notes will remain.')) {
                    await onClearDemoData()
                    alert('Demo data cleared!')
                  }
                }}
                className="w-full p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-between transition-colors text-amber-800 dark:text-amber-300"
              >
                <div className="text-left">
                  <div className="font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Clear Demo Data
                  </div>
                  <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80">Remove sample notes created during first launch</div>
                </div>
              </button>

              {/* Delete all data */}
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('⚠️ DANGER: Delete ALL notes, drawings, and reset database? This cannot be undone.')) {
                    await onDeleteAllData()
                    window.location.reload()
                  }
                }}
                className="w-full p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-between transition-colors text-red-700 dark:text-red-400"
              >
                <div className="text-left">
                  <div className="font-medium flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" /> Delete All Data & Reset
                  </div>
                  <div className="text-[11px] text-red-500/80">Completely purge IndexedDB tables</div>
                </div>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
