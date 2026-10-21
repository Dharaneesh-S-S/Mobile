import React, { useState, useRef } from 'react';
import { useTasks } from './context/TasksContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/header/Header';
import { TaskList } from './components/tasks/TaskList';
import { TaskDetailPane } from './components/tasks/TaskDetailPane';
import { StarredView } from './components/starred/StarredView';
import { TaskCalendarView } from './components/calendar/TaskCalendarView';
import { SearchResults } from './components/search/SearchResults';
import { ListDialogs } from './components/lists/ListDialogs';
import { SettingsModal } from './components/settings/SettingsModal';
import { ShortcutsHelpModal } from './components/help/ShortcutsHelpModal';
import { BulkActionBar } from './components/bulk/BulkActionBar';
import { ToastContainer } from './components/toasts/ToastContainer';

export const App: React.FC = () => {
  const {
    activeListId,
    tasks,
    editingTaskId,
    setEditingTaskId,
    searchQuery,
    layoutMode,
  } = useTasks();

  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts hook
  useKeyboardShortcuts(focusedTaskId, setFocusedTaskId, searchInputRef);

  return (
    <div
      className={`h-screen w-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 transition-colors overflow-hidden select-none ${
        layoutMode === 'fullscreen' ? 'p-0' : 'sm:p-4'
      }`}
    >
      {/* Main Container */}
      <div
        className={`bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 border border-slate-200/80 dark:border-slate-800 ${
          layoutMode === 'fullscreen'
            ? 'w-full h-full rounded-none'
            : 'w-full h-full sm:max-w-[400px] sm:h-[94vh] sm:rounded-2xl'
        }`}
      >
        {/* Header */}
        <Header searchInputRef={searchInputRef} />

        {/* Body Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main List / View */}
          <main className="flex-1 h-full overflow-hidden flex flex-col">
            {searchQuery.trim() ? (
              <SearchResults
                focusedTaskId={focusedTaskId}
                setFocusedTaskId={setFocusedTaskId}
              />
            ) : activeListId === 'starred' ? (
              <StarredView
                focusedTaskId={focusedTaskId}
                setFocusedTaskId={setFocusedTaskId}
              />
            ) : activeListId === 'calendar' ? (
              <TaskCalendarView />
            ) : (
              <TaskList
                listId={activeListId}
                tasks={tasks}
                focusedTaskId={focusedTaskId}
                setFocusedTaskId={setFocusedTaskId}
              />
            )}
          </main>

          {/* Task Detail Pane:
              - In Fullscreen mode: side-by-side docked pane (width ~340px)
              - In Sidepanel/Mobile mode: full overlay sliding in with Back button */}
          {editingTaskId && (
            <div
              className={`${
                layoutMode === 'fullscreen'
                  ? 'w-[360px] border-l border-slate-200 dark:border-slate-800'
                  : 'absolute inset-0 z-30'
              }`}
            >
              <TaskDetailPane
                taskId={editingTaskId}
                onClose={() => setEditingTaskId(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating & Modal Components */}
      <BulkActionBar />
      <ListDialogs />
      <SettingsModal />
      <ShortcutsHelpModal />
      <ToastContainer />
    </div>
  );
};
export default App;
