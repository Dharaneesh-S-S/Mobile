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
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Starred ({starredTasks.length})
          </h2>
        </div>
        <button
          onClick={handleAddStarred}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add starred</span>
        </button>
      </div>

      {starredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-3">
            <Star className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
            No starred tasks
          </h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Star important tasks to find them quickly across all your lists.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {listGroups.map(group => (
            <div key={group.list.id} className="space-y-1">
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                <Folder className="w-3.5 h-3.5" />
                <span>{group.list.name}</span>
                <span className="text-[11px] font-normal text-slate-400">({group.tasks.length})</span>
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
