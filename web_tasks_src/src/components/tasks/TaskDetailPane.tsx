import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar as CalIcon,
  Clock,
  Repeat,
  Star,
  Trash2,
  Folder,
  Check,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { DatePickerModal } from './DatePickerModal';
import { SubtaskList } from './SubtaskList';
import { formatDateChip } from '../../utils/dateHelpers';

interface TaskDetailPaneProps {
  taskId: string;
  onClose: () => void;
}

export const TaskDetailPane: React.FC<TaskDetailPaneProps> = ({ taskId, onClose }) => {
  const {
    tasks,
    lists,
    updateTask,
    deleteTask,
    toggleTaskStar,
    toggleTaskComplete,
    moveTaskToList,
    settings,
  } = useTasks();

  const task = tasks.find(t => t.id === taskId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMoveDropdown, setShowMoveDropdown] = useState(false);
  const [isSavedAnimating, setIsSavedAnimating] = useState(false);

  useEffect(() => {
    setIsSavedAnimating(true);
    const timer = setTimeout(() => setIsSavedAnimating(false), 1200);
    return () => clearTimeout(timer);
  }, [task?.title, task?.details, task?.dueDate, task?.dueTime, task?.recurrence]);

  if (!task) return null;

  const currentList = lists.find(l => l.id === task.listId);

  const completedSubtasksCount = task.subtasks.filter(s => s.isCompleted).length;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-30 animate-slide-up">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Back to list (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-400">
            {isSavedAnimating ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Check className="w-3 h-3" /> Saved
              </span>
            ) : (
              'Saved'
            )}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Star Toggle */}
          <button
            onClick={() => toggleTaskStar(task.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition"
            title={task.isStarred ? 'Unstar task' : 'Star task'}
          >
            <Star
              className={`w-4 h-4 ${
                task.isStarred ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
              }`}
            />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              deleteTask(task.id);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Title Input */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => toggleTaskComplete(task.id)}
            className={`w-5 h-5 rounded-full border mt-1 flex items-center justify-center transition flex-shrink-0 ${
              task.isCompleted
                ? 'border-blue-600 bg-blue-600 text-white animate-check-pop'
                : 'border-slate-400 hover:border-blue-500'
            }`}
          >
            {task.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
          <textarea
            value={task.title}
            onChange={e => updateTask({ ...task, title: e.target.value })}
            placeholder="Title"
            rows={2}
            className={`w-full bg-transparent border-none outline-none resize-none font-semibold text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 ${
              task.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}
          />
        </div>

        {/* Date / Time Picker Button */}
        <div>
          {task.dueDate ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800">
              <CalIcon className="w-3.5 h-3.5" />
              <button
                type="button"
                onClick={() => setShowDatePicker(true)}
                className="hover:underline"
              >
                {formatDateChip(task.dueDate, task.dueTime, settings.timeFormat)}
              </button>
              {task.recurrence && task.recurrence.frequency !== 'none' && (
                <span title={`Repeats ${task.recurrence.frequency}`}>
                  <Repeat className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ml-1" />
                </span>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-600 dark:text-slate-300 text-xs font-medium transition w-full"
            >
              <CalIcon className="w-4 h-4 text-slate-400" />
              <span>Add date/time</span>
            </button>
          )}
        </div>

        {/* Details Multi-line Description */}
        <div>
          <textarea
            value={task.details || ''}
            onChange={e => updateTask({ ...task, details: e.target.value })}
            placeholder="Details"
            rows={4}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        {/* Subtasks Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subtasks {task.subtasks.length > 0 && `(${completedSubtasksCount}/${task.subtasks.length})`}
            </span>
          </div>
          <SubtaskList parentTaskId={task.id} subtasks={task.subtasks} />
        </div>

        {/* Move to another List Dropdown */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoveDropdown(!showMoveDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-slate-400" />
                <span>List: {currentList?.name || 'Default'}</span>
              </div>
              <span className="text-slate-400 text-[11px]">Change</span>
            </button>

            {showMoveDropdown && (
              <div className="absolute left-0 bottom-full mb-1.5 w-full bg-white dark:bg-slate-800 rounded-xl shadow-popover border border-slate-200 dark:border-slate-700 py-1 z-50 animate-pop-in">
                {lists.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      moveTaskToList(task.id, l.id);
                      setShowMoveDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition ${
                      task.listId === l.id
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{l.name}</span>
                    {task.listId === l.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePickerModal
          initialDate={task.dueDate}
          initialTime={task.dueTime}
          initialRecurrence={task.recurrence}
          timeFormat={settings.timeFormat}
          onSave={(date, time, rec) => {
            updateTask({
              ...task,
              dueDate: date,
              dueTime: time,
              recurrence: rec,
            });
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};
