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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#051211] rounded-2xl shadow-2xl border border-teal-500/20 w-full max-w-lg overflow-hidden text-[#F4FFFD]">
        <div className="px-5 py-3.5 border-b border-teal-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Settings className="w-4 h-4 text-[#19E6C8]" />
            <span>Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-teal-500/10 text-teal-400/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-teal-500/15 bg-[#081a18] px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-2 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'general'
                ? 'border-[#19E6C8] text-[#19E6C8]'
                : 'border-transparent text-[#94B5B0] hover:text-[#F4FFFD]'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`pb-2 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'editor'
                ? 'border-[#19E6C8] text-[#19E6C8]'
                : 'border-transparent text-[#94B5B0] hover:text-[#F4FFFD]'
            }`}
          >
            Editor & Notes
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`pb-2 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'data'
                ? 'border-[#19E6C8] text-[#19E6C8]'
                : 'border-transparent text-[#94B5B0] hover:text-[#F4FFFD]'
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
                <label className="block font-medium mb-1.5 text-[#94B5B0]">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'light' })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'light'
                        ? 'border-[#19E6C8] bg-teal-500/15 text-[#19E6C8] font-bold'
                        : 'border-teal-500/15 bg-[#081a18] text-[#94B5B0] hover:text-white'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-[#19E6C8]" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'dark' })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'dark'
                        ? 'border-[#19E6C8] bg-teal-500/15 text-[#19E6C8] font-bold'
                        : 'border-teal-500/15 bg-[#081a18] text-[#94B5B0] hover:text-white'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-[#19E6C8]" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'system' })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'system'
                        ? 'border-[#19E6C8] bg-teal-500/15 text-[#19E6C8] font-bold'
                        : 'border-teal-500/15 bg-[#081a18] text-[#94B5B0] hover:text-white'
                    }`}
                  >
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Default Note Size */}
              <div>
                <label className="block font-medium mb-1 text-[#94B5B0]">Default Note Size</label>
                <select
                  value={settings.defaultNoteSize}
                  onChange={(e) => onUpdateSettings({ defaultNoteSize: e.target.value as any })}
                  className="w-full bg-[#081a18] border border-teal-500/20 text-[#F4FFFD] rounded-xl p-2 text-xs focus:outline-none focus:border-[#19E6C8]"
                >
                  <option value="quick">Quick Note (Google Keep-style card)</option>
                  <option value="document">Document (Word-style large canvas)</option>
                </select>
              </div>

              {/* Link Previews */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-teal-500/15 bg-[#081a18] hover:bg-teal-500/10 cursor-pointer">
                <div>
                  <div className="font-medium text-[#F4FFFD]">Display Link Previews</div>
                  <div className="text-[11px] text-[#94B5B0]">Render preview chips for pasted URLs</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.displayLinkPreviews}
                  onChange={(e) => onUpdateSettings({ displayLinkPreviews: e.target.checked })}
                  className="rounded border-teal-500/30 text-[#19E6C8] focus:ring-[#19E6C8] w-4 h-4 bg-[#051211]"
                />
              </label>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-4">
              {/* Default Page Size */}
              <div>
                <label className="block font-medium mb-1 text-[#94B5B0]">Default Document Paper Size</label>
                <select
                  value={settings.defaultPageSize}
                  onChange={(e) => onUpdateSettings({ defaultPageSize: e.target.value as any })}
                  className="w-full bg-[#081a18] border border-teal-500/20 text-[#F4FFFD] rounded-xl p-2 text-xs focus:outline-none focus:border-[#19E6C8]"
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="Letter">Letter (8.5 × 11 in)</option>
                  <option value="Legal">Legal (8.5 × 14 in)</option>
                </select>
              </div>

              {/* Move Checked to Bottom */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-teal-500/15 bg-[#081a18] hover:bg-teal-500/10 cursor-pointer">
                <div>
                  <div className="font-medium text-[#F4FFFD]">Move Checked Items to Bottom</div>
                  <div className="text-[11px] text-[#94B5B0]">Automatically group completed checklist tasks</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.moveCheckedToBottom}
                  onChange={(e) => onUpdateSettings({ moveCheckedToBottom: e.target.checked })}
                  className="rounded border-teal-500/30 text-[#19E6C8] focus:ring-[#19E6C8] w-4 h-4 bg-[#051211]"
                />
              </label>

              {/* Spellcheck */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-teal-500/15 bg-[#081a18] hover:bg-teal-500/10 cursor-pointer">
                <div>
                  <div className="font-medium text-[#F4FFFD]">Spellcheck & Underlines</div>
                  <div className="text-[11px] text-[#94B5B0]">Enable browser spellchecker in editors</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.spellcheck}
                  onChange={(e) => onUpdateSettings({ spellcheck: e.target.checked })}
                  className="rounded border-teal-500/30 text-[#19E6C8] focus:ring-[#19E6C8] w-4 h-4 bg-[#051211]"
                />
              </label>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-3">
              <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
                <div className="font-bold text-[#19E6C8] mb-0.5">IndexedDB Zero-Backend Storage</div>
                <p className="text-[11px] text-[#94B5B0]">
                  All notes, drawing vectors, comments, and image blobs are saved locally in your browser's IndexedDB. No remote servers are used.
                </p>
              </div>

              {/* Export all */}
              <button
                type="button"
                onClick={onExportAllData}
                className="w-full p-3 rounded-xl border border-teal-500/15 bg-[#081a18] hover:bg-teal-500/10 flex items-center justify-between transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-[#F4FFFD] flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-[#19E6C8]" /> Export All Notes (.JSON)
                  </div>
                  <div className="text-[11px] text-[#94B5B0]">Download complete offline backup file</div>
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
                className="w-full p-3 rounded-xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 flex items-center justify-between transition-colors text-[#19E6C8]"
              >
                <div className="text-left">
                  <div className="font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#19E6C8]" /> Clear Demo Data
                  </div>
                  <div className="text-[11px] text-[#94B5B0]">Remove sample notes created during first launch</div>
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
                className="w-full p-3 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 flex items-center justify-between transition-colors text-red-400"
              >
                <div className="text-left">
                  <div className="font-medium flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" /> Delete All Data & Reset
                  </div>
                  <div className="text-[11px] text-red-400/80">Completely purge IndexedDB tables</div>
                </div>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-teal-500/15 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-white text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] hover:bg-slate-100 transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
