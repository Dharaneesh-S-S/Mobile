import React from 'react';
import { CheckSquare, Users, Sparkles, HelpCircle } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';

export const RightDock: React.FC = () => {
  const { tasksSidebarOpen, toggleTasksSidebar, openHelp, seedDemoData } = useCalendar();

  return (
    <aside data-right-dock className="w-14 border-l border-teal-500/15 bg-[#051211]/90 backdrop-blur-xl flex flex-col items-center py-3 gap-2 flex-shrink-0 z-20 select-none">
      {/* Tasks Toggle */}
      <button
        type="button"
        onClick={toggleTasksSidebar}
        className={`p-2.5 rounded-2xl transition-all ${
          tasksSidebarOpen
            ? 'bg-teal-500/20 text-[#19E6C8] border border-teal-400/40 shadow-[0_0_15px_rgba(25,230,200,0.3)] ring-1 ring-teal-400/20'
            : 'text-teal-400/60 hover:bg-teal-500/10 hover:text-white'
        }`}
        title="Tasks Panel"
      >
        <CheckSquare className="w-5 h-5" />
      </button>

      {/* Demo Data Reset */}
      <button
        type="button"
        onClick={() => {
          if (window.confirm('Reset calendar to sample demo events?')) {
            seedDemoData();
          }
        }}
        className="p-2.5 rounded-2xl text-teal-400/60 hover:bg-teal-500/10 hover:text-[#19E6C8] transition-colors"
        title="Restore Demo Data"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {/* Shortcuts Help */}
      <button
        type="button"
        onClick={openHelp}
        className="p-2.5 rounded-2xl text-teal-400/60 hover:bg-teal-500/10 hover:text-white transition-colors mt-auto"
        title="Keyboard Shortcuts (?)"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    </aside>
  );
};
