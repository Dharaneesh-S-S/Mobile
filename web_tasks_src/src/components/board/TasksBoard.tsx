import React from 'react';
import { Plus } from 'lucide-react';
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
  const { lists, tasks, visibleListIds, activeNavTab, activeListId, setInlineAddingListId } = useTasks();

  // If "Starred" tab is selected in sidebar, display Starred view
  if (activeNavTab === 'starred') {
    return (
      <div className="flex-1 h-full overflow-y-auto bg-[#030707] p-4">
        <StarredView focusedTaskId={focusedTaskId} setFocusedTaskId={setFocusedTaskId} />
      </div>
    );
  }

  // Filter lists to only those checked in the sidebar
  const visibleLists = lists.filter(l => visibleListIds.has(l.id));

  return (
    <div className="flex-1 h-full overflow-x-auto overflow-y-hidden bg-[#030707] p-4 flex flex-row items-start gap-4 scrollbar-thin select-none relative">
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
        <div className="flex-1 h-full flex items-center justify-center text-teal-400/60 text-sm">
          No lists selected. Check lists in the sidebar to display them.
        </div>
      )}

      {/* Floating "+ New task" button at bottom right */}
      {visibleLists.length > 0 && (
        <button
          onClick={() => {
            const targetId = activeListId || visibleLists[0]?.id;
            if (targetId) {
              setInlineAddingListId(targetId);
              const col = document.getElementById(`list-column-${targetId}`);
              if (col) {
                col.scrollIntoView({ behavior: 'smooth', inline: 'center' });
              }
            }
          }}
          className="fixed bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#19E6C8] hover:bg-[#2DD4BF] text-[#030707] font-bold shadow-[0_0_20px_rgba(25,230,200,0.4)] text-xs transition active:scale-95 cursor-pointer"
          title="Add new task"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New task</span>
        </button>
      )}
    </div>
  );
};
