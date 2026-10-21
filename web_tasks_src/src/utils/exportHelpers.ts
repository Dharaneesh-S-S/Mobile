import { Task, TaskList } from '../types/tasks';

export function exportTasksAsJson(tasks: Task[], lists: TaskList[]): void {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    lists,
    tasks,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `zenith_tasks_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTasksAsCsv(tasks: Task[], lists: TaskList[]): void {
  const listMap = new Map(lists.map(l => [l.id, l.name]));
  const headers = [
    'Task ID',
    'List Name',
    'Title',
    'Details',
    'Due Date',
    'Due Time',
    'Completed',
    'Starred',
    'Subtask Count',
    'Created At',
  ];

  const rows = tasks.map(t => [
    `"${t.id}"`,
    `"${(listMap.get(t.listId) || 'Unknown').replace(/"/g, '""')}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${(t.details || '').replace(/"/g, '""')}"`,
    `"${t.dueDate || ''}"`,
    `"${t.dueTime || ''}"`,
    t.isCompleted ? 'TRUE' : 'FALSE',
    t.isStarred ? 'TRUE' : 'FALSE',
    t.subtasks.length,
    `"${t.createdAt}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `zenith_tasks_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importTasksFromJson(jsonString: string): { tasks: Task[]; lists: TaskList[] } | null {
  try {
    const data = JSON.parse(jsonString);
    if (!data || !Array.isArray(data.tasks)) {
      throw new Error('Invalid backup file format.');
    }
    return {
      tasks: data.tasks as Task[],
      lists: Array.isArray(data.lists) && data.lists.length > 0 ? (data.lists as TaskList[]) : [],
    };
  } catch (err) {
    console.error('Failed to import tasks:', err);
    return null;
  }
}
