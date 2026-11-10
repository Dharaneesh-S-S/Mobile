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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#051211]/95 text-[#F4FFFD] rounded-2xl shadow-2xl border border-teal-500/25 p-5 animate-pop-in">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-teal-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-[#19E6C8] border border-teal-500/30 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#F4FFFD]">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={() => setShowShortcutsHelp(false)}
            className="p-1 rounded-lg text-teal-400/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-teal-500/10 transition"
            >
              <span className="text-[#94B5B0] font-medium">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-[#081a18] text-[#19E6C8] font-mono text-[11px] shadow-xs border border-teal-500/30">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-teal-500/20 flex justify-end">
          <button
            onClick={() => setShowShortcutsHelp(false)}
            className="px-4 py-1.5 rounded-full bg-[#19E6C8] text-[#030707] font-bold text-xs transition shadow-[0_0_15px_rgba(25,230,200,0.3)] hover:bg-[#2DD4BF]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
