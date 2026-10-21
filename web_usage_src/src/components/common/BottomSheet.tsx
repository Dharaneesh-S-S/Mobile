import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  maxHeight?: string
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = 'max-h-[85vh]',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-lg sm:rounded-[36px] rounded-t-[36px] bg-white/95 dark:bg-[#0D1322]/95 backdrop-blur-2xl shadow-[0_-15px_50px_rgba(0,0,0,0.45)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-slate-200/80 dark:border-white/10 flex flex-col ${maxHeight} overflow-hidden animate-slide-up sm:animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Pill Handle (Mobile Only) */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        {(title || subtitle) && (
          <div className="px-6 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] shrink-0">
            <div>
              {title && (
                <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white">{title}</h3>
              )}
              {subtitle && (
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1 no-scrollbar">{children}</div>
      </div>
    </div>
  )
}
