import React, { useRef, useState, useEffect, useCallback } from 'react'
import { getStroke } from 'perfect-freehand'
import {
  Pen,
  Highlighter,
  Eraser,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Star,
  MessageSquare,
  Layers,
  Palette,
  Undo2,
  Redo2,
  Download,
  Check,
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  FileText,
  Type,
  Move,
} from 'lucide-react'
import { DrawingData, DrawingLayer, DrawingStroke } from '../../types'

interface DrawingCanvasProps {
  initialData?: DrawingData
  onSave: (data: DrawingData, previewDataUrl: string) => void
  onClose: () => void
  title?: string
}

type ToolType = 'pen' | 'marker' | 'highlighter' | 'pencil' | 'eraser' | 'line' | 'arrow' | 'rect' | 'ellipse' | 'star' | 'speech'

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  initialData,
  onSave,
  onClose,
  title = 'Drawing Canvas',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Canvas layers state
  const [layers, setLayers] = useState<DrawingLayer[]>(() => {
    if (initialData?.layers && initialData.layers.length > 0) {
      return initialData.layers
    }
    return [
      { id: 'layer_1', name: 'Layer 1 (Drawing)', visible: true, locked: false, opacity: 1, strokes: [] },
      { id: 'layer_2', name: 'Layer 2 (Color Fill)', visible: true, locked: false, opacity: 1, strokes: [] },
      { id: 'layer_3', name: 'Layer 3 (Highlights)', visible: true, locked: false, opacity: 1, strokes: [] },
    ]
  })

  const [activeLayerId, setActiveLayerId] = useState<string>('layer_1')
  const [background, setBackground] = useState<'blank' | 'grid' | 'dotted' | 'ruled'>(
    initialData?.background || 'blank'
  )
  const [bgColor, setBgColor] = useState<string>(initialData?.bgColor || '#0f172a')

  // Tool settings
  const [tool, setTool] = useState<ToolType>('pen')
  const [color, setColor] = useState<string>('#38bdf8')
  const [size, setSize] = useState<number>(6)
  const [opacity, setOpacity] = useState<number>(1)
  const [smoothing, setSmoothing] = useState<number>(0.5)

  // Undo / Redo history
  const [history, setHistory] = useState<DrawingLayer[][]>([])
  const [redoStack, setRedoStack] = useState<DrawingLayer[][]>([])

  // Drawing state
  const isDrawing = useRef(false)
  const currentPoints = useRef<number[][]>([])
  const shapeStart = useRef<{ x: number; y: number } | null>(null)
  const [zoom, setZoom] = useState<number>(1)
  const [showLayersPanel, setShowLayersPanel] = useState<boolean>(false)

  // Color Swatches
  const swatches = [
    '#ffffff', '#38bdf8', '#818cf8', '#c084fc',
    '#f472b6', '#f87171', '#fb923c', '#facc15',
    '#34d399', '#10b981', '#94a3b8', '#000000',
  ]

  // Render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // Render Pattern
    if (background === 'grid') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)'
      ctx.lineWidth = 1
      const step = 25
      for (let x = 0; x <= width; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y <= height; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    } else if (background === 'dotted') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      const step = 20
      for (let x = step; x < width; x += step) {
        for (let y = step; y < height; y += step) {
          ctx.beginPath()
          ctx.arc(x, y, 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    } else if (background === 'ruled') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      const step = 28
      for (let y = step; y < height; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    // Render Strokes Layer by Layer
    layers.forEach((layer) => {
      if (!layer.visible) return
      ctx.save()
      ctx.globalAlpha = layer.opacity

      layer.strokes.forEach((stroke) => {
        ctx.save()
        ctx.globalAlpha = stroke.opacity
        ctx.fillStyle = stroke.color
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.size
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        if (stroke.tool === 'highlighter') {
          ctx.globalCompositeOperation = 'source-over'
        } else if (stroke.tool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out'
        }

        // Geometric shapes
        if (stroke.shapeType && stroke.startPoint && stroke.endPoint) {
          const [x1, y1] = stroke.startPoint
          const [x2, y2] = stroke.endPoint
          const minX = Math.min(x1, x2)
          const minY = Math.min(y1, y2)
          const w = Math.abs(x2 - x1)
          const h = Math.abs(y2 - y1)

          ctx.beginPath()
          if (stroke.shapeType === 'line') {
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          } else if (stroke.shapeType === 'arrow') {
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
            const angle = Math.atan2(y2 - y1, x2 - x1)
            const headLen = stroke.size * 3.5
            ctx.beginPath()
            ctx.moveTo(x2, y2)
            ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6))
            ctx.moveTo(x2, y2)
            ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6))
            ctx.stroke()
          } else if (stroke.shapeType === 'rect') {
            ctx.strokeRect(minX, minY, w, h)
          } else if (stroke.shapeType === 'ellipse') {
            ctx.beginPath()
            ctx.ellipse(minX + w / 2, minY + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
            ctx.stroke()
          } else if (stroke.shapeType === 'star') {
            const cx = minX + w / 2
            const cy = minY + h / 2
            const r = Math.min(w, h) / 2
            ctx.beginPath()
            for (let i = 0; i < 5; i++) {
              ctx.lineTo(
                cx + r * Math.cos(((18 + i * 72) * Math.PI) / 180),
                cy - r * Math.sin(((18 + i * 72) * Math.PI) / 180)
              )
              ctx.lineTo(
                cx + (r / 2) * Math.cos(((54 + i * 72) * Math.PI) / 180),
                cy - (r / 2) * Math.sin(((54 + i * 72) * Math.PI) / 180)
              )
            }
            ctx.closePath()
            ctx.stroke()
          }
        } else if (stroke.points && stroke.points.length > 0) {
          // Freehand stroke with perfect-freehand
          const outlinePoints = getStroke(stroke.points, {
            size: stroke.size,
            thinning: stroke.tool === 'highlighter' ? 0 : 0.5,
            smoothing: smoothing,
            streamline: 0.5,
          })

          if (outlinePoints.length > 0) {
            ctx.beginPath()
            ctx.moveTo(outlinePoints[0][0], outlinePoints[0][1])
            for (let i = 1; i < outlinePoints.length; i++) {
              ctx.lineTo(outlinePoints[i][0], outlinePoints[i][1])
            }
            ctx.closePath()
            ctx.fill()
          }
        }
        ctx.restore()
      })
      ctx.restore()
    })
  }, [layers, background, bgColor, smoothing])

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 1200
    canvas.height = 800
    renderCanvas()
  }, [renderCanvas])

  useEffect(() => {
    renderCanvas()
  }, [layers, background, bgColor, renderCanvas])

  // Get pointer coordinates relative to canvas
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return [0, 0, 0.5]
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5
    return [x, y, pressure]
  }

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const activeLayer = layers.find((l) => l.id === activeLayerId)
    if (!activeLayer || activeLayer.locked || !activeLayer.visible) return

    // Save history for Undo
    setHistory((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(layers))])
    setRedoStack([])

    isDrawing.current = true
    const [x, y, pressure] = getCoordinates(e)
    currentPoints.current = [[x, y, pressure]]
    shapeStart.current = { x, y }
  }

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return
    const [x, y, pressure] = getCoordinates(e)
    currentPoints.current.push([x, y, pressure])

    // Live preview
    renderCanvas()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = size

    if (['line', 'arrow', 'rect', 'ellipse', 'star'].includes(tool) && shapeStart.current) {
      const x1 = shapeStart.current.x
      const y1 = shapeStart.current.y
      ctx.strokeRect(Math.min(x1, x), Math.min(y1, y), Math.abs(x - x1), Math.abs(y - y1))
    } else {
      const outlinePoints = getStroke(currentPoints.current, {
        size,
        thinning: tool === 'highlighter' ? 0 : 0.5,
        smoothing,
      })
      if (outlinePoints.length > 0) {
        ctx.beginPath()
        ctx.moveTo(outlinePoints[0][0], outlinePoints[0][1])
        for (let i = 1; i < outlinePoints.length; i++) {
          ctx.lineTo(outlinePoints[i][0], outlinePoints[i][1])
        }
        ctx.closePath()
        ctx.fill()
      }
    }
    ctx.restore()
  }

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return
    isDrawing.current = false

    const [endX, endY] = getCoordinates(e)
    const isShape = ['line', 'arrow', 'rect', 'ellipse', 'star'].includes(tool)

    const newStroke: DrawingStroke = {
      id: 'stroke_' + Date.now() + Math.random(),
      points: currentPoints.current,
      color: tool === 'highlighter' ? `${color}88` : color,
      size: tool === 'highlighter' ? size * 2.5 : size,
      opacity: tool === 'highlighter' ? 0.4 : opacity,
      tool: tool as any,
      shapeType: isShape ? (tool as any) : undefined,
      startPoint: shapeStart.current ? [shapeStart.current.x, shapeStart.current.y] : undefined,
      endPoint: isShape ? [endX, endY] : undefined,
    }

    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id === activeLayerId) {
          return { ...layer, strokes: [...layer.strokes, newStroke] }
        }
        return layer
      })
    )
    currentPoints.current = []
    shapeStart.current = null
  }

  // Undo / Redo
  const handleUndo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setRedoStack((r) => [JSON.parse(JSON.stringify(layers)), ...r])
    setLayers(prev)
    setHistory((h) => h.slice(0, -1))
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[0]
    setHistory((h) => [...h, JSON.parse(JSON.stringify(layers))])
    setLayers(next)
    setRedoStack((r) => r.slice(1))
  }

  // Clear Canvas
  const handleClear = () => {
    if (window.confirm('Clear all drawings on the active layer?')) {
      setHistory((prev) => [...prev, JSON.parse(JSON.stringify(layers))])
      setLayers((prev) =>
        prev.map((l) => (l.id === activeLayerId ? { ...l, strokes: [] } : l))
      )
    }
  }

  // Save to Note
  const handleSaveToNote = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const drawingData: DrawingData = {
      layers,
      background,
      bgColor,
      width: canvas.width,
      height: canvas.height,
    }
    onSave(drawingData, dataUrl)
  }

  // Download image
  const handleDownload = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current
    if (!canvas) return
    const url = canvas.toDataURL(`image/${format}`)
    const a = document.createElement('a')
    a.href = url
    a.download = `drawing_${Date.now()}.${format}`
    a.click()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col text-white select-none animate-fade-in">
      {/* Top Studio Bar */}
      <header className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Discard and close"
          >
            <X size={20} />
          </button>
          <div>
            <h2 className="text-sm font-bold font-display tracking-tight text-white">{title}</h2>
            <p className="text-[10px] text-slate-400">Pressure-sensitive vector canvas</p>
          </div>
        </div>

        {/* Center Canvas Background Toggles */}
        <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {(['blank', 'grid', 'dotted', 'ruled'] as const).map((bg) => (
            <button
              key={bg}
              onClick={() => setBackground(bg)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                background === bg ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo2 size={18} />
          </button>
          <button
            onClick={() => handleDownload('png')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Download PNG"
          >
            <Download size={18} />
          </button>
          <button
            onClick={handleSaveToNote}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all active:scale-95"
          >
            <Check size={16} strokeWidth={2.6} />
            <span>Save to Note</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative" ref={containerRef}>
        {/* Left Floating Tools Toolbar */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 p-2 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
          {[
            { id: 'pen' as const, label: 'Pen', icon: Pen },
            { id: 'highlighter' as const, label: 'Highlighter', icon: Highlighter },
            { id: 'eraser' as const, label: 'Eraser', icon: Eraser },
            { id: 'line' as const, label: 'Line', icon: Minus },
            { id: 'arrow' as const, label: 'Arrow', icon: ArrowRight },
            { id: 'rect' as const, label: 'Rectangle', icon: Square },
            { id: 'ellipse' as const, label: 'Circle', icon: Circle },
            { id: 'star' as const, label: 'Star', icon: Star },
          ].map((t) => {
            const Icon = t.icon
            const isActive = tool === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`p-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title={t.label}
              >
                <Icon size={18} />
              </button>
            )
          })}

          <div className="my-1 border-t border-white/10" />

          {/* Layers Toggle */}
          <button
            onClick={() => setShowLayersPanel(!showLayersPanel)}
            className={`p-2.5 rounded-xl transition-all ${
              showLayersPanel ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Layers Manager"
          >
            <Layers size={18} />
          </button>

          {/* Clear Layer */}
          <button
            onClick={handleClear}
            className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-all"
            title="Clear active layer"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Center Canvas Area with Pan/Zoom */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="rounded-2xl shadow-2xl border border-white/10 cursor-crosshair touch-none transition-shadow"
            style={{
              maxWidth: '92vw',
              maxHeight: '78vh',
              objectFit: 'contain',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          />
        </div>

        {/* Right Layers Panel (Collapsible) */}
        {showLayersPanel && (
          <div className="w-64 border-l border-white/10 bg-slate-900/95 backdrop-blur-xl p-4 flex flex-col gap-3 shrink-0 animate-fade-in z-20">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Layers</span>
              <button
                onClick={() => setShowLayersPanel(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
              {layers.map((layer) => {
                const isActive = layer.id === activeLayerId
                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                        : 'border-white/10 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs truncate">{layer.name}</span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() =>
                          setLayers((prev) =>
                            prev.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l))
                          )
                        }
                        className="p-1 hover:text-white text-slate-400"
                        title={layer.visible ? 'Hide layer' : 'Show layer'}
                      >
                        {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() =>
                          setLayers((prev) =>
                            prev.map((l) => (l.id === layer.id ? { ...l, locked: !l.locked } : l))
                          )
                        }
                        className="p-1 hover:text-white text-slate-400"
                        title={layer.locked ? 'Unlock' : 'Lock'}
                      >
                        {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Brush & Color Controls Bar */}
      <footer className="h-16 px-6 border-t border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md shrink-0 gap-4 overflow-x-auto no-scrollbar">
        {/* Colors Swatches */}
        <div className="flex items-center gap-1.5 shrink-0">
          {swatches.map((swatch) => (
            <button
              key={swatch}
              onClick={() => setColor(swatch)}
              className={`w-7 h-7 rounded-full border transition-all ${
                color === swatch ? 'scale-125 border-white ring-2 ring-amber-500 shadow-md' : 'border-white/20 hover:scale-110'
              }`}
              style={{ backgroundColor: swatch }}
              title={swatch}
            />
          ))}
          {/* Custom color input */}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-0"
            title="Custom Color"
          />
        </div>

        {/* Brush Size Slider */}
        <div className="flex items-center gap-3 shrink-0 min-w-[160px]">
          <span className="text-xs text-slate-400 font-semibold">Size:</span>
          <input
            type="range"
            min="2"
            max="40"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-28 accent-amber-500 cursor-pointer"
          />
          <div
            className="rounded-full bg-amber-500 shrink-0"
            style={{ width: Math.min(24, Math.max(6, size)), height: Math.min(24, Math.max(6, size)) }}
          />
        </div>

        {/* Opacity Slider */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-400 font-semibold">Opacity:</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-24 accent-amber-500 cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-300">{Math.round(opacity * 100)}%</span>
        </div>
      </footer>
    </div>
  )
}
