import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  Trash2,
  Folder,
  X,
  ChevronDown,
} from 'lucide-react';
import { useTasks } from '../../context/TasksContext';

export const BulkActionBar: React.FC = () => {
  const {
    selectedTaskIds,
    clearSelection,
    bulkStar,
    bulkComplete,
    bulkDelete,
    bulkMove,
    lists,
  } = useTasks();

  const [showMoveMenu, setShowMoveMenu] = useState(false);

  if (selectedTaskIds.size === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white dark:bg-slate-800 rounded-2xl shadow-modal px-4 py-2.5 flex items-center gap-3 border border-slate-700 animate-slide-up text-xs">
      <div className="flex items-center gap-2 pr-2 border-r border-slate-700 font-semibold">
        <span>{selectedTaskIds.size} selected</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Star */}
        <button
          onClick={() => bulkStar(true)}
          className="p-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition"
          title="Star all selected"
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        </button>

        {/* Complete */}
        <button
          onClick={() => bulkComplete(true)}
          className="p-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition"
          title="Mark complete"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Move */}
        <div className="relative">
          <button
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition"
            title="Move to list"
          >
            <Folder className="w-4 h-4 text-blue-400" />
            <span>Move</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showMoveMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-44 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-popover border border-slate-200 dark:border-slate-700 py-1 z-50">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => {
                    bulkMove(list.id);
                    setShowMoveMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-700 truncate"
                >
                  {list.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={bulkDelete}
          className="p-1.5 rounded-lg hover:bg-rose-900/50 text-rose-400 transition"
          title="Delete selected"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={clearSelection}
        className="p-1 rounded-lg text-slate-400 hover:text-white transition ml-1"
        title="Deselect all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
