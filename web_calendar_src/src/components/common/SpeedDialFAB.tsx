import React, { useState } from 'react';
import {
  Plus,
  X,
  Calendar as CalIcon,
  CheckCircle2,
  CalendarX,
  Headphones,
  MapPin,
  Cake,
  Sparkles,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { CalendarItemType } from '../../types/calendar';
import { formatDateToYYYYMMDD } from '../../utils/dateUtils';

export const SpeedDialFAB: React.FC = () => {
  const { openEditor, currentDate } = useCalendar();
  const [isOpen, setIsOpen] = useState(false);

  const speedDialOptions: {
    type: CalendarItemType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: 'holiday',
      label: 'Holiday',
      icon: <Sparkles className="w-5 h-5 text-[#00897b]" />,
    },
    {
      type: 'birthday',
      label: 'Birthday',
      icon: <Cake className="w-5 h-5 text-[#81c995]" />,
    },
    {
      type: 'working_location',
      label: 'Working location',
      icon: <MapPin className="w-5 h-5 text-[#a8c7fa]" />,
    },
    {
      type: 'focus_time',
      label: 'Focus time',
      icon: <Headphones className="w-5 h-5 text-[#a8c7fa]" />,
    },
    {
      type: 'out_of_office',
      label: 'Out of office',
      icon: <CalendarX className="w-5 h-5 text-[#a8c7fa]" />,
    },
    {
      type: 'task',
      label: 'Task',
      icon: <CheckCircle2 className="w-5 h-5 text-[#19E6C8]" />,
    },
    {
      type: 'event',
      label: 'Event',
      icon: <CalIcon className="w-5 h-5 text-[#a8c7fa]" />,
    },
  ];

  const handleSelectOption = (type: CalendarItemType) => {
    setIsOpen(false);
    const dateStr = formatDateToYYYYMMDD(currentDate || new Date());
    openEditor(null, {
      type,
      startDate: dateStr,
      endDate: dateStr,
      isAllDay: type === 'birthday' || type === 'task' || type === 'holiday' || type === 'working_location',
    });
  };

  return (
    <>
      {/* Dimmed backdrop when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/65 backdrop-blur-xs z-40 animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating container in bottom right */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end select-none">
        {/* Speed-dial stack of option pills (Screenshot 11) */}
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-4 animate-in slide-in-from-bottom-3 duration-200">
            {speedDialOptions.map((opt, idx) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleSelectOption(opt.type)}
                style={{ animationDelay: `${idx * 25}ms` }}
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#081a18] hover:bg-[#0a2421] text-[#F4FFFD] text-sm font-semibold shadow-xl border border-teal-500/30 active:scale-95 transition-all"
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* The FAB button matching the mobile screenshot */}
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`w-14 h-14 flex items-center justify-center transition-all duration-200 active:scale-95 rounded-full ${
            isOpen
              ? 'bg-[#19E6C8] text-[#030707] shadow-[0_0_24px_rgba(25,230,200,0.6)] rotate-45'
              : 'bg-[#19E6C8] text-[#030707] shadow-[0_0_24px_rgba(25,230,200,0.5)] hover:shadow-[0_0_30px_rgba(25,230,200,0.7)]'
          }`}
          title={isOpen ? 'Close menu' : 'Create new item'}
          aria-label={isOpen ? 'Close speed dial' : 'Open speed dial'}
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </>
  );
};
