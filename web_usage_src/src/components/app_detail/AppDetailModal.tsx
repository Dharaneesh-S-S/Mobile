import React, { useState } from 'react'
import {
  ChevronLeft,
  Hourglass,
  Bell,
  Play,
  Pause,
  Zap,
  Clock,
  Unlock,
  ShieldAlert,
  ArrowDown,
  ArrowUp,
} from 'lucide-react'
import { AppInfo, AppTimer, AppUsageSummary } from '../../types'
import { AppIcon } from '../common/AppIcon'
import { formatDuration, formatTimeOfDay } from '../../utils/formatters'
import { BottomSheet } from '../common/BottomSheet'

interface AppDetailModalProps {
  app: AppInfo | null
  summary: AppUsageSummary | null
  timer: AppTimer | null
  isInFocusMode: boolean
  isBlockedToday: boolean
  onClose: () => void
  onSetTimer: (appId: string, limitMinutes: number | null) => void
  onToggleFocusModeApp: (appId: string) => void
  onToggleBlockAppToday: (appId: string) => void
  onSimulateAppUsage: (appId: string, minutes: number) => void
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  summary,
  timer,
  isInFocusMode,
  isBlockedToday,
  onClose,
  onSetTimer,
  onToggleFocusModeApp,
  onToggleBlockAppToday,
  onSimulateAppUsage,
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  const [notificationsMock, setNotificationsMock] = useState(true)
  const [isTimerPickerOpen, setIsTimerPickerOpen] = useState(false)
  const [customTimerMinutes, setCustomTimerMinutes] = useState(timer?.limitMinutes || 45)

  if (!app || !summary) return null

  const todayMinutes = summary.totalMinutes
  const timerLimit = timer?.enabled ? timer.limitMinutes : null
  const timeLeft = timerLimit ? Math.max(0, timerLimit - todayMinutes) : null

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-[#121316] text-gray-900 dark:text-gray-100 flex flex-col overflow-y-auto animate-fade-in">
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-neutral-800">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1 text-sm font-semibold"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>

        <span className="text-sm font-bold truncate max-w-[180px]">{app.name}</span>

        {/* Simulate Usage Test Button */}
        <button
          onClick={() => onSimulateAppUsage(app.id, 15)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500/20 transition-colors"
          title="Simulate 15 min of app usage to test timers"
        >
          <Play size={12} fill="currentColor" />
          <span>+15m Test</span>
        </button>
      </div>

      <div className="px-4 py-4 flex-1 max-w-[430px] mx-auto w-full pb-16">
        {/* App Header Card */}
        <div className="p-5 rounded-3xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3.5">
            <AppIcon
              name={app.name}
              iconName={app.icon}
              color={app.accentColor}
              size={24}
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {app.name}
              </h2>
              <span className="text-xs text-gray-400">{app.category}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {formatDuration(todayMinutes)}
            </span>
            <span className="text-[10px] text-gray-400">Used today</span>
          </div>
        </div>

        {/* Blocked or Timed Out Status Banner */}
        {isBlockedToday && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>App is paused/blocked for the rest of today</span>
            </div>
            <button
              onClick={() => onToggleBlockAppToday(app.id)}
              className="px-2 py-0.5 rounded-lg bg-rose-500 text-white text-[11px] font-bold"
            >
              Unpause
            </button>
          </div>
        )}

        {/* Day / Week segmented toggle */}
        <div className="flex items-center justify-center bg-gray-100 dark:bg-neutral-800/80 p-1 rounded-2xl text-xs font-semibold mb-4">
          <button
            onClick={() => setViewMode('day')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              viewMode === 'day'
                ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Hourly (Today)
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              viewMode === 'week'
                ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Weekly (Last 7 Days)
          </button>
        </div>

        {/* 1. Hourly Bar Chart */}
        {viewMode === 'day' ? (
          <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Today's Hourly Usage
            </h4>
            <div className="relative w-full h-[120px] select-none">
              <svg viewBox="0 0 360 120" className="w-full h-full overflow-visible">
                {summary.hourlyToday.map((mins, h) => {
                  const barW = 10
                  const x = h * 15 + 2
                  const maxH = 60
                  const hHeight = (mins / maxH) * 120
                  return (
                    <g key={h}>
                      <rect
                        x={x}
                        y={0}
                        width={barW}
                        height={120}
                        fill="currentColor"
                        className="text-gray-100 dark:text-neutral-700/30"
                        rx="3"
                      />
                      {mins > 0 && (
                        <rect
                          x={x}
                          y={120 - hHeight}
                          width={barW}
                          height={hHeight}
                          fill={app.accentColor}
                          rx="3"
                        />
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        ) : (
          /* 2. Weekly Bar Chart with average line */
          <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Daily Usage (Last 7 Days)
              </h4>
              <span className="text-[11px] text-amber-500 font-semibold">
                Daily Avg: {formatDuration(summary.dailyAverageMinutes)}
              </span>
            </div>
            <div className="relative w-full h-[120px] select-none">
              <svg viewBox="0 0 350 120" className="w-full h-full overflow-visible">
                {/* Average line */}
                {summary.dailyAverageMinutes > 0 && (
                  <line
                    x1="0"
                    y1={120 - (summary.dailyAverageMinutes / 120) * 120}
                    x2="350"
                    y2={120 - (summary.dailyAverageMinutes / 120) * 120}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )}
                {summary.dailyLast7Days.map((d, i) => {
                  const barW = 28
                  const x = i * 50 + 10
                  const bH = (d.minutes / 120) * 120
                  return (
                    <g key={d.date}>
                      <rect
                        x={x}
                        y={0}
                        width={barW}
                        height={120}
                        fill="currentColor"
                        className="text-gray-100 dark:text-neutral-700/30"
                        rx="4"
                      />
                      <rect
                        x={x}
                        y={120 - bH}
                        width={barW}
                        height={bH}
                        fill={app.accentColor}
                        rx="4"
                      />
                    </g>
                  )
                })}
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-gray-400 mt-2 px-3">
              {summary.dailyLast7Days.map((d) => {
                const [, , dayNum] = d.date.split('-')
                return <span key={d.date}>{dayNum}</span>
              })}
            </div>
          </div>
        )}

        {/* 3. 30-Day Line Chart with limit reference */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              30-Day Trend & Limit
            </h4>
            {timerLimit && (
              <span className="text-[11px] text-rose-500 font-semibold">
                Limit: {formatDuration(timerLimit)}
              </span>
            )}
          </div>
          <div className="relative w-full h-[90px] select-none">
            <svg viewBox="0 0 300 90" className="w-full h-full overflow-visible">
              {timerLimit && (
                <line
                  x1="0"
                  y1={90 - (timerLimit / 140) * 90}
                  x2="300"
                  y2={90 - (timerLimit / 140) * 90}
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              )}
              {/* Trend line */}
              <polyline
                fill="none"
                stroke={app.accentColor}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={summary.dailyLast30Days
                  .map((d, i) => {
                    const x = (i / 29) * 300
                    const y = 90 - (d.minutes / 140) * 85 - 2
                    return `${x.toFixed(1)},${y.toFixed(1)}`
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Stats Tiles (6 Key Metrics) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 text-center">
            <span className="text-[10px] text-gray-400 font-semibold block">Opened</span>
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              {summary.openCount} times
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 text-center">
            <span className="text-[10px] text-gray-400 font-semibold block">Alerts</span>
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              {summary.notificationCount}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 text-center">
            <span className="text-[10px] text-gray-400 font-semibold block">Avg Session</span>
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(summary.averageSessionMinutes)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 text-center">
            <span className="text-[10px] text-gray-400 font-semibold block">Max Session</span>
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(summary.longestSessionMinutes)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 text-center">
            <span className="text-[10px] text-gray-400 font-semibold block">First Used</span>
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              {summary.firstUseTime}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 text-center">
            <span className="text-[10px] text-gray-400 font-semibold block">Last Used</span>
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              {summary.lastUseTime}
            </span>
          </div>
        </div>

        {/* App Timer Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Hourglass size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                {timerLimit ? `${formatDuration(timerLimit)} daily timer` : 'No timer set'}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {timeLeft !== null
                  ? `${formatDuration(timeLeft)} remaining today`
                  : 'Set a limit to curb usage'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTimerPickerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-600 transition-colors"
          >
            {timerLimit ? 'Edit Timer' : 'Set Timer'}
          </button>
        </div>

        {/* Per-App Notification & Focus Toggles */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col gap-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell size={16} className="text-blue-500" />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                App Notifications
              </span>
            </div>
            <button
              onClick={() => setNotificationsMock(!notificationsMock)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationsMock ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationsMock ? 'translate-x-6' : 'translate-x-1'
                } top-1 absolute`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <Zap size={16} className="text-purple-500" />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Include in Focus Mode Blocklist
              </span>
            </div>
            <button
              onClick={() => onToggleFocusModeApp(app.id)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isInFocusMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isInFocusMode ? 'translate-x-6' : 'translate-x-1'
                } top-1 absolute`}
              />
            </button>
          </div>
        </div>

        {/* Action: Block/Pause App Today */}
        <button
          onClick={() => onToggleBlockAppToday(app.id)}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all mb-4 ${
            isBlockedToday
              ? 'bg-emerald-500 text-neutral-950 hover:bg-emerald-600'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
          }`}
        >
          <Pause size={15} />
          <span>{isBlockedToday ? 'Resume App Access' : 'Pause App for Today'}</span>
        </button>

        {/* Sessions List */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Today's Sessions ({summary.sessions.length})
          </h4>
          <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
            {summary.sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-neutral-900/60 text-xs"
              >
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Clock size={12} className="text-gray-400" />
                  <span>
                    {s.startTime} – {s.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (s.durationMinutes / 45) * 100)}%`,
                        backgroundColor: app.accentColor,
                      }}
                    />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {formatDuration(s.durationMinutes)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Set Timer Bottom Sheet */}
      <BottomSheet
        isOpen={isTimerPickerOpen}
        onClose={() => setIsTimerPickerOpen(false)}
        title={`Set Timer for ${app.name}`}
        subtitle="Choose a daily usage limit"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="text-center py-4">
            <span className="text-5xl font-extrabold text-amber-500">
              {formatDuration(customTimerMinutes)}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60, 90, 120, 180].map((mins) => (
              <button
                key={mins}
                onClick={() => setCustomTimerMinutes(mins)}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                  customTimerMinutes === mins
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {formatDuration(mins)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            {timerLimit && (
              <button
                onClick={() => {
                  onSetTimer(app.id, null)
                  setIsTimerPickerOpen(false)
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-500/10 text-rose-600 font-bold text-xs hover:bg-rose-500/20"
              >
                Remove Timer
              </button>
            )}

            <button
              onClick={() => {
                onSetTimer(app.id, customTimerMinutes)
                setIsTimerPickerOpen(false)
              }}
              className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs"
            >
              Save Timer
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
