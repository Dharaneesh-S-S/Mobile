import React, { useState } from 'react'
import { AppInfo, AppTimer } from '../../types'
import { AppIcon } from '../common/AppIcon'
import { formatDuration } from '../../utils/formatters'
import { Hourglass, Plus, Check, Play, Clock } from 'lucide-react'
import { BottomSheet } from '../common/BottomSheet'

interface AppTimersViewProps {
  apps: AppInfo[]
  timers: AppTimer[]
  todayUsageMinutes: Record<string, number>
  onSaveTimer: (timer: AppTimer) => void
  onDeleteTimer: (appId: string) => void
  onSimulateAppUsage: (appId: string, minutes: number) => void
}

export const AppTimersView: React.FC<AppTimersViewProps> = ({
  apps,
  timers,
  todayUsageMinutes,
  onSaveTimer,
  onDeleteTimer,
  onSimulateAppUsage,
}) => {
  const [editingApp, setEditingApp] = useState<AppInfo | null>(null)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(30)
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
  const [resetTime, setResetTime] = useState('00:00')

  const openEditor = (app: AppInfo) => {
    const existing = timers.find((t) => t.appId === app.id)
    if (existing) {
      setHours(Math.floor(existing.limitMinutes / 60))
      setMinutes(existing.limitMinutes % 60)
      setSelectedDays(existing.daysOfWeek || [0, 1, 2, 3, 4, 5, 6])
      setResetTime(existing.resetTime || '00:00')
    } else {
      setHours(0)
      setMinutes(45)
      setSelectedDays([0, 1, 2, 3, 4, 5, 6])
      setResetTime('00:00')
    }
    setEditingApp(app)
  }

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day))
      }
    } else {
      setSelectedDays([...selectedDays, day].sort())
    }
  }

  const handleSave = () => {
    if (!editingApp) return
    const totalMins = hours * 60 + minutes
    if (totalMins > 0) {
      onSaveTimer({
        appId: editingApp.id,
        limitMinutes: totalMins,
        enabled: true,
        daysOfWeek: selectedDays,
        resetTime,
      })
    } else {
      onDeleteTimer(editingApp.id)
    }
    setEditingApp(null)
  }

  const daysLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="flex flex-col px-4 pb-16 animate-fade-in">
      <div className="py-4">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
          App Timers
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Set daily limits for your apps to build balanced habits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {apps.map((app) => {
          const timer = timers.find((t) => t.appId === app.id)
          const usedMins = todayUsageMinutes[app.id] || 0
          const hasTimer = timer && timer.enabled
          const timeLeft = hasTimer ? Math.max(0, timer.limitMinutes - usedMins) : null
          const isExpired = hasTimer && timeLeft === 0

          return (
            <div
              key={app.id}
              className={`p-3.5 rounded-[24px] glass-card transition-all flex items-center justify-between ${
                isExpired
                  ? 'border-rose-500/40 bg-rose-500/10'
                  : ''
              }`}
            >
              <div
                onClick={() => openEditor(app)}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
              >
                <AppIcon
                  name={app.name}
                  iconName={app.icon}
                  color={app.accentColor}
                  size={18}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {app.name}
                    </span>
                    {hasTimer && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isExpired
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {formatDuration(timer.limitMinutes)} daily
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-0.5">
                    {hasTimer
                      ? isExpired
                        ? 'Time up for today'
                        : `${formatDuration(timeLeft!)} left • ${formatDuration(usedMins)} used`
                      : 'No timer'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => onSimulateAppUsage(app.id, 15)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-neutral-700/60 hover:bg-emerald-500/20 text-gray-600 dark:text-gray-300 hover:text-emerald-500 transition-colors"
                  title="Simulate 15 min usage"
                >
                  <Play size={14} fill="currentColor" />
                </button>

                <button
                  onClick={() => openEditor(app)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                    hasTimer
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                      : 'bg-emerald-500 text-neutral-950 hover:bg-emerald-600'
                  }`}
                >
                  {hasTimer ? 'Edit' : 'Set'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Set Timer Bottom Sheet */}
      <BottomSheet
        isOpen={Boolean(editingApp)}
        onClose={() => setEditingApp(null)}
        title={`Set Timer for ${editingApp?.name}`}
        subtitle="App pauses automatically when daily limit is reached"
      >
        <div className="flex flex-col gap-4 py-2">
          {/* Wheel / Time Picker */}
          <div className="flex items-center justify-center gap-4 py-4 bg-gray-50 dark:bg-neutral-900 rounded-3xl">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                Hours
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHours(Math.max(0, hours - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 font-bold text-sm"
                >
                  -
                </button>
                <span className="text-3xl font-extrabold w-10 text-center">{hours}</span>
                <button
                  onClick={() => setHours(Math.min(12, hours + 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <span className="text-3xl font-light text-gray-400 mt-4">:</span>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                Minutes
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMinutes(Math.max(0, minutes - 5))}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 font-bold text-sm"
                >
                  -
                </button>
                <span className="text-3xl font-extrabold w-12 text-center">{minutes}</span>
                <button
                  onClick={() => setMinutes(Math.min(55, minutes + 5))}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Days of Week Chips */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Active Days
            </label>
            <div className="flex justify-between gap-1">
              {daysLabels.map((lbl, idx) => {
                const isSelected = selectedDays.includes(idx)
                return (
                  <button
                    key={idx}
                    onClick={() => toggleDay(idx)}
                    className={`w-10 h-10 rounded-2xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {lbl}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Reset Time Selector */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Reset Time
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-gray-100 dark:bg-neutral-800">
              <Clock size={16} className="text-gray-400" />
              <input
                type="time"
                value={resetTime}
                onChange={(e) => setResetTime(e.target.value)}
                className="bg-transparent text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none flex-1"
              />
            </div>
          </div>

          {/* Save / Cancel buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setEditingApp(null)}
              className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              Save Timer
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
