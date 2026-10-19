import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCalendar();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'error':
              return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
              return <Info className="w-4 h-4 text-blue-500" />;
          }
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gray-900/95 dark:bg-gray-800/95 text-white shadow-xl backdrop-blur-md border border-gray-700/50 text-xs min-w-[280px] max-w-md animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {getIcon()}
              <span className="truncate font-medium">{toast.message}</span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {toast.actionLabel && toast.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction!();
                    removeToast(toast.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs transition-colors"
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 text-gray-400 hover:text-white rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
