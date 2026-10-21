import React, { useEffect } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  type: 'info' | 'warning' | 'success' | 'danger'
  title: string
  message: string
  duration?: number
}

interface ToastAlertProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export const ToastAlert: React.FC<ToastAlertProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map((t) =>
      setTimeout(() => onDismiss(t.id), t.duration || 4500)
    )
    return () => timers.forEach(clearTimeout)
  }, [toasts, onDismiss])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[390px] px-4 pointer-events-none flex flex-col gap-2">
      {toasts.map((toast) => {
        const bg =
          toast.type === 'warning'
            ? 'bg-amber-500/95 text-neutral-950'
            : toast.type === 'danger'
            ? 'bg-rose-600 text-white'
            : toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-neutral-900/95 text-white'

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl backdrop-blur-md animate-slide-up ${bg}`}
            role="alert"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'warning' && <AlertCircle size={18} />}
              {toast.type === 'danger' && <AlertCircle size={18} />}
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </div>

            <div className="flex-1 text-xs">
              <div className="font-bold">{toast.title}</div>
              <div className="opacity-90 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss alert"
            >
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
