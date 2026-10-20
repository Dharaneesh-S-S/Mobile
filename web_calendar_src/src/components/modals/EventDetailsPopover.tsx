import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Edit2,
  Trash2,
  Mail,
  MoreVertical,
  Clock,
  MapPin,
  Video,
  Users,
  AlignLeft,
  Calendar as CalIcon,
  Check,
  HelpCircle,
  Copy,
  Printer,
  Share2,
  Paperclip,
  Palette,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { formatTimeDisplay } from '../../utils/dateUtils';
import { Guest } from '../../types/calendar';

export const EventDetailsPopover: React.FC = () => {
  const {
    selectedEvent,
    popoverAnchor,
    closeEventDetails,
    openEditor,
    deleteEvent,
    duplicateEvent,
    updateEvent,
    calendars,
    settings,
  } = useCalendar();

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedEvent) return null;

  const cal = calendars.find(c => c.id === selectedEvent.calendarId);
  const eventColor = selectedEvent.colorOverride || cal?.color || '#3b82f6';

  const handleRSVP = (status: 'yes' | 'no' | 'maybe') => {
    const currentGuests = selectedEvent.guests || [];
    const myGuest = currentGuests.find(g => g.email === 'user@chronos.local');

    let updatedGuests: Guest[];
    if (myGuest) {
      updatedGuests = currentGuests.map(g =>
        g.email === 'user@chronos.local' ? { ...g, status } : g
      );
    } else {
      updatedGuests = [
        ...currentGuests,
        { email: 'user@chronos.local', name: 'You', status },
      ];
    }
    updateEvent({ ...selectedEvent, guests: updatedGuests });
  };

  const myRsvpStatus = selectedEvent.guests?.find(g => g.email === 'user@chronos.local')?.status;

  const style: React.CSSProperties = popoverAnchor
    ? {
        position: 'fixed',
        top: Math.min(window.innerHeight - 440, Math.max(70, popoverAnchor.y - 100)),
        left: Math.min(window.innerWidth - 440, Math.max(20, popoverAnchor.x + 20)),
        zIndex: 50,
      }
    : {
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
      };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40"
        onClick={closeEventDetails}
      />

      <div
        style={style}
        className="w-96 md:w-[420px] rounded-3xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 p-5 select-none animate-in fade-in zoom-in-95 duration-150 z-50 flex flex-col max-h-[85vh] overflow-y-auto"
      >
        {/* Header Action Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
          <div className="flex items-center gap-1.5">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: eventColor }}
            />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
              {cal?.name || 'Calendar'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Edit (Pencil) */}
            <button
              type="button"
              onClick={() => {
                closeEventDetails();
                openEditor(selectedEvent);
              }}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Edit event"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Delete (Trash) */}
            <button
              type="button"
              onClick={() => {
                closeEventDetails();
                deleteEvent(selectedEvent.id);
              }}
              className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              title="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Email Guests */}
            {selectedEvent.guests && selectedEvent.guests.length > 0 && (
              <a
                href={`mailto:${selectedEvent.guests.map(g => g.email).join(',')}`}
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Email guests"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}

            {/* More Options Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setShowMoreMenu(prev => !prev)}
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-2xl bg-white dark:bg-gray-800 p-1.5 shadow-2xl border border-gray-100 dark:border-gray-700 z-50 text-xs text-gray-700 dark:text-gray-200 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      duplicateEvent(selectedEvent);
                      setShowMoreMenu(false);
                      closeEventDetails();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Duplicate</span>
                  </button>

                  {/* Change color */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(prev => !prev)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Palette className="w-3.5 h-3.5 text-gray-500" />
                        <span>Change color</span>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: eventColor }}
                      />
                    </button>

                    {showColorPicker && (
                      <div className="p-2 my-1 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-6 gap-1.5 mb-1.5">
                          {[
                            '#2563eb', '#0284c7', '#0d9488', '#10b981', '#16a34a', '#ca8a04',
                            '#d97706', '#ea580c', '#dc2626', '#e11d48', '#9333ea', '#4f46e5',
                          ].map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                updateEvent({ ...selectedEvent, colorOverride: color });
                                setShowColorPicker(false);
                                setShowMoreMenu(false);
                              }}
                              className="w-4 h-4 rounded-full flex items-center justify-center transition-transform hover:scale-125"
                              style={{ backgroundColor: color }}
                            >
                              {eventColor.toLowerCase() === color.toLowerCase() && (
                                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-gray-200 dark:border-gray-700">
                          <input
                            type="color"
                            value={eventColor}
                            onChange={e => {
                              updateEvent({ ...selectedEvent, colorOverride: e.target.value });
                            }}
                            className="w-5 h-4 rounded cursor-pointer border-0 bg-transparent"
                            title="Custom color"
                          />
                          <span className="text-[10px] text-gray-400 font-mono uppercase">{eventColor}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${selectedEvent.title} on ${selectedEvent.startDate} at ${selectedEvent.startTime || 'all day'}`
                      );
                      alert('Event details copied to clipboard!');
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Publish / Share event</span>
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closeEventDetails}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-snug">
          {selectedEvent.title}
        </h3>

        {/* Information rows */}
        <div className="space-y-3.5 text-xs text-gray-700 dark:text-gray-300">
          {/* Time & Date */}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {selectedEvent.startDate}
                {selectedEvent.endDate !== selectedEvent.startDate ? ` – ${selectedEvent.endDate}` : ''}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                {selectedEvent.isAllDay
                  ? 'All day'
                  : `${formatTimeDisplay(selectedEvent.startTime, settings.timeFormat)} – ${formatTimeDisplay(
                      selectedEvent.endTime,
                      settings.timeFormat
                    )}`}
              </p>
            </div>
          </div>

          {/* Video Link */}
          {selectedEvent.videoConference && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
              <div className="flex items-center gap-2.5 min-w-0">
                <Video className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="truncate">
                  <p className="font-semibold text-blue-900 dark:text-blue-300">Join with Video</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400 truncate font-mono">
                    {selectedEvent.videoConference.url}
                  </p>
                </div>
              </div>
              <a
                href={selectedEvent.videoConference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex-shrink-0"
              >
                Join
              </a>
            </div>
          )}

          {/* Location */}
          {selectedEvent.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>{selectedEvent.location}</span>
            </div>
          )}

          {/* Guests */}
          {selectedEvent.guests && selectedEvent.guests.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {selectedEvent.guests.length} guests
                </p>
                <div className="space-y-1">
                  {selectedEvent.guests.map((g, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-600 dark:text-gray-400">{g.name || g.email}</span>
                      <span
                        className={`capitalize font-medium ${
                          g.status === 'yes'
                            ? 'text-emerald-600'
                            : g.status === 'no'
                            ? 'text-red-500'
                            : 'text-amber-500'
                        }`}
                      >
                        {g.status === 'needs_action' ? 'invited' : g.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {selectedEvent.description && (
            <div className="flex items-start gap-3">
              <AlignLeft className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                {selectedEvent.description}
              </div>
            </div>
          )}

          {/* Attachments */}
          {selectedEvent.attachments && selectedEvent.attachments.length > 0 && (
            <div className="flex items-start gap-3">
              <Paperclip className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {selectedEvent.attachments.map(att => (
                  <span
                    key={att.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[11px]"
                  >
                    {att.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RSVP Bottom Row */}
        <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Going?
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'yes', label: 'Yes' },
              { id: 'no', label: 'No' },
              { id: 'maybe', label: 'Maybe' },
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRSVP(r.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  myRsvpStatus === r.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
