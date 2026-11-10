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
      className={`relative group rounded-xl transition-all duration-150 border select-none ${
        isSelected
          ? 'bg-[#081a18] border-[#19E6C8] border-l-4 border-l-[#19E6C8] shadow-[0_0_15px_rgba(25,230,200,0.25)] ring-1 ring-[#19E6C8]/40'
          : isFocused
          ? 'bg-[#081a18] border-[#19E6C8]/70 border-l-4 border-l-[#19E6C8] shadow-[0_0_12px_rgba(25,230,200,0.2)]'
          : 'bg-[#081a18]/85 hover:bg-[#081a18] border-teal-500/25 border-l-4 border-l-[#19E6C8] hover:border-teal-500/50 hover:shadow-[0_0_12px_rgba(25,230,200,0.15)] shadow-xs'
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
              ? 'border-[#19E6C8] bg-[#19E6C8] text-[#030707] shadow-[0_0_8px_rgba(25,230,200,0.4)]'
              : 'border-[#19E6C8]/60 hover:border-[#19E6C8] hover:shadow-[0_0_6px_rgba(25,230,200,0.3)]'
          }`}
          title={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.isCompleted && <Check className="w-2.5 h-2.5 stroke-[3] text-[#030707]" />}
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
                className="w-full bg-transparent border-none outline-none font-medium text-xs sm:text-sm text-[#F4FFFD]"
              />
            </form>
          ) : (
            <div
              className={`text-xs sm:text-sm font-semibold tracking-tight truncate leading-snug ${
                task.isCompleted
                  ? 'line-through text-teal-400/40'
                  : 'text-[#F4FFFD]'
              }`}
            >
              {task.title}
            </div>
          )}

          {/* Details Preview line */}
          {task.details && (
            <div className="text-[11px] text-[#94B5B0] truncate mt-0.5 max-w-[280px] sm:max-w-md">
              {task.details}
            </div>
          )}

          {/* Meta Chips: Due Date & Subtasks count */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  isOverdueTask
                    ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                    : 'bg-teal-500/15 text-[#19E6C8] border-teal-500/30'
                }`}
              >
                <CalIcon className="w-3 h-3 flex-shrink-0 text-[#19E6C8]" />
                <span>{dateChipText}</span>
              </span>
            )}

            {task.recurrence && task.recurrence.frequency !== 'none' && (
              <span
                className="text-[#19E6C8] flex items-center"
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
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#94B5B0] hover:text-[#F4FFFD] bg-[#051211] border border-teal-500/25 px-1.5 py-0.5 rounded-md"
              >
                <ListTree className="w-3 h-3 text-[#19E6C8]" />
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
            className="p-1 rounded-lg text-teal-400/40 hover:text-amber-400 transition"
            title={task.isStarred ? 'Unstar task' : 'Star task'}
          >
            <Star
              className={`w-4 h-4 ${
                task.isStarred ? 'text-amber-400 fill-amber-400' : 'text-teal-400/30'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="p-1 rounded-lg text-teal-400/40 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
