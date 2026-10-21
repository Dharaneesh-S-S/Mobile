import React, { useState } from 'react'
import { AppInfo, FocusMode } from '../../types'
import { AppIcon } from '../common/AppIcon'
import { Zap, Coffee, Search, Clock, Flame, Check, Play, Pause } from 'lucide-react'
import { formatDuration } from '../../utils/formatters'

interface FocusModeViewProps {
  apps: AppInfo[]
  focusConfig: FocusMode
  onUpdateFocusConfig: (cfg: FocusMode) => void
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  apps,
  focusConfig,
  onUpdateFocusConfig,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [breakMinutes, setBreakMinutes] = useState<number | null>(null)

  const toggleApp = (id: string) => {
    const list = focusConfig.distractingAppIds.includes(id)
      ? focusConfig.distractingAppIds.filter((x) => x !== id)
      : [...focusConfig.distractingAppIds, id]
    onUpdateFocusConfig({ ...focusConfig, distractingAppIds: list })
  }

  const toggleFocusActive = () => {
    onUpdateFocusConfig({
      ...focusConfig,
      enabled: !focusConfig.enabled,
      activeUntil: !focusConfig.enabled
        ? new Date(Date.now() + 60 * 60 * 1000).toISOString()
        : null,
      breakUntil: null,
    })
  }

  const takeBreak = (mins: number) => {
    setBreakMinutes(mins)
    onUpdateFocusConfig({
      ...focusConfig,
      breakUntil: new Date(Date.now() + mins * 60 * 1000).toISOString(),
    })
  }

  const filteredApps = apps.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const daysLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="flex flex-col px-4 pb-16 animate-fade-in">
      <div className="py-4">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
          Focus Mode
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Silence distracting apps and stay in the zone.
        </p>
      </div>

      {/* Quick Settings Tile Mockup */}
      <div className="mb-4 p-4 rounded-3xl bg-neutral-900 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div
            onClick={toggleFocusActive}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
              focusConfig.enabled ? 'bg-purple-600 text-white shadow-lg' : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            <Zap size={22} />
          </div>
          <div>
            <span className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider block">
              Quick Settings Tile
            </span>
            <span className="text-sm font-bold">
              {focusConfig.enabled ? 'Focus Mode Active' : 'Focus Mode Off'}
            </span>
          </div>
        </div>

        <button
          onClick={toggleFocusActive}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            focusConfig.enabled
              ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
              : 'bg-purple-600 text-white hover:bg-purple-500'
          }`}
        >
          {focusConfig.enabled ? 'Turn Off' : 'Turn On'}
        </button>
      </div>

      {/* Active Session & Break Controls */}
      {focusConfig.enabled && (
        <div className="p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 mb-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-purple-500" />
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                {focusConfig.distractingAppIds.length} distracting apps blocked
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Flame size={14} />
              <span>{focusConfig.streakDays} Day Streak</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
              <Coffee size={14} />
              Take a break:
            </span>
            {[5, 10, 15].map((m) => (
              <button
                key={m}
                onClick={() => takeBreak(m)}
                className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors"
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History of Focus Sessions Chart */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm mb-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Focus History (Minutes / Day)
        </h4>
        <div className="relative w-full h-[80px] select-none">
          <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
            {[45, 60, 30, 90, 75, 50, 45].map((mins, i) => {
              const x = i * 42 + 10
              const h = (mins / 100) * 80
              return (
                <rect
                  key={i}
                  x={x}
                  y={80 - h}
                  width="22"
                  height={h}
                  fill="#8b5cf6"
                  rx="4"
                />
              )
            })}
          </svg>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-3">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Pick Distracting Apps */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Distracting Apps ({focusConfig.distractingAppIds.length})
          </h4>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-gray-100 dark:bg-neutral-700/60 mb-3 text-xs">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-gray-800 dark:text-gray-100 focus:outline-none flex-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {filteredApps.map((app) => {
            const isSelected = focusConfig.distractingAppIds.includes(app.id)

            return (
              <div
                key={app.id}
                onClick={() => toggleApp(app.id)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/30 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <AppIcon
                    name={app.name}
                    iconName={app.icon}
                    color={app.accentColor}
                    size={13}
                  />
                  <span className="text-xs font-bold truncate">{app.name}</span>
                </div>

                {isSelected && (
                  <Check size={14} className="text-purple-600 shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
