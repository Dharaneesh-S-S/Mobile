import { useEffect } from 'react';
import { useTasks } from '../context/TasksContext';

export function useKeyboardShortcuts(
  focusedTaskId: string | null,
  setFocusedTaskId: (id: string | null) => void,
  searchInputRef: React.RefObject<HTMLInputElement | null>
) {
  const {
    editingTaskId,
    setEditingTaskId,
    isAddingTask,
    setIsAddingTask,
    createTask,
    deleteTask,
    moveTaskPosition,
    setShowShortcutsHelp,
    showShortcutsHelp,
    showSettingsModal,
    setShowSettingsModal,
    showCreateListModal,
    setShowCreateListModal,
  } = useTasks();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Escape key handles modals, editors, and quick add
      if (e.key === 'Escape') {
        if (showShortcutsHelp) {
          setShowShortcutsHelp(false);
          return;
        }
        if (showSettingsModal) {
          setShowSettingsModal(false);
          return;
        }
        if (showCreateListModal) {
          setShowCreateListModal(false);
          return;
        }
        if (editingTaskId) {
          setEditingTaskId(null);
          return;
        }
        if (isAddingTask) {
          setIsAddingTask(false);
          return;
        }
        if (isInput) {
          target.blur();
          return;
        }
        setFocusedTaskId(null);
        return;
      }

      // If typing inside an input/textarea, only allow specific combo keys
      if (isInput) {
        // Tab / Shift+Tab while in task row input could handle subtask indent/outdent
        return;
      }

      // Focus Search with "/"
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Shortcuts Help with "?"
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsHelp(true);
        return;
      }

      // Quick add new task with "a" or "Enter" when not typing
      if (e.key === 'a' || e.key === 'Enter') {
        e.preventDefault();
        setIsAddingTask(true);
        return;
      }

      // Focused task operations
      if (focusedTaskId) {
        // Ctrl/Cmd + Up / Down moves task
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
          e.preventDefault();
          moveTaskPosition(focusedTaskId, 'up');
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown') {
          e.preventDefault();
          moveTaskPosition(focusedTaskId, 'down');
          return;
        }

        // Delete focused task
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          deleteTask(focusedTaskId);
          setFocusedTaskId(null);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusedTaskId,
    setFocusedTaskId,
    searchInputRef,
    editingTaskId,
    setEditingTaskId,
    isAddingTask,
    setIsAddingTask,
    createTask,
    deleteTask,
    moveTaskPosition,
    showShortcutsHelp,
    setShowShortcutsHelp,
    showSettingsModal,
    setShowSettingsModal,
    showCreateListModal,
    setShowCreateListModal,
  ]);
}
