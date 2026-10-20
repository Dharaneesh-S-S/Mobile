import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export const RecurringConfirmDialog: React.FC = () => {
  const { recurringActionDialog, handleRecurringChoice, closeRecurringDialog } = useCalendar();

  if (!recurringActionDialog || !recurringActionDialog.isOpen) return null;

  const isDelete = recurringActionDialog.action === 'delete';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 dark:bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-150 select-none">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDelete ? 'bg-red-50 dark:bg-red-950/40 text-red-600' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
            }`}
          >
            {isDelete ? <AlertTriangle className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {isDelete ? 'Delete recurring event' : 'Edit recurring event'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              "{recurringActionDialog.event.title}" is part of a recurring series.
            </p>
          </div>
        </div>

        <div className="space-y-2 my-5 text-xs">
          <button
            type="button"
            onClick={() => handleRecurringChoice('this')}
            className="w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition-all"
          >
            <p className="font-semibold text-gray-800 dark:text-gray-200">This event</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Only modify or delete this specific instance on this date.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleRecurringChoice('following')}
            className="w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition-all"
          >
            <p className="font-semibold text-gray-800 dark:text-gray-200">This and following events</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Affects this instance and all future occurrences in the series.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleRecurringChoice('all')}
            className="w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition-all"
          >
            <p className="font-semibold text-gray-800 dark:text-gray-200">All events</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Affects every single instance in this recurring series.
            </p>
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={closeRecurringDialog}
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
