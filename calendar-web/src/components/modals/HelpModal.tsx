import React from 'react';
import { X, Keyboard, HelpCircle, BookOpen, Sparkles } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';

export const HelpModal: React.FC = () => {
  const { isHelpOpen, closeHelp, settings, updateSettings } = useCalendar();

  if (!isHelpOpen) return null;

  const shortcuts = [
    { key: 'c', label: 'Create event or task' },
    { key: '/', label: 'Search calendar' },
    { key: 't', label: 'Jump to today' },
    { key: 'j or n', label: 'Next date range' },
    { key: 'k or p', label: 'Previous date range' },
    { key: 'd', label: 'Day view' },
    { key: 'w', label: 'Week view' },
    { key: 'm', label: 'Month view' },
    { key: 'y', label: 'Year view' },
    { key: 'a', label: 'Schedule (Agenda) view' },
    { key: 'x', label: '4-day view' },
    { key: 'e', label: 'Edit selected event' },
    { key: 'Delete', label: 'Delete selected event' },
    { key: 'Esc', label: 'Close popover / modal' },
    { key: '?', label: 'Open shortcuts help' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 dark:bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
                Keyboard Shortcuts & Help
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Navigate Chronos Calendar at the speed of thought
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeHelp}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 mb-4 text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Enable keyboard shortcuts
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableShortcuts}
              onChange={e => updateSettings({ enableShortcuts: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-gray-50/70 dark:bg-gray-750 text-xs text-gray-700 dark:text-gray-300"
            >
              <span>{sc.label}</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 font-mono text-[11px] font-bold text-gray-600 dark:text-gray-300 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Chronos Tips */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Chronos Pro Tip: Drag bottom edge of any event to resize!
          </span>
          <button
            type="button"
            onClick={closeHelp}
            className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
