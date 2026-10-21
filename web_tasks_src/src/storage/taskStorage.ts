import LZString from 'lz-string';
import { Task, TaskList, TaskSettings } from '../types/tasks';
import { formatDateToYYYYMMDD } from '../utils/dateHelpers';

const STORAGE_KEYS = {
  TASKS: 'zenith_tasks_data_v1',
  LISTS: 'zenith_task_lists_v1',
  SETTINGS: 'zenith_task_settings_v1',
  INITIALIZED: 'zenith_tasks_initialized_v1',
};

export const DEFAULT_SETTINGS: TaskSettings = {
  theme: 'system',
  defaultListId: 'list_default',
  startOfWeek: 1, // Mon
  timeFormat: '12h',
  defaultSortOrder: 'order',
  showCompletedDefault: false,
  notificationsEnabled: true,
  density: 'comfortable',
};

export const DEFAULT_LISTS: TaskList[] = [
  {
    id: 'list_default',
    name: 'My Tasks',
    isDefault: true,
    sortOrder: 'order',
    showCompleted: false,
    order: 0,
    color: '#3b82f6',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list_work',
    name: 'Work & Projects',
    isDefault: false,
    sortOrder: 'order',
    showCompleted: false,
    order: 1,
    color: '#8b5cf6',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'list_personal',
    name: 'Personal & Wellness',
    isDefault: false,
    sortOrder: 'order',
    showCompleted: false,
    order: 2,
    color: '#10b981',
    createdAt: new Date().toISOString(),
  },
];

export function getDemoTasks(): Task[] {
  const now = new Date();
  const todayStr = formatDateToYYYYMMDD(now);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = formatDateToYYYYMMDD(tomorrow);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = formatDateToYYYYMMDD(yesterday);

  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  const nextWeekStr = formatDateToYYYYMMDD(nextWeek);

  return [
    {
      id: 'task_demo_1',
      listId: 'list_default',
      title: 'Review project roadmap and milestones',
      details: 'Check deliverables for Q4 and ensure team alignment on upcoming release sprints.',
      dueDate: todayStr,
      dueTime: '14:30',
      isCompleted: false,
      isStarred: true,
      starredAt: new Date().toISOString(),
      order: 0,
      subtasks: [
        {
          id: 'sub_1_1',
          parentId: 'task_demo_1',
          title: 'Review analytics dashboard',
          isCompleted: true,
          completedAt: new Date().toISOString(),
          isStarred: false,
          order: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_1_2',
          parentId: 'task_demo_1',
          title: 'Sync with product designers on UI flow',
          isCompleted: false,
          isStarred: true,
          order: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_1_3',
          parentId: 'task_demo_1',
          title: 'Draft sprint summary notes',
          isCompleted: false,
          isStarred: false,
          order: 2,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_demo_2',
      listId: 'list_default',
      title: 'Follow up on client feedback report',
      details: 'Overdue task from yesterday to highlight the red badge.',
      dueDate: yesterdayStr,
      dueTime: '17:00',
      isCompleted: false,
      isStarred: false,
      order: 1,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_demo_3',
      listId: 'list_default',
      title: 'Prepare presentation slides for team showcase',
      details: 'Include interactive demos and performance benchmark diagrams.',
      dueDate: tomorrowStr,
      isCompleted: false,
      isStarred: true,
      starredAt: new Date().toISOString(),
      order: 2,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_demo_4',
      listId: 'list_default',
      title: 'Daily engineering standup',
      details: 'Discuss blockers, progress, and daily deliverables.',
      dueDate: todayStr,
      dueTime: '10:00',
      isCompleted: true,
      completedAt: new Date().toISOString(),
      isStarred: false,
      recurrence: {
        frequency: 'daily',
        interval: 1,
        endType: 'never',
      },
      order: 3,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Work List
    {
      id: 'task_demo_5',
      listId: 'list_work',
      title: 'Audit mobile performance and bundle sizes',
      details: 'Run Lighthouse audits and check Flutter wasm load speeds.',
      dueDate: nextWeekStr,
      isCompleted: false,
      isStarred: true,
      starredAt: new Date().toISOString(),
      order: 0,
      subtasks: [
        {
          id: 'sub_5_1',
          parentId: 'task_demo_5',
          title: 'Analyze WebAssembly network latency',
          isCompleted: false,
          isStarred: false,
          order: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_5_2',
          parentId: 'task_demo_5',
          title: 'Optimize image and font asset preloading',
          isCompleted: false,
          isStarred: false,
          order: 1,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_demo_6',
      listId: 'list_work',
      title: 'Deploy production release build',
      details: 'Push tag and monitor automated deployment pipeline.',
      isCompleted: false,
      isStarred: false,
      order: 1,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Personal List
    {
      id: 'task_demo_7',
      listId: 'list_personal',
      title: '30-minute evening run & stretch',
      details: 'Stay active and hydrated.',
      dueDate: todayStr,
      dueTime: '19:00',
      isCompleted: false,
      isStarred: true,
      starredAt: new Date().toISOString(),
      recurrence: {
        frequency: 'daily',
        interval: 1,
        endType: 'never',
      },
      order: 0,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_demo_8',
      listId: 'list_personal',
      title: 'Weekly grocery shopping list',
      details: 'Fresh vegetables, almond milk, oats, and fruits.',
      dueDate: tomorrowStr,
      isCompleted: false,
      isStarred: false,
      order: 1,
      subtasks: [
        {
          id: 'sub_8_1',
          parentId: 'task_demo_8',
          title: 'Avocados & leafy greens',
          isCompleted: true,
          completedAt: new Date().toISOString(),
          isStarred: false,
          order: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_8_2',
          parentId: 'task_demo_8',
          title: 'Whole grains & sourdough bread',
          isCompleted: false,
          isStarred: false,
          order: 1,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

// Storage operations with transparent LZ-String compression
export function saveTasks(tasks: Task[]): void {
  try {
    const json = JSON.stringify(tasks);
    const compressed = LZString.compressToUTF16(json);
    localStorage.setItem(STORAGE_KEYS.TASKS, compressed);
  } catch (err) {
    console.error('Failed to compress and save tasks to localStorage:', err);
  }
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      const demo = getDemoTasks();
      saveTasks(demo);
      return demo;
    }

    // Try decompressing UTF-16
    const decompressed = LZString.decompressFromUTF16(raw);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
    // Fallback in case raw json was stored previously
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse tasks from localStorage, returning demo data:', err);
    return getDemoTasks();
  }
}

export function saveLists(lists: TaskList[]): void {
  try {
    const json = JSON.stringify(lists);
    const compressed = LZString.compressToUTF16(json);
    localStorage.setItem(STORAGE_KEYS.LISTS, compressed);
  } catch (err) {
    console.error('Failed to save task lists to localStorage:', err);
  }
}

export function loadLists(): TaskList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LISTS);
    if (!raw) {
      saveLists(DEFAULT_LISTS);
      return DEFAULT_LISTS;
    }
    const decompressed = LZString.decompressFromUTF16(raw);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse lists from localStorage:', err);
    return DEFAULT_LISTS;
  }
}

export function saveSettings(settings: TaskSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadSettings(): TaskSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function clearAllData(): { tasks: Task[]; lists: TaskList[] } {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.LISTS);
  saveLists(DEFAULT_LISTS);
  saveTasks([]);
  return { tasks: [], lists: DEFAULT_LISTS };
}

export function resetDemoData(): { tasks: Task[]; lists: TaskList[] } {
  const demoTasks = getDemoTasks();
  saveLists(DEFAULT_LISTS);
  saveTasks(demoTasks);
  return { tasks: demoTasks, lists: DEFAULT_LISTS };
}
