import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Calendar as EventIcon,
  CheckSquare,
  Plane,
  Clock,
  MapPin,
  CalendarRange,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { CalendarItemType } from '../../types/calendar';

export const CreateMenu: React.FC = () => {
  const { openEditor, currentDate } = useCalendar();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createOptions: { type: CalendarItemType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      type: 'event',
      label: 'Event',
      icon: <EventIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      desc: 'Meetings, syncs & milestones',
    },
    {
      type: 'task',
      label: 'Task',
      icon: <CheckSquare className="w-4 h-4 text-amber-500" />,
      desc: 'To-do item with subtasks & deadline',
    },
    {
      type: 'out_of_office',
      label: 'Out of office',
      icon: <Plane className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      desc: 'Vacation with auto-decline',
    },
    {
      type: 'focus_time',
      label: 'Focus time',
      icon: <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      desc: 'Deep work & mute notifications',
    },
    {
      type: 'working_location',
      label: 'Working location',
      icon: <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      desc: 'Office, Home, or Other',
    },
    {
      type: 'appointment_schedule',
      label: 'Appointment schedule',
      icon: <CalendarRange className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      desc: 'Bookable schedule & public page',
    },
  ];

  const handleSelect = (type: CalendarItemType) => {
    setIsOpen(false);
    openEditor(null, { type });
  };

  return (
    <div className="relative p-3" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold text-sm shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 transition-all duration-200 group"
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus className="w-5 h-5" />
        </div>
        <span>Create</span>
      </button>

      {isOpen && (
        <div className="absolute left-3 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-2xl border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-1">
            {createOptions.map(opt => (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleSelect(opt.type)}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors text-left group"
              >
                <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600 shadow-2xs transition-colors mt-0.5">
                  {opt.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{opt.label}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
