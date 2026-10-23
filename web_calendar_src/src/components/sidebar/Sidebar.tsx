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
    <aside className="w-64 md:w-68 flex-shrink-0 h-[calc(100vh-4rem)] border-r border-teal-500/15 bg-[#051211]/90 backdrop-blur-xl overflow-y-auto overflow-x-hidden flex flex-col select-none transition-all z-20 text-[#F4FFFD]">
      {/* Create Button with dropdown */}
      <CreateMenu />

      {/* Mini month calendar */}
      <MiniCalendar />

      <div className="my-1 border-t border-teal-500/15" />

      {/* Search for people (mock contacts with overlay toggle) */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => setPeopleOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-[#94B5B0] hover:text-[#F4FFFD]"
        >
          <span>People & Colleagues</span>
          {peopleOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#19E6C8]" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        {peopleOpen && <PeopleSearch />}
      </div>

      <div className="my-1 border-t border-teal-500/15" />

      {/* Appointment schedules / booking pages list */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => setAppointmentsOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-[#94B5B0] hover:text-[#F4FFFD]"
        >
          <span>Booking Schedules</span>
          {appointmentsOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#19E6C8]" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        {appointmentsOpen && <AppointmentSchedulesList />}
      </div>

      {/* World Clock (if enabled in Settings) */}
      <WorldClock />

      <div className="my-1 border-t border-teal-500/15" />

      {/* My calendars & Other calendars */}
      <div className="flex-1 pb-6">
        <CalendarList />
      </div>
    </aside>
  );
};
