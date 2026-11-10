import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { addDays } from '../../utils/dateUtils';
import { TimeGrid } from './TimeGrid';

export const ThreeDayView: React.FC = () => {
  const { currentDate } = useCalendar();
  const days = [currentDate, addDays(currentDate, 1), addDays(currentDate, 2)];

  return <TimeGrid days={days} numDays={3} />;
};
