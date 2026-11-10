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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#051211]/95 text-[#F4FFFD] rounded-2xl shadow-[0_0_25px_rgba(25,230,200,0.2)] px-4 py-2.5 flex items-center gap-3 border border-teal-500/30 backdrop-blur-xl animate-slide-up text-xs">
      <div className="flex items-center gap-2 pr-2 border-r border-teal-500/20 font-semibold text-[#19E6C8]">
        <span>{selectedTaskIds.size} selected</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Star */}
        <button
          onClick={() => bulkStar(true)}
          className="p-1.5 rounded-lg hover:bg-teal-500/15 transition text-teal-400"
          title="Star all selected"
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        </button>

        {/* Complete */}
        <button
          onClick={() => bulkComplete(true)}
          className="p-1.5 rounded-lg hover:bg-teal-500/15 transition text-[#19E6C8]"
          title="Mark complete"
        >
          <CheckCircle2 className="w-4 h-4 text-[#19E6C8]" />
        </button>

        {/* Move */}
        <div className="relative">
          <button
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-teal-500/15 transition text-[#F4FFFD]"
            title="Move to list"
          >
            <Folder className="w-4 h-4 text-[#19E6C8]" />
            <span>Move</span>
            <ChevronDown className="w-3 h-3 text-teal-400/60" />
          </button>

          {showMoveMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-44 bg-[#051211] text-[#F4FFFD] rounded-xl shadow-2xl border border-teal-500/30 py-1 z-50">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => {
                    bulkMove(list.id);
                    setShowMoveMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-teal-500/15 text-[#94B5B0] hover:text-[#F4FFFD] truncate"
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
          className="p-1.5 rounded-lg hover:bg-rose-950/40 text-rose-400 transition"
          title="Delete selected"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={clearSelection}
        className="p-1 rounded-lg text-teal-400/60 hover:text-white transition ml-1"
        title="Deselect all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
