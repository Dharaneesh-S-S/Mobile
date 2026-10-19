import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { getWeekDays } from '../../utils/dateUtils';
import { TimeGrid } from './TimeGrid';

export const WeekView: React.FC = () => {
  const { currentDate, settings } = useCalendar();

  const allWeekDays = getWeekDays(currentDate, 7, settings.startWeekOn || 0);

  // Filter out weekends if showWeekends is disabled
  const displayDays = settings.showWeekends
    ? allWeekDays
    : allWeekDays.filter(d => d.getDay() !== 0 && d.getDay() !== 6);

  return <TimeGrid days={displayDays} numDays={displayDays.length} />;
};
