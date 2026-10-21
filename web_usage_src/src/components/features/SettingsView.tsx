import React, { useState } from 'react'
import { UserSettings, DailyUsage } from '../../types'
import {
  Settings,
  Sun,
  Moon,
  Eye,
  Clock,
  Download,
  Trash2,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  Check,
} from 'lucide-react'

interface SettingsViewProps {
  settings: UserSettings
  usages: DailyUsage[]
  onUpdateSettings: (s: UserSettings) => void
  onRegenerateData: (profile: 'low' | 'medium' | 'high') => void
  onDeleteAllData: () => void
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  usages,
  onUpdateSettings,
  onRegenerateData,
  onDeleteAllData,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  // CSV Export
  const handleExportCSV = () => {
    let csv = 'Date,TotalScreenTimeMinutes,Unlocks,Notifications,BedtimeMinutes\n'
    usages.forEach((u) => {
      csv += `${u.date},${u.totalScreenTimeMinutes},${u.unlocks},${u.notifications},${u.bedtimeUseMinutes}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zenpulse_wellbeing_usage_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  // JSON Export
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(usages, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zenpulse_wellbeing_data_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  return (
    <div className="flex flex-col px-4 pb-20 animate-fade-in">
      <div className="py-4">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
          Settings & Preferences
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Customize themes, accessibility palettes, data export and demo profiles.
        </p>
      </div>

      {/* Appearance Section */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col gap-3 mb-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Appearance & Accessibility
        </h4>

        {/* Theme */}
        <div className="flex items-center justify-between text-xs py-1">
          <span className="font-semibold text-gray-800 dark:text-gray-200">App Theme</span>
          <div className="flex bg-gray-100 dark:bg-neutral-700/60 p-1 rounded-xl">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onUpdateSettings({ ...settings, theme: t })}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  settings.theme === t
                    ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Color Palette */}
        <div className="flex items-center justify-between text-xs py-1 border-t border-gray-100 dark:border-neutral-800">
          <div>
            <span className="font-semibold text-gray-800 dark:text-gray-200 block">
              Chart Palette
            </span>
            <span className="text-[10px] text-gray-400">
              Colorblind-safe Okabe-Ito accessible tones
            </span>
          </div>

          <div className="flex bg-gray-100 dark:bg-neutral-700/60 p-1 rounded-xl">
            {(['default', 'colorblind'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onUpdateSettings({ ...settings, palette: p })}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  settings.palette === p
                    ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {p === 'colorblind' ? 'Safe' : 'Default'}
              </button>
            ))}
          </div>
        </div>

        {/* Time Format */}
        <div className="flex items-center justify-between text-xs py-1 border-t border-gray-100 dark:border-neutral-800">
          <span className="font-semibold text-gray-800 dark:text-gray-200">Time Format</span>
          <div className="flex bg-gray-100 dark:bg-neutral-700/60 p-1 rounded-xl">
            {(['12h', '24h'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onUpdateSettings({ ...settings, timeFormat: tf })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  settings.timeFormat === tf
                    ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Phone Frame Mode */}
        <div className="flex items-center justify-between text-xs py-1 border-t border-gray-100 dark:border-neutral-800">
          <div>
            <span className="font-semibold text-gray-800 dark:text-gray-200 block">
              Smartphone Frame Mockup
            </span>
            <span className="text-[10px] text-gray-400">
              Show phone bezel & status bar on desktop screens
            </span>
          </div>

          <button
            onClick={() =>
              onUpdateSettings({ ...settings, phoneFrameMode: !settings.phoneFrameMode })
            }
            className={`w-11 h-6 rounded-full transition-colors relative ${
              settings.phoneFrameMode ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-neutral-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.phoneFrameMode ? 'translate-x-6' : 'translate-x-1'
              } top-1 absolute shadow-xs`}
            />
          </button>
        </div>
      </div>

      {/* Demo Profile Selector */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col gap-2.5 mb-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <RefreshCw size={13} className="text-emerald-500" />
          <span>Regenerate Demo Data Profile</span>
        </h4>
        <p className="text-xs text-gray-400">
          Select a usage pattern to populate realistic 90-day history:
        </p>

        <div className="grid grid-cols-3 gap-2 mt-1">
          {[
            { id: 'low' as const, label: 'Low', desc: '~2.5h / day' },
            { id: 'medium' as const, label: 'Medium', desc: '~4.5h / day' },
            { id: 'high' as const, label: 'High', desc: '~7.0h / day' },
          ].map((prof) => (
            <button
              key={prof.id}
              onClick={() => onRegenerateData(prof.id)}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                settings.demoProfile === prof.id
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs font-bold block">{prof.label}</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{prof.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Export Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col gap-2 mb-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Download size={13} className="text-blue-500" />
          <span>Export Usage History ({usages.length} Days)</span>
        </h4>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-2xl border border-gray-200 dark:border-neutral-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Download CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="p-2.5 rounded-2xl border border-gray-200 dark:border-neutral-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-sm flex flex-col gap-2">
        <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
          <Trash2 size={13} />
          <span>Danger Zone</span>
        </h4>

        {!showConfirmDelete ? (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="w-full py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
          >
            Clear All Usage & Settings Data
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="flex-1 py-2.5 rounded-2xl bg-gray-200 dark:bg-neutral-700 text-xs font-bold text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDeleteAllData()
                setShowConfirmDelete(false)
              }}
              className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
            >
              Confirm Clear
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
