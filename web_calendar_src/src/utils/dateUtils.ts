import { CalendarEvent, RecurrenceRule } from '../types/calendar';

export function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function formatDateToYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = padZero(date.getMonth() + 1);
  const d = padZero(date.getDate());
  return `${y}-${m}-${d}`;
}

export function parseYYYYMMDD(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function addDays(date: Date, days: number): Date {
  const res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}

export function subDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

export function addMonths(date: Date, months: number): Date {
  const res = new Date(date);
  res.setMonth(res.getMonth() + months);
  return res;
}

export function subMonths(date: Date, months: number): Date {
  return addMonths(date, -months);
}

export function addYears(date: Date, years: number): Date {
  const res = new Date(date);
  res.setFullYear(res.getFullYear() + years);
  return res;
}

export function getWeekStart(date: Date, startWeekOn: 0 | 1 | 6 = 0): Date {
  const res = new Date(date);
  res.setHours(0, 0, 0, 0);
  const day = res.getDay();
  let diff = day - startWeekOn;
  if (diff < 0) diff += 7;
  res.setDate(res.getDate() - diff);
  return res;
}

export function getWeekDays(startDate: Date, numDays: number = 7, startWeekOn: 0 | 1 | 6 = 0): Date[] {
  const start = numDays === 7 ? getWeekStart(startDate, startWeekOn) : new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const days: Date[] = [];
  for (let i = 0; i < numDays; i++) {
    days.push(addDays(start, i));
  }
  return days;
}

export function getMonthDays(date: Date, startWeekOn: 0 | 1 | 6 = 0): Date[][] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOfFirstWeek = getWeekStart(firstDay, startWeekOn);
  
  const weeks: Date[][] = [];
  let current = new Date(startOfFirstWeek);

  // Generate 5 or 6 weeks (Google Calendar shows 5 or 6 rows)
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(current));
      current = addDays(current, 1);
    }
    weeks.push(week);
    // If the next week starts in the next month and we already rendered at least 5 rows, break
    if (w >= 4 && current.getMonth() !== month) {
      break;
    }
  }
  return weeks;
}

export function formatTimeDisplay(timeStr?: string, timeFormat: '12h' | '24h' = '12h'): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);

  if (timeFormat === '24h') {
    return `${padZero(h)}:${padZero(m)}`;
  }

  const period = h >= 12 ? 'pm' : 'am';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${displayHour} ${period}` : `${displayHour}:${padZero(m)} ${period}`;
}

export function getDayHours(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

export function getMinutesFromTimeStr(timeStr?: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function getTimeStrFromMinutes(minutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(minutes)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${padZero(h)}:${padZero(m)}`;
}

export function snapTo15Minutes(minutes: number): number {
  return Math.round(minutes / 15) * 15;
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Calculates side-by-side layout for overlapping events in Day / Week views
 */
export interface PositionedEvent {
  event: CalendarEvent;
  topPercent: number;
  heightPercent: number;
  leftPercent: number;
  widthPercent: number;
}

export function calculateEventPositions(events: CalendarEvent[]): PositionedEvent[] {
  const timedEvents = events.filter(e => !e.isAllDay && e.startTime && e.endTime);
  if (timedEvents.length === 0) return [];

  const parsed = timedEvents.map(e => {
    const startMins = getMinutesFromTimeStr(e.startTime);
    let endMins = getMinutesFromTimeStr(e.endTime);
    if (endMins <= startMins) endMins = startMins + 30; // minimum duration visual
    return {
      event: e,
      startMins,
      endMins,
      colIndex: 0,
      totalCols: 1,
    };
  }).sort((a, b) => a.startMins - b.startMins || (b.endMins - b.startMins) - (a.endMins - a.startMins));

  type ParsedItem = (typeof parsed)[0];

  // Build overlap clusters
  const clusters: ParsedItem[][] = [];
  let currentCluster: ParsedItem[] = [];
  let clusterEnd = 0;

  for (const item of parsed) {
    if (currentCluster.length === 0) {
      currentCluster.push(item);
      clusterEnd = item.endMins;
    } else if (item.startMins < clusterEnd) {
      currentCluster.push(item);
      clusterEnd = Math.max(clusterEnd, item.endMins);
    } else {
      clusters.push(currentCluster);
      currentCluster = [item];
      clusterEnd = item.endMins;
    }
  }
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  const result: PositionedEvent[] = [];

  for (const cluster of clusters) {
    // Greedy column assignment
    const columns: ParsedItem[][] = [];
    for (const item of cluster) {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const lastInCol = columns[i][columns[i].length - 1];
        if (lastInCol.endMins <= item.startMins) {
          columns[i].push(item);
          item.colIndex = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([item]);
        item.colIndex = columns.length - 1;
      }
    }

    const totalCols = columns.length;
    for (const item of cluster) {
      const topPercent = (item.startMins / (24 * 60)) * 100;
      const durationMins = Math.max(20, item.endMins - item.startMins);
      const heightPercent = (durationMins / (24 * 60)) * 100;
      const leftPercent = (item.colIndex / totalCols) * 100;
      const widthPercent = (1 / totalCols) * 100;

      result.push({
        event: item.event,
        topPercent,
        heightPercent,
        leftPercent,
        widthPercent,
      });
    }
  }

  return result;
}

/**
 * Expands recurring events within the target date range
 */
export function expandRecurringEvents(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  const result: CalendarEvent[] = [];
  const rangeStartStr = formatDateToYYYYMMDD(rangeStart);
  const rangeEndStr = formatDateToYYYYMMDD(rangeEnd);

  for (const event of events) {
    if (event.deletedAt) continue;

    if (!event.recurrence || event.recurrence.frequency === 'none') {
      if (event.startDate <= rangeEndStr && event.endDate >= rangeStartStr) {
        result.push(event);
      }
      continue;
    }

    // Expand recurrence
    const r = event.recurrence;
    const baseStart = parseYYYYMMDD(event.startDate);
    const durationDays = Math.max(0, (parseYYYYMMDD(event.endDate).getTime() - baseStart.getTime()) / 86400000);

    let current = new Date(baseStart);
    let occurrences = 0;
    const maxSafety = 730; // Max 2 years expansion window

    while (occurrences < maxSafety) {
      const curStr = formatDateToYYYYMMDD(current);

      if (curStr > rangeEndStr) break;

      // Check end conditions
      if (r.ends?.type === 'on_date' && r.ends.date && curStr > r.ends.date) break;
      if (r.ends?.type === 'after_occurrences' && r.ends.occurrences && occurrences >= r.ends.occurrences) break;

      // Check frequency matches
      let matches = false;
      if (r.frequency === 'daily') {
        matches = true;
      } else if (r.frequency === 'every_weekday') {
        const d = current.getDay();
        matches = d >= 1 && d <= 5;
      } else if (r.frequency === 'weekly') {
        if (r.weekdays && r.weekdays.length > 0) {
          matches = r.weekdays.includes(current.getDay());
        } else {
          matches = current.getDay() === baseStart.getDay();
        }
      } else if (r.frequency === 'monthly') {
        matches = current.getDate() === baseStart.getDate();
      } else if (r.frequency === 'yearly') {
        matches = current.getDate() === baseStart.getDate() && current.getMonth() === baseStart.getMonth();
      } else if (r.frequency === 'custom') {
        const interval = r.interval || 1;
        matches = true; // Handled by interval step
      }

      if (matches && curStr >= event.startDate && curStr <= rangeEndStr) {
        const curEnd = addDays(current, durationDays);
        result.push({
          ...event,
          id: `${event.id}_inst_${curStr}`,
          recurringEventId: event.id,
          startDate: curStr,
          endDate: formatDateToYYYYMMDD(curEnd),
        });
      }

      occurrences++;

      // Advance
      if (r.frequency === 'daily' || r.frequency === 'every_weekday') {
        current = addDays(current, 1);
      } else if (r.frequency === 'weekly') {
        current = addDays(current, 1); // check each day of week
      } else if (r.frequency === 'monthly') {
        current = addMonths(current, 1);
      } else if (r.frequency === 'yearly') {
        current = addYears(current, 1);
      } else {
        current = addDays(current, r.interval || 1);
      }
    }
  }

  return result;
}

/**
 * Generates an iCalendar (.ics) string for export
 */
export function exportEventsToICS(events: CalendarEvent[]): string {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Chronos Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const e of events) {
    if (e.deletedAt) continue;
    ics.push('BEGIN:VEVENT');
    ics.push(`UID:${e.id}@chronos.calendar`);
    ics.push(`SUMMARY:${e.title.replace(/[,;]/g, '\\$&')}`);
    if (e.description) ics.push(`DESCRIPTION:${e.description.replace(/(\r\n|\n|\r)/gm, '\\n')}`);
    if (e.location) ics.push(`LOCATION:${e.location}`);

    const startClean = e.startDate.replace(/-/g, '');
    const endClean = e.endDate.replace(/-/g, '');

    if (e.isAllDay) {
      ics.push(`DTSTART;VALUE=DATE:${startClean}`);
      ics.push(`DTEND;VALUE=DATE:${endClean}`);
    } else {
      const startT = (e.startTime || '09:00').replace(':', '') + '00';
      const endT = (e.endTime || '10:00').replace(':', '') + '00';
      ics.push(`DTSTART:${startClean}T${startT}`);
      ics.push(`DTEND:${endClean}T${endT}`);
    }
    ics.push('END:VEVENT');
  }

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

/**
 * Parses basic iCalendar (.ics) text content
 */
export function parseICSContent(icsText: string, defaultCalendarId: string = 'cal_my_calendar'): Partial<CalendarEvent>[] {
  const events: Partial<CalendarEvent>[] = [];
  const lines = icsText.split(/\r\n|\n|\r/);
  let inEvent = false;
  let current: Partial<CalendarEvent> = {};

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      current = {
        calendarId: defaultCalendarId,
        type: 'event',
        isAllDay: false,
      };
    } else if (line.startsWith('END:VEVENT')) {
      if (current.title && current.startDate) {
        if (!current.endDate) current.endDate = current.startDate;
        events.push(current);
      }
      inEvent = false;
      current = {};
    } else if (inEvent) {
      if (line.startsWith('SUMMARY:')) {
        current.title = line.substring(8).replace(/\\,/g, ',');
      } else if (line.startsWith('DESCRIPTION:')) {
        current.description = line.substring(12).replace(/\\n/g, '\n');
      } else if (line.startsWith('LOCATION:')) {
        current.location = line.substring(9);
      } else if (line.startsWith('DTSTART')) {
        const val = line.split(':').pop() || '';
        if (val.length >= 8) {
          const y = val.substring(0, 4);
          const m = val.substring(4, 6);
          const d = val.substring(6, 8);
          current.startDate = `${y}-${m}-${d}`;
          if (val.includes('T') && val.length >= 13) {
            const h = val.substring(9, 11);
            const min = val.substring(11, 13);
            current.startTime = `${h}:${min}`;
          } else {
            current.isAllDay = true;
          }
        }
      } else if (line.startsWith('DTEND')) {
        const val = line.split(':').pop() || '';
        if (val.length >= 8) {
          const y = val.substring(0, 4);
          const m = val.substring(4, 6);
          const d = val.substring(6, 8);
          current.endDate = `${y}-${m}-${d}`;
          if (val.includes('T') && val.length >= 13) {
            const h = val.substring(9, 11);
            const min = val.substring(11, 13);
            current.endTime = `${h}:${min}`;
          }
        }
      }
    }
  }

  return events;
}

/**
 * Parses CSV format calendar events (e.g. Google Calendar / Outlook CSV export)
 * Supports columns: Subject/Title, Start Date, Start Time, End Date, End Time, All Day, Description, Location
 */
export function parseCSVContent(csvText: string, defaultCalendarId: string = 'cal_my_calendar'): Partial<CalendarEvent>[] {
  const lines = csvText.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = parseCSVRow(headerLine).map(h => h.trim().toLowerCase());

  const getColIdx = (aliases: string[]) => headers.findIndex(h => aliases.some(a => h.includes(a)));

  const titleIdx = getColIdx(['subject', 'title', 'summary', 'name']);
  const startDateIdx = getColIdx(['start date', 'start_date', 'startdate', 'start']);
  const startTimeIdx = getColIdx(['start time', 'start_time', 'starttime']);
  const endDateIdx = getColIdx(['end date', 'end_date', 'enddate', 'end']);
  const endTimeIdx = getColIdx(['end time', 'end_time', 'endtime']);
  const allDayIdx = getColIdx(['all day', 'allday', 'all_day']);
  const descIdx = getColIdx(['description', 'desc', 'notes', 'details']);
  const locIdx = getColIdx(['location', 'where', 'place']);

  const events: Partial<CalendarEvent>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVRow(lines[i]);
    if (row.length === 0) continue;

    const title = titleIdx >= 0 && row[titleIdx] ? row[titleIdx].trim() : `Event ${i}`;
    let startDate = startDateIdx >= 0 && row[startDateIdx] ? normalizeDateStr(row[startDateIdx]) : '';
    let endDate = endDateIdx >= 0 && row[endDateIdx] ? normalizeDateStr(row[endDateIdx]) : startDate;
    let startTime = startTimeIdx >= 0 && row[startTimeIdx] ? normalizeTimeStr(row[startTimeIdx]) : undefined;
    let endTime = endTimeIdx >= 0 && row[endTimeIdx] ? normalizeTimeStr(row[endTimeIdx]) : undefined;
    const isAllDay = allDayIdx >= 0 ? ['true', 'yes', '1', 'y'].includes(row[allDayIdx]?.toLowerCase().trim()) : !startTime;
    const description = descIdx >= 0 ? row[descIdx]?.trim() : '';
    const location = locIdx >= 0 ? row[locIdx]?.trim() : '';

    if (!startDate) {
      startDate = formatDateToYYYYMMDD(new Date());
      endDate = startDate;
    }

    events.push({
      calendarId: defaultCalendarId,
      type: 'event',
      title,
      startDate,
      endDate: endDate || startDate,
      startTime: isAllDay ? undefined : (startTime || '10:00'),
      endTime: isAllDay ? undefined : (endTime || '11:00'),
      isAllDay,
      description,
      location,
    });
  }

  return events;
}

function parseCSVRow(rowStr: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < rowStr.length; i++) {
    const char = rowStr[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(s => s.replace(/^["']|["']$/g, ''));
}

function normalizeDateStr(val: string): string {
  val = val.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  // If MM/DD/YYYY or DD/MM/YYYY
  const parts = val.split(/[/-]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return formatDateToYYYYMMDD(new Date());
}

function normalizeTimeStr(val: string): string {
  val = val.trim().toLowerCase();
  const match = val.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2];
    const ampm = match[3];
    if (ampm === 'pm' && h < 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
  }
  return '10:00';
}
