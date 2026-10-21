import LZString from 'lz-string';
import { Task, TaskList, TaskSettings } from '../types/tasks';
import { formatDateToYYYYMMDD } from '../utils/dateHelpers';

const STORAGE_KEYS = {
  TASKS: 'zenith_tasks_data_v3',
  LISTS: 'zenith_task_lists_v3',
  SETTINGS: 'zenith_task_settings_v3',
  INITIALIZED: 'zenith_tasks_initialized_v3',
};

export const DEFAULT_SETTINGS: TaskSettings = {
  theme: 'dark', // Default to dark theme matching Google Tasks screenshot
  defaultListId: 'list_valeo_work',
  startOfWeek: 1, // Mon
  timeFormat: '12h',
  defaultSortOrder: 'order',
  showCompletedDefault: false,
  notificationsEnabled: true,
  density: 'comfortable',
};

export const DEFAULT_LISTS: TaskList[] = [
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

export function getDemoTasks(): Task[] {
  const now = new Date();

  // Date offsets
  const getDateAgo = (weeksAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - weeksAgo * 7);
    return formatDateToYYYYMMDD(d);
  };

  const todayStr = formatDateToYYYYMMDD(now);
  const sixWeeksAgo = getDateAgo(6);
  const fiveWeeksAgo = getDateAgo(5);
  const fourWeeksAgo = getDateAgo(4);
  const twoWeeksAgo = getDateAgo(2);

  // Generate completed tasks for collapsible counts
  const generateCompleted = (listId: string, count: number, prefix: string): Task[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `task_${listId}_comp_${i}`,
      listId,
      title: `${prefix} archive item #${i + 1}`,
      isCompleted: true,
      completedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
      isStarred: false,
      subtasks: [],
      order: 100 + i,
      createdAt: new Date(Date.now() - (i + 10) * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  };

  return [
    // 1. Valeo Work
    {
      id: 'task_valeo_1',
      listId: 'list_valeo_work',
      title: 'Learn Testing',
      details: 'Automated unit tests and E2E validation setup for release pipeline.',
      dueDate: sixWeeksAgo,
      isCompleted: false,
      isStarred: true,
      starredAt: new Date().toISOString(),
      order: 0,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_valeo_2',
      listId: 'list_valeo_work',
      title: 'Complete build',
      details: 'Finalize native build configurations and test on multiple devices.',
      dueDate: fourWeeksAgo,
      isCompleted: false,
      isStarred: false,
      order: 1,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_valeo_3',
      listId: 'list_valeo_work',
      title: 'Check for remote access',
      details: 'Verify SSH credentials, VPN tokens, and firewall ports.',
      dueDate: fiveWeeksAgo,
      isCompleted: false,
      isStarred: false,
      order: 2,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    ...generateCompleted('list_valeo_work', 30, 'Valeo sprint task'),

    // 2. Valeo Meet
    {
      id: 'task_meet_1',
      listId: 'list_valeo_meet',
      title: 'Cam Driver Syncup',
      details: 'Weekly review of camera driver performance, latency, and memory footprints.',
      dueDate: twoWeeksAgo,
      isCompleted: false,
      isStarred: true,
      starredAt: new Date().toISOString(),
      recurrence: {
        frequency: 'weekly',
        interval: 1,
        endType: 'never',
      },
      order: 0,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    ...generateCompleted('list_valeo_meet', 24, 'Driver sync topic'),

    // 3. Buy
    {
      id: 'task_buy_1',
      listId: 'list_buy',
      title: 'Kavi Gift',
      details: 'Surprise birthday gift for Kavi.',
      isCompleted: false,
      isStarred: true,
      starredAt: new Date().toISOString(),
      order: 0,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_buy_2',
      listId: 'list_buy',
      title: 'T-Shirt',
      details: 'Cotton casual wear.',
      isCompleted: false,
      isStarred: false,
      order: 1,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_buy_3',
      listId: 'list_buy',
      title: 'power bank',
      details: '20000mAh fast-charging portable battery.',
      isCompleted: false,
      isStarred: false,
      order: 2,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    ...generateCompleted('list_buy', 12, 'Purchased order'),

    // 4. SSD
    {
      id: 'task_ssd_1',
      listId: 'list_ssd',
      title: 'SPM Assignment',
      details: 'Software Project Management deliverable submission.',
      isCompleted: false,
      isStarred: false,
      order: 0,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_ssd_2',
      listId: 'list_ssd',
      title: 'Gt sign in DL',
      isCompleted: false,
      isStarred: false,
      order: 1,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_ssd_3',
      listId: 'list_ssd',
      title: 'Phone Case',
      isCompleted: false,
      isStarred: false,
      order: 2,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_ssd_4',
      listId: 'list_ssd',
      title: 'MobileApp',
      isCompleted: false,
      isStarred: false,
      order: 3,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_ssd_5',
      listId: 'list_ssd',
      title: 'HCI Assignment',
      isCompleted: false,
      isStarred: false,
      order: 4,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_ssd_6',
      listId: 'list_ssd',
      title: 'OE Assignment',
      isCompleted: false,
      isStarred: false,
      order: 5,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task_ssd_app',
      listId: 'list_ssd',
      title: 'App',
      details: 'All-in-one personal productivity application feature list.',
      isCompleted: false,
      isStarred: true,
      starredAt: new Date().toISOString(),
      order: 6,
      subtasks: [
        {
          id: 'sub_app_1',
          parentId: 'task_ssd_app',
          title: 'Calendar',
          details: 'check whather the birthday month repeats itself',
          isCompleted: false,
          isStarred: false,
          order: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_app_2',
          parentId: 'task_ssd_app',
          title: 'money manager',
          isCompleted: false,
          isStarred: false,
          order: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_app_3',
          parentId: 'task_ssd_app',
          title: 'tasks',
          isCompleted: false,
          isStarred: false,
          order: 2,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_app_4',
          parentId: 'task_ssd_app',
          title: 'impt notes taker like keep',
          isCompleted: false,
          isStarred: false,
          order: 3,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_app_5',
          parentId: 'task_ssd_app',
          title: 'mobile usage tracker and restricter',
          isCompleted: false,
          isStarred: false,
          order: 4,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_app_6',
          parentId: 'task_ssd_app',
          title: 'song player from local storage',
          isCompleted: false,
          isStarred: false,
          order: 5,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_app_7',
          parentId: 'task_ssd_app',
          title: 'ability to add wigets',
          isCompleted: false,
          isStarred: false,
          order: 6,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sub_app_8',
          parentId: 'task_ssd_app',
          title: 'notification',
          isCompleted: false,
          isStarred: false,
          order: 7,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    ...Array.from({ length: 9 }, (_, i) => ({
      id: `task_ssd_item_${i + 7}`,
      listId: 'list_ssd',
      title: `Project module milestone #${i + 1}`,
      isCompleted: false,
      isStarred: false,
      order: 7 + i,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),

    // 5. Need to Learn (9 items)
    ...Array.from({ length: 9 }, (_, i) => ({
      id: `task_learn_${i}`,
      listId: 'list_learn',
      title: [
        'Docker & Container Orchestration',
        'Rust WebAssembly for Web',
        'Advanced Dart Isolates & FFI',
        'IndexedDB OPFS high-speed cache',
        'System Design & Micro-frontends',
        'PostgreSQL Query Optimization',
        'GraphQL vs gRPC Architecture',
        'CI/CD Pipeline Security',
        'Machine Learning On-Device Inference',
      ][i],
      isCompleted: false,
      isStarred: i === 0,
      order: i,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),

    // 6. Anime / Series (7 items)
    ...Array.from({ length: 7 }, (_, i) => ({
      id: `task_anime_${i}`,
      listId: 'list_anime',
      title: [
        'Attack on Titan - Final Season',
        'Jujutsu Kaisen Season 2',
        'Demon Slayer - Hashira Training',
        'Vinland Saga Season 2',
        'Frieren: Beyond Journey\'s End',
        'Solo Leveling',
        'Steins;Gate rewatch',
      ][i],
      isCompleted: false,
      isStarred: i === 0,
      order: i,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),

    // 7. Movie (8 items)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `task_movie_${i}`,
      listId: 'list_movie',
      title: [
        'Interstellar',
        'Inception',
        'Oppenheimer',
        'Dune: Part Two',
        'Spider-Man: Across the Spider-Verse',
        'The Dark Knight',
        'Shutter Island',
        'The Prestige',
      ][i],
      isCompleted: false,
      isStarred: i === 0,
      order: i,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),

    // 8. Draw (6 items)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `task_draw_${i}`,
      listId: 'list_draw',
      title: [
        'Character facial anatomy study',
        'Perspective landscape sketch',
        'Isometric app icon set',
        'Sci-Fi mech lineart',
        'Color theory watercolor practice',
        'Digital oil portrait render',
      ][i],
      isCompleted: false,
      isStarred: i === 0,
      order: i,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
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

    const decompressed = LZString.decompressFromUTF16(raw);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
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
