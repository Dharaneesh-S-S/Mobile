import React, { useState } from 'react';
import {
  X,
  Edit2,
  MoreVertical,
  Bell,
  Lock,
  Calendar as CalIcon,
  Trash2,
  CheckCircle2,
  Circle,
  List as ListIcon,
  MapPin,
  AlignLeft,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';

export const EventDetailsPopover: React.FC = () => {
  const {
    selectedEvent,
    closeEventDetails,
    openEditor,
    deleteEvent,
    quickToggleTaskCompletion,
    calendars,
    taskLists,
  } = useCalendar();

  const [showMenu, setShowMenu] = useState(false);

  if (!selectedEvent) return null;

  const isBirthday = selectedEvent.type === 'birthday' || selectedEvent.calendarId === 'cal_birthdays';
  const isHoliday = selectedEvent.type === 'holiday' || selectedEvent.calendarId === 'cal_holidays';
  const isTask = selectedEvent.type === 'task' || selectedEvent.calendarId === 'cal_tasks';
  const cal = calendars.find(c => c.id === selectedEvent.calendarId);
  const color = selectedEvent.colorOverride || cal?.color || (isTask ? '#19E6C8' : isBirthday ? '#EC4899' : isHoliday ? '#EF4444' : '#38BDF8');

  const taskList = selectedEvent.taskListId ? taskLists.find(l => l.id === selectedEvent.taskListId) : undefined;

  const formatEventDate = () => {
    try {
      const [y, m, d] = selectedEvent.startDate.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } catch {
      return selectedEvent.startDate;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-in fade-in duration-150"
        onClick={closeEventDetails}
      />

      {/* Bottom Sheet / Modal (Screenshot 14) */}
      <div className="fixed bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 sm:-translate-y-1/2 w-full max-w-md bg-[#1b1b1f] text-[#e3e3e3] rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-[#2d2f34] z-50 overflow-hidden select-none animate-in slide-in-from-bottom-4 duration-200">
        {/* Hero Illustration Header (Screenshot 14) */}
        <div className="relative h-44 w-full bg-gradient-to-br from-[#2a1b3d] via-[#1a233a] to-[#122329] overflow-hidden flex items-center justify-center">
          {isBirthday ? (
            /* Birthday graphic with cake, candles, balloons, and stars */
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 180" fill="none">
                {/* Background soft glow */}
                <circle cx="200" cy="90" r="100" fill="#f48fb1" fillOpacity="0.15" />
                {/* Balloons */}
                <ellipse cx="60" cy="80" rx="35" ry="45" fill="#f06292" fillOpacity="0.8" />
                <path d="M60 125 L65 170" stroke="#f06292" strokeWidth="1.5" />
                <ellipse cx="100" cy="70" rx="30" ry="40" fill="#ba68c8" fillOpacity="0.8" />
                <path d="M100 110 L95 170" stroke="#ba68c8" strokeWidth="1.5" />
                <ellipse cx="330" cy="70" rx="32" ry="42" fill="#ab47bc" fillOpacity="0.8" />
                <ellipse cx="365" cy="90" rx="30" ry="40" fill="#f06292" fillOpacity="0.8" />
                {/* Star Balloons */}
                <polygon points="320,100 325,115 340,115 328,125 332,140 320,130 308,140 312,125 300,115 315,115" fill="#ffd54f" fillOpacity="0.9" />
                {/* Birthday Cake */}
                <rect x="150" y="80" width="100" height="40" rx="6" fill="#f48fb1" />
                <rect x="150" y="100" width="100" height="20" fill="#ffffff" fillOpacity="0.85" />
                <rect x="145" y="115" width="110" height="40" rx="8" fill="#f06292" />
                {/* Cake frosting dots */}
                <circle cx="160" cy="80" r="4" fill="#ffffff" />
                <circle cx="180" cy="80" r="4" fill="#ffffff" />
                <circle cx="200" cy="80" r="4" fill="#ffffff" />
                <circle cx="220" cy="80" r="4" fill="#ffffff" />
                <circle cx="240" cy="80" r="4" fill="#ffffff" />
                {/* Candle */}
                <rect x="197" y="50" width="6" height="30" rx="3" fill="#ffffff" />
                <polygon points="200,32 195,46 205,46" fill="#ffd54f" />
                <circle cx="200" cy="38" r="14" fill="#ffeb3b" fillOpacity="0.4" />
              </svg>
            </div>
          ) : isTask ? (
            /* Task hero banner */
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#2e1d47] to-[#1a2b47]">
              <CheckCircle2 className="w-16 h-16 text-[#c58af9] opacity-40" />
            </div>
          ) : (
            /* Regular event / holiday banner */
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#004d40] to-[#006064]">
              <CalIcon className="w-16 h-16 text-[#4db6ac] opacity-35" />
            </div>
          )}

          {/* Floating Top Buttons over Illustration (Screenshot 14) */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <button
              type="button"
              onClick={closeEventDetails}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 relative">
              <button
                type="button"
                onClick={() => {
                  closeEventDetails();
                  openEditor(selectedEvent);
                }}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowMenu(prev => !prev)}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                title="More options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-2xl bg-[#282a2d] p-1.5 shadow-2xl border border-[#3c4043] z-20">
                  <button
                    type="button"
                    onClick={() => {
                      deleteEvent(selectedEvent.id);
                      closeEventDetails();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#f28b82] hover:bg-[#f28b82]/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Body (Screenshot 14) */}
        <div className="px-6 py-5 space-y-5">
          {/* Title row with colored square or checkbox */}
          <div className="flex items-start gap-3">
            {isTask ? (
              <button
                type="button"
                onClick={() => quickToggleTaskCompletion(selectedEvent.id)}
                className="mt-1 text-[#c58af9] hover:scale-110 transition-transform"
              >
                {selectedEvent.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 fill-[#c58af9] text-[#1b1b1f]" />
                ) : (
                  <Circle className="w-6 h-6 stroke-[2]" />
                )}
              </button>
            ) : (
              <span
                className="w-4 h-4 rounded-xs mt-1.5 flex-shrink-0"
                style={{ backgroundColor: color }}
              />
            )}
            <div>
              <h2
                className={`text-xl font-normal text-white ${
                  selectedEvent.isCompleted ? 'line-through text-[#9aa0a6]' : ''
                }`}
              >
                {selectedEvent.title}
              </h2>
              <div className="text-sm text-[#c4c7c5] mt-1 font-medium">
                {formatEventDate()}
              </div>
            </div>
          </div>

          {/* Task list indicator */}
          {isTask && (
            <div className="flex items-center gap-4 text-sm text-[#c4c7c5]">
              <ListIcon className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
              <span>List: <strong className="text-white">{selectedEvent.taskListName || taskList?.name || 'Valeo Work'}</strong></span>
            </div>
          )}

          {/* Location */}
          {selectedEvent.location && (
            <div className="flex items-center gap-4 text-sm text-[#c4c7c5]">
              <MapPin className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
              <span>{selectedEvent.location}</span>
            </div>
          )}

          {/* Notifications (Screenshot 14) */}
          <div className="flex items-start gap-4 text-sm text-[#c4c7c5]">
            <Bell className="w-5 h-5 text-[#9aa0a6] mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div>On the day at 6 am</div>
              <div>The day before at 9 pm</div>
            </div>
          </div>

          {/* Lock Privacy (Screenshot 14) */}
          <div className="flex items-center gap-4 text-sm text-[#c4c7c5]">
            <Lock className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
            <span>Only me</span>
          </div>

          {/* Calendar category & info */}
          <div className="flex items-start gap-4 text-sm text-[#c4c7c5]">
            <CalIcon className="w-5 h-5 text-[#9aa0a6] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-white font-medium">{cal?.name || (isBirthday ? 'Birthdays' : isHoliday ? 'Holidays' : 'My calendar')}</div>
            </div>
          </div>

          {/* Description */}
          {selectedEvent.description && (
            <div className="flex items-start gap-4 text-sm text-[#c4c7c5] pt-1 border-t border-[#2d2f34]">
              <AlignLeft className="w-5 h-5 text-[#9aa0a6] mt-0.5 flex-shrink-0" />
              <p className="whitespace-pre-line text-xs">{selectedEvent.description}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
