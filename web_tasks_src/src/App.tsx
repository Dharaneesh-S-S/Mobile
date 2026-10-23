import React, { useState, useRef } from 'react';
import { useTasks } from './context/TasksContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/header/Header';
import { Sidebar } from './components/sidebar/Sidebar';
import { TasksBoard } from './components/board/TasksBoard';
import { TaskDetailPane } from './components/tasks/TaskDetailPane';
import { SearchResults } from './components/search/SearchResults';
import { ListDialogs } from './components/lists/ListDialogs';
import { SettingsModal } from './components/settings/SettingsModal';
import { ShortcutsHelpModal } from './components/help/ShortcutsHelpModal';
import { BulkActionBar } from './components/bulk/BulkActionBar';
import { ToastContainer } from './components/toasts/ToastContainer';

export const App: React.FC = () => {
  const {
    editingTaskId,
    setEditingTaskId,
    searchQuery,
  } = useTasks();

  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts hook
  useKeyboardShortcuts(focusedTaskId, setFocusedTaskId, searchInputRef);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#030707] text-[#F4FFFD] overflow-hidden select-none font-sans">
      {/* Top Header Bar */}
      <Header searchInputRef={searchInputRef} />

      {/* Main Body: Sidebar + Horizontal Board / Search View + Right Detail Drawer */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Board View or Search Results */}
        <main className="flex-1 h-full overflow-hidden flex flex-col bg-[#030707]">
          {searchQuery.trim() ? (
            <div className="flex-1 h-full overflow-y-auto p-4 bg-[#030707]">
              <SearchResults
                focusedTaskId={focusedTaskId}
                setFocusedTaskId={setFocusedTaskId}
              />
            </div>
          ) : (
            <TasksBoard
              focusedTaskId={focusedTaskId}
              setFocusedTaskId={setFocusedTaskId}
            />
          )}
        </main>

        {/* Task Detail Pane / Drawer on Right */}
        {editingTaskId && (
          <div className="w-[360px] flex-shrink-0 h-full border-l border-[#282a2c] bg-[#1e1f20] shadow-2xl z-30 animate-slide-up">
            <TaskDetailPane
              taskId={editingTaskId}
              onClose={() => setEditingTaskId(null)}
            />
          </div>
        )}
      </div>

      {/* Floating Action Bars & Modals */}
      <BulkActionBar />
      <ListDialogs />
      <SettingsModal />
      <ShortcutsHelpModal />
      <ToastContainer />
    </div>
  );
};

export default App;
