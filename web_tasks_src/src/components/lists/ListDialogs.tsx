import React, { useState, useEffect } from 'react';
import { AlertTriangle, FolderPlus, Edit3, Trash2 } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';

export const ListDialogs: React.FC = () => {
  const {
    showCreateListModal,
    setShowCreateListModal,
    createList,
    listToRename,
    setListToRename,
    renameList,
    listToDelete,
    setListToDelete,
    deleteList,
    showDeleteCompletedModal,
    setShowDeleteCompletedModal,
    deleteCompletedTasks,
    activeListId,
    tasks,
  } = useTasks();

  const [newListName, setNewListName] = useState('');
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    if (listToRename) {
      setRenameValue(listToRename.name);
    }
  }, [listToRename]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createList(newListName.trim());
    setNewListName('');
    setShowCreateListModal(false);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listToRename || !renameValue.trim()) return;
    renameList(listToRename.id, renameValue.trim());
    setListToRename(null);
  };

  const handleDeleteConfirm = () => {
    if (!listToDelete) return;
    deleteList(listToDelete.id);
    setListToDelete(null);
  };

  const handleDeleteCompletedConfirm = () => {
    deleteCompletedTasks(activeListId);
    setShowDeleteCompletedModal(false);
  };

  const completedCount = tasks.filter(t => t.listId === activeListId && t.isCompleted).length;
  const listTasksCount = listToDelete ? tasks.filter(t => t.listId === listToDelete.id).length : 0;

  return (
    <>
      {/* Create List Modal */}
      {showCreateListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-modal border border-slate-200 dark:border-slate-700 p-5 animate-pop-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FolderPlus className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Create new list</h3>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <input
                type="text"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                placeholder="List title"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-4"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateListModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename List Modal */}
      {listToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-modal border border-slate-200 dark:border-slate-700 p-5 animate-pop-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Rename list</h3>
            </div>
            <form onSubmit={handleRenameSubmit}>
              <input
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                placeholder="List title"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-4"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setListToRename(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!renameValue.trim()}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete List Confirmation Dialog */}
      {listToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-modal border border-slate-200 dark:border-slate-700 p-5 animate-pop-in">
            <div className="flex items-center gap-3 mb-3 text-rose-600 dark:text-rose-400">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Delete "{listToDelete.name}"?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              This list will be deleted along with all its <strong className="text-rose-600 dark:text-rose-400">{listTasksCount} task(s)</strong>. You can undo this immediately from the toast.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setListToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
              >
                Delete list
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Completed Modal */}
      {showDeleteCompletedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-modal border border-slate-200 dark:border-slate-700 p-5 animate-pop-in">
            <div className="flex items-center gap-3 mb-3 text-rose-600 dark:text-rose-400">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Delete completed tasks?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              Permanently delete all <strong className="text-slate-800 dark:text-slate-100">{completedCount} completed task(s)</strong> in this list?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteCompletedModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCompletedConfirm}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
