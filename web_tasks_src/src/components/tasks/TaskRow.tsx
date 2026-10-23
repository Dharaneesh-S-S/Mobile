import React, { useState } from 'react';
import {
  Check,
  Star,
  Trash2,
  GripVertical,
  Calendar as CalIcon,
  Repeat,
  ChevronRight,
  ChevronDown,
  ListTree,
} from 'lucide-react';
import { Task } from '../../types/tasks';
import { useTasks } from '../../context/TasksContext';
import { formatDateChip, isOverdue } from '../../utils/dateHelpers';
import { SubtaskList } from './SubtaskList';

interface TaskRowProps {
  task: Task;
  isFocused?: boolean;
  onFocus?: () => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
  dropPosition?: 'top' | 'bottom' | null;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  isFocused,
  onFocus,
  onDragStart,
  onDragOver,
  onDrop,
  dropPosition,
}) => {
  const {
    toggleTaskComplete,
    toggleTaskStar,
    deleteTask,
    setEditingTaskId,
    editingTaskId,
    updateTask,
    toggleSubtasksCollapse,
    selectedTaskIds,
    toggleSelectTask,
    settings,
  } = useTasks();

  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineTitle, setInlineTitle] = useState(task.title);

  const isSelected = selectedTaskIds.has(task.id);
  const isOverdueTask = isOverdue(task.dueDate, task.dueTime) && !task.isCompleted;

  const completedSubtasksCount = task.subtasks.filter(s => s.isCompleted).length;
  const totalSubtasksCount = task.subtasks.length;

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inlineTitle.trim()) {
      updateTask({ ...task, title: inlineTitle.trim() });
    }
    setIsEditingInline(false);
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // If Shift or Ctrl/Cmd is clicked, toggle selection for bulk actions
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      e.stopPropagation();
      toggleSelectTask(task.id, true);
      return;
    }

    if (onFocus) onFocus();
    setEditingTaskId(task.id);
  };

  const dateChipText = formatDateChip(task.dueDate, task.dueTime, settings.timeFormat);

  return (
    <div
      className={`relative group rounded-xl transition-all duration-150 ${
        isSelected
          ? 'bg-teal-500/20 ring-1 ring-[#19E6C8] text-[#F4FFFD]'
          : isFocused
          ? 'bg-teal-500/10 text-[#F4FFFD]'
          : 'hover:bg-teal-500/5 text-[#94B5B0] hover:text-[#F4FFFD]'
      } ${
        dropPosition === 'top'
          ? 'drop-indicator drop-indicator-top'
          : dropPosition === 'bottom'
          ? 'drop-indicator drop-indicator-bottom'
          : ''
      }`}
      draggable
      onDragStart={e => onDragStart?.(e, task.id)}
      onDragOver={e => onDragOver?.(e, task.id)}
      onDrop={e => onDrop?.(e, task.id)}
    >
      <div
        className="flex items-start gap-2.5 px-2.5 py-2 cursor-pointer select-none"
        onClick={handleRowClick}
      >
        {/* Left Drag Handle */}
        <div
          className="cursor-grab active:cursor-grabbing text-teal-400/30 hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1 -ml-1 flex-shrink-0"
          title="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        {/* Complete Checkbox */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
          }}
          className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center transition flex-shrink-0 ${
            task.isCompleted
              ? 'border-[#19E6C8] bg-[#19E6C8] text-[#030707] animate-check-pop'
              : 'border-teal-500/40 hover:border-[#19E6C8]'
          }`}
          title={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
        </button>

        {/* Task Title & Details */}
        <div className="flex-1 min-w-0 pr-1">
          {isEditingInline ? (
            <form onSubmit={handleInlineSubmit} onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={inlineTitle}
                onChange={e => setInlineTitle(e.target.value)}
                onBlur={handleInlineSubmit}
                autoFocus
                className="w-full bg-transparent border-none outline-none font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-100"
              />
            </form>
          ) : (
            <div
              className={`text-xs sm:text-sm font-medium tracking-tight truncate leading-snug ${
                task.isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.title}
            </div>
          )}

          {/* Details Preview line */}
          {task.details && (
            <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 max-w-[280px] sm:max-w-md">
              {task.details}
            </div>
          )}

          {/* Meta Chips: Due Date & Subtasks count */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  isOverdueTask
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <CalIcon className="w-3 h-3 flex-shrink-0" />
                <span>{dateChipText}</span>
              </span>
            )}

            {task.recurrence && task.recurrence.frequency !== 'none' && (
              <span
                className="text-slate-400 dark:text-slate-500 flex items-center"
                title={`Repeats ${task.recurrence.frequency}`}
              >
                <Repeat className="w-3 h-3" />
              </span>
            )}

            {totalSubtasksCount > 0 && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  toggleSubtasksCollapse(task.id);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md"
              >
                <ListTree className="w-3 h-3" />
                <span>
                  {completedSubtasksCount}/{totalSubtasksCount}
                </span>
                {task.isSubtasksCollapsed ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons: Star & Delete */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              toggleTaskStar(task.id);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-amber-500 transition"
            title={task.isStarred ? 'Unstar task' : 'Star task'}
          >
            <Star
              className={`w-4 h-4 ${
                task.isStarred ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="p-1 rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtasks Expanded */}
      {totalSubtasksCount > 0 && !task.isSubtasksCollapsed && (
        <SubtaskList parentTaskId={task.id} subtasks={task.subtasks} />
      )}
    </div>
  );
};
