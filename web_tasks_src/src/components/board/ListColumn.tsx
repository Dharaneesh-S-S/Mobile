import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  MoreVertical,
  Plus,
  Check,
  Clock,
  Repeat,
  ChevronRight,
  ChevronDown,
  Trash2,
  GripVertical,
  Star,
} from 'lucide-react';
import { Task, TaskList, SortOption } from '../../types/tasks';
import { useTasks } from '../../context/TasksContext';
import { formatRelativeDate } from '../../utils/dateHelpers';
import { ListOptionsMenu } from '../lists/ListOptionsMenu';

interface ListColumnProps {
  list: TaskList;
  tasks: Task[];
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;
}

export const ListColumn: React.FC<ListColumnProps> = ({
  list,
  tasks,
  focusedTaskId,
  setFocusedTaskId,
}) => {
  const {
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    toggleTaskStar,
    setEditingTaskId,
    inlineAddingListId,
    setInlineAddingListId,
    moveTaskToAnotherList,
    reorderTasks,
    settings,
  } = useTasks();

  const [isAddingInline, setIsAddingInline] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(list.showCompleted);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Focus input when entering inline add mode
  useEffect(() => {
    if (inlineAddingListId === list.id || isAddingInline) {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [inlineAddingListId, isAddingInline, list.id]);

  // Close options on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setIsOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tasks for this list
  const { activeTasks, completedTasks } = useMemo(() => {
    const listTasks = tasks.filter(t => t.listId === list.id);
    const active = listTasks.filter(t => !t.isCompleted);
    const completed = listTasks.filter(t => t.isCompleted);

    const sortOption: SortOption = list.sortOrder || 'order';
    const sorted = [...active].sort((a, b) => {
      switch (sortOption) {
        case 'date': {
          if (!a.dueDate && !b.dueDate) return a.order - b.order;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        case 'starred': {
          if (a.isStarred && !b.isStarred) return -1;
          if (!a.isStarred && b.isStarred) return 1;
          return a.order - b.order;
        }
        case 'title':
          return a.title.localeCompare(b.title);
        case 'order':
        default:
          return a.order - b.order;
      }
    });

    return { activeTasks: sorted, completedTasks: completed };
  }, [tasks, list.id, list.sortOrder]);

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setIsAddingInline(false);
      setInlineAddingListId(null);
      return;
    }
    createTask(newTaskTitle.trim(), list.id);
    setNewTaskTitle('');
    // Rapid entry: keep focused for the next task!
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAddingInline(false);
      setInlineAddingListId(null);
      setNewTaskTitle('');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: id, sourceListId: list.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverCard = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnCard = (e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      if (data.taskId) {
        if (data.sourceListId !== list.id) {
          moveTaskToAnotherList(data.taskId, list.id);
        } else if (dragOverTaskId && dragOverTaskId !== data.taskId) {
          reorderTasks(data.taskId, dragOverTaskId);
        }
      }
    } catch {
      // fallback
      if (raw) {
        moveTaskToAnotherList(raw, list.id);
      }
    }

    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  return (
    <div
      id={`list-column-${list.id}`}
      onDragOver={handleDragOverCard}
      onDrop={handleDropOnCard}
      className="w-80 min-w-[300px] max-w-[320px] bg-[#051211]/90 backdrop-blur-xl rounded-2xl flex flex-col h-full max-h-full border border-teal-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)] select-none flex-shrink-0"
    >
      {/* Column Header */}
      <div className="p-4 pb-2 flex items-center justify-between relative">
        <h3 className="font-bold text-base text-[#F4FFFD] truncate tracking-tight font-display">
          {list.name}
        </h3>

        <div className="relative" ref={optionsRef}>
          <button
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className="p-1 rounded-lg text-teal-400/60 hover:text-white hover:bg-teal-500/15 transition"
            title="List options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {isOptionsOpen && (
            <ListOptionsMenu onClose={() => setIsOptionsOpen(false)} />
          )}
        </div>
      </div>

      {/* "+ Add a task" button */}
      <div className="px-3 pb-2">
        {isAddingInline || inlineAddingListId === list.id ? (
          <form
            onSubmit={handleQuickAddSubmit}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#081a18] border border-[#19E6C8] shadow-[0_0_15px_rgba(25,230,200,0.2)] transition"
          >
            <div className="w-4 h-4 rounded-full border border-dashed border-[#19E6C8] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Title"
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#F4FFFD] placeholder:text-teal-400/50"
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="text-[11px] font-bold text-[#19E6C8] hover:underline disabled:opacity-40"
            >
              Save
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsAddingInline(true);
              setInlineAddingListId(list.id);
            }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[#19E6C8] hover:text-[#2DD4BF] hover:bg-teal-500/10 transition text-sm font-semibold w-full text-left"
          >
            <div className="w-5 h-5 rounded-full border-2 border-[#19E6C8] flex items-center justify-center flex-shrink-0">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Add a task</span>
          </button>
        )}
      </div>

      {/* Task Rows List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin">
        {activeTasks.map(task => {
          const dateInfo = formatRelativeDate(task.dueDate, task.dueTime, settings.timeFormat);
          const isOverdue = dateInfo.isOverdue;
          const isSelected = focusedTaskId === task.id;

          return (
            <div
              key={task.id}
              draggable
              onDragStart={e => handleDragStart(e, task.id)}
              onDragOver={e => {
                e.preventDefault();
                setDragOverTaskId(task.id);
              }}
              onClick={() => {
                setFocusedTaskId(task.id);
                setEditingTaskId(task.id);
              }}
              className={`group rounded-xl p-2.5 transition flex flex-col gap-1 cursor-pointer hover:bg-teal-500/10 ${
                isSelected ? 'bg-teal-500/15 border border-teal-500/30' : 'bg-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox Circle */}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    toggleTaskComplete(task.id);
                  }}
                  className="w-4 h-4 rounded-full border border-teal-500/40 hover:border-[#19E6C8] transition flex items-center justify-center flex-shrink-0 mt-0.5"
                  title="Mark complete"
                >
                  {task.isCompleted && <Check className="w-2.5 h-2.5 text-[#19E6C8]" />}
                </button>

                {/* Title & Date Chips */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#F4FFFD] leading-snug break-words">
                    {task.title}
                  </div>

                  {/* Overdue / Due Date Badge */}
                  {task.dueDate && dateInfo.text && (
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          isOverdue
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                            : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{dateInfo.text}</span>
                        {task.recurrence && task.recurrence.frequency !== 'none' && (
                          <Repeat className="w-3 h-3 ml-0.5" />
                        )}
                      </span>
                    </div>
                  )}

                  {/* Subtasks (if any) */}
                  {task.subtasks.length > 0 && (
                    <div className="mt-2 pl-3 border-l-2 border-teal-500/20 space-y-1.5">
                      {task.subtasks.map(sub => (
                        <div
                          key={sub.id}
                          className="flex items-start gap-2.5 text-xs text-[#94B5B0]"
                        >
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              // Toggle subtask complete
                              const updated = task.subtasks.map(s =>
                                s.id === sub.id ? { ...s, isCompleted: !s.isCompleted } : s
                              );
                              updateTask({ ...task, subtasks: updated });
                            }}
                            className={`w-3.5 h-3.5 rounded-full border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                              sub.isCompleted
                                ? 'border-[#19E6C8] bg-[#19E6C8] text-[#030707]'
                                : 'border-teal-500/40 hover:border-[#19E6C8]'
                            }`}
                          >
                            {sub.isCompleted && <Check className="w-2 h-2 stroke-[3]" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <span className={sub.isCompleted ? 'line-through opacity-60 text-teal-400/50' : 'text-[#F4FFFD]'}>
                              {sub.title}
                            </span>
                            {sub.details && (
                              <div className="text-[11px] text-teal-400/60 font-normal leading-tight mt-0.5">
                                {sub.details}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Star Toggle on hover */}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    toggleTaskStar(task.id);
                  }}
                  className={`p-1 rounded text-teal-400/40 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition ${
                    task.isStarred ? 'opacity-100 text-amber-400' : ''
                  }`}
                  title={task.isStarred ? 'Starred' : 'Star'}
                >
                  <Star className={`w-4 h-4 ${task.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Completed Section */}
      {completedTasks.length > 0 && (
        <div className="p-3 pt-2 border-t border-teal-500/20 mt-auto">
          <button
            type="button"
            onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
            className="flex items-center gap-1.5 text-xs text-teal-400/80 hover:text-[#F4FFFD] transition font-medium w-full text-left"
          >
            {isCompletedExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <span>Completed ({completedTasks.length})</span>
          </button>

          {isCompletedExpanded && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {completedTasks.map(t => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-2 py-1 px-1 text-xs text-teal-400/60"
                >
                  <div className="flex items-center gap-2 truncate flex-1">
                    <button
                      type="button"
                      onClick={() => toggleTaskComplete(t.id)}
                      className="w-3.5 h-3.5 rounded-full border border-[#19E6C8] bg-[#19E6C8] text-[#030707] flex items-center justify-center flex-shrink-0"
                      title="Click to restore"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </button>
                    <span className="line-through truncate text-teal-400/50">{t.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTask(t.id)}
                    className="p-1 hover:text-rose-400 text-teal-400/40 rounded transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
