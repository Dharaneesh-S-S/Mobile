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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#051211] text-[#F4FFFD] rounded-3xl p-5 sm:p-6 shadow-2xl border border-teal-500/20 animate-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-[#19E6C8] border border-teal-500/20 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F4FFFD]">
                Keyboard Shortcuts & Help
              </h3>
              <p className="text-xs text-teal-400/60">
                Navigate Chronos Calendar quickly
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeHelp}
            className="p-1.5 rounded-full text-teal-400/60 hover:text-[#19E6C8] hover:bg-teal-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#081a18] border border-teal-500/15 mb-4 text-xs">
          <span className="font-semibold text-teal-300">
            Enable keyboard shortcuts
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableShortcuts}
              onChange={e => updateSettings({ enableShortcuts: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-teal-950/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F4FFFD] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#19E6C8]" />
          </label>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-[#081a18] border border-teal-500/10 text-xs text-teal-300"
            >
              <span>{sc.label}</span>
              <kbd className="px-2 py-0.5 rounded-md bg-[#051211] border border-teal-500/20 font-mono text-[11px] font-bold text-[#19E6C8] shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Chronos Tips */}
        <div className="mt-4 pt-3 border-t border-teal-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-teal-400/70">
          <span className="flex items-center gap-1.5 text-[#19E6C8] font-medium">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" /> Chronos Pro Tip: Drag bottom edge of any event to resize!
          </span>
          <button
            type="button"
            onClick={closeHelp}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-[#19E6C8] text-[#030707] font-bold hover:bg-[#15caa0] shadow-[0_0_15px_rgba(25,230,200,0.3)] transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
