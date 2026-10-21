import {
  formatDateToYYYYMMDD,
  parseYYYYMMDD,
  isToday,
  isTomorrow,
  isYesterday,
  isOverdue,
  formatDateChip,
  calculateNextRecurrenceDate,
} from '../utils/dateHelpers';
import { RecurrenceRule, Task } from '../types/tasks';

export function runAllUnitTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, msg: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      errors.push(msg);
      console.error(`FAIL: ${msg}`);
    }
  }

  // 1. Date formatting & parsing
  const d = new Date(2026, 9, 20); // Oct 20, 2026
  assert(formatDateToYYYYMMDD(d) === '2026-10-20', 'formatDateToYYYYMMDD should format YYYY-MM-DD');

  const parsed = parseYYYYMMDD('2026-10-20');
  assert(parsed.getFullYear() === 2026 && parsed.getMonth() === 9 && parsed.getDate() === 20, 'parseYYYYMMDD should parse date correctly');

  // 2. Today, Tomorrow, Yesterday
  const now = new Date();
  const todayStr = formatDateToYYYYMMDD(now);
  assert(isToday(todayStr), 'isToday should return true for current date');

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  assert(isTomorrow(formatDateToYYYYMMDD(tomorrow)), 'isTomorrow should return true for tomorrow');

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  assert(isYesterday(formatDateToYYYYMMDD(yesterday)), 'isYesterday should return true for yesterday');

  // 3. Overdue check
  assert(isOverdue(formatDateToYYYYMMDD(yesterday)), 'Yesterday should be overdue');
  assert(!isOverdue(formatDateToYYYYMMDD(tomorrow)), 'Tomorrow should not be overdue');

  // 4. Date chip formatting
  assert(formatDateChip(todayStr).startsWith('Today'), 'Date chip should format Today');

  // 5. Recurrence Generation
  const dailyRule: RecurrenceRule = { frequency: 'daily', interval: 1, endType: 'never' };
  const nextDaily = calculateNextRecurrenceDate('2026-10-20', dailyRule);
  assert(nextDaily === '2026-10-21', 'Daily recurrence should advance by 1 day');

  const weeklyRule: RecurrenceRule = { frequency: 'weekly', interval: 1, endType: 'never' };
  const nextWeekly = calculateNextRecurrenceDate('2026-10-20', weeklyRule);
  assert(nextWeekly === '2026-10-27', 'Weekly recurrence should advance by 7 days');

  const monthlyRule: RecurrenceRule = { frequency: 'monthly', interval: 1, endType: 'never' };
  const nextMonthly = calculateNextRecurrenceDate('2026-10-20', monthlyRule);
  assert(nextMonthly === '2026-11-20', 'Monthly recurrence should advance by 1 month');

  // 6. Recurrence End condition
  const endedRule: RecurrenceRule = {
    frequency: 'daily',
    interval: 1,
    endType: 'after_count',
    endCount: 3,
    countProgress: 3,
  };
  assert(calculateNextRecurrenceDate('2026-10-20', endedRule) === null, 'Completed recurrence count should return null');

  // 7. Sorting tests
  const tasks: Task[] = [
    { id: '1', listId: 'a', title: 'Beta', order: 2, isCompleted: false, isStarred: false, subtasks: [], createdAt: '', updatedAt: '' },
    { id: '2', listId: 'a', title: 'Alpha', order: 1, isCompleted: false, isStarred: true, subtasks: [], createdAt: '', updatedAt: '' },
  ];

  const sortedByTitle = [...tasks].sort((a, b) => a.title.localeCompare(b.title));
  assert(sortedByTitle[0].title === 'Alpha', 'Title sort should be alphabetical');

  const sortedByStarred = [...tasks].sort((a, b) => (b.isStarred ? 1 : 0) - (a.isStarred ? 1 : 0));
  assert(sortedByStarred[0].id === '2', 'Starred sort should put starred items first');

  return { passed, failed, errors };
}
