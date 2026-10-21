import React from 'react';
import { HelpCircle, X, Keyboard } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';

export const ShortcutsHelpModal: React.FC = () => {
  const { showShortcutsHelp, setShowShortcutsHelp } = useTasks();

  if (!showShortcutsHelp) return null;

  const shortcuts = [
    { key: 'Enter', desc: 'Save task and rapidly create next task row' },
    { key: 'Esc', desc: 'Cancel current edit, close detail panel or modal' },
    { key: 'Tab', desc: 'Indent subtask while in focus' },
    { key: 'Shift + Tab', desc: 'Outdent subtask' },
    { key: 'Ctrl + ↑ / ↓', desc: 'Move focused task position up or down' },
    { key: 'Delete / Backspace', desc: 'Delete the currently focused task' },
    { key: '/', desc: 'Focus global search across all lists' },
    { key: '?', desc: 'Toggle keyboard shortcuts help' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-modal border border-slate-200 dark:border-slate-700 p-5 animate-pop-in">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={() => setShowShortcutsHelp(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/40 transition"
            >
              <span className="text-slate-600 dark:text-slate-300 font-medium">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[11px] shadow-xs border border-slate-200 dark:border-slate-600">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
          <button
            onClick={() => setShowShortcutsHelp(false)}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
