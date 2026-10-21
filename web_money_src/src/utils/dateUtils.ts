import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  isSameDay,
  isSameMonth,
  eachDayOfInterval,
  getDay,
} from 'date-fns';
import { ViewRangeType } from '../types/money';

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

export function formatTransactionDateTime(isoString: string): {
  dateStr: string;
  timeStr: string;
  dayHeaderStr: string;
  dayNumber: string;
  weekdayStr: string;
  monthYearStr: string;
} {
  const d = typeof isoString === 'string' ? parseISO(isoString) : new Date(isoString);
  return {
    dateStr: format(d, 'dd/MM/yyyy'),
    timeStr: format(d, 'hh:mm a').toLowerCase(),
    dayHeaderStr: format(d, 'd EEEE MMMM yyyy'),
    dayNumber: format(d, 'd'),
    weekdayStr: format(d, 'EEEE'),
    monthYearStr: format(d, 'MMM yyyy'),
  };
}

export function calculateDateRange(
  currentAnchorDate: Date,
  rangeType: ViewRangeType,
  weekStartsOn: 0 | 1 = 0,
  monthStartDay: number = 1
): DateRange {
  const anchor = new Date(currentAnchorDate);

  switch (rangeType) {
    case 'day':
      return {
        start: startOfDay(anchor),
        end: endOfDay(anchor),
        label: format(anchor, 'd MMM yyyy'),
      };
    case 'week': {
      const s = startOfWeek(anchor, { weekStartsOn });
      const e = endOfWeek(anchor, { weekStartsOn });
      return {
        start: s,
        end: e,
        label: `${format(s, 'd MMM')} - ${format(e, 'd MMM yyyy')}`,
      };
    }
    case 'month': {
      if (monthStartDay === 1) {
        return {
          start: startOfMonth(anchor),
          end: endOfMonth(anchor),
          label: format(anchor, 'MMM yyyy'),
        };
      } else {
        // Custom cycle start day, e.g. 25th
        let s = new Date(anchor.getFullYear(), anchor.getMonth(), monthStartDay);
        if (anchor.getDate() < monthStartDay) {
          s = subMonths(s, 1);
        }
        const e = endOfDay(subDays(addMonths(s, 1), 1));
        return {
          start: startOfDay(s),
          end: e,
          label: `${format(s, 'd MMM')} - ${format(e, 'd MMM yyyy')}`,
        };
      }
    }
    case 'year':
      return {
        start: startOfYear(anchor),
        end: endOfYear(anchor),
        label: format(anchor, 'yyyy'),
      };
    case 'all':
      return {
        start: new Date(2000, 0, 1),
        end: new Date(2100, 11, 31),
        label: 'All Time',
      };
    case 'custom':
    default:
      return {
        start: startOfMonth(anchor),
        end: endOfMonth(anchor),
        label: format(anchor, 'MMM yyyy'),
      };
  }
}

export function shiftDate(
  currentDate: Date,
  rangeType: ViewRangeType,
  direction: 'prev' | 'next'
): Date {
  const mult = direction === 'next' ? 1 : -1;
  switch (rangeType) {
    case 'day':
      return mult === 1 ? addDays(currentDate, 1) : subDays(currentDate, 1);
    case 'week':
      return mult === 1 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1);
    case 'month':
      return mult === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
    case 'year':
      return mult === 1 ? addYears(currentDate, 1) : subYears(currentDate, 1);
    default:
      return mult === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
  }
}

export function getCalendarGridDays(
  monthDate: Date,
  weekStartsOn: 0 | 1 = 0
): { date: Date; isCurrentMonth: boolean; isToday: boolean; dayNumber: number }[] {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn });
  const today = new Date();

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  return days.map((d) => ({
    date: d,
    isCurrentMonth: isSameMonth(d, monthDate),
    isToday: isSameDay(d, today),
    dayNumber: d.getDate(),
  }));
}
