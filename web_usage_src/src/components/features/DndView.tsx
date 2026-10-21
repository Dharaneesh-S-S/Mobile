import React from 'react'
import { DndConfig, AppInfo } from '../../types'
import { BellOff, Phone, Star, AlarmClock, Bell } from 'lucide-react'
import { AppIcon } from '../common/AppIcon'

interface DndViewProps {
  config: DndConfig
  apps: AppInfo[]
  todayUsageMinutes: Record<string, number>
  onUpdateConfig: (cfg: DndConfig) => void
}

export const DndView: React.FC<DndViewProps> = ({
  config,
  apps,
  todayUsageMinutes,
  onUpdateConfig,
}) => {
  const toggleDnd = () => {
    onUpdateConfig({ ...config, enabled: !config.enabled })
  }

  // Derive notification breakdown
  const appNotifications = apps
    .map((app) => ({
      app,
      count: Math.round((todayUsageMinutes[app.id] || 0) * 0.4) + 4,
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="flex flex-col px-4 pb-16 animate-fade-in">
      <div className="py-4">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
          Do Not Disturb
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Mute calls, notifications and media with custom exceptions.
        </p>
      </div>

      {/* Main Switch */}
      <div className="p-5 rounded-[28px] glass-card shadow-sm flex items-center justify-between mb-4 border border-pink-500/25">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              config.enabled ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <BellOff size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {config.enabled ? 'Do Not Disturb ON' : 'Do Not Disturb Off'}
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              {config.enabled ? 'Notifications are currently muted' : 'Alerts will sound normally'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleDnd}
          className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition-all active:scale-95 shadow-sm ${
            config.enabled
              ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/25'
              : 'bg-pink-600 text-white hover:bg-pink-500 shadow-pink-500/25'
          }`}
        >
          {config.enabled ? 'Turn Off' : 'Turn On'}
        </button>
      </div>

      {/* Exceptions Card */}
      <div className="p-5 rounded-[28px] glass-card shadow-sm flex flex-col gap-3 mb-4">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Exceptions (What Can Interrupt)
        </h4>

        {/* Calls Selector */}
        <div className="flex items-center justify-between text-xs py-1">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-emerald-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Calls from</span>
          </div>
          <select
            value={config.allowCalls}
            onChange={(e) =>
              onUpdateConfig({
                ...config,
                allowCalls: e.target.value as any,
              })
            }
            className="bg-gray-100 dark:bg-neutral-700/60 px-2 py-1 rounded-xl text-xs font-bold focus:outline-none"
          >
            <option value="anyone">Anyone</option>
            <option value="contacts">Contacts only</option>
            <option value="favorites">Starred contacts</option>
            <option value="none">Don't allow calls</option>
          </select>
        </div>

        {/* Repeat callers */}
        <div className="flex items-center justify-between text-xs py-1 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-500" />
            <div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                Repeat Callers
              </span>
              <span className="text-[10px] text-gray-400">
                Allow if same person calls twice in 15 min
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={config.allowRepeatCallers}
            onChange={(e) =>
              onUpdateConfig({ ...config, allowRepeatCallers: e.target.checked })
            }
            className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
          />
        </div>

        {/* Alarms */}
        <div className="flex items-center justify-between text-xs py-1 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <AlarmClock size={16} className="text-indigo-500" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Alarms & Timers
            </span>
          </div>
          <input
            type="checkbox"
            checked={config.allowAlarms}
            onChange={(e) =>
              onUpdateConfig({ ...config, allowAlarms: e.target.checked })
            }
            className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Notification Summary */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-800 shadow-sm">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Notification Summary (Today)
        </h4>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {appNotifications.slice(0, 6).map((item) => (
            <div
              key={item.app.id}
              className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-neutral-900/60 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <AppIcon
                  name={item.app.name}
                  iconName={item.app.icon}
                  color={item.app.accentColor}
                  size={14}
                />
                <span className="font-semibold">{item.app.name}</span>
              </div>
              <span className="font-bold text-gray-500">{item.count} alerts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
