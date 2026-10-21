import React from 'react'
import { EyeProtectionConfig } from '../../types'
import { Eye, SunMedium, Moon, Sparkles } from 'lucide-react'

interface EyeProtectionViewProps {
  config: EyeProtectionConfig
  onUpdateConfig: (cfg: EyeProtectionConfig) => void
  onToggleLivePreview: (active: boolean, intensity: number) => void
  isLivePreviewActive: boolean
}

export const EyeProtectionView: React.FC<EyeProtectionViewProps> = ({
  config,
  onUpdateConfig,
  onToggleLivePreview,
  isLivePreviewActive,
}) => {
  const handleToggle = () => {
    const next = !config.enabled
    onUpdateConfig({ ...config, enabled: next })
    onToggleLivePreview(next, config.intensity)
  }

  const handleIntensityChange = (val: number) => {
    onUpdateConfig({ ...config, intensity: val })
    if (config.enabled || isLivePreviewActive) {
      onToggleLivePreview(true, val)
    }
  }

  return (
    <div className="flex flex-col px-4 pb-16 animate-fade-in">
      <div className="py-4">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
          Protect Your Eyes
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Filters harmful blue light and reduces eye strain in dark environments.
        </p>
      </div>

      {/* Main Switch Card */}
      <div className="p-5 rounded-[28px] glass-card shadow-sm flex items-center justify-between mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <Eye size={22} strokeWidth={2.4} />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Blue Light Filter
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              {config.enabled ? 'Filter active' : 'Filter turned off'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`w-12 h-7 rounded-full transition-colors relative ${
            config.enabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              config.enabled ? 'translate-x-6' : 'translate-x-1'
            } top-1 absolute shadow-sm`}
          />
        </button>
      </div>

      {/* Warmth Intensity Slider */}
      <div className="p-5 rounded-[28px] glass-card shadow-sm flex flex-col mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Warmth Intensity ({config.intensity}%)
          </span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
            {config.intensity > 70 ? 'Very Warm' : config.intensity > 40 ? 'Moderate' : 'Mild'}
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="90"
          value={config.intensity}
          onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
          className="w-full accent-amber-500 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer my-3"
        />

        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Natural</span>
          <span>Warm Amber</span>
          <span>Deep Candlelight</span>
        </div>
      </div>

      {/* Schedule Selector */}
      <div className="p-5 rounded-[28px] glass-card shadow-sm mb-4">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Automatic Schedule
        </h4>

        <div className="flex flex-col gap-2">
          {[
            {
              type: 'sunset' as const,
              label: 'Sunset to Sunrise',
              desc: 'Adapts dynamically to local twilight hours',
            },
            {
              type: 'custom' as const,
              label: 'Custom Schedule',
              desc: 'From 20:00 to 06:30 daily',
            },
            {
              type: 'always' as const,
              label: 'Always On',
              desc: 'Keep warm eye protection active 24/7',
            },
          ].map((item) => (
            <div
              key={item.type}
              onClick={() => onUpdateConfig({ ...config, scheduleType: item.type })}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                config.scheduleType === item.type
                  ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                  : 'border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/30 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">{item.label}</span>
                <span className="text-[10px] text-gray-400">{item.desc}</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  config.scheduleType === item.type
                    ? 'border-amber-500 bg-amber-500'
                    : 'border-gray-400'
                }`}
              >
                {config.scheduleType === item.type && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
