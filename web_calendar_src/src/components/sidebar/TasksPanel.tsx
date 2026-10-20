import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Calendar as CalIcon,
  ChevronRight,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { CalendarEvent } from '../../types/calendar';
import { formatDateToYYYYMMDD } from '../../utils/dateUtils';

export const TasksPanel: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, openEditor, settings } = useCalendar();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const tasks = events.filter(e => e.type === 'task' && !e.deletedAt);
  const activeTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addEvent({
      type: 'task',
      title: newTaskTitle.trim(),
      startDate: formatDateToYYYYMMDD(new Date()),
      endDate: formatDateToYYYYMMDD(new Date()),
      isAllDay: true,
      isCompleted: false,
      subtasks: [],
    });
    setNewTaskTitle('');
  };

  const handleToggleTask = (task: CalendarEvent) => {
    updateEvent({ ...task, isCompleted: !task.isCompleted }, 'all');
  };

  const handleAddSubtask = (taskId: string) => {
    if (!newSubtaskTitle.trim()) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const subtasks = [
      ...(task.subtasks || []),
      {
        id: `sub_${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ];
    updateEvent({ ...task, subtasks }, 'all');
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    const subtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateEvent({ ...task, subtasks }, 'all');
  };

  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    const subtasks = task.subtasks.filter(st => st.id !== subtaskId);
    updateEvent({ ...task, subtasks }, 'all');
  };

  return (
    <div data-tasks-panel className="w-80 h-full border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col z-20 select-none animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-100">Tasks</h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
          {activeTasks.length} pending
        </span>
      </div>

      {/* Quick Add Task Input */}
      <form onSubmit={handleCreateTask} className="p-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-gray-700 transition-all">
          <Plus className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <input
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="Add a task"
            className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeTasks.map(task => {
          const isExpanded = expandedTaskId === task.id;
          const totalSubs = task.subtasks?.length || 0;
          const completedSubs = task.subtasks?.filter(s => s.completed).length || 0;

          return (
            <div
              key={task.id}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-850 shadow-2xs transition-all"
            >
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToggleTask(task)}
                  className="mt-0.5 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Square className="w-4 h-4 rounded-md" />
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    onClick={() => openEditor(task)}
                    className="text-xs font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 cursor-pointer truncate"
                  >
                    {task.title}
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <CalIcon className="w-3 h-3" />
                      {task.startDate}
                    </span>
                    {totalSubs > 0 && (
                      <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {completedSubs}/{totalSubs} subtasks
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Subtasks drawer */}
              {isExpanded && (
                <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 pl-6 space-y-1.5">
                  {task.subtasks?.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between group text-xs">
                      <button
                        type="button"
                        onClick={() => handleToggleSubtask(task.id, sub.id)}
                        className="flex items-center gap-2 text-left"
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                            sub.completed
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {sub.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs ${
                            sub.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {sub.title}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubtask(task.id, sub.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add subtask input */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={e => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubtask(task.id);
                        }
                      }}
                      placeholder="Add subtask..."
                      className="w-full text-xs px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubtask(task.id)}
                      className="px-2 py-1 text-[11px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Completed Tasks section */}
        {settings.showCompletedTasks && completedTasks.length > 0 && (
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Completed ({completedTasks.length})
            </p>
            <div className="space-y-1.5 opacity-60">
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task)}
                    className="flex items-center gap-2 text-left line-through text-gray-500 dark:text-gray-400 truncate"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{task.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEvent(task.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
