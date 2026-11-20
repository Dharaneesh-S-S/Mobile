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
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm px-4 py-3 rounded-2xl bg-[#061817]/95 border border-teal-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl text-white flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2.5 min-w-0">
        {toast.type === 'error' ? (
          <AlertTriangle className="w-5 h-5 text-[#FF6B6B] shrink-0" />
        ) : toast.type === 'warning' ? (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-[#19E6C8] shrink-0" />
        ) : (
          <CheckCircle className="w-5 h-5 text-[#19E6C8] shrink-0" />
        )}
        <span className="text-xs sm:text-sm font-medium text-[#F4FFFD] truncate">
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
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-500/20 text-[#19E6C8] hover:bg-teal-500/30 border border-teal-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{toast.undoLabel || 'Undo'}</span>
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#94B5B0] hover:text-white transition-colors cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
