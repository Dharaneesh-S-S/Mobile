import React from 'react';
import { useTasks } from '../../context/TasksContext';
import { ListColumn } from './ListColumn';
import { StarredView } from '../starred/StarredView';

interface TasksBoardProps {
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;
}

export const TasksBoard: React.FC<TasksBoardProps> = ({
  focusedTaskId,
  setFocusedTaskId,
}) => {
  const { lists, tasks, visibleListIds, activeNavTab } = useTasks();

  // If "Starred" tab is selected in sidebar, display Starred view
  if (activeNavTab === 'starred') {
    return (
      <div className="flex-1 h-full overflow-y-auto bg-[#131314] dark:bg-[#131314] p-4">
        <StarredView focusedTaskId={focusedTaskId} setFocusedTaskId={setFocusedTaskId} />
      </div>
    );
  }

  // Filter lists to only those checked in the sidebar
  const visibleLists = lists.filter(l => visibleListIds.has(l.id));

  return (
    <div className="flex-1 h-full overflow-x-auto overflow-y-hidden bg-[#131314] dark:bg-[#131314] p-4 flex flex-row items-start gap-4 scrollbar-thin select-none">
      {visibleLists.map(list => (
        <ListColumn
          key={list.id}
          list={list}
          tasks={tasks}
          focusedTaskId={focusedTaskId}
          setFocusedTaskId={setFocusedTaskId}
        />
      ))}

      {visibleLists.length === 0 && (
        <div className="flex-1 h-full flex items-center justify-center text-[#8e918f] text-sm">
          No lists selected. Check lists in the sidebar to display them.
        </div>
      )}
    </div>
  );
};
