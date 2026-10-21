import React from 'react';
import { Search, Folder, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { TaskRow } from '../tasks/TaskRow';

interface SearchResultsProps {
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ focusedTaskId, setFocusedTaskId }) => {
  const { searchQuery, tasks, lists } = useTasks();

  const query = searchQuery.toLowerCase().trim();

  const matchingTasks = tasks.filter(t => {
    const titleMatch = t.title.toLowerCase().includes(query);
    const detailsMatch = t.details?.toLowerCase().includes(query);
    const subtaskMatch = t.subtasks.some(s => s.title.toLowerCase().includes(query));
    return titleMatch || detailsMatch || subtaskMatch;
  });

  const listGroups = lists
    .map(list => ({
      list,
      tasks: matchingTasks.filter(t => t.listId === list.id),
    }))
    .filter(g => g.tasks.length > 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-3 sm:px-4 py-3 select-none">
      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
        <Search className="w-4 h-4 text-slate-400" />
        <span>Search results for "{searchQuery}" ({matchingTasks.length})</span>
      </div>

      {matchingTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
            No matching tasks
          </h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Try searching for a different keyword or check spelling.
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
