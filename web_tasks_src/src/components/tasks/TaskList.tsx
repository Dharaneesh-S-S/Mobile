import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, CheckCircle2, Inbox, Calendar, Star } from 'lucide-react';
import { Task, SortOption } from '../../types/tasks';
import { useTasks } from '../../context/TasksContext';
import { TaskRow } from './TaskRow';
import { CompletedSection } from './CompletedSection';

interface TaskListProps {
  listId: string;
  tasks: Task[];
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  listId,
  tasks,
  focusedTaskId,
  setFocusedTaskId,
}) => {
  const {
    activeList,
    createTask,
    reorderTasks,
    isAddingTask,
    setIsAddingTask,
  } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | null>(null);

  const quickInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingTask) {
      setTimeout(() => quickInputRef.current?.focus(), 40);
    }
  }, [isAddingTask]);

  // Split into active and completed tasks
  const { activeTasks, completedTasks } = useMemo(() => {
    const listTasks = tasks.filter(t => t.listId === listId);
    const active = listTasks.filter(t => !t.isCompleted);
    const completed = listTasks.filter(t => t.isCompleted);

    const sortOption: SortOption = activeList?.sortOrder || 'order';

    const sortedActive = [...active].sort((a, b) => {
      switch (sortOption) {
        case 'date': {
          if (!a.dueDate && !b.dueDate) return a.order - b.order;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          const cmp = a.dueDate.localeCompare(b.dueDate);
          if (cmp !== 0) return cmp;
          if (a.dueTime && b.dueTime) return a.dueTime.localeCompare(b.dueTime);
          return 0;
        }
        case 'starred': {
          if (a.isStarred && !b.isStarred) return -1;
          if (!a.isStarred && b.isStarred) return 1;
          return a.order - b.order;
        }
        case 'title': {
          return a.title.localeCompare(b.title);
        }
        case 'order':
        default:
          return a.order - b.order;
      }
    });

    return { activeTasks: sortedActive, completedTasks: completed };
  }, [tasks, listId, activeList?.sortOrder]);

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setIsAddingTask(false);
      return;
    }
    const created = createTask(newTaskTitle.trim(), listId);
    setNewTaskTitle('');
    // Rapid entry: keep input open for the next task
    setTimeout(() => quickInputRef.current?.focus(), 30);
  };

  const handleQuickAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id === draggedTaskId) return;

    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = targetRect.top + targetRect.height / 2;
    const pos = e.clientY < midY ? 'top' : 'bottom';

    setDragOverTaskId(id);
    setDropPosition(pos);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      setDropPosition(null);
      return;
    }

    reorderTasks(draggedTaskId, targetId);
    setDraggedTaskId(null);
    setDragOverTaskId(null);
    setDropPosition(null);
  };

  const isListEmpty = activeTasks.length === 0 && completedTasks.length === 0;
  const isAllCompleted = activeTasks.length === 0 && completedTasks.length > 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-3 sm:px-4 py-3 select-none">
      {/* "Add a task" button & inline entry row */}
      <div className="mb-2">
        {isAddingTask ? (
          <form
            onSubmit={handleQuickAddSubmit}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#081a18] shadow-lg border border-[#19E6C8] transition"
          >
            <div className="w-4 h-4 rounded-full border border-dashed border-[#19E6C8] flex-shrink-0" />
            <input
              ref={quickInputRef}
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={handleQuickAddKeyDown}
              placeholder="Title"
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#F4FFFD] placeholder:text-teal-400/50"
            />
            <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400 text-xs">
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="px-2.5 py-1 rounded-lg bg-[#19E6C8] text-[#030707] font-bold text-[11px] disabled:opacity-50 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }}
                className="px-2 py-1 rounded text-teal-400/60 hover:bg-teal-500/10 text-[11px]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingTask(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#19E6C8] hover:bg-teal-500/10 transition text-xs sm:text-sm font-semibold border border-transparent hover:border-teal-500/20"
          >
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-[#19E6C8] flex items-center justify-center flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>Add a task</span>
          </button>
        )}
      </div>

      {/* Active Tasks List */}
      <div className="space-y-1">
        {activeTasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            isFocused={focusedTaskId === task.id}
            onFocus={() => setFocusedTaskId(task.id)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            dropPosition={dragOverTaskId === task.id ? dropPosition : null}
          />
        ))}
      </div>

      {/* Empty States */}
      {isListEmpty && !isAddingTask && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-[#19E6C8] border border-teal-500/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(25,230,200,0.15)]">
            <Inbox className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className="text-sm font-bold text-[#F4FFFD] mb-1">
            No tasks yet
          </h4>
          <p className="text-xs text-[#94B5B0] max-w-xs mb-4">
            Add your tasks to organize your day and stay in focus.
          </p>
          <button
            onClick={() => setIsAddingTask(true)}
            className="px-4 py-2 rounded-full bg-white text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] transition hover:bg-slate-100"
          >
            Add your first task
          </button>
        </div>
      )}

      {isAllCompleted && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
            All tasks complete!
          </h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Nicely done. You have completed everything in this list.
          </p>
        </div>
      )}

      {/* Collapsible Completed Section */}
      <CompletedSection tasks={completedTasks} listId={listId} />
    </div>
  );
};
