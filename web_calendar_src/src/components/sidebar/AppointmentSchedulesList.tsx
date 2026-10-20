import React from 'react';
import { CalendarRange, ExternalLink, Plus } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';

export const AppointmentSchedulesList: React.FC = () => {
  const { events, openBookingPage, openEditor } = useCalendar();

  const appointmentEvents = events.filter(e => e.type === 'appointment_schedule' && !e.deletedAt);

  return (
    <div className="px-3 py-2">
      <div className="space-y-1">
        {appointmentEvents.length === 0 ? (
          <div className="p-3 text-center rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">No booking pages yet</p>
            <button
              type="button"
              onClick={() => openEditor(null, { type: 'appointment_schedule', title: '30-Min Consultation' })}
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Create one
            </button>
          </div>
        ) : (
          appointmentEvents.map(evt => (
            <button
              key={evt.id}
              type="button"
              onClick={() => openBookingPage(evt)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                  <CalendarRange className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{evt.title}</p>
                  <p className="text-[10px] text-gray-400">
                    {evt.appointmentSchedule?.durationMinutes || 30} mins
                  </p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
