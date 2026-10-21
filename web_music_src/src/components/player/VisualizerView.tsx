import React, { useRef, useEffect, useState } from 'react'
import { Maximize2, Minimize2, Radio, Activity, Circle, Sparkles } from 'lucide-react'
import { audioEngine } from '../../audio/AudioEngine'
import { VisualizerStyle } from '../../types/music'

export const VisualizerView: React.FC<{
  isOpen: boolean
  onClose: () => void
  accentColor?: string
}> = ({ isOpen, onClose, accentColor = '#d946ef' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [style, setStyle] = useState<VisualizerStyle>('bars')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 360
      canvas.height = canvas.parentElement?.clientHeight || 240
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const bufferLength = 128
    const freqData = new Uint8Array(bufferLength)
    const timeData = new Uint8Array(bufferLength)

    // Particle cache for particle mode
    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 3 + 1.5,
      baseRadius: Math.random() * 3 + 1.5,
    }))

    const render = () => {
      animId = requestAnimationFrame(render)

      audioEngine.getFrequencyData(freqData)
      audioEngine.getTimeDomainData(timeData)

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // 1. Neon Frequency Bars
      if (style === 'bars') {
        const barWidth = (w / bufferLength) * 2.2
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const val = freqData[i]
          const barHeight = (val / 255) * h * 0.95

          const grad = ctx.createLinearGradient(0, h, 0, h - barHeight)
          grad.addColorStop(0, accentColor)
          grad.addColorStop(0.7, '#8b5cf6')
          grad.addColorStop(1, '#38bdf8')

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.roundRect(x, h - barHeight, barWidth - 1.5, barHeight, [4, 4, 0, 0])
          ctx.fill()

          x += barWidth
        }
      }
      // 2. Mirrored Waveform Oscilloscope
      else if (style === 'wave') {
        ctx.lineWidth = 3
        ctx.strokeStyle = accentColor
        ctx.shadowColor = accentColor
        ctx.shadowBlur = 12
        ctx.beginPath()

        const sliceWidth = w / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0
          const y = (v * h) / 2

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          x += sliceWidth
        }

        ctx.lineTo(w, h / 2)
        ctx.stroke()
        ctx.shadowBlur = 0
      }
      // 3. Circular Radial Spectrum
      else if (style === 'circle') {
        const cx = w / 2
        const cy = h / 2
        const baseRadius = Math.min(w, h) * 0.22

        ctx.save()
        ctx.translate(cx, cy)

        const barsCount = 64
        const angleStep = (Math.PI * 2) / barsCount

        for (let i = 0; i < barsCount; i++) {
          const val = freqData[i % bufferLength]
          const barLen = (val / 255) * (Math.min(w, h) * 0.26)
          const angle = i * angleStep

          const x1 = Math.cos(angle) * baseRadius
          const y1 = Math.sin(angle) * baseRadius
          const x2 = Math.cos(angle) * (baseRadius + barLen)
          const y2 = Math.sin(angle) * (baseRadius + barLen)

          ctx.strokeStyle = i % 2 === 0 ? accentColor : '#8b5cf6'
          ctx.lineWidth = 3.5
          ctx.lineCap = 'round'

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }

        // Inner glowing core
        ctx.beginPath()
        ctx.arc(0, 0, baseRadius - 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.restore()
      }
      // 4. Floating Audio Particles
      else if (style === 'particles') {
        // Average energy in low frequencies
        let bassSum = 0
        for (let i = 0; i < 16; i++) bassSum += freqData[i]
        const bassAvg = bassSum / 16 / 255

        particles.forEach((p, idx) => {
          p.x += p.vx * (1 + bassAvg * 2)
          p.y += p.vy * (1 + bassAvg * 2)

          if (p.x < 0) p.x = w
          if (p.x > w) p.x = 0
          if (p.y < 0) p.y = h
          if (p.y > h) p.y = 0

          const sampleVal = freqData[idx % bufferLength] / 255
          p.radius = p.baseRadius * (1 + sampleVal * 3)

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = idx % 2 === 0 ? accentColor : '#38bdf8'
          ctx.shadowColor = accentColor
          ctx.shadowBlur = 10
          ctx.fill()
        })
        ctx.shadowBlur = 0
      }
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isOpen, style, accentColor])

  if (!isOpen) return null

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl p-4 bg-slate-950/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-64'
      }`}
    >
      {/* Visualizer Header: Style selector & Fullscreen toggle */}
      <div className="flex items-center justify-between z-10 select-none pb-2">
        <div className="flex items-center gap-1 bg-black/40 rounded-xl p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setStyle('bars')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              style === 'bars' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Frequency Bars"
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bars</span>
          </button>
          <button
            type="button"
            onClick={() => setStyle('wave')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              style === 'wave' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Oscilloscope Waveform"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Wave</span>
          </button>
          <button
            type="button"
            onClick={() => setStyle('circle')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              style === 'circle' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Radial Spectrum"
          >
            <Circle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Radial</span>
          </button>
          <button
            type="button"
            onClick={() => setStyle('particles')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              style === 'particles' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Audio Particles"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Particles</span>
          </button>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white border border-white/10 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Visualizer'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 w-full relative flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  )
}
