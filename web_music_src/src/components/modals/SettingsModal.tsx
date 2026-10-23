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
  { id: '#19E6C8', name: 'Neon Cyan (Default)' },
  { id: '#2DD4BF', name: 'Mint Teal' },
  { id: '#38BDF8', name: 'Ice Sky' },
  { id: '#0D9488', name: 'Deep Emerald' },
  { id: '#14B8A6', name: 'Aquamarine' },
  { id: '#FFFFFF', name: 'Pure White' },
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
      <div className="w-full max-w-xl max-h-[90vh] bg-[#051413]/95 border border-teal-500/25 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col text-[#F4FFFD] space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-[#19E6C8] border border-teal-400/30 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-[#F4FFFD]">
                Settings
              </h2>
              <p className="text-xs text-[#94B5B0]">
                AuraBeat player preferences
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex gap-1 bg-[#030d0c] p-1 rounded-2xl text-xs font-semibold shrink-0 border border-teal-500/20">
          {(['appearance', 'playback', 'library', 'about'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-xl capitalize transition-all ${
                activeTab === tab ? 'bg-[#19E6C8] text-[#04100F] font-bold shadow-md shadow-teal-500/30' : 'text-[#94B5B0] hover:text-[#F4FFFD]'
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
              <div className="bg-[#030707]/90 border border-teal-500/20 rounded-2xl p-4 space-y-2">
                <span className="block font-bold text-slate-200">Theme</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['dark', 'amoled', 'light', 'system'] as const).map(th => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => updateSettings({ theme: th })}
                      className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        settings.theme === th
                          ? 'border-[#19E6C8] bg-teal-500/15 text-[#19E6C8] font-bold'
                          : 'border-teal-500/20 bg-[#051211] text-slate-400 hover:text-white'
                      }`}
                    >
                      {th === 'amoled' ? 'AMOLED' : th}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="bg-[#030707]/90 border border-teal-500/20 rounded-2xl p-4 space-y-2.5">
                <span className="block font-bold text-slate-200">Accent Color</span>
                <div className="flex items-center gap-3">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateSettings({ accentColor: c.id })}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                        settings.accentColor === c.id ? 'scale-110 ring-2 ring-[#19E6C8] shadow-lg' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.id }}
                      title={c.name}
                    >
                      {settings.accentColor === c.id && <Check className="w-4 h-4 text-black stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Album Art Shape */}
              <div className="bg-[#030707]/90 border border-teal-500/20 rounded-2xl p-4 space-y-2">
                <span className="block font-bold text-slate-200">Album Art Shape</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['rounded', 'square', 'circle'] as const).map(shape => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => updateSettings({ albumArtShape: shape })}
                      className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        settings.albumArtShape === shape
                          ? 'border-[#19E6C8] bg-teal-500/15 text-[#19E6C8] font-bold'
                          : 'border-teal-500/20 bg-[#051211] text-slate-400 hover:text-white'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Frame Toggle (Desktop) */}
              <div className="hidden lg:flex items-center justify-between p-4 bg-[#030707]/90 border border-teal-500/20 rounded-2xl">
                <div>
                  <span className="block font-bold text-slate-200">Phone Frame Mockup</span>
                  <span className="text-[11px] text-slate-400">Centers layout in mobile device frame</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.phoneFrame}
                  onChange={(e) => updateSettings({ phoneFrame: e.target.checked })}
                  className="w-4 h-4 rounded text-[#19E6C8] focus:ring-0 cursor-pointer accent-[#19E6C8]"
                />
              </div>
            </div>
          )}

          {activeTab === 'playback' && (
            <div className="space-y-4">
              {/* Crossfade */}
              <div className="bg-[#030707]/90 border border-teal-500/20 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Crossfade Duration</span>
                  <span className="text-[#19E6C8] font-mono">{settings.crossfadeSeconds}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={settings.crossfadeSeconds}
                  onChange={(e) => updateSettings({ crossfadeSeconds: Number(e.target.value) })}
                  className="w-full accent-[#19E6C8] cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Smooth transition between track changes</span>
              </div>

              {/* Gapless Playback */}
              <div className="flex items-center justify-between p-4 bg-[#030707]/90 border border-teal-500/20 rounded-2xl">
                <div>
                  <span className="block font-bold text-slate-200">Gapless Playback</span>
                  <span className="text-[10px] text-slate-400">Preload next track for seamless audio</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.gapless}
                  onChange={(e) => updateSettings({ gapless: e.target.checked })}
                  className="w-4 h-4 rounded text-[#19E6C8] focus:ring-0 cursor-pointer accent-[#19E6C8]"
                />
              </div>

              {/* Minimum Track Length */}
              <div className="bg-[#030707]/90 border border-teal-500/20 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Hide Short Clips (Ringtones)</span>
                  <span className="text-[#19E6C8] font-mono">
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
                  className="w-full accent-[#19E6C8] cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Excludes brief audio snippets from the library</span>
              </div>

              {/* Lock Screen Controls */}
              <div className="flex items-center justify-between p-4 bg-[#030707]/90 border border-teal-500/20 rounded-2xl">
                <div>
                  <span className="block font-bold text-slate-200">Media Session API</span>
                  <span className="text-[10px] text-slate-400">Lock screen and notification controls</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.mediaSessionEnabled}
                  onChange={(e) => updateSettings({ mediaSessionEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#19E6C8] focus:ring-0 cursor-pointer accent-[#19E6C8]"
                />
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Select Folder Action */}
              <div className="p-4 bg-[#030707]/90 border border-teal-500/20 rounded-2xl flex items-center justify-between">
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
                  className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-bold text-xs shadow-[0_0_15px_rgba(255,255,255,0.22)]"
                >
                  Browse Folder
                </button>
              </div>

              {/* Clear Demo Tracks */}
              <div className="p-4 bg-[#030707]/90 border border-teal-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="block font-bold text-slate-200">Clear Demo Tracks</span>
                  <span className="text-[10px] text-slate-400">Remove built-in synthesized sample songs</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearDemos}
                  className="px-3.5 py-1.5 rounded-xl bg-[#051211] hover:bg-[#071f1d] text-slate-300 font-semibold text-xs border border-teal-500/20"
                >
                  Clear Demos
                </button>
              </div>

              {demoNotice && (
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[#19E6C8] text-xs font-semibold">
                  {demoNotice}
                </div>
              )}

              {/* Backup & Restore */}
              <div className="p-4 bg-[#030707]/90 border border-teal-500/20 rounded-2xl space-y-3">
                <span className="block font-bold text-slate-200">Backup & Restore</span>
                <p className="text-[11px] text-slate-400">
                  Export your playlists, favorites, listening stats, and EQ presets as a portable JSON file.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-[#051211] hover:bg-[#071f1d] border border-teal-500/20 text-white font-semibold text-xs flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#19E6C8]" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              {/* Factory Reset */}
              <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="block font-bold text-red-400">Reset Application</span>
                  <span className="text-[10px] text-slate-400">Clear database and restore defaults</span>
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
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#19E6C8] via-[#0ea5e9] to-[#0d9488] flex items-center justify-center text-[#030707] shadow-xl shadow-teal-500/30 mx-auto">
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
