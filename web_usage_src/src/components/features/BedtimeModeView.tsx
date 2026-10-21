import React, { useState } from 'react'
import { BedtimeConfig, DailyUsage } from '../../types'
import { Moon, Sun, Sliders, BellOff, Eye, Sparkles } from 'lucide-react'
import { formatDuration } from '../../utils/formatters'

interface BedtimeModeViewProps {
  config: BedtimeConfig
  last7Days: DailyUsage[]
  onUpdateConfig: (cfg: BedtimeConfig) => void
  onToggleGlobalGrayscale: (active: boolean) => void
  isGrayscaleActive: boolean
}

export const BedtimeModeView: React.FC<BedtimeModeViewProps> = ({
  config,
  last7Days,
  onUpdateConfig,
  onToggleGlobalGrayscale,
  isGrayscaleActive,
}) => {
  const [bedtimeHour, setBedtimeHour] = useState(23)
  const [wakeHour, setWakeHour] = useState(7)

  const daysLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const toggleDay = (d: number) => {
    const list = config.days.includes(d)
      ? config.days.filter((x) => x !== d)
      : [...config.days, d].sort()
    onUpdateConfig({ ...config, days: list })
  }

  // 24-hour circular dial visualization
  const size = 180
  const center = size / 2
  const r = 70

  const getAngle = (h: number) => (h / 24) * 2 * Math.PI - Math.PI / 2
  const bedX = center + r * Math.cos(getAngle(bedtimeHour))
  const bedY = center + r * Math.sin(getAngle(bedtimeHour))
  const wakeX = center + r * Math.cos(getAngle(wakeHour))
  const wakeY = center + r * Math.sin(getAngle(wakeHour))

  return (
    <div className="flex flex-col px-4 pb-16 animate-fade-in">
      <div className="py-4">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
          Bedtime Mode
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Wind down with grayscale screen filter and silence overnight alerts.
        </p>
      </div>

      {/* 24-Hour Circular Dial */}
      <div className="p-5 rounded-[28px] glass-card shadow-sm flex flex-col items-center mb-4">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            <Moon size={14} strokeWidth={2.4} />
            <span>Bedtime: {bedtimeHour}:00</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Sun size={14} strokeWidth={2.4} />
            <span>Wake: {wakeHour}:00</span>
          </div>
        </div>

        <div className="relative w-[180px] h-[180px] my-2 select-none">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Dial Ring */}
            <circle
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="currentColor"
              className="text-slate-200/60 dark:text-slate-800/60"
              strokeWidth="12"
            />

            {/* Bedtime Hour Marker */}
            <circle cx={bedX} cy={bedY} r="14" fill="#6366f1" className="cursor-pointer shadow-md" />
            {/* Wake Hour Marker */}
            <circle cx={wakeX} cy={wakeY} r="14" fill="#f59e0b" className="cursor-pointer shadow-md" />
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xs font-bold text-slate-400">Target Sleep</span>
            <span className="text-xl font-display font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {(24 - bedtimeHour + wakeHour) % 24} Hours
            </span>
          </div>
        </div>

        {/* Quick Stepper for Bedtime and Wake */}
        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => setBedtimeHour((bedtimeHour - 1 + 24) % 24)}
              className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs active:scale-95 transition-transform"
            >
              -
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{bedtimeHour}:00</span>
            <button
              onClick={() => setBedtimeHour((bedtimeHour + 1) % 24)}
              className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs active:scale-95 transition-transform"
            >
              +
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => setWakeHour((wakeHour - 1 + 24) % 24)}
              className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs active:scale-95 transition-transform"
            >
              -
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{wakeHour}:00</span>
            <button
              onClick={() => setWakeHour((wakeHour + 1) % 24)}
              className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs active:scale-95 transition-transform"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Chips */}
      <div className="mb-4">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
          Schedule Days
        </label>
        <div className="flex justify-between gap-1">
          {daysLabels.map((lbl, idx) => {
            const isSelected = config.days.includes(idx)
            return (
              <button
                key={idx}
                onClick={() => toggleDay(idx)}
                className={`w-10 h-10 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {lbl}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grayscale Screen Filter Live Preview Switch */}
      <div className="p-5 rounded-[28px] glass-card shadow-sm flex items-center justify-between mb-4 border border-indigo-500/30">
        <div>
          <span className="text-xs font-bold flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
            <Sliders size={14} />
            <span>Grayscale Screen Filter</span>
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Removes all screen color to make apps boring before sleep.
          </p>
        </div>

        <button
          onClick={() => onToggleGlobalGrayscale(!isGrayscaleActive)}
          className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition-all active:scale-95 shadow-sm ${
            isGrayscaleActive
              ? 'bg-indigo-600 text-white font-extrabold shadow-indigo-500/25'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
          }`}
        >
          {isGrayscaleActive ? 'Grayscale ON' : 'Preview'}
        </button>
      </div>

      {/* Sleep Summary Chart (last 7 days after bedtime) */}
      <div className="p-5 rounded-[28px] glass-card shadow-sm mb-4">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
          Phone Use After Bedtime (Last 7 Days)
        </h4>
        <div className="relative w-full h-[70px] select-none">
          <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
            {last7Days.slice(-7).map((d, i) => {
              const x = i * 42 + 10
              const h = Math.min(70, (d.bedtimeUseMinutes / 60) * 70)
              const isOver = d.bedtimeUseMinutes > 15
              return (
                <rect
                  key={d.date}
                  x={x}
                  y={70 - h}
                  width="20"
                  height={h}
                  fill={isOver ? '#ef4444' : '#6366f1'}
                  rx="3"
                />
              )
            })}
          </svg>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-2">
          {last7Days.slice(-7).map((d) => {
            const [, , num] = d.date.split('-')
            return <span key={d.date}>{num}</span>
          })}
        </div>
      </div>
    </div>
  )
}
