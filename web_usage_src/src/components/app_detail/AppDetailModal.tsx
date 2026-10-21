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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 sm:py-8 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl sm:max-h-[90vh] bg-slate-50 dark:bg-[#070A11] text-slate-900 dark:text-slate-100 flex flex-col overflow-y-auto sm:rounded-[36px] sm:border border-slate-200/80 dark:border-white/10 sm:shadow-2xl no-scrollbar animate-slide-up sm:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Bar */}
        <div className="sticky top-0 z-40 bg-slate-50/90 dark:bg-[#070A11]/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-slate-200/70 dark:border-white/[0.06]">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-2xl hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1 text-sm font-bold active:scale-95"
          aria-label="Back"
        >
          <ChevronLeft size={20} strokeWidth={2.4} />
          <span>Back</span>
        </button>

        <span className="text-sm font-display font-extrabold truncate max-w-[180px]">{app.name}</span>

        {/* Simulate Usage Test Button */}
        <button
          onClick={() => onSimulateAppUsage(app.id, 15)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-500/25 border border-emerald-500/30 transition-all active:scale-95 shadow-sm"
          title="Simulate 15 min of app usage to test timers"
        >
          <Play size={12} fill="currentColor" />
          <span>+15m Test</span>
        </button>
      </div>

      <div className="px-4 py-4 flex-1 max-w-[430px] mx-auto w-full pb-16">
        {/* App Header Card */}
        <div className="p-5 rounded-[28px] glass-card shadow-sm flex items-center justify-between mb-4">
          <div className="flex items-center gap-3.5">
            <AppIcon
              name={app.name}
              iconName={app.icon}
              color={app.accentColor}
              size={24}
            />
            <div>
              <h2 className="text-lg font-display font-extrabold text-slate-900 dark:text-white leading-tight">
                {app.name}
              </h2>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{app.category}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {formatDuration(todayMinutes)}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">Used today</span>
          </div>
        </div>

        {/* Blocked or Timed Out Status Banner */}
        {isBlockedToday && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between mb-4 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>App is paused/blocked for the rest of today</span>
            </div>
            <button
              onClick={() => onToggleBlockAppToday(app.id)}
              className="px-2.5 py-1 rounded-xl bg-rose-500 text-white text-[11px] font-bold shadow-sm active:scale-95"
            >
              Unpause
            </button>
          </div>
        )}

        {/* Day / Week segmented toggle */}
        <div className="flex items-center justify-center bg-slate-200/60 dark:bg-[#121929]/70 backdrop-blur-md p-1 rounded-2xl text-xs font-bold mb-4 border border-slate-300/50 dark:border-white/[0.06]">
          <button
            onClick={() => setViewMode('day')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              viewMode === 'day'
                ? 'bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-sm font-bold border border-transparent dark:border-emerald-500/30'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Hourly (Today)
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              viewMode === 'week'
                ? 'bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-sm font-bold border border-transparent dark:border-emerald-500/30'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Weekly (Last 7 Days)
          </button>
        </div>

        {/* 1. Hourly Bar Chart */}
        {viewMode === 'day' ? (
          <div className="p-5 rounded-[28px] glass-card shadow-sm mb-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
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
                        className="text-slate-200/60 dark:text-slate-800/40"
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
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        ) : (
          /* 2. Weekly Bar Chart with average line */
          <div className="p-5 rounded-[28px] glass-card shadow-sm mb-4">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Daily Usage (Last 7 Days)
              </h4>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
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
                        className="text-slate-200/60 dark:text-slate-800/40"
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
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2 px-3">
              {summary.dailyLast7Days.map((d) => {
                const [, , dayNum] = d.date.split('-')
                return <span key={d.date}>{dayNum}</span>
              })}
            </div>
          </div>
        )}

        {/* 3. 30-Day Line Chart with limit reference */}
        <div className="p-5 rounded-[28px] glass-card shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              30-Day Trend & Limit
            </h4>
            {timerLimit && (
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md">
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
                strokeWidth="2.4"
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
          <div className="p-3 rounded-2xl glass-card text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Opened</span>
            <span className="text-base font-display font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {summary.openCount}x
            </span>
          </div>

          <div className="p-3 rounded-2xl glass-card text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Alerts</span>
            <span className="text-base font-display font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {summary.notificationCount}
            </span>
          </div>

          <div className="p-3 rounded-2xl glass-card text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Session</span>
            <span className="text-base font-display font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {formatDuration(summary.averageSessionMinutes)}
            </span>
          </div>

          <div className="p-3 rounded-2xl glass-card text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Max Session</span>
            <span className="text-base font-display font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {formatDuration(summary.longestSessionMinutes)}
            </span>
          </div>

          <div className="p-3 rounded-2xl glass-card text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">First Used</span>
            <span className="text-base font-display font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {summary.firstUseTime}
            </span>
          </div>

          <div className="p-3 rounded-2xl glass-card text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Last Used</span>
            <span className="text-base font-display font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {summary.lastUseTime}
            </span>
          </div>
        </div>

        {/* App Timer Card */}
        <div className="p-4 rounded-[26px] glass-card shadow-sm flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm">
              <Hourglass size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {timerLimit ? `${formatDuration(timerLimit)} daily timer` : 'No timer set'}
              </h4>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                {timeLeft !== null
                  ? `${formatDuration(timeLeft)} remaining today`
                  : 'Set a limit to curb usage'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTimerPickerOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all active:scale-95 shadow-sm shadow-amber-500/25"
          >
            {timerLimit ? 'Edit Timer' : 'Set Timer'}
          </button>
        </div>

        {/* Per-App Notification & Focus Toggles */}
        <div className="p-4 rounded-[26px] glass-card shadow-sm flex flex-col gap-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell size={16} className="text-blue-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                App Notifications
              </span>
            </div>
            <button
              onClick={() => setNotificationsMock(!notificationsMock)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationsMock ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationsMock ? 'translate-x-6' : 'translate-x-1'
                } top-1 absolute shadow-sm`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Zap size={16} className="text-purple-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Include in Focus Mode Blocklist
              </span>
            </div>
            <button
              onClick={() => onToggleFocusModeApp(app.id)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isInFocusMode ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isInFocusMode ? 'translate-x-6' : 'translate-x-1'
                } top-1 absolute shadow-sm`}
              />
            </button>
          </div>
        </div>

        {/* Action: Block/Pause App Today */}
        <button
          onClick={() => onToggleBlockAppToday(app.id)}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all mb-4 active:scale-98 ${
            isBlockedToday
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/25'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
          }`}
        >
          <Pause size={15} />
          <span>{isBlockedToday ? 'Resume App Access' : 'Pause App for Today'}</span>
        </button>

        {/* Sessions List */}
        <div className="p-4 rounded-[26px] glass-card shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Today's Sessions ({summary.sessions.length})
          </h4>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
            {summary.sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-850/60 dark:bg-white/[0.03] text-xs border border-transparent dark:border-white/[0.04]"
              >
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Clock size={12} className="text-slate-400" />
                  <span>
                    {s.startTime} – {s.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (s.durationMinutes / 45) * 100)}%`,
                        backgroundColor: app.accentColor,
                      }}
                    />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
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
    </div>
  )
}
