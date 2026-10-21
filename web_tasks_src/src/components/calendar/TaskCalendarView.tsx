import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Check,
  Star,
  Clock,
} from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { Task } from '../../types/tasks';
import {
  formatDateToYYYYMMDD,
  parseYYYYMMDD,
  formatTime,
  isToday,
} from '../../utils/dateHelpers';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const TaskCalendarView: React.FC = () => {
  const { tasks, updateTask, setEditingTaskId, settings } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCompletedInCalendar, setShowCompletedInCalendar] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Build grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDaysCount = new Date(year, month, 0).getDate();

  const leading = Array.from({ length: firstDay }, (_, i) => ({
    dateStr: formatDateToYYYYMMDD(new Date(year, month - 1, prevDaysCount - firstDay + i + 1)),
    dayNum: prevDaysCount - firstDay + i + 1,
    isCurrentMonth: false,
  }));

  const current = Array.from({ length: daysInMonth }, (_, i) => ({
    dateStr: formatDateToYYYYMMDD(new Date(year, month, i + 1)),
    dayNum: i + 1,
    isCurrentMonth: true,
  }));

  const totalSlots = Math.ceil((leading.length + current.length) / 7) * 7;
  const trailingCount = totalSlots - (leading.length + current.length);
  const trailing = Array.from({ length: trailingCount }, (_, i) => ({
    dateStr: formatDateToYYYYMMDD(new Date(year, month + 1, i + 1)),
    dayNum: i + 1,
    isCurrentMonth: false,
  }));

  const daysGrid = [...leading, ...current, ...trailing];

  // Filter tasks with dates
  const datedTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    if (!showCompletedInCalendar && t.isCompleted) return false;
    return true;
  });

  // Group tasks by date
  const tasksByDate = new Map<string, Task[]>();
  datedTasks.forEach(t => {
    if (!t.dueDate) return;
    const existing = tasksByDate.get(t.dueDate) || [];
    existing.push(t);
    tasksByDate.set(t.dueDate, existing);
  });

  // Drag and drop task chip to another date
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropOnDate = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    updateTask({ ...task, dueDate: targetDateStr });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const monthName = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden select-none">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{monthName}</h2>
          <div className="flex items-center gap-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
            >
              Today
            </button>
          </div>
        </div>

        <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showCompletedInCalendar}
            onChange={e => setShowCompletedInCalendar(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Show done</span>
        </label>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center py-1">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-[11px] font-semibold text-slate-400">
            {w}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto">
        {daysGrid.map(cell => {
          const dayTasks = tasksByDate.get(cell.dateStr) || [];
          const isCurrentToday = isToday(cell.dateStr);

          return (
            <div
              key={cell.dateStr}
              onDragOver={handleDragOver}
              onDrop={e => handleDropOnDate(e, cell.dateStr)}
              className={`p-1 flex flex-col min-h-[64px] transition-colors ${
                cell.isCurrentMonth
                  ? 'bg-white dark:bg-slate-900'
                  : 'bg-slate-50/40 dark:bg-slate-950/40 text-slate-300 dark:text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`text-[11px] font-medium w-5 h-5 flex items-center justify-center rounded-full ${
                    isCurrentToday
                      ? 'bg-blue-600 text-white font-bold'
                      : cell.isCurrentMonth
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {cell.dayNum}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-semibold px-1">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Task Chips */}
              <div className="space-y-0.5 overflow-hidden flex-1">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={e => handleDragStart(e, task.id)}
                    onClick={() => setEditingTaskId(task.id)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate cursor-pointer transition shadow-xs flex items-center gap-1 ${
                      task.isCompleted
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 line-through'
                        : task.isStarred
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/50'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40'
                    }`}
                    title={`${task.title}${task.dueTime ? ` (${formatTime(task.dueTime, settings.timeFormat)})` : ''}`}
                  >
                    {task.isStarred && <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 flex-shrink-0" />}
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] text-slate-400 font-medium pl-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
