import React, { useState } from 'react'
import { NoteAttachment } from '../../types'
import { X, ChevronLeft, ChevronRight, Download, Trash2, ZoomIn, ZoomOut } from 'lucide-react'

interface LightboxModalProps {
  attachments: NoteAttachment[]
  initialIndex: number
  onClose: () => void
  onDelete?: (id: string) => void
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  attachments,
  initialIndex,
  onClose,
  onDelete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)

  const current = attachments[currentIndex]
  if (!current) return null

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : attachments.length - 1))
    setScale(1)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev < attachments.length - 1 ? prev + 1 : 0))
    setScale(1)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    const a = document.createElement('a')
    a.href = current.url
    a.download = `auranotes-${current.type}-${Date.now()}.png`
    a.click()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Delete this image attachment?')) {
      onDelete?.(current.id)
      if (attachments.length <= 1) {
        onClose()
      } else {
        setCurrentIndex(prev => Math.max(0, prev - 1))
      }
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none animate-in fade-in"
    >
      {/* Top action bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full flex items-center justify-between text-white/80 px-4 py-2"
      >
        <div className="text-xs font-medium">
          {currentIndex + 1} of {attachments.length} {current.caption && `— ${current.caption}`}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScale(s => Math.min(s + 0.25, 3))}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setScale(s => Math.max(s - 0.25, 0.5))}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Download image"
          >
            <Download className="w-5 h-5" />
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="Delete attachment"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image View */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex-1 flex items-center justify-center relative w-full overflow-hidden"
      >
        {attachments.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={current.url}
          alt={current.caption || 'Attachment preview'}
          style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease-out' }}
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl pointer-events-auto"
        />

        {attachments.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Caption footer if present */}
      {current.caption && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="text-white/90 text-sm max-w-xl text-center py-2 px-4 bg-black/40 rounded-full backdrop-blur-sm"
        >
          {current.caption}
        </div>
      )}
    </div>
  )
}
