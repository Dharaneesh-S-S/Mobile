import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { addDays } from '../../utils/dateUtils';
import { TimeGrid } from './TimeGrid';

export const FourDayView: React.FC = () => {
  const { currentDate } = useCalendar();
  const days = [0, 1, 2, 3].map(offset => addDays(currentDate, offset));

  return <TimeGrid days={days} numDays={4} />;
};
