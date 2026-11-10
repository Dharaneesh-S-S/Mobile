import React from 'react';
import { Star, Plus, Folder } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { TaskRow } from '../tasks/TaskRow';

interface StarredViewProps {
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;
}

export const StarredView: React.FC<StarredViewProps> = ({ focusedTaskId, setFocusedTaskId }) => {
  const { tasks, lists, createTask, settings } = useTasks();

  const starredTasks = tasks.filter(t => t.isStarred && !t.isCompleted);

  // Group by listId
  const listGroups = lists
    .map(list => ({
      list,
      tasks: starredTasks.filter(t => t.listId === list.id),
    }))
    .filter(g => g.tasks.length > 0);

  const handleAddStarred = () => {
    const title = prompt('Enter task title:');
    if (title && title.trim()) {
      createTask(title.trim(), settings.defaultListId);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-3 sm:px-4 py-3 select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-teal-500/20">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h2 className="text-sm font-bold text-[#F4FFFD]">
            Starred ({starredTasks.length})
          </h2>
        </div>
        <button
          onClick={handleAddStarred}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-[#19E6C8] text-xs font-semibold transition border border-teal-500/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add starred</span>
        </button>
      </div>

      {starredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3">
            <Star className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-[#F4FFFD] mb-1">
            No starred tasks
          </h4>
          <p className="text-xs text-[#94B5B0] max-w-xs">
            Star important tasks to find them quickly across all your lists.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {listGroups.map(group => (
            <div key={group.list.id} className="space-y-2">
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-teal-400/70 tracking-wider uppercase">
                <Folder className="w-3.5 h-3.5 text-[#19E6C8]" />
                <span className="text-[#F4FFFD]">{group.list.name}</span>
                <span className="text-[11px] font-semibold text-teal-400/60">({group.tasks.length})</span>
              </div>

              {group.tasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  isFocused={focusedTaskId === task.id}
                  onFocus={() => setFocusedTaskId(task.id)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
