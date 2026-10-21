import React, { useState } from 'react'
import {
  ChildProfile,
  ParentalControlsConfig,
  AppInfo,
  AppCategory,
} from '../../types'
import {
  ShieldAlert,
  Lock,
  Unlock,
  Plus,
  User,
  Clock,
  Printer,
  Bell,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  Layers,
} from 'lucide-react'
import { formatDuration } from '../../utils/formatters'
import { BottomSheet } from '../common/BottomSheet'
import { AppIcon } from '../common/AppIcon'

interface ParentalControlsViewProps {
  config: ParentalControlsConfig
  apps: AppInfo[]
  onUpdateConfig: (cfg: ParentalControlsConfig) => void
  onTriggerAlert: (title: string, message: string) => void
}

export const ParentalControlsView: React.FC<ParentalControlsViewProps> = ({
  config,
  apps,
  onUpdateConfig,
  onTriggerAlert,
}) => {
  const [enteredPin, setEnteredPin] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [selectedChildId, setSelectedChildId] = useState<string>(
    config.children[0]?.id || ''
  )
  const [isAddChildOpen, setIsAddChildOpen] = useState(false)
  const [isReportCardOpen, setIsReportCardOpen] = useState(false)

  // New child state
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState(10)
  const [newChildColor, setNewChildColor] = useState('#3b82f6')
  const [newChildLimit, setNewChildLimit] = useState(120)

  const activeChild = config.children.find((c) => c.id === selectedChildId) || config.children[0]

  const handlePinDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + digit
      setEnteredPin(next)
      if (next.length === 4) {
        if (next === (config.pin || '1234')) {
          setIsUnlocked(true)
          setEnteredPin('')
        } else {
          onTriggerAlert('Incorrect PIN', 'The 4-digit parent PIN is incorrect. Try 1234.')
          setEnteredPin('')
        }
      }
    }
  }

  const handleAddBonusTime = (mins: number) => {
    if (!activeChild) return
    const updated = config.children.map((c) =>
      c.id === activeChild.id ? { ...c, bonusTimeMinutes: c.bonusTimeMinutes + mins } : c
    )
    onUpdateConfig({ ...config, children: updated })
    onTriggerAlert('Bonus Time Granted', `Added ${mins} minutes of screen time for ${activeChild.name}.`)
  }

  const handleToggleLockChild = () => {
    if (!activeChild) return
    const nextLocked = !activeChild.locked
    const updated = config.children.map((c) =>
      c.id === activeChild.id ? { ...c, locked: nextLocked } : c
    )
    onUpdateConfig({ ...config, children: updated })
    onTriggerAlert(
      nextLocked ? 'Device Locked' : 'Device Unlocked',
      `${activeChild.name}'s device is now ${nextLocked ? 'locked' : 'unlocked'}.`
    )
  }

  const handleCreateChild = () => {
    if (!newChildName.trim()) return
    const newChild: ChildProfile = {
      id: `child_${Date.now()}`,
      name: newChildName.trim(),
      age: newChildAge,
      avatarColor: newChildColor,
      screenTimeLimitMinutes: newChildLimit,
      appLimits: {},
      downtime: { enabled: true, start: '20:30', end: '07:00' },
      approvedAppIds: ['duolingo', 'maps'],
      blockedCategories: ['Social'],
      bonusTimeMinutes: 0,
      locked: false,
    }
    onUpdateConfig({
      ...config,
      children: [...config.children, newChild],
      activeChildId: newChild.id,
    })
    setSelectedChildId(newChild.id)
    setIsAddChildOpen(false)
    setNewChildName('')
  }

  // 1. PIN Gate if locked
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
          <Lock size={32} />
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
          Parental Controls PIN
        </h3>
        <p className="text-xs text-gray-400 mt-1 mb-6">
          Enter your 4-digit parent PIN to manage family settings (Default: 1234)
        </p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all ${
                enteredPin.length > idx
                  ? 'bg-emerald-500 scale-110 shadow-sm'
                  : 'bg-gray-200 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'C') setEnteredPin('')
                else if (btn === '⌫') setEnteredPin(enteredPin.slice(0, -1))
                else handlePinDigit(btn)
              }}
              className="h-14 rounded-2xl bg-gray-100 dark:bg-neutral-800/80 hover:bg-gray-200 dark:hover:bg-neutral-700 font-extrabold text-lg text-gray-800 dark:text-gray-100 active:scale-95 transition-all flex items-center justify-center shadow-xs"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-4 pb-16 animate-fade-in">
      <div className="py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
            Family Controls
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage screentime limits and downtime schedules for your children.
          </p>
        </div>

        <button
          onClick={() => setIsUnlocked(false)}
          className="p-2 rounded-2xl bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:text-emerald-500 text-xs font-bold flex items-center gap-1"
        >
          <Lock size={14} />
          <span>Lock</span>
        </button>
      </div>

      {/* Children Pill Selector */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {config.children.map((child) => (
          <button
            key={child.id}
            onClick={() => setSelectedChildId(child.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedChildId === child.id
                ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-neutral-700'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: child.avatarColor }}
            />
            <span>
              {child.name} ({child.age}y)
            </span>
          </button>
        ))}

        <button
          onClick={() => setIsAddChildOpen(true)}
          className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700 text-xs font-bold text-gray-500 hover:text-emerald-500 shrink-0"
        >
          <Plus size={14} />
          <span>Add Child</span>
        </button>
      </div>

      {activeChild && (
        <>
          {/* Child Status Hero */}
          <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: activeChild.avatarColor }}
                >
                  {activeChild.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {activeChild.name}'s Device
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    Limit: {formatDuration(activeChild.screenTimeLimitMinutes)} / day
                  </span>
                </div>
              </div>

              {/* Instant Lock Toggle */}
              <button
                onClick={handleToggleLockChild}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeChild.locked
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-rose-500/20 hover:text-rose-500'
                }`}
              >
                {activeChild.locked ? <Lock size={13} /> : <Unlock size={13} />}
                <span>{activeChild.locked ? 'Device Locked' : 'Lock Now'}</span>
              </button>
            </div>

            {/* Quick Bonus Time Adders */}
            <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-semibold">Bonus time today:</span>
              <div className="flex items-center gap-1.5">
                {[15, 30, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleAddBonusTime(m)}
                    className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors"
                  >
                    +{m}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Downtime Schedule Card */}
          <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">
                  Scheduled Downtime
                </span>
                <span className="text-[11px] text-gray-400">
                  {activeChild.downtime.start} to {activeChild.downtime.end} nightly
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !activeChild.downtime.enabled
                const updated = config.children.map((c) =>
                  c.id === activeChild.id
                    ? { ...c, downtime: { ...c.downtime, enabled: next } }
                    : c
                )
                onUpdateConfig({ ...config, children: updated })
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                activeChild.downtime.enabled
                  ? 'bg-indigo-600'
                  : 'bg-gray-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  activeChild.downtime.enabled ? 'translate-x-6' : 'translate-x-1'
                } top-1 absolute shadow-xs`}
              />
            </button>
          </div>

          {/* Blocked Categories & Approved Apps */}
          <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Content & Category Restrictions
            </h4>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {(['Social', 'Games', 'Video'] as AppCategory[]).map((cat) => {
                const isBlocked = activeChild.blockedCategories.includes(cat)
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const list = isBlocked
                        ? activeChild.blockedCategories.filter((c) => c !== cat)
                        : [...activeChild.blockedCategories, cat]
                      const updated = config.children.map((c) =>
                        c.id === activeChild.id ? { ...c, blockedCategories: list } : c
                      )
                      onUpdateConfig({ ...config, children: updated })
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isBlocked
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {isBlocked ? `Blocked: ${cat}` : `Allow: ${cat}`}
                  </button>
                )
              })}
            </div>

            <div className="text-[11px] text-gray-400">
              Approved Educational Apps: Chrome, Google Maps, Duolingo
            </div>
          </div>

          {/* Weekly Report Card Button */}
          <button
            onClick={() => setIsReportCardOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 mb-4"
          >
            <Printer size={15} />
            <span>View {activeChild.name}'s Weekly Report Card</span>
          </button>
        </>
      )}

      {/* Activity Alerts Inbox */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Bell size={13} className="text-amber-500" />
          <span>Activity Alerts Inbox ({config.alerts.length})</span>
        </h4>

        <div className="flex flex-col gap-2">
          {config.alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-start gap-2.5 text-xs"
            >
              <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {alert.childName}: {alert.message}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Today at {alert.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Report Card Modal */}
      <BottomSheet
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
        title={`${activeChild?.name}'s Weekly Report Card`}
        subtitle="Comprehensive family screen time audit & goal score"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-xs font-bold text-emerald-600 uppercase">
              Overall Screen Time Score
            </span>
            <div className="text-4xl font-extrabold text-emerald-600 my-1">A- (88%)</div>
            <p className="text-xs text-gray-500">
              {activeChild?.name} stayed under the daily limit on 6 out of 7 days this week!
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-xs">
            <span className="font-bold block mb-2">Top Learning vs Leisure</span>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-neutral-800">
              <span>Duolingo (Language)</span>
              <span className="font-bold text-emerald-500">3h 40m</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-neutral-800">
              <span>Subway Surfers (Gaming)</span>
              <span className="font-bold text-amber-500">1h 50m</span>
            </div>
            <div className="flex justify-between py-1">
              <span>YouTube Kids (Video)</span>
              <span className="font-bold text-blue-500">2h 10m</span>
            </div>
          </div>

          <button
            onClick={() => {
              window.print()
            }}
            className="w-full py-3 rounded-2xl bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <Printer size={15} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </BottomSheet>

      {/* Add Child Bottom Sheet */}
      <BottomSheet
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        title="Add Child Profile"
        subtitle="Create dedicated limits for another family member"
      >
        <div className="flex flex-col gap-3 py-2 text-xs">
          <div>
            <label className="font-bold text-gray-500 block mb-1">Child's Name</label>
            <input
              type="text"
              placeholder="e.g. Maya"
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              className="w-full p-2.5 rounded-2xl bg-gray-100 dark:bg-neutral-800 font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-500 block mb-1">Age ({newChildAge} years)</label>
            <input
              type="range"
              min="4"
              max="17"
              value={newChildAge}
              onChange={(e) => setNewChildAge(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="font-bold text-gray-500 block mb-1">Daily Limit ({formatDuration(newChildLimit)})</label>
            <input
              type="range"
              min="30"
              max="240"
              step="15"
              value={newChildLimit}
              onChange={(e) => setNewChildLimit(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="font-bold text-gray-500 block mb-1">Avatar Color</label>
            <div className="flex gap-2">
              {['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'].map((color) => (
                <div
                  key={color}
                  onClick={() => setNewChildColor(color)}
                  className={`w-7 h-7 rounded-full cursor-pointer transition-all ${
                    newChildColor === color ? 'ring-2 ring-emerald-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateChild}
            className="w-full py-3 rounded-2xl bg-emerald-500 text-neutral-950 font-bold text-xs mt-2"
          >
            Create Child Profile
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
