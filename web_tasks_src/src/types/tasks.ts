export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type RecurrenceEndType = 'never' | 'on_date' | 'after_count';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number; // Every N days/weeks/months/years
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  endType: RecurrenceEndType;
  endDate?: string; // YYYY-MM-DD
  endCount?: number;
  countProgress?: number;
}

export interface Subtask {
  id: string;
  parentId: string;
  title: string;
  details?: string;
  isCompleted: boolean;
  completedAt?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  isStarred: boolean;
  order: number;
  createdAt: string;
}

export interface Task {
  id: string;
  listId: string;
  title: string;
  details?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm (e.g. "17:00")
  isCompleted: boolean;
  completedAt?: string;
  isStarred: boolean;
  starredAt?: string;
  subtasks: Subtask[];
  isSubtasksCollapsed?: boolean;
  recurrence?: RecurrenceRule;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'order' | 'date' | 'starred' | 'title';

export interface TaskList {
  id: string;
  name: string;
  isDefault?: boolean;
  sortOrder: SortOption;
  showCompleted: boolean;
  order: number;
  color?: string;
  createdAt: string;
}

export type LayoutMode = 'sidepanel' | 'fullscreen' | 'mobile';

export interface TaskSettings {
  theme: 'light' | 'dark' | 'system';
  defaultListId: string;
  startOfWeek: 0 | 1 | 6; // 0=Sun, 1=Mon, 6=Sat
  timeFormat: '12h' | '24h';
  defaultSortOrder: SortOption;
  showCompletedDefault: boolean;
  notificationsEnabled: boolean;
  density: 'compact' | 'comfortable';
}

export interface ToastMessage {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
  durationMs?: number;
}
