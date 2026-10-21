import React from 'react'
import { Hourglass, Lock, AlertTriangle } from 'lucide-react'
import { AppInfo } from '../../types'

interface TimeLimitOverlayProps {
  app: AppInfo | null
  isOpen: boolean
  onCloseApp: () => void
  onIgnore15Min: () => void
  isParentalLocked?: boolean
}

export const TimeLimitOverlay: React.FC<TimeLimitOverlayProps> = ({
  app,
  isOpen,
  onCloseApp,
  onIgnore15Min,
  isParentalLocked = false,
}) => {
  if (!isOpen || !app) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6 animate-fade-in text-white"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="timelimit-title"
    >
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-4xl p-6 text-center shadow-2xl animate-slide-up flex flex-col items-center">
        {/* Animated Hourglass Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 animate-pulse">
          {isParentalLocked ? <Lock size={36} /> : <Hourglass size={36} />}
        </div>

        <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full mb-3">
          App Timer Expired
        </span>

        <h2 id="timelimit-title" className="text-2xl font-bold tracking-tight mb-2">
          Time's up for {app.name}
        </h2>

        <p className="text-sm text-neutral-400 mb-6 px-2">
          {isParentalLocked
            ? `Your parent or guardian has locked ${app.name} for the remainder of today.`
            : `You've reached your daily screen time limit for ${app.name}. Take a breather or focus on other tasks.`}
        </p>

        {isParentalLocked && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-rose-950/40 border border-rose-800/40 rounded-2xl text-xs text-rose-300 text-left">
            <AlertTriangle size={18} className="shrink-0" />
            <span>Parental control lock is active. Extension requires parent PIN.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onCloseApp}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-sm tracking-wide transition-transform active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Close App
          </button>

          {!isParentalLocked && (
            <button
              onClick={onIgnore15Min}
              className="w-full py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
            >
              Ignore for 15 minutes
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
