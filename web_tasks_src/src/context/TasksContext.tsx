import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  TaskList,
  Subtask,
  TaskSettings,
  SortOption,
  LayoutMode,
  ToastMessage,
} from '../types/tasks';
import {
  loadTasks,
  saveTasks,
  loadLists,
  saveLists,
  loadSettings,
  saveSettings,
  resetDemoData,
  clearAllData,
} from '../storage/taskStorage';
import { calculateNextRecurrenceDate, formatDateToYYYYMMDD, isOverdue } from '../utils/dateHelpers';

interface TasksContextType {
  lists: TaskList[];
  activeListId: string;
  setActiveListId: (id: string) => void;
  tasks: Task[];
  settings: TaskSettings;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLayoutMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTaskIds: Set<string>;
  toggleSelectTask: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  isAddingTask: boolean;
  setIsAddingTask: (val: boolean) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  visibleListIds: Set<string>;
  toggleListVisibility: (listId: string) => void;
  showAllLists: () => void;
  activeNavTab: 'all' | 'starred';
  setActiveNavTab: (tab: 'all' | 'starred') => void;
  inlineAddingListId: string | null;
  setInlineAddingListId: (val: string | null) => void;
  moveTaskToAnotherList: (taskId: string, targetListId: string, overTaskId?: string) => void;

  toasts: ToastMessage[];
  showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
  removeToast: (id: string) => void;

  // Modals
  showShortcutsHelp: boolean;
  setShowShortcutsHelp: (val: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (val: boolean) => void;
  showCreateListModal: boolean;
  setShowCreateListModal: (val: boolean) => void;
  listToRename: TaskList | null;
  setListToRename: (list: TaskList | null) => void;
  listToDelete: TaskList | null;
  setListToDelete: (list: TaskList | null) => void;
  showDeleteCompletedModal: boolean;
  setShowDeleteCompletedModal: (val: boolean) => void;

  // Task Actions
  createTask: (title: string, listId?: string, dueDate?: string, dueTime?: string) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string, showToast?: boolean) => void;
  toggleTaskComplete: (taskId: string) => void;
  toggleTaskStar: (taskId: string) => void;
  reorderTasks: (activeId: string, overId: string) => void;
  moveTaskPosition: (taskId: string, direction: 'up' | 'down') => void;
  moveTaskToList: (taskId: string, targetListId: string) => void;

  // Subtasks
  addSubtask: (parentTaskId: string, title: string) => void;
  updateSubtask: (parentTaskId: string, subtask: Subtask) => void;
  deleteSubtask: (parentTaskId: string, subtaskId: string) => void;
  toggleSubtaskComplete: (parentTaskId: string, subtaskId: string) => void;
  toggleSubtasksCollapse: (parentTaskId: string) => void;

  // Lists Actions
  createList: (name: string) => TaskList;
  renameList: (listId: string, newName: string) => void;
  deleteList: (listId: string) => void;
  reorderLists: (activeListId: string, overListId: string) => void;
  deleteCompletedTasks: (listId: string) => void;
  setListSort: (listId: string, sort: SortOption) => void;
  toggleListShowCompleted: (listId: string) => void;

  // Bulk Actions
  bulkStar: (starred: boolean) => void;
  bulkComplete: (completed: boolean) => void;
  bulkDelete: () => void;
  bulkMove: (targetListId: string) => void;

  // Settings & Utilities
  updateSettings: (partial: Partial<TaskSettings>) => void;
  resetToDemo: () => void;
  clearAll: () => void;
  activeList: TaskList | undefined;
  starredTasksCount: number;
  todayTasksCount: number;
  overdueTasksCount: number;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<TaskList[]>(() => loadLists());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [settings, setSettings] = useState<TaskSettings>(() => loadSettings());
  const [activeListId, setActiveListId] = useState<string>('list_default');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('fullscreen');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<'all' | 'starred'>('all');
  const [visibleListIds, setVisibleListIds] = useState<Set<string>>(() => new Set(loadLists().map(l => l.id)));
  const [inlineAddingListId, setInlineAddingListId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [listToRename, setListToRename] = useState<TaskList | null>(null);
  const [listToDelete, setListToDelete] = useState<TaskList | null>(null);
  const [showDeleteCompletedModal, setShowDeleteCompletedModal] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const toggleListVisibility = useCallback((listId: string) => {
    setVisibleListIds(prev => {
      const next = new Set(prev);
      if (next.has(listId)) {
        if (next.size > 1) {
          next.delete(listId);
        }
      } else {
        next.add(listId);
      }
      return next;
    });
  }, []);

  const showAllLists = useCallback(() => {
    setVisibleListIds(new Set(lists.map(l => l.id)));
  }, [lists]);

  const moveTaskToAnotherList = useCallback((taskId: string, targetListId: string, overTaskId?: string) => {
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;
      const targetTasks = prev.filter(t => t.listId === targetListId && t.id !== taskId);
      let targetOrder = 0;
      if (overTaskId) {
        const overTask = prev.find(t => t.id === overTaskId);
        if (overTask) {
          targetOrder = overTask.order;
        }
      } else if (targetTasks.length > 0) {
        targetOrder = Math.max(...targetTasks.map(t => t.order)) + 1;
      }
      return prev.map(t => (t.id === taskId ? { ...t, listId: targetListId, order: targetOrder, updatedAt: new Date().toISOString() } : t));
    });
  }, []);

  // Auto-detect responsive layout mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setLayoutMode('mobile');
      } else if (window.innerWidth > 1024 && layoutMode !== 'fullscreen') {
        // keep current or default to fullscreen if wide
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save changes to localStorage with compression
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveLists(lists);
  }, [lists]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Notification reminder check
  useEffect(() => {
    if (!settings.notificationsEnabled) return;
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = formatDateToYYYYMMDD(now);
      const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      tasks.forEach(t => {
        if (!t.isCompleted && t.dueDate === todayStr && t.dueTime === currentTimeStr) {
          // Trigger browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Task Reminder: ${t.title}`, {
              body: t.details || 'Your scheduled task is due now.',
              icon: '/favicon.png',
            });
          }
          // In-app toast
          showToast(`Reminder: ${t.title}`);
        }
      });
    }, 45000); // Check every 45s

    return () => clearInterval(interval);
  }, [tasks, settings.notificationsEnabled]);

  const showToast = useCallback((message: string, actionLabel?: string, onAction?: () => void) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, actionLabel, onAction, durationMs: 5000 }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleLayoutMode = useCallback(() => {
    setLayoutMode(prev => (prev === 'fullscreen' ? 'sidepanel' : 'fullscreen'));
  }, []);

  // Active list lookup
  const activeList = useMemo(() => {
    return lists.find(l => l.id === activeListId);
  }, [lists, activeListId]);

  // Counts
  const starredTasksCount = useMemo(() => {
    return tasks.filter(t => !t.isCompleted && t.isStarred).length;
  }, [tasks]);

  const todayTasksCount = useMemo(() => {
    const today = formatDateToYYYYMMDD(new Date());
    return tasks.filter(t => !t.isCompleted && t.dueDate === today).length;
  }, [tasks]);

  const overdueTasksCount = useMemo(() => {
    return tasks.filter(t => !t.isCompleted && isOverdue(t.dueDate, t.dueTime)).length;
  }, [tasks]);

  // Task creation
  const createTask = useCallback(
    (title: string, listId?: string, dueDate?: string, dueTime?: string): Task => {
      const targetListId =
        listId || (activeListId !== 'starred' && activeListId !== 'calendar' ? activeListId : settings.defaultListId);

      const targetTasks = tasks.filter(t => t.listId === targetListId);
      const minOrder = targetTasks.length > 0 ? Math.min(...targetTasks.map(t => t.order)) : 0;

      const newTask: Task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        listId: targetListId,
        title: title.trim(),
        dueDate,
        dueTime,
        isCompleted: false,
        isStarred: activeListId === 'starred',
        starredAt: activeListId === 'starred' ? new Date().toISOString() : undefined,
        subtasks: [],
        order: minOrder - 1, // Add to top
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTasks(prev => [newTask, ...prev]);
      return newTask;
    },
    [activeListId, settings.defaultListId, tasks]
  );

  const updateTask = useCallback((updated: Task) => {
    setTasks(prev =>
      prev.map(t => (t.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : t))
    );
  }, []);

  const deleteTask = useCallback(
    (taskId: string, showToastMsg: boolean = true) => {
      const taskToDelete = tasks.find(t => t.id === taskId);
      if (!taskToDelete) return;

      setTasks(prev => prev.filter(t => t.id !== taskId));
      if (editingTaskId === taskId) {
        setEditingTaskId(null);
      }

      if (showToastMsg) {
        showToast('Task deleted', 'Undo', () => {
          setTasks(prev => [taskToDelete, ...prev]);
        });
      }
    },
    [tasks, editingTaskId, showToast]
  );

  const toggleTaskComplete = useCallback(
    (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const willBeCompleted = !task.isCompleted;

      // Handle recurrence on complete
      let recurringNewTask: Task | null = null;
      if (willBeCompleted && task.recurrence && task.recurrence.frequency !== 'none' && task.dueDate) {
        const nextDate = calculateNextRecurrenceDate(task.dueDate, task.recurrence);
        if (nextDate) {
          recurringNewTask = {
            ...task,
            id: `task_${Date.now()}_rec`,
            isCompleted: false,
            completedAt: undefined,
            dueDate: nextDate,
            subtasks: task.subtasks.map(s => ({ ...s, isCompleted: false, id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      }

      // Check if all other tasks in list are complete for celebratory confetti!
      const currentListTasks = tasks.filter(t => t.listId === task.listId && t.id !== taskId);
      const areAllOthersDone = currentListTasks.every(t => t.isCompleted);
      if (willBeCompleted && areAllOthersDone && currentListTasks.length > 0) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      }

      const updatedSubtasks = willBeCompleted
        ? task.subtasks.map(s => ({ ...s, isCompleted: true, completedAt: new Date().toISOString() }))
        : task.subtasks;

      const updatedTask: Task = {
        ...task,
        isCompleted: willBeCompleted,
        completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        subtasks: updatedSubtasks,
        updatedAt: new Date().toISOString(),
      };

      setTasks(prev => {
        const newTasks = prev.map(t => (t.id === taskId ? updatedTask : t));
        return recurringNewTask ? [recurringNewTask, ...newTasks] : newTasks;
      });

      showToast(willBeCompleted ? 'Task marked complete' : 'Task restored', 'Undo', () => {
        setTasks(prev => {
          let rolledBack = prev.map(t => (t.id === taskId ? task : t));
          if (recurringNewTask) {
            rolledBack = rolledBack.filter(t => t.id !== recurringNewTask!.id);
          }
          return rolledBack;
        });
      });
    },
    [tasks, showToast]
  );

  const toggleTaskStar = useCallback((taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const isStarred = !t.isStarred;
          return {
            ...t,
            isStarred,
            starredAt: isStarred ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  }, []);

  const reorderTasks = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;

    setTasks(prev => {
      const activeIdx = prev.findIndex(t => t.id === activeId);
      const overIdx = prev.findIndex(t => t.id === overId);
      if (activeIdx === -1 || overIdx === -1) return prev;

      const newTasks = [...prev];
      const [moved] = newTasks.splice(activeIdx, 1);
      newTasks.splice(overIdx, 0, moved);

      // Reassign order indices for tasks in that list
      return newTasks.map((t, i) => ({ ...t, order: i }));
    });
  }, []);

  const moveTaskPosition = useCallback(
    (taskId: string, direction: 'up' | 'down') => {
      setTasks(prev => {
        const task = prev.find(t => t.id === taskId);
        if (!task) return prev;

        const listTasks = prev.filter(t => t.listId === task.listId && !t.isCompleted);
        const currentIndex = listTasks.findIndex(t => t.id === taskId);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= listTasks.length) return prev;

        const targetTask = listTasks[targetIndex];
        const newTasks = [...prev];
        const activeIdx = newTasks.findIndex(t => t.id === taskId);
        const overIdx = newTasks.findIndex(t => t.id === targetTask.id);

        const [moved] = newTasks.splice(activeIdx, 1);
        newTasks.splice(overIdx, 0, moved);
        return newTasks.map((t, i) => ({ ...t, order: i }));
      });
    },
    []
  );

  const moveTaskToList = useCallback(
    (taskId: string, targetListId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.listId === targetListId) return;

      const oldListId = task.listId;
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, listId: targetListId, updatedAt: new Date().toISOString() } : t))
      );

      const targetList = lists.find(l => l.id === targetListId);
      showToast(`Moved to ${targetList?.name || 'list'}`, 'Undo', () => {
        setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, listId: oldListId } : t)));
      });
    },
    [tasks, lists, showToast]
  );

  // Subtask handlers
  const addSubtask = useCallback((parentTaskId: string, title: string) => {
    if (!title.trim()) return;
    const newSub: Subtask = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      parentId: parentTaskId,
      title: title.trim(),
      isCompleted: false,
      isStarred: false,
      order: Date.now(),
      createdAt: new Date().toISOString(),
    };

    setTasks(prev =>
      prev.map(t => {
        if (t.id === parentTaskId) {
          return {
            ...t,
            subtasks: [...t.subtasks, newSub],
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  }, []);

  const updateSubtask = useCallback((parentTaskId: string, subtask: Subtask) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === parentTaskId) {
          return {
            ...t,
            subtasks: t.subtasks.map(s => (s.id === subtask.id ? subtask : s)),
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  }, []);

  const deleteSubtask = useCallback((parentTaskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === parentTaskId) {
          return {
            ...t,
            subtasks: t.subtasks.filter(s => s.id !== subtaskId),
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  }, []);

  const toggleSubtaskComplete = useCallback((parentTaskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === parentTaskId) {
          return {
            ...t,
            subtasks: t.subtasks.map(s => {
              if (s.id === subtaskId) {
                const isCompleted = !s.isCompleted;
                return {
                  ...s,
                  isCompleted,
                  completedAt: isCompleted ? new Date().toISOString() : undefined,
                };
              }
              return s;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  }, []);

  const toggleSubtasksCollapse = useCallback((parentTaskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === parentTaskId ? { ...t, isSubtasksCollapsed: !t.isSubtasksCollapsed } : t))
    );
  }, []);

  // List management
  const createList = useCallback((name: string): TaskList => {
    const newList: TaskList = {
      id: `list_${Date.now()}`,
      name: name.trim() || 'New List',
      sortOrder: 'order',
      showCompleted: false,
      order: Date.now(),
      color: '#3b82f6',
      createdAt: new Date().toISOString(),
    };
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    return newList;
  }, []);

  const renameList = useCallback((listId: string, newName: string) => {
    if (!newName.trim()) return;
    setLists(prev => prev.map(l => (l.id === listId ? { ...l, name: newName.trim() } : l)));
  }, []);

  const deleteList = useCallback(
    (listId: string) => {
      const list = lists.find(l => l.id === listId);
      if (!list || list.isDefault) return;

      const associatedTasks = tasks.filter(t => t.listId === listId);
      setLists(prev => prev.filter(l => l.id !== listId));
      setTasks(prev => prev.filter(t => t.listId !== listId));

      if (activeListId === listId) {
        setActiveListId('list_default');
      }

      showToast(`Deleted list "${list.name}"`, 'Undo', () => {
        setLists(prev => [...prev, list]);
        setTasks(prev => [...prev, ...associatedTasks]);
        setActiveListId(list.id);
      });
    },
    [lists, tasks, activeListId, showToast]
  );

  const reorderLists = useCallback((activeListId: string, overListId: string) => {
    if (activeListId === overListId) return;
    setLists(prev => {
      const activeIdx = prev.findIndex(l => l.id === activeListId);
      const overIdx = prev.findIndex(l => l.id === overListId);
      if (activeIdx === -1 || overIdx === -1) return prev;

      const newLists = [...prev];
      const [moved] = newLists.splice(activeIdx, 1);
      newLists.splice(overIdx, 0, moved);
      return newLists.map((l, i) => ({ ...l, order: i }));
    });
  }, []);

  const deleteCompletedTasks = useCallback(
    (listId: string) => {
      const targetCompleted = tasks.filter(t => t.listId === listId && t.isCompleted);
      if (targetCompleted.length === 0) return;

      setTasks(prev => prev.filter(t => !(t.listId === listId && t.isCompleted)));
      showToast(`Deleted ${targetCompleted.length} completed tasks`, 'Undo', () => {
        setTasks(prev => [...prev, ...targetCompleted]);
      });
    },
    [tasks, showToast]
  );

  const setListSort = useCallback((listId: string, sort: SortOption) => {
    setLists(prev => prev.map(l => (l.id === listId ? { ...l, sortOrder: sort } : l)));
  }, []);

  const toggleListShowCompleted = useCallback((listId: string) => {
    setLists(prev => prev.map(l => (l.id === listId ? { ...l, showCompleted: !l.showCompleted } : l)));
  }, []);

  // Selection & Bulk
  const toggleSelectTask = useCallback((id: string, multi: boolean = false) => {
    setSelectedTaskIds(prev => {
      const next = new Set(multi ? prev : []);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTaskIds(new Set());
  }, []);

  const bulkStar = useCallback(
    (starred: boolean) => {
      setTasks(prev =>
        prev.map(t => (selectedTaskIds.has(t.id) ? { ...t, isStarred: starred, starredAt: starred ? new Date().toISOString() : undefined } : t))
      );
      showToast(`Updated ${selectedTaskIds.size} tasks`);
      clearSelection();
    },
    [selectedTaskIds, showToast, clearSelection]
  );

  const bulkComplete = useCallback(
    (completed: boolean) => {
      setTasks(prev =>
        prev.map(t =>
          selectedTaskIds.has(t.id)
            ? {
                ...t,
                isCompleted: completed,
                completedAt: completed ? new Date().toISOString() : undefined,
                subtasks: t.subtasks.map(s => ({ ...s, isCompleted: completed })),
              }
            : t
        )
      );
      showToast(`${completed ? 'Completed' : 'Restored'} ${selectedTaskIds.size} tasks`);
      clearSelection();
    },
    [selectedTaskIds, showToast, clearSelection]
  );

  const bulkDelete = useCallback(() => {
    const count = selectedTaskIds.size;
    const deleted = tasks.filter(t => selectedTaskIds.has(t.id));
    setTasks(prev => prev.filter(t => !selectedTaskIds.has(t.id)));
    showToast(`Deleted ${count} tasks`, 'Undo', () => {
      setTasks(prev => [...prev, ...deleted]);
    });
    clearSelection();
  }, [selectedTaskIds, tasks, showToast, clearSelection]);

  const bulkMove = useCallback(
    (targetListId: string) => {
      const count = selectedTaskIds.size;
      setTasks(prev => prev.map(t => (selectedTaskIds.has(t.id) ? { ...t, listId: targetListId } : t)));
      const listName = lists.find(l => l.id === targetListId)?.name || 'list';
      showToast(`Moved ${count} tasks to ${listName}`);
      clearSelection();
    },
    [selectedTaskIds, lists, showToast, clearSelection]
  );

  const updateSettings = useCallback((partial: Partial<TaskSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const resetToDemo = useCallback(() => {
    const data = resetDemoData();
    setTasks(data.tasks);
    setLists(data.lists);
    setActiveListId('list_default');
    showToast('Loaded demo tasks');
  }, [showToast]);

  const clearAll = useCallback(() => {
    const data = clearAllData();
    setTasks(data.tasks);
    setLists(data.lists);
    setActiveListId('list_default');
    showToast('Cleared all tasks');
  }, [showToast]);

  return (
    <TasksContext.Provider
      value={{
        lists,
        activeListId,
        setActiveListId,
        tasks,
        settings,
        layoutMode,
        setLayoutMode,
        toggleLayoutMode,
        searchQuery,
        setSearchQuery,
        selectedTaskIds,
        toggleSelectTask,
        clearSelection,
        editingTaskId,
        setEditingTaskId,
        isAddingTask,
        setIsAddingTask,
        isSidebarCollapsed,
        toggleSidebar,
        visibleListIds,
        toggleListVisibility,
        showAllLists,
        activeNavTab,
        setActiveNavTab,
        inlineAddingListId,
        setInlineAddingListId,
        moveTaskToAnotherList,
        toasts,
        showToast,
        removeToast,

        showShortcutsHelp,
        setShowShortcutsHelp,
        showSettingsModal,
        setShowSettingsModal,
        showCreateListModal,
        setShowCreateListModal,
        listToRename,
        setListToRename,
        listToDelete,
        setListToDelete,
        showDeleteCompletedModal,
        setShowDeleteCompletedModal,

        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        toggleTaskStar,
        reorderTasks,
        moveTaskPosition,
        moveTaskToList,

        addSubtask,
        updateSubtask,
        deleteSubtask,
        toggleSubtaskComplete,
        toggleSubtasksCollapse,

        createList,
        renameList,
        deleteList,
        reorderLists,
        deleteCompletedTasks,
        setListSort,
        toggleListShowCompleted,

        bulkStar,
        bulkComplete,
        bulkDelete,
        bulkMove,

        updateSettings,
        resetToDemo,
        clearAll,
        activeList,
        starredTasksCount,
        todayTasksCount,
        overdueTasksCount,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
