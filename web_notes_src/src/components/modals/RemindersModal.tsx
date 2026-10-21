import React, { useState } from 'react'
import { NoteReminder } from '../../types'
import { Bell, Calendar, Clock, RotateCw, MapPin, X, Trash2 } from 'lucide-react'

interface RemindersModalProps {
  initialReminder?: NoteReminder
  onSave: (reminder: NoteReminder) => void
  onRemove: () => void
  onClose: () => void
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  initialReminder,
  onSave,
  onRemove,
  onClose,
}) => {
  const defaultDate = initialReminder?.dateTime
    ? new Date(initialReminder.dateTime)
    : new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow

  const [dateStr, setDateStr] = useState(defaultDate.toISOString().split('T')[0])
  const [timeStr, setTimeStr] = useState(
    defaultDate.toTimeString().substring(0, 5) || '09:00'
  )
  const [repeat, setRepeat] = useState<NoteReminder['repeat']>(initialReminder?.repeat || 'none')
  const [placeText, setPlaceText] = useState(initialReminder?.placeText || '')
  const [tab, setTab] = useState<'time' | 'place'>('time')

  // Set quick preset
  const setQuickPreset = (preset: 'today' | 'tomorrow' | 'nextWeek') => {
    const d = new Date()
    if (preset === 'today') {
      d.setHours(18, 0, 0, 0)
    } else if (preset === 'tomorrow') {
      d.setDate(d.getDate() + 1)
      d.setHours(8, 0, 0, 0)
    } else if (preset === 'nextWeek') {
      d.setDate(d.getDate() + 7)
      d.setHours(9, 0, 0, 0)
    }
    setDateStr(d.toISOString().split('T')[0])
    setTimeStr(d.toTimeString().substring(0, 5))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const isoDateTime = new Date(`${dateStr}T${timeStr}:00`).toISOString()
    onSave({
      id: initialReminder?.id || `rem-${Date.now()}`,
      dateTime: isoDateTime,
      repeat,
      placeText: placeText.trim() || undefined,
      completed: false,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden text-slate-800 dark:text-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Bell className="w-4 h-4 text-indigo-600" />
            <span>Set Reminder</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher: Time vs Place */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <button
            type="button"
            onClick={() => setTab('time')}
            className={`flex-1 py-2 text-xs font-medium text-center border-b-2 transition-colors ${
              tab === 'time'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Time Reminder
          </button>
          <button
            type="button"
            onClick={() => setTab('place')}
            className={`flex-1 py-2 text-xs font-medium text-center border-b-2 transition-colors ${
              tab === 'place'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Place Reminder
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {tab === 'time' ? (
            <>
              {/* Quick Presets */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setQuickPreset('today')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors"
                >
                  Later today (18:00)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPreset('tomorrow')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors"
                >
                  Tomorrow (08:00)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPreset('nextWeek')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors"
                >
                  Next week
                </button>
              </div>

              {/* Date & Time fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date
                  </label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Time
                  </label>
                  <input
                    type="time"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Repeat options */}
              <div>
                <label className="block font-medium mb-1 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-slate-400" /> Repeat
                </label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom repeat...</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block font-medium mb-1.5 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Location / Place
              </label>
              <input
                type="text"
                value={placeText}
                onChange={(e) => setPlaceText(e.target.value)}
                placeholder="e.g. Home, Office, Supermarket, Airport..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                autoFocus
              />
              <p className="mt-2 text-[11px] text-slate-400">
                You'll receive a notification when you arrive at or leave this location.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {initialReminder ? (
              <button
                type="button"
                onClick={() => {
                  onRemove()
                  onClose()
                }}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
