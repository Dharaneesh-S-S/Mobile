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
        className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-[#04100F] font-extrabold text-sm shadow-[0_0_20px_rgba(255,255,255,0.22)] hover:bg-slate-100 transition-all active:scale-95 duration-200 group"
      >
        <Plus className="w-4 h-4 text-[#04100F] stroke-[2.5]" />
        <span>Create</span>
      </button>

      {isOpen && (
        <div className="absolute left-3 top-full mt-2 w-64 rounded-2xl bg-[#051211] p-2 shadow-2xl border border-teal-500/20 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-1">
            {createOptions.map(opt => (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleSelect(opt.type)}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-500/10 transition-colors text-left group"
              >
                <div className="p-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 shadow-2xs transition-colors mt-0.5">
                  {opt.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#F4FFFD]">{opt.label}</p>
                  <p className="text-[11px] text-[#94B5B0] leading-tight">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
