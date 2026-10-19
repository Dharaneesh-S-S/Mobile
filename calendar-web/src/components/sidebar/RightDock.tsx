import React from 'react';
import { CheckSquare, Users, Sparkles, HelpCircle } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';

export const RightDock: React.FC = () => {
  const { tasksSidebarOpen, toggleTasksSidebar, openHelp, seedDemoData } = useCalendar();

  return (
    <aside className="w-14 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col items-center py-3 gap-2 flex-shrink-0 z-20 select-none">
      {/* Tasks Toggle */}
      <button
        type="button"
        onClick={toggleTasksSidebar}
        className={`p-2.5 rounded-2xl transition-all ${
          tasksSidebarOpen
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800'
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
        className="p-2.5 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        title="Restore Demo Data"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {/* Shortcuts Help */}
      <button
        type="button"
        onClick={openHelp}
        className="p-2.5 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 transition-colors mt-auto"
        title="Keyboard Shortcuts (?)"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    </aside>
  );
};
