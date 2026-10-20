import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { TimeGrid } from './TimeGrid';

export const DayView: React.FC = () => {
  const { currentDate } = useCalendar();
  return <TimeGrid days={[currentDate]} numDays={1} />;
};
