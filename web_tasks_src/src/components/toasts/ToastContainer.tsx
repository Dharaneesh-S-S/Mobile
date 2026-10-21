import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { ToastMessage } from '../../types/tasks';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTasks();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, toast.durationMs || 5000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div className="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-modal border border-slate-700/80 animate-slide-up text-xs">
      <span className="truncate flex-1 font-medium">{toast.message}</span>
      {toast.actionLabel && toast.onAction && (
        <button
          onClick={() => {
            toast.onAction?.();
            onRemove();
          }}
          className="text-blue-400 hover:text-blue-300 font-semibold px-2 py-0.5 rounded transition hover:bg-slate-800"
        >
          {toast.actionLabel}
        </button>
      )}
      <button
        onClick={onRemove}
        className="text-slate-400 hover:text-slate-200 p-0.5 rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
