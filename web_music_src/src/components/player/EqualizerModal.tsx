import React, { useState, useEffect, useRef } from 'react'
import {
  X, SlidersHorizontal, Volume2, Save, Trash2,
  Plus, Check, Sparkles, Activity, ShieldCheck
} from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, DEFAULT_EQ_PRESETS } from '../../db'
import { audioEngine, EQ_FREQUENCIES } from '../../audio/AudioEngine'
import { useMusic } from '../../context/MusicContext'
import { EqPreset } from '../../types/music'

export const EqualizerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings } = useMusic()
  const dbPresets = useLiveQuery(() => db.eqPresets.toArray(), []) || DEFAULT_EQ_PRESETS

  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-normal')
  const [bandGains, setBandGains] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [customPresetName, setCustomPresetName] = useState('')
  const [isCreatingPreset, setIsCreatingPreset] = useState(false)

  const curveCanvasRef = useRef<HTMLCanvasElement>(null)

  // Sync band gains from engine or preset
  useEffect(() => {
    if (audioEngine.eqFilters.length === 10) {
      setBandGains(audioEngine.eqFilters.map(f => Math.round(f.gain.value)))
    }
  }, [isOpen])

  // Draw frequency response curve on Canvas
  useEffect(() => {
    if (!isOpen) return
    const canvas = curveCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Generate log frequencies from 20Hz to 20kHz
    const pointCount = 100
    const freqs = new Float32Array(pointCount)
    for (let i = 0; i < pointCount; i++) {
      freqs[i] = 20 * Math.pow(20000 / 20, i / (pointCount - 1))
    }

    const { mag } = audioEngine.getFrequencyResponse(freqs)

    // Draw baseline (0 dB)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, h / 2)
    ctx.lineTo(w, h / 2)
    ctx.stroke()

    // Draw curve with vibrant glow
    const accent = settings.accentColor || '#d946ef'
    ctx.strokeStyle = accent
    ctx.lineWidth = 2.5
    ctx.shadowColor = accent
    ctx.shadowBlur = 8
    ctx.beginPath()

    for (let i = 0; i < pointCount; i++) {
      const dbVal = 20 * Math.log10(mag[i] || 1)
      // Map -15dB .. +15dB to canvas height
      const y = h / 2 - (dbVal / 15) * (h / 2.3)
      const x = (i / (pointCount - 1)) * w

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
    ctx.shadowBlur = 0
  }, [isOpen, bandGains, settings.bassBoost, settings.soundEffectsEnabled, settings.accentColor])

  if (!isOpen) return null

  const handleBandChange = (index: number, val: number) => {
    const updated = [...bandGains]
    updated[index] = val
    setBandGains(updated)
    audioEngine.setEqBandGain(index, val)
    setSelectedPresetId('custom')
  }

  const handleSelectPreset = (preset: EqPreset) => {
    setSelectedPresetId(preset.id)
    setBandGains([...preset.bands])
    audioEngine.setAllEqBands(preset.bands)
  }

  const handleSaveCustomPreset = async () => {
    if (!customPresetName.trim()) return
    const newPreset: EqPreset = {
      id: `custom-${Date.now()}`,
      name: customPresetName.trim(),
      bands: [...bandGains],
      isBuiltIn: false,
    }
    await db.eqPresets.add(newPreset)
    setSelectedPresetId(newPreset.id)
    setIsCreatingPreset(false)
    setCustomPresetName('')
  }

  const handleDeletePreset = async (presetId: string) => {
    await db.eqPresets.delete(presetId)
    setSelectedPresetId('preset-normal')
    handleSelectPreset(DEFAULT_EQ_PRESETS[0])
  }

  const formatFreq = (freq: number) => {
    return freq >= 1000 ? `${freq / 1000}k` : `${freq}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shadow-md">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                10-Band Graphic Equalizer
              </h2>
              <p className="text-xs text-slate-400">
                Acoustic tuning & sound enhancement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Master Sound Effects Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold">
              <span className="text-slate-300">Effects</span>
              <input
                type="checkbox"
                checked={settings.soundEffectsEnabled}
                onChange={(e) => updateSettings({ soundEffectsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-fuchsia-600 focus:ring-0 cursor-pointer"
              />
            </label>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Frequency Response Curve */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1">
            <span>+12 dB</span>
            <span className="text-fuchsia-400 font-bold uppercase tracking-wider">Acoustic Curve</span>
            <span>-12 dB</span>
          </div>
          <canvas
            ref={curveCanvasRef}
            width={580}
            height={90}
            className="w-full h-20 block"
          />
        </div>

        {/* Presets Horizontal Carousel */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Presets</span>
            {!isCreatingPreset ? (
              <button
                type="button"
                onClick={() => setIsCreatingPreset(true)}
                className="text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Current</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={customPresetName}
                  onChange={(e) => setCustomPresetName(e.target.value)}
                  placeholder="Preset name..."
                  className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg text-xs text-white focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveCustomPreset}
                  className="p-1 text-emerald-400 hover:text-emerald-300"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingPreset(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {dbPresets.map((preset) => {
              const isSelected = selectedPresetId === preset.id
              return (
                <div
                  key={preset.id}
                  className={`flex items-center rounded-xl transition-all shrink-0 ${
                    isSelected
                      ? 'bg-fuchsia-600 text-white font-bold shadow-md shadow-fuchsia-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-3 py-1.5 text-xs font-semibold"
                  >
                    {preset.name}
                  </button>
                  {!preset.isBuiltIn && (
                    <button
                      type="button"
                      onClick={() => handleDeletePreset(preset.id)}
                      className="pr-2 pl-0.5 text-slate-400 hover:text-red-400"
                      title="Delete Preset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 10 Vertical Sliders */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
          <div className="grid grid-cols-10 gap-1 sm:gap-2 text-center">
            {EQ_FREQUENCIES.map((freq, idx) => {
              const val = bandGains[idx] || 0
              return (
                <div key={freq} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-fuchsia-400 h-4">
                    {val > 0 ? `+${val}` : `${val}`}
                  </span>
                  <div className="h-36 flex items-center justify-center">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={val}
                      onChange={(e) => handleBandChange(idx, Number(e.target.value))}
                      className="vertical-range accent-fuchsia-500"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 truncate w-full">
                    {formatFreq(freq)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Enhanced Sound Controls: Bass Boost, Virtualizer, Reverb, Loudness, Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Bass Boost */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>Bass Boost</span>
              <span className="text-fuchsia-400 font-mono">{settings.bassBoost}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.bassBoost}
              onChange={(e) => updateSettings({ bassBoost: Number(e.target.value) })}
              className="w-full accent-fuchsia-500 cursor-pointer"
            />
          </div>

          {/* Virtualizer / Stereo Widening */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>Stereo Virtualizer</span>
              <span className="text-fuchsia-400 font-mono">{settings.virtualizer}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.virtualizer}
              onChange={(e) => updateSettings({ virtualizer: Number(e.target.value) })}
              className="w-full accent-fuchsia-500 cursor-pointer"
            />
          </div>

          {/* Reverb Presets */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <span className="font-bold text-slate-200">Reverb Environment</span>
            <select
              value={settings.reverbPreset}
              onChange={(e) => updateSettings({ reverbPreset: e.target.value as any })}
              className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              <option value="none">None (Direct)</option>
              <option value="small">Small Room</option>
              <option value="hall">Concert Hall</option>
              <option value="stadium">Stadium Arena</option>
            </select>
          </div>

          {/* Loudness Normalization */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="block font-bold text-slate-200">Loudness Normalizer</span>
              <span className="text-[10px] text-slate-500">Smooth volume jumps</span>
            </div>
            <input
              type="checkbox"
              checked={settings.loudnessNorm}
              onChange={(e) => updateSettings({ loudnessNorm: e.target.checked })}
              className="w-4 h-4 rounded text-fuchsia-600 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-fuchsia-600/30 active:scale-95 transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  )
}
