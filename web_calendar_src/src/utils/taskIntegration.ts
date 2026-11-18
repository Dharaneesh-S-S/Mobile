import LZString from 'lz-string';
import { CalendarEvent } from '../types/calendar';

export interface ZenithSubtask {
  id: string;
  parentId: string;
  title: string;
  details?: string;
  isCompleted: boolean;
  completedAt?: string;
  dueDate?: string;
  dueTime?: string;
  isStarred: boolean;
  order: number;
  createdAt: string;
}

export interface ZenithTask {
  id: string;
  listId: string;
  title: string;
  details?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  isCompleted: boolean;
  completedAt?: string;
  isStarred: boolean;
  starredAt?: string;
  subtasks: ZenithSubtask[];
  isSubtasksCollapsed?: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdFromCalendar?: boolean;
}

export interface ZenithTaskList {
  id: string;
  name: string;
  isDefault?: boolean;
  sortOrder: 'order' | 'date' | 'starred' | 'title';
  showCompleted: boolean;
  order: number;
  color?: string;
  createdAt: string;
}

export const ZENITH_STORAGE_KEYS = {
  TASKS: 'zenith_tasks_data_v3',
  LISTS: 'zenith_task_lists_v3',
  SETTINGS: 'zenith_task_settings_v3',
  INITIALIZED: 'zenith_tasks_initialized_v3',
};

export const DEFAULT_ZENITH_LISTS: ZenithTaskList[] = [
  {
    id: 'list_valeo_work',
    name: 'Valeo Work',
    isDefault: true,
    sortOrder: 'order',
    showCompleted: false,
    order: 0,
    color: '#3b82f6',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list_valeo_meet',
    name: 'Valeo Meet',
    isDefault: false,
    sortOrder: 'order',
    showCompleted: false,
    order: 1,
    color: '#6366f1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list_buy',
    name: 'Buy',
    isDefault: false,
    sortOrder: 'order',
    showCompleted: false,
    order: 2,
    color: '#10b981',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list_ssd',
    name: 'SSD',
    isDefault: false,
    sortOrder: 'order',
    showCompleted: false,
    order: 3,
    color: '#f59e0b',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list_learn',
    name: 'Need to Learn',
    isDefault: false,
    sortOrder: 'order',
    showCompleted: false,
    order: 4,
    color: '#ec4899',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list_anime',
    name: 'Anime / Series',
    isDefault: false,
    sortOrder: 'order',
    showCompleted: false,
    order: 5,
    color: '#8b5cf6',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list_movie',
    name: 'Movie',
    isDefault: false,
    sortOrder: 'order',
    showCompleted: false,
    order: 6,
    color: '#06b6d4',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list_draw',
    name: 'Draw',
    isDefault: false,
    sortOrder: 'order',
    showCompleted: false,
    order: 7,
    color: '#f97316',
    createdAt: new Date().toISOString(),
  },
];

export function loadZenithLists(): ZenithTaskList[] {
  try {
    const raw = localStorage.getItem(ZENITH_STORAGE_KEYS.LISTS);
    if (!raw) {
      saveZenithLists(DEFAULT_ZENITH_LISTS);
      return DEFAULT_ZENITH_LISTS;
    }
    const decompressed = LZString.decompressFromUTF16(raw);
    if (decompressed) {
      const parsed = JSON.parse(decompressed);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const directParsed = JSON.parse(raw);
    if (Array.isArray(directParsed) && directParsed.length > 0) return directParsed;
    return DEFAULT_ZENITH_LISTS;
  } catch {
    return DEFAULT_ZENITH_LISTS;
  }
}

export function saveZenithLists(lists: ZenithTaskList[]): void {
  try {
    const json = JSON.stringify(lists);
    const compressed = LZString.compressToUTF16(json);
    localStorage.setItem(ZENITH_STORAGE_KEYS.LISTS, compressed);
  } catch (err) {
    console.error('Failed to save zenith task lists:', err);
  }
}

export function loadZenithTasks(): ZenithTask[] {
  try {
    const raw = localStorage.getItem(ZENITH_STORAGE_KEYS.TASKS);
    if (!raw) return [];
    const decompressed = LZString.decompressFromUTF16(raw);
    const parsed: ZenithTask[] = decompressed ? JSON.parse(decompressed) : JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveZenithTasks(tasks: ZenithTask[]): void {
  try {
    const json = JSON.stringify(tasks);
    const compressed = LZString.compressToUTF16(json);
    localStorage.setItem(ZENITH_STORAGE_KEYS.TASKS, compressed);
    // Notify other components/windows
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('zenith_tasks_sync', { detail: tasks }));
  } catch (err) {
    console.error('Failed to save zenith tasks:', err);
  }
}

export function addOrUpdateZenithTask(taskData: {
  id?: string;
  listId: string;
  title: string;
  details?: string;
  dueDate?: string;
  dueTime?: string;
  isCompleted?: boolean;
  createdFromCalendar?: boolean;
}): ZenithTask {
  const tasks = loadZenithTasks();
  const existingIdx = taskData.id ? tasks.findIndex(t => t.id === taskData.id) : -1;

  if (existingIdx >= 0) {
    const updated: ZenithTask = {
      ...tasks[existingIdx],
      listId: taskData.listId,
      title: taskData.title.trim(),
      details: taskData.details,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      isCompleted: taskData.isCompleted ?? tasks[existingIdx].isCompleted,
      createdFromCalendar: taskData.createdFromCalendar ?? tasks[existingIdx].createdFromCalendar,
      updatedAt: new Date().toISOString(),
    };
    tasks[existingIdx] = updated;
    saveZenithTasks(tasks);
    return updated;
  }

  const newTask: ZenithTask = {
    id: taskData.id || `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    listId: taskData.listId,
    title: taskData.title.trim() || 'Untitled task',
    details: taskData.details || '',
    dueDate: taskData.dueDate,
    dueTime: taskData.dueTime,
    isCompleted: taskData.isCompleted || false,
    createdFromCalendar: taskData.createdFromCalendar,
    isStarred: false,
    subtasks: [],
    order: tasks.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);
  saveZenithTasks(tasks);
  return newTask;
}

export function toggleZenithTaskCompletion(taskId: string): boolean {
  const tasks = loadZenithTasks();
  const cleanId = taskId.replace(/^task_/, '');
  const task = tasks.find(t => t.id === cleanId || t.id === taskId || `task_${t.id}` === taskId);
  if (!task) return false;

  task.isCompleted = !task.isCompleted;
  task.completedAt = task.isCompleted ? new Date().toISOString() : undefined;
  task.updatedAt = new Date().toISOString();
  saveZenithTasks(tasks);
  return task.isCompleted;
}

export function deleteZenithTask(taskId: string): void {
  const tasks = loadZenithTasks();
  const cleanId = taskId.replace(/^task_/, '');
  const filtered = tasks.filter(
    t => t.id !== cleanId && t.id !== taskId && `task_${t.id}` !== taskId
  );
  saveZenithTasks(filtered);
}

export function convertZenithTaskToCalendarEvent(task: ZenithTask, listName?: string): CalendarEvent {
  const todayStr = task.dueDate || new Date().toISOString().split('T')[0];
  return {
    id: task.id.startsWith('task_') ? task.id : `task_${task.id}`,
    calendarId: 'cal_tasks',
    type: 'task',
    title: task.title,
    description: task.details,
    startDate: todayStr,
    endDate: todayStr,
    startTime: task.dueTime,
    endTime: task.dueTime,
    isAllDay: !task.dueTime,
    isCompleted: task.isCompleted,
    createdFromCalendar: task.createdFromCalendar === true,
    colorOverride: '#19E6C8',
    subtasks: task.subtasks?.map(st => ({
      id: st.id,
      title: st.title,
      completed: st.isCompleted,
    })) || [],
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
