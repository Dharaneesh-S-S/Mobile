import { RecurrenceRule } from '../types/tasks';

export function formatDateToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseYYYYMMDD(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isToday(dateStr: string): boolean {
  return dateStr === formatDateToYYYYMMDD(new Date());
}

export function isTomorrow(dateStr: string): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return dateStr === formatDateToYYYYMMDD(tomorrow);
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === formatDateToYYYYMMDD(yesterday);
}

export function isOverdue(dateStr?: string, timeStr?: string): boolean {
  if (!dateStr) return false;
  const now = new Date();
  const todayStr = formatDateToYYYYMMDD(now);

  if (dateStr < todayStr) return true;
  if (dateStr > todayStr) return false;

  // Same day: if time is set, compare hour & minute
  if (timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const taskTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    return taskTime.getTime() < now.getTime();
  }

  return false;
}

export function formatTime(timeStr?: string, format: '12h' | '24h' = '12h'): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  if (format === '24h') {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatDateChip(dateStr?: string, timeStr?: string, timeFormat: '12h' | '24h' = '12h'): string {
  if (!dateStr) return '';
  
  let label = '';
  if (isToday(dateStr)) {
    label = 'Today';
  } else if (isTomorrow(dateStr)) {
    label = 'Tomorrow';
  } else if (isYesterday(dateStr)) {
    label = 'Yesterday';
  } else {
    const d = parseYYYYMMDD(dateStr);
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const monthName = d.toLocaleDateString(undefined, { month: 'short' });
    const dayNum = d.getDate();
    const currentYear = new Date().getFullYear();
    if (d.getFullYear() === currentYear) {
      label = `${dayName}, ${monthName} ${dayNum}`;
    } else {
      label = `${dayName}, ${monthName} ${dayNum}, ${d.getFullYear()}`;
    }
  }

  if (timeStr) {
    label += `, ${formatTime(timeStr, timeFormat)}`;
  }
  return label;
}

export function formatRelativeDate(
  dateStr?: string,
  timeStr?: string,
  timeFormat: '12h' | '24h' = '12h'
): { text: string; isOverdue: boolean } {
  if (!dateStr) return { text: '', isOverdue: false };
  const now = new Date();
  const todayStr = formatDateToYYYYMMDD(now);
  const target = parseYYYYMMDD(dateStr);
  const diffTime = target.getTime() - parseYYYYMMDD(todayStr).getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const overdue = isOverdue(dateStr, timeStr);

  let text = '';
  if (diffDays === 0) {
    text = timeStr ? `Today, ${formatTime(timeStr, timeFormat)}` : 'Today';
  } else if (diffDays === 1) {
    text = timeStr ? `Tomorrow, ${formatTime(timeStr, timeFormat)}` : 'Tomorrow';
  } else if (diffDays === -1) {
    text = timeStr ? `Yesterday, ${formatTime(timeStr, timeFormat)}` : 'Yesterday';
  } else if (diffDays < -1) {
    const daysAgo = Math.abs(diffDays);
    if (daysAgo < 7) {
      text = `${daysAgo} days ago`;
    } else if (daysAgo < 30) {
      const weeks = Math.round(daysAgo / 7);
      text = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.round(daysAgo / 30);
      text = `${months} month${months > 1 ? 's' : ''} ago`;
    }
  } else {
    if (diffDays < 7) {
      const dayName = target.toLocaleDateString(undefined, { weekday: 'short' });
      text = timeStr ? `${dayName}, ${formatTime(timeStr, timeFormat)}` : dayName;
    } else {
      const monthName = target.toLocaleDateString(undefined, { month: 'short' });
      text = `${monthName} ${target.getDate()}`;
    }
  }

  return { text, isOverdue: overdue };
}

export function calculateNextRecurrenceDate(currentDateStr: string, rule: RecurrenceRule): string | null {
  if (rule.frequency === 'none') return null;

  // Check end conditions
  if (rule.endType === 'after_count' && rule.endCount !== undefined && rule.countProgress !== undefined) {
    if (rule.countProgress >= rule.endCount) return null;
  }

  const current = parseYYYYMMDD(currentDateStr);
  const next = new Date(current);

  const interval = Math.max(1, rule.interval || 1);

  switch (rule.frequency) {
    case 'daily':
      next.setDate(next.getDate() + interval);
      break;

    case 'weekly':
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        // Find next day of week in list
        let found = false;
        const curDay = next.getDay();
        const sortedDays = [...rule.daysOfWeek].sort((a, b) => a - b);
        for (const targetDay of sortedDays) {
          if (targetDay > curDay) {
            next.setDate(next.getDate() + (targetDay - curDay));
            found = true;
            break;
          }
        }
        if (!found) {
          // Wrap around to first day in next interval cycle
          const firstDay = sortedDays[0];
          const daysToAdd = (7 - curDay) + firstDay + (interval - 1) * 7;
          next.setDate(next.getDate() + daysToAdd);
        }
      } else {
        next.setDate(next.getDate() + interval * 7);
      }
      break;

    case 'monthly':
      next.setMonth(next.getMonth() + interval);
      break;

    case 'yearly':
      next.setFullYear(next.getFullYear() + interval);
      break;

    case 'custom':
      next.setDate(next.getDate() + interval);
      break;

    default:
      return null;
  }

  const nextStr = formatDateToYYYYMMDD(next);

  if (rule.endType === 'on_date' && rule.endDate && nextStr > rule.endDate) {
    return null;
  }

  return nextStr;
}
