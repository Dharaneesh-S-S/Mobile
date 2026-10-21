import React from 'react';
import { RotateCcw, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  text: string;
  undoAction?: () => void;
  undoLabel?: string;
  durationMs?: number;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm px-4 py-3 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md text-white flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2.5 min-w-0">
        {toast.type === 'error' ? (
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
        ) : toast.type === 'warning' ? (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-blue-400 shrink-0" />
        ) : (
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
          {toast.text}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {toast.undoAction && (
          <button
            onClick={() => {
              toast.undoAction!();
              onClose();
            }}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600/30 text-blue-400 hover:bg-blue-600/50 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{toast.undoLabel || 'Undo'}</span>
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
