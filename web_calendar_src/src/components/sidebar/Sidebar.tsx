import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { CreateMenu } from './CreateMenu';
import { MiniCalendar } from './MiniCalendar';
import { PeopleSearch } from './PeopleSearch';
import { AppointmentSchedulesList } from './AppointmentSchedulesList';
import { WorldClock } from './WorldClock';
import { CalendarList } from './CalendarList';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useCalendar();
  const [peopleOpen, setPeopleOpen] = React.useState(true);
  const [appointmentsOpen, setAppointmentsOpen] = React.useState(true);

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="w-64 md:w-68 flex-shrink-0 h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto overflow-x-hidden flex flex-col select-none transition-all z-20">
      {/* Create Button with dropdown */}
      <CreateMenu />

      {/* Mini month calendar */}
      <MiniCalendar />

      <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

      {/* Search for people (mock contacts with overlay toggle) */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => setPeopleOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <span>People & Colleagues</span>
          {peopleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        {peopleOpen && <PeopleSearch />}
      </div>

      <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

      {/* Appointment schedules / booking pages list */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => setAppointmentsOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <span>Booking Schedules</span>
          {appointmentsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        {appointmentsOpen && <AppointmentSchedulesList />}
      </div>

      {/* World Clock (if enabled in Settings) */}
      <WorldClock />

      <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

      {/* My calendars & Other calendars */}
      <div className="flex-1 pb-6">
        <CalendarList />
      </div>
    </aside>
  );
};
