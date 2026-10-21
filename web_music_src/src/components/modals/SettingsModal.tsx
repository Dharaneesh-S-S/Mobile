import React, { useState } from 'react'
import {
  X, Settings, Palette, Play, FolderOpen, HardDrive,
  Download, Upload, RotateCcw, Smartphone, Shield, Sparkles,
  Check, Trash2, Filter
} from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { clearDemoTracks } from '../../db'
import { exportFullBackupJson } from '../../utils/exportImport'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'

const ACCENT_COLORS = [
  { id: '#d946ef', name: 'Neon Fuchsia' },
  { id: '#3b82f6', name: 'Electric Blue' },
  { id: '#10b981', name: 'Emerald' },
  { id: '#f59e0b', name: 'Amber Gold' },
  { id: '#8b5cf6', name: 'Cyber Purple' },
  { id: '#f43f5e', name: 'Rose Red' },
]

export const SettingsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, setIsImportModalOpen } = useMusic()
  const [activeTab, setActiveTab] = useState<'appearance' | 'playback' | 'library' | 'about'>('appearance')
  const [demoNotice, setDemoNotice] = useState<string | null>(null)

  const tracks = useLiveQuery(() => db.tracks.toArray(), []) || []
  const playlists = useLiveQuery(() => db.playlists.toArray(), []) || []
  const playEvents = useLiveQuery(() => db.playEvents.toArray(), []) || []

  if (!isOpen) return null

  const handleClearDemos = async () => {
    const cleared = await clearDemoTracks()
    setDemoNotice(`Cleared ${cleared} demo tracks from library.`)
    setTimeout(() => setDemoNotice(null), 3000)
  }

  const handleExportBackup = () => {
    const favs = tracks.filter(t => t.isFavorite).map(t => ({ title: t.title, artist: t.artist }))
    exportFullBackupJson(playlists, settings, playEvents, favs)
  }

  const handleResetApp = async () => {
    if (confirm('Reset AuraBeat to factory settings? All imported tracks and playlists will be cleared.')) {
      await db.delete()
      window.location.reload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none overflow-y-auto">
      <div className="w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-white space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                Settings
              </h2>
              <p className="text-xs text-slate-400">
                AuraBeat player preferences
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex gap-1 bg-slate-950/80 p-1 rounded-2xl text-xs font-semibold shrink-0">
          {(['appearance', 'playback', 'library', 'about'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-xl capitalize transition-colors ${
                activeTab === tab ? 'bg-fuchsia-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              {/* Theme */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <span className="block font-bold text-slate-200">Theme</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['dark', 'amoled', 'light', 'system'] as const).map(th => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => updateSettings({ theme: th })}
                      className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        settings.theme === th
                          ? 'border-fuchsia-500 bg-fuchsia-600/20 text-fuchsia-300 font-bold'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {th === 'amoled' ? 'AMOLED' : th}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <span className="block font-bold text-slate-200">Accent Color</span>
                <div className="flex items-center gap-3">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateSettings({ accentColor: c.id })}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                        settings.accentColor === c.id ? 'scale-110 ring-2 ring-white shadow-lg' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.id }}
                      title={c.name}
                    >
                      {settings.accentColor === c.id && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Album Art Shape */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <span className="block font-bold text-slate-200">Album Art Shape</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['rounded', 'square', 'circle'] as const).map(shape => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => updateSettings({ albumArtShape: shape })}
                      className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        settings.albumArtShape === shape
                          ? 'border-fuchsia-500 bg-fuchsia-600/20 text-fuchsia-300 font-bold'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Frame Toggle (Desktop) */}
              <div className="hidden lg:flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <div>
                  <span className="block font-bold text-slate-200">Phone Frame Mockup</span>
                  <span className="text-[11px] text-slate-400">Centers layout in mobile device frame</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.phoneFrame}
                  onChange={(e) => updateSettings({ phoneFrame: e.target.checked })}
                  className="w-4 h-4 rounded text-fuchsia-600 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'playback' && (
            <div className="space-y-4">
              {/* Crossfade */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Crossfade Duration</span>
                  <span className="text-fuchsia-400 font-mono">{settings.crossfadeSeconds}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={settings.crossfadeSeconds}
                  onChange={(e) => updateSettings({ crossfadeSeconds: Number(e.target.value) })}
                  className="w-full accent-fuchsia-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Smooth transition between track changes</span>
              </div>

              {/* Gapless Playback */}
              <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <div>
                  <span className="block font-bold text-slate-200">Gapless Playback</span>
                  <span className="text-[10px] text-slate-400">Preload next track for seamless audio</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.gapless}
                  onChange={(e) => updateSettings({ gapless: e.target.checked })}
                  className="w-4 h-4 rounded text-fuchsia-600 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Minimum Track Length */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Hide Short Clips (Ringtones)</span>
                  <span className="text-fuchsia-400 font-mono">
                    {settings.minTrackLengthSeconds === 0 ? 'Disabled' : `${settings.minTrackLengthSeconds}s`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={settings.minTrackLengthSeconds}
                  onChange={(e) => updateSettings({ minTrackLengthSeconds: Number(e.target.value) })}
                  className="w-full accent-fuchsia-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Excludes brief audio snippets from the library</span>
              </div>

              {/* Lock Screen Controls */}
              <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <div>
                  <span className="block font-bold text-slate-200">Media Session API</span>
                  <span className="text-[10px] text-slate-400">Lock screen and notification controls</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.mediaSessionEnabled}
                  onChange={(e) => updateSettings({ mediaSessionEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-fuchsia-600 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Select Folder Action */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="block font-bold text-slate-200">Select Music Folder</span>
                  <span className="text-[10px] text-slate-400">Scan directory for offline audio files</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    setIsImportModalOpen(true)
                  }}
                  className="px-3.5 py-2 rounded-xl bg-fuchsia-600 text-white font-bold text-xs shadow-md shadow-fuchsia-600/30 hover:bg-fuchsia-500"
                >
                  Browse Folder
                </button>
              </div>

              {/* Clear Demo Tracks */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="block font-bold text-slate-200">Clear Demo Tracks</span>
                  <span className="text-[10px] text-slate-400">Remove built-in synthesized sample songs</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearDemos}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
                >
                  Clear Demos
                </button>
              </div>

              {demoNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  {demoNotice}
                </div>
              )}

              {/* Backup & Restore */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <span className="block font-bold text-slate-200">Backup & Restore</span>
                <p className="text-[11px] text-slate-400">
                  Export your playlists, favorites, listening stats, and EQ presets as a portable JSON file.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-fuchsia-400" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              {/* Factory Reset */}
              <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="block font-bold text-red-400">Reset Application</span>
                  <span className="text-[10px] text-slate-400">Clear database and restored defaults</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetApp}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs"
                >
                  Reset App
                </button>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-fuchsia-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-fuchsia-600/30 mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold font-display">AuraBeat</h3>
                <p className="text-xs text-slate-400">Version 1.0.0 (On-Device Music Studio)</p>
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                A browser-native music player designed with Web Audio API 10-band equalizer, offline folder library import, and local ID3 tag parsing.
              </p>
              <div className="pt-2 text-[10px] text-slate-500">
                Built with React, TypeScript, Vite, Tailwind CSS, Web Audio API & Dexie IndexedDB.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
