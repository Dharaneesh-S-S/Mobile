import React, { useState } from 'react';
import { Check, Plus, Trash2, Star } from 'lucide-react';
import { Subtask } from '../../types/tasks';
import { useTasks } from '../../context/TasksContext';

interface SubtaskListProps {
  parentTaskId: string;
  subtasks: Subtask[];
}

export const SubtaskList: React.FC<SubtaskListProps> = ({ parentTaskId, subtasks }) => {
  const { addSubtask, updateSubtask, deleteSubtask, toggleSubtaskComplete } = useTasks();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(parentTaskId, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAddingSubtask(false);
      setNewSubtaskTitle('');
    }
  };

  return (
    <div className="pl-6 pr-2 py-1 space-y-1.5 border-l-2 border-teal-500/20 ml-4 my-1">
      {subtasks.map(subtask => (
        <div
          key={subtask.id}
          className="group/sub flex items-center justify-between gap-2 py-1 px-2 rounded-lg hover:bg-teal-500/10 transition text-xs"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Checkbox */}
            <button
              type="button"
              onClick={() => toggleSubtaskComplete(parentTaskId, subtask.id)}
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition flex-shrink-0 ${
                subtask.isCompleted
                  ? 'border-[#19E6C8] bg-[#19E6C8] text-[#030707] animate-check-pop'
                  : 'border-teal-500/40 hover:border-[#19E6C8]'
              }`}
            >
              {subtask.isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </button>

            {/* Title */}
            <input
              type="text"
              value={subtask.title}
              onChange={e => updateSubtask(parentTaskId, { ...subtask, title: e.target.value })}
              className={`bg-transparent border-none outline-none flex-1 truncate text-xs text-[#F4FFFD] ${
                subtask.isCompleted ? 'line-through text-teal-400/50' : ''
              }`}
            />
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => updateSubtask(parentTaskId, { ...subtask, isStarred: !subtask.isStarred })}
              className="p-1 rounded text-teal-400/40 hover:text-amber-400 transition"
              title="Star subtask"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  subtask.isStarred ? 'text-amber-400 fill-amber-400' : 'text-teal-400/40'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => deleteSubtask(parentTaskId, subtask.id)}
              className="p-1 rounded text-teal-400/40 hover:text-rose-400 transition"
              title="Delete subtask"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}

      {/* Add Subtask Row */}
      {isAddingSubtask ? (
        <form onSubmit={handleAddSubmit} className="flex items-center gap-2 py-1 px-2">
          <div className="w-4 h-4 rounded-full border border-dashed border-teal-500/40 flex-shrink-0" />
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={e => setNewSubtaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add subtask..."
            className="bg-transparent border-none outline-none flex-1 text-xs text-[#F4FFFD] placeholder:text-teal-400/50"
            autoFocus
          />
          <button
            type="submit"
            disabled={!newSubtaskTitle.trim()}
            className="text-[11px] font-bold text-[#19E6C8] hover:underline disabled:opacity-50"
          >
            Save
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingSubtask(true)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold text-teal-400 hover:text-[#19E6C8] hover:bg-teal-500/10 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add subtasks</span>
        </button>
      )}
    </div>
  );
};
