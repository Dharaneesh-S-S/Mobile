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
    <div className="h-full flex flex-col bg-[#051211] border-l border-teal-500/20 z-30 animate-slide-up text-[#F4FFFD]">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-teal-500/20">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-400 hover:text-white hover:bg-teal-500/10 transition"
            title="Back to list (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-teal-400/70">
            {isSavedAnimating ? (
              <span className="flex items-center gap-1 text-[#19E6C8]">
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
            className="p-1.5 rounded-lg text-teal-400/60 hover:text-amber-400 transition"
            title={task.isStarred ? 'Unstar task' : 'Star task'}
          >
            <Star
              className={`w-4 h-4 ${
                task.isStarred ? 'text-amber-400 fill-amber-400' : 'text-teal-400/40'
              }`}
            />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              deleteTask(task.id);
              onClose();
            }}
            className="p-1.5 rounded-lg text-teal-400/60 hover:text-rose-400 hover:bg-rose-950/40 transition"
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
                ? 'border-[#19E6C8] bg-[#19E6C8] text-[#030707] animate-check-pop'
                : 'border-teal-500/40 hover:border-[#19E6C8]'
            }`}
          >
            {task.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
          <textarea
            value={task.title}
            onChange={e => updateTask({ ...task, title: e.target.value })}
            placeholder="Title"
            rows={2}
            className={`w-full bg-transparent border-none outline-none resize-none font-semibold text-base text-[#F4FFFD] placeholder:text-teal-400/50 ${
              task.isCompleted ? 'line-through text-teal-400/50' : ''
            }`}
          />
        </div>

        {/* Date / Time Picker Button */}
        <div>
          {task.dueDate ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/15 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <CalIcon className="w-3.5 h-3.5 text-[#19E6C8]" />
              <button
                type="button"
                onClick={() => setShowDatePicker(true)}
                className="hover:underline"
              >
                {formatDateChip(task.dueDate, task.dueTime, settings.timeFormat)}
              </button>
              {task.recurrence && task.recurrence.frequency !== 'none' && (
                <span title={`Repeats ${task.recurrence.frequency}`}>
                  <Repeat className="w-3.5 h-3.5 text-[#19E6C8] ml-1" />
                </span>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-teal-500/30 hover:border-[#19E6C8] text-teal-400 text-xs font-semibold transition w-full"
            >
              <CalIcon className="w-4 h-4 text-teal-400/60" />
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
            className="w-full px-3 py-2 rounded-xl bg-[#081a18] border border-teal-500/20 text-[#F4FFFD] placeholder:text-teal-400/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#19E6C8]/40 resize-y"
          />
        </div>

        {/* Subtasks Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-teal-300">
              Subtasks {task.subtasks.length > 0 && `(${completedSubtasksCount}/${task.subtasks.length})`}
            </span>
          </div>
          <SubtaskList parentTaskId={task.id} subtasks={task.subtasks} />
        </div>

        {/* Move to another List Dropdown */}
        <div className="pt-3 border-t border-teal-500/20">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoveDropdown(!showMoveDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#081a18] hover:bg-[#0a2421] text-[#F4FFFD] text-xs font-semibold border border-teal-500/20 transition"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#19E6C8]" />
                <span>List: {currentList?.name || 'Default'}</span>
              </div>
              <span className="text-teal-400 text-[11px]">Change</span>
            </button>

            {showMoveDropdown && (
              <div className="absolute left-0 bottom-full mb-1.5 w-full bg-[#051211] rounded-xl shadow-2xl border border-teal-500/30 py-1 z-50 animate-pop-in">
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
                        ? 'bg-teal-500/20 text-[#19E6C8] font-bold'
                        : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-white'
                    }`}
                  >
                    <span>{l.name}</span>
                    {task.listId === l.id && <Check className="w-3.5 h-3.5 text-[#19E6C8]" />}
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
