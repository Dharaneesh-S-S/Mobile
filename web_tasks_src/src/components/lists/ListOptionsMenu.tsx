import React from 'react';
import {
  Check,
  ArrowUpDown,
  Edit2,
  Trash2,
  Printer,
  Eye,
  EyeOff,
  Calendar,
  Star,
  Type,
  ListOrdered,
} from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { SortOption } from '../../types/tasks';

interface ListOptionsMenuProps {
  onClose: () => void;
}

export const ListOptionsMenu: React.FC<ListOptionsMenuProps> = ({ onClose }) => {
  const {
    activeList,
    activeListId,
    setListSort,
    setListToRename,
    setListToDelete,
    setShowDeleteCompletedModal,
    toggleListShowCompleted,
    tasks,
  } = useTasks();

  if (!activeList && activeListId !== 'starred') return null;

  const currentSort: SortOption = activeList?.sortOrder || 'order';
  const showCompleted = activeList?.showCompleted ?? false;

  const completedCount = tasks.filter(t => t.listId === activeListId && t.isCompleted).length;

  const handleSortChange = (sort: SortOption) => {
    if (activeList) {
      setListSort(activeList.id, sort);
    }
    onClose();
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="absolute right-0 top-full mt-1.5 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-popover border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-pop-in text-sm text-slate-700 dark:text-slate-200">
      {/* Sort By Section */}
      <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <ArrowUpDown className="w-3.5 h-3.5" />
        <span>Sort by</span>
      </div>

      <div className="px-1 py-0.5 space-y-0.5">
        <button
          onClick={() => handleSortChange('order')}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-slate-400" />
            <span>My order</span>
          </div>
          {currentSort === 'order' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        </button>

        <button
          onClick={() => handleSortChange('date')}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Date</span>
          </div>
          {currentSort === 'date' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        </button>

        <button
          onClick={() => handleSortChange('starred')}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-slate-400" />
            <span>Starred recently</span>
          </div>
          {currentSort === 'starred' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        </button>

        <button
          onClick={() => handleSortChange('title')}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-slate-400" />
            <span>Title</span>
          </div>
          {currentSort === 'title' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        </button>
      </div>

      <div className="my-1.5 border-t border-slate-100 dark:border-slate-700/60" />

      {/* List Management Options */}
      {activeList && (
        <div className="px-1 py-0.5 space-y-0.5">
          <button
            onClick={() => {
              toggleListShowCompleted(activeList.id);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-left"
          >
            {showCompleted ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
            <span>{showCompleted ? 'Hide completed' : 'Show completed'}</span>
          </button>

          <button
            onClick={() => {
              setListToRename(activeList);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-left"
          >
            <Edit2 className="w-4 h-4 text-slate-400" />
            <span>Rename list</span>
          </button>

          {completedCount > 0 && (
            <button
              onClick={() => {
                setShowDeleteCompletedModal(true);
                onClose();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-left text-rose-600 dark:text-rose-400"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete all completed ({completedCount})</span>
            </button>
          )}

          {!activeList.isDefault && (
            <button
              onClick={() => {
                setListToDelete(activeList);
                onClose();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left text-rose-600 dark:text-rose-400"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete list</span>
            </button>
          )}
        </div>
      )}

      <div className="my-1.5 border-t border-slate-100 dark:border-slate-700/60" />

      {/* Print List */}
      <div className="px-1 py-0.5">
        <button
          onClick={handlePrint}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-left"
        >
          <Printer className="w-4 h-4 text-slate-400" />
          <span>Print list</span>
        </button>
      </div>
    </div>
  );
};
