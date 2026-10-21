import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Check, Trash2, CheckCircle2 } from 'lucide-react';
import { Task } from '../../types/tasks';
import { useTasks } from '../../context/TasksContext';

interface CompletedSectionProps {
  tasks: Task[];
  listId: string;
}

export const CompletedSection: React.FC<CompletedSectionProps> = ({ tasks, listId }) => {
  const { toggleTaskComplete, deleteTask, setShowDeleteCompletedModal, activeList, toggleListShowCompleted } = useTasks();
  
  // Use list's remembered showCompleted state or local state
  const isExpanded = activeList ? activeList.showCompleted : false;

  if (tasks.length === 0) return null;

  return (
    <div className="pt-3 pb-2 border-t border-slate-100 dark:border-slate-800/80 mt-2 select-none">
      {/* Collapsible Header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer">
        <button
          type="button"
          onClick={() => {
            if (activeList) {
              toggleListShowCompleted(activeList.id);
            }
          }}
          className="flex items-center gap-1.5 text-xs font-semibold"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span>Completed ({tasks.length})</span>
        </button>

        {isExpanded && (
          <button
            type="button"
            onClick={() => setShowDeleteCompletedModal(true)}
            className="text-[11px] text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
            title="Delete all completed tasks"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Completed Items */}
      {isExpanded && (
        <div className="space-y-1 mt-1 pl-1">
          {tasks.map(task => (
            <div
              key={task.id}
              className="group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition text-xs"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTaskComplete(task.id)}
                  className="w-4 h-4 rounded-full border border-blue-600 bg-blue-600 text-white flex items-center justify-center flex-shrink-0 animate-check-pop"
                  title="Click to uncomplete"
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </button>
                <span className="line-through text-slate-400 dark:text-slate-500 truncate flex-1">
                  {task.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="p-1 rounded text-slate-300 dark:text-slate-600 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
