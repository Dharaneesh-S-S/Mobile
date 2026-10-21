import React, { useState, useEffect } from 'react'
import {
  AppInfo,
  AppTimer,
  AppUsageSummary,
  DailyUsage,
  FocusMode,
  GoalConfig,
  UserSettings,
} from './types'
import { mockUsageProvider } from './services/MockUsageProvider'
import {
  loadBedtimeConfig,
  loadBlockedAppsToday,
  loadDndConfig,
  loadEyeProtection,
  loadFocusMode,
  loadGoalConfig,
  loadTimers,
  loadUserSettings,
  saveBedtimeConfig,
  saveBlockedAppsToday,
  saveDndConfig,
  saveEyeProtection,
  saveFocusMode,
  saveGoalConfig,
  saveTimers,
  saveUserSettings,
} from './services/storage'
import { formatDuration, getOffsetDateStr, getTodayDateStr } from './utils/formatters'
import { calculateStreak } from './utils/aggregations'

// Components
import { Header } from './components/common/Header'
import { BottomNavigation, NavigationTab } from './components/common/BottomNavigation'
import { PhoneFrame } from './components/common/PhoneFrame'
import { TimeLimitOverlay } from './components/common/TimeLimitOverlay'
import { ToastAlert, ToastMessage } from './components/common/ToastAlert'

// Dashboard Components
import { DateNavigator } from './components/dashboard/DateNavigator'
import { HeroCard } from './components/dashboard/HeroCard'
import { HourlyStackedBarChart } from './components/dashboard/HourlyStackedBarChart'
import { StatSparklineTiles } from './components/dashboard/StatSparklineTiles'
import { GoalRingCard } from './components/dashboard/GoalRingCard'
import { MostUsedAppsList } from './components/dashboard/MostUsedAppsList'
import { QuickActionCards, QuickActionKey } from './components/dashboard/QuickActionCards'

// Views
import { InsightsView } from './components/insights/InsightsView'
import { AppTimersView } from './components/features/AppTimersView'
import { FocusModeView } from './components/features/FocusModeView'
import { BedtimeModeView } from './components/features/BedtimeModeView'
import { EyeProtectionView } from './components/features/EyeProtectionView'
import { DndView } from './components/features/DndView'
import { GoalsView } from './components/features/GoalsView'
import { SettingsView } from './components/features/SettingsView'
import { AppDetailModal } from './components/app_detail/AppDetailModal'

export function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard')
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateStr())
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')

  // Sub-features routing (e.g. Bedtime, Eye care, DND, Settings, Goals)
  const [activeSubView, setActiveSubView] = useState<
    'none' | 'bedtime' | 'eyecare' | 'dnd' | 'goals' | 'settings'
  >('none')

  // App details
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [selectedAppSummary, setSelectedAppSummary] = useState<AppUsageSummary | null>(null)

  // Data states
  const [apps, setApps] = useState<AppInfo[]>([])
  const [todayUsage, setTodayUsage] = useState<DailyUsage | null>(null)
  const [prevUsage, setPrevUsage] = useState<DailyUsage | null>(null)
  const [rangeUsages, setRangeUsages] = useState<DailyUsage[]>([])

  // Config states
  const [timers, setTimers] = useState<AppTimer[]>(loadTimers)
  const [focusConfig, setFocusConfig] = useState<FocusMode>(loadFocusMode)
  const [bedtimeConfig, setBedtimeConfig] = useState(loadBedtimeConfig)
  const [eyeCareConfig, setEyeCareConfig] = useState(loadEyeProtection)
  const [dndConfig, setDndConfig] = useState(loadDndConfig)
  const [goalConfig, setGoalConfig] = useState<GoalConfig>(loadGoalConfig)
  const [userSettings, setUserSettings] = useState<UserSettings>(loadUserSettings)
  const [blockedAppsToday, setBlockedAppsToday] = useState<string[]>(loadBlockedAppsToday)

  // Simulation overlays & toasts
  const [expiredApp, setExpiredApp] = useState<AppInfo | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [isGrayscaleActive, setIsGrayscaleActive] = useState(false)
  const [isEyeCareLiveActive, setIsEyeCareLiveActive] = useState(false)

  // Scroll state for header collapse
  const [isScrolled, setIsScrolled] = useState(false)

  // Initialize data on mount
  useEffect(() => {
    async function loadData() {
      const appList = await mockUsageProvider.getApps()
      setApps(appList)

      const start = getOffsetDateStr(-89)
      const end = getTodayDateStr()
      const allUsages = await mockUsageProvider.getUsageRange(start, end)
      setRangeUsages(allUsages)

      const today = await mockUsageProvider.getDailyUsage(currentDate)
      setTodayUsage(today)

      const prev = await mockUsageProvider.getDailyUsage(getOffsetDateStr(-1, currentDate))
      setPrevUsage(prev)
    }
    loadData()
  }, [])

  // Update on date change
  useEffect(() => {
    async function updateDate() {
      const day = await mockUsageProvider.getDailyUsage(currentDate)
      setTodayUsage(day)
      const prev = await mockUsageProvider.getDailyUsage(getOffsetDateStr(-1, currentDate))
      setPrevUsage(prev)
    }
    updateDate()
  }, [currentDate])

  // Update selected app summary when opened
  useEffect(() => {
    async function loadAppSummary() {
      if (selectedAppId) {
        const start = getOffsetDateStr(-30, currentDate)
        const summary = await mockUsageProvider.getAppUsage(selectedAppId, start, currentDate)
        setSelectedAppSummary(summary)
      } else {
        setSelectedAppSummary(null)
      }
    }
    loadAppSummary()
  }, [selectedAppId, currentDate, todayUsage])

  // Theme & Accessibility setup
  useEffect(() => {
    const root = document.documentElement
    if (
      userSettings.theme === 'dark' ||
      (userSettings.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    if (userSettings.palette === 'colorblind') {
      root.classList.add('colorblind-safe')
    } else {
      root.classList.remove('colorblind-safe')
    }
  }, [userSettings.theme, userSettings.palette])

  const showToast = (
    type: 'info' | 'warning' | 'success' | 'danger',
    title: string,
    message: string
  ) => {
    const id = `toast_${Date.now()}`
    setToasts((prev) => [...prev, { id, type, title, message }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Simulate app usage advancement and check timer expiration
  const handleSimulateAppUsage = async (appId: string, minutes: number) => {
    const app = apps.find((a) => a.id === appId)
    if (!app) return

    // Record session
    const startTime = new Date().toTimeString().slice(0, 5)
    await mockUsageProvider.recordSession({
      id: `sim_${Date.now()}`,
      appId,
      startTime,
      endTime: startTime,
      durationMinutes: minutes,
    })

    // Reload today's usage
    const refreshed = await mockUsageProvider.getDailyUsage(currentDate)
    setTodayUsage(refreshed)

    const newMins = refreshed.appTotals[appId] || 0
    const timer = timers.find((t) => t.appId === appId && t.enabled)

    if (timer) {
      const remaining = timer.limitMinutes - newMins
      if (remaining <= 0) {
        // Trigger full screen Time's up overlay
        setExpiredApp(app)
      } else if (remaining <= 5) {
        showToast(
          'warning',
          '5 Minutes Left',
          `You have ${remaining}m remaining for ${app.name} today.`
        )
      } else {
        showToast(
          'info',
          'Simulated Usage',
          `Added ${minutes}m to ${app.name}. ${remaining}m remaining.`
        )
      }
    } else {
      showToast('info', 'Simulated Usage', `Added ${minutes}m to ${app.name}.`)
    }
  }

  // Quick Action card handler
  const handleSelectQuickAction = (key: QuickActionKey) => {
    if (key === 'focus') {
      setCurrentTab('focus')
      setActiveSubView('none')
    } else if (key === 'timers') {
      setCurrentTab('timers')
      setActiveSubView('none')
    } else if (key === 'goals') {
      setCurrentTab('goals')
      setActiveSubView('none')
    } else if (key === 'bedtime') {
      setActiveSubView('bedtime')
    } else if (key === 'eyecare') {
      setActiveSubView('eyecare')
    } else if (key === 'dnd') {
      setActiveSubView('dnd')
    }
  }

  // Calculate streaks & goal status
  const streakInfo = calculateStreak(rangeUsages, goalConfig.dailyScreenTimeGoal)

  // 7-day sparkline histories for stat tiles
  const last7Usages = rangeUsages.slice(-7)
  const screenTime7Days = last7Usages.map((u) => u.totalScreenTimeMinutes)
  const notifications7Days = last7Usages.map((u) => u.notifications)
  const unlocks7Days = last7Usages.map((u) => u.unlocks)

  return (
    <div
      className={`${isGrayscaleActive ? 'bedtime-grayscale-active' : ''}`}
      onScroll={(e) => {
        const target = e.target as HTMLElement
        setIsScrolled(target.scrollTop > 30)
      }}
    >
      {/* Eye Protection Warm Tint Simulation Filter */}
      {(eyeCareConfig.enabled || isEyeCareLiveActive) && (
        <div
          className="eye-protection-overlay"
          style={
            {
              '--eye-warmth': `${(eyeCareConfig.intensity / 100) * 0.4}`,
            } as React.CSSProperties
          }
        />
      )}

      {/* Floating Alerts Container */}
      <ToastAlert toasts={toasts} onDismiss={dismissToast} />

      {/* Full-screen "Time's up" Simulation Overlay */}
      <TimeLimitOverlay
        app={expiredApp}
        isOpen={Boolean(expiredApp)}
        onCloseApp={() => setExpiredApp(null)}
        onIgnore15Min={() => {
          if (expiredApp) {
            showToast(
              'info',
              '15-Minute Extension',
              `Extended limit for ${expiredApp.name} by 15 minutes.`
            )
          }
          setExpiredApp(null)
        }}
      />

      {/* Main Responsive Phone Wrapper */}
      <PhoneFrame
        phoneFrameMode={userSettings.phoneFrameMode}
        onToggleFrame={() => {
          const next = !userSettings.phoneFrameMode
          const updated = { ...userSettings, phoneFrameMode: next }
          setUserSettings(updated)
          saveUserSettings(updated)
        }}
      >
        {/* Android Native Large Header */}
        <Header
          onOpenSettings={() => setActiveSubView('settings')}
          onOpenGoals={() => {
            setCurrentTab('goals')
            setActiveSubView('none')
          }}
          theme={userSettings.theme}
          onToggleTheme={() => {
            const nextTheme: 'light' | 'dark' = userSettings.theme === 'dark' ? 'light' : 'dark'
            const updated = { ...userSettings, theme: nextTheme }
            setUserSettings(updated)
            saveUserSettings(updated)
          }}
          isScrolled={isScrolled}
        />

        {/* SUB-VIEW MODAL / PAGES (e.g. Bedtime, Eye care, DND, Settings, Goals) */}
        {activeSubView !== 'none' ? (
          <div className="flex-1 pb-14">
            <div className="px-4 pt-2">
              <button
                onClick={() => setActiveSubView('none')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1"
              >
                ← Back to Dashboard
              </button>
            </div>

            {activeSubView === 'bedtime' && (
              <BedtimeModeView
                config={bedtimeConfig}
                last7Days={rangeUsages.slice(-7)}
                onUpdateConfig={(cfg) => {
                  setBedtimeConfig(cfg)
                  saveBedtimeConfig(cfg)
                }}
                onToggleGlobalGrayscale={(active) => setIsGrayscaleActive(active)}
                isGrayscaleActive={isGrayscaleActive}
              />
            )}

            {activeSubView === 'eyecare' && (
              <EyeProtectionView
                config={eyeCareConfig}
                onUpdateConfig={(cfg) => {
                  setEyeCareConfig(cfg)
                  saveEyeProtection(cfg)
                }}
                onToggleLivePreview={(active) => setIsEyeCareLiveActive(active)}
                isLivePreviewActive={isEyeCareLiveActive}
              />
            )}

            {activeSubView === 'dnd' && (
              <DndView
                config={dndConfig}
                apps={apps}
                todayUsageMinutes={todayUsage?.appTotals || {}}
                onUpdateConfig={(cfg) => {
                  setDndConfig(cfg)
                  saveDndConfig(cfg)
                }}
              />
            )}

            {activeSubView === 'goals' && (
              <GoalsView
                goalConfig={goalConfig}
                streakDays={streakInfo.currentStreak}
                last7DaysUnder={streakInfo.last7DaysUnder}
                onUpdateGoalConfig={(cfg) => {
                  setGoalConfig(cfg)
                  saveGoalConfig(cfg)
                }}
              />
            )}

            {activeSubView === 'settings' && (
              <SettingsView
                settings={userSettings}
                usages={rangeUsages}
                onUpdateSettings={(s) => {
                  setUserSettings(s)
                  saveUserSettings(s)
                }}
                onRegenerateData={(profile) => {
                  mockUsageProvider.resetAllData(profile)
                  const updated = { ...userSettings, demoProfile: profile }
                  setUserSettings(updated)
                  saveUserSettings(updated)
                  window.location.reload()
                }}
                onDeleteAllData={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
              />
            )}
          </div>
        ) : (
          /* MAIN TABS */
          <main className="flex-1">
            {/* TAB 1: HOME DASHBOARD */}
            {currentTab === 'dashboard' && todayUsage && (
              <div className="flex flex-col pb-8 animate-fade-in">
                {/* Date Navigator */}
                <DateNavigator
                  currentDate={currentDate}
                  onSelectDate={(d) => setCurrentDate(d)}
                  viewMode={viewMode}
                  onToggleViewMode={(m) => setViewMode(m)}
                  minDate={getOffsetDateStr(-89)}
                  maxDate={getTodayDateStr()}
                />

                {/* Hero Card */}
                <HeroCard
                  totalMinutes={todayUsage.totalScreenTimeMinutes}
                  previousMinutes={prevUsage?.totalScreenTimeMinutes || 240}
                  comparisonLabel="vs yesterday"
                  goalMinutes={goalConfig.dailyScreenTimeGoal}
                />

                {/* Daily Stacked Hourly Bar Chart */}
                <HourlyStackedBarChart
                  hourly={todayUsage.hourly}
                  apps={apps}
                  goalMinutes={goalConfig.dailyScreenTimeGoal}
                  isColorblindSafe={userSettings.palette === 'colorblind'}
                />

                {/* 3 Stat Sparkline Tiles */}
                <StatSparklineTiles
                  screenTimeMinutes={todayUsage.totalScreenTimeMinutes}
                  prevScreenTimeMinutes={prevUsage?.totalScreenTimeMinutes || 240}
                  screenTime7Days={screenTime7Days}
                  notifications={todayUsage.notifications}
                  prevNotifications={prevUsage?.notifications || 120}
                  notifications7Days={notifications7Days}
                  unlocks={todayUsage.unlocks}
                  prevUnlocks={prevUsage?.unlocks || 50}
                  unlocks7Days={unlocks7Days}
                />

                {/* Goal Ring Card */}
                <GoalRingCard
                  currentMinutes={todayUsage.totalScreenTimeMinutes}
                  goalMinutes={goalConfig.dailyScreenTimeGoal}
                  streakDays={streakInfo.currentStreak}
                  onUpdateGoal={(newGoal) => {
                    const updated = { ...goalConfig, dailyScreenTimeGoal: newGoal }
                    setGoalConfig(updated)
                    saveGoalConfig(updated)
                  }}
                />

                {/* Most Used Apps List */}
                <MostUsedAppsList
                  apps={apps}
                  appTotals={todayUsage.appTotals}
                  onSelectApp={(appId) => setSelectedAppId(appId)}
                />

                {/* Quick Action Cards */}
                <QuickActionCards
                  onSelectAction={handleSelectQuickAction}
                  isFocusActive={focusConfig.enabled}
                  isBedtimeActive={bedtimeConfig.enabled}
                  timersCount={timers.filter((t) => t.enabled).length}
                  isEyeCareActive={eyeCareConfig.enabled}
                  isDndActive={dndConfig.enabled}
                  streakDays={streakInfo.currentStreak}
                />
              </div>
            )}

            {/* TAB 2: INSIGHTS (ALL 13 WHOLE-PHONE GRAPHS) */}
            {currentTab === 'insights' && todayUsage && (
              <InsightsView
                usages={rangeUsages}
                todayUsage={todayUsage}
                apps={apps}
                goalMinutes={goalConfig.dailyScreenTimeGoal}
                isColorblindSafe={userSettings.palette === 'colorblind'}
                onSelectDay={(d) => {
                  setCurrentDate(d)
                  setCurrentTab('dashboard')
                }}
                onSelectApp={(appId) => setSelectedAppId(appId)}
              />
            )}

            {/* TAB 3: MODES (FOCUS & BEDTIME) */}
            {currentTab === 'focus' && (
              <FocusModeView
                apps={apps}
                focusConfig={focusConfig}
                onUpdateFocusConfig={(cfg) => {
                  setFocusConfig(cfg)
                  saveFocusMode(cfg)
                }}
              />
            )}

            {/* TAB 4: APP TIMERS */}
            {currentTab === 'timers' && (
              <AppTimersView
                apps={apps}
                timers={timers}
                todayUsageMinutes={todayUsage?.appTotals || {}}
                onSaveTimer={(timer) => {
                  const filtered = timers.filter((t) => t.appId !== timer.appId)
                  const updated = [...filtered, timer]
                  setTimers(updated)
                  saveTimers(updated)
                  showToast('success', 'Timer Saved', `Limit set for app.`)
                }}
                onDeleteTimer={(appId) => {
                  const updated = timers.filter((t) => t.appId !== appId)
                  setTimers(updated)
                  saveTimers(updated)
                  showToast('info', 'Timer Removed', `App limit removed.`)
                }}
                onSimulateAppUsage={handleSimulateAppUsage}
              />
            )}

            {/* TAB 5: GOALS & ACHIEVEMENTS */}
            {currentTab === 'goals' && (
              <GoalsView
                goalConfig={goalConfig}
                streakDays={streakInfo.currentStreak}
                last7DaysUnder={streakInfo.last7DaysUnder}
                onUpdateGoalConfig={(cfg) => {
                  setGoalConfig(cfg)
                  saveGoalConfig(cfg)
                }}
              />
            )}
          </main>
        )}

        {/* Per-App Detail Screen Modal */}
        {selectedAppId && (
          <AppDetailModal
            app={apps.find((a) => a.id === selectedAppId) || null}
            summary={selectedAppSummary}
            timer={timers.find((t) => t.appId === selectedAppId) || null}
            isInFocusMode={focusConfig.distractingAppIds.includes(selectedAppId)}
            isBlockedToday={blockedAppsToday.includes(selectedAppId)}
            onClose={() => setSelectedAppId(null)}
            onSetTimer={(appId, limitMinutes) => {
              if (limitMinutes) {
                const updated = [
                  ...timers.filter((t) => t.appId !== appId),
                  {
                    appId,
                    limitMinutes,
                    enabled: true,
                    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                    resetTime: '00:00',
                  },
                ]
                setTimers(updated)
                saveTimers(updated)
                showToast('success', 'Timer Set', `${formatDuration(limitMinutes)} daily limit.`)
              } else {
                const updated = timers.filter((t) => t.appId !== appId)
                setTimers(updated)
                saveTimers(updated)
                showToast('info', 'Timer Removed', 'Limit removed.')
              }
            }}
            onToggleFocusModeApp={(appId) => {
              const list = focusConfig.distractingAppIds.includes(appId)
                ? focusConfig.distractingAppIds.filter((x) => x !== appId)
                : [...focusConfig.distractingAppIds, appId]
              const updated = { ...focusConfig, distractingAppIds: list }
              setFocusConfig(updated)
              saveFocusMode(updated)
            }}
            onToggleBlockAppToday={(appId) => {
              const list = blockedAppsToday.includes(appId)
                ? blockedAppsToday.filter((x) => x !== appId)
                : [...blockedAppsToday, appId]
              setBlockedAppsToday(list)
              saveBlockedAppsToday(list)
            }}
            onSimulateAppUsage={handleSimulateAppUsage}
          />
        )}

        {/* Native Android Bottom Navigation Bar */}
        <BottomNavigation
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab)
            setActiveSubView('none')
          }}
        />
      </PhoneFrame>
    </div>
  )
}
