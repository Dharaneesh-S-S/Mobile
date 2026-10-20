import React, { useState } from 'react';
import {
  X,
  Clock,
  Users,
  Video,
  MapPin,
  AlignLeft,
  Calendar as EventIcon,
  CheckSquare,
  CalendarRange,
  Paperclip,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { CalendarItemType } from '../../types/calendar';
import { formatTimeDisplay, addDays, formatDateToYYYYMMDD } from '../../utils/dateUtils';

export const QuickCreatePopover: React.FC = () => {
  const {
    isQuickCreateOpen,
    quickCreateData,
    popoverAnchor,
    closeQuickCreate,
    addEvent,
    openEditor,
    settings,
  } = useCalendar();

  const [activeTab, setActiveTab] = useState<CalendarItemType>(
    quickCreateData?.type || 'event'
  );
  const [title, setTitle] = useState('');
  const [hasVideoCall, setHasVideoCall] = useState(false);
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [description, setDescription] = useState('');
  const [showDescInput, setShowDescInput] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guests, setGuests] = useState<string[]>([]);
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [attachments, setAttachments] = useState<{ id: string; name: string }[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isQuickCreateOpen || !quickCreateData) return null;

  const dateStr = quickCreateData.date;
  const startTime = quickCreateData.time || '10:00';
  const [h, m] = startTime.split(':').map(Number);
  const endH = (h + 1) % 24;
  const endTime = `${endH < 10 ? `0${endH}` : endH}:${m < 10 ? `0${m}` : m}`;

  const handleAddGuest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && guestEmail.trim()) {
      e.preventDefault();
      if (!guests.includes(guestEmail.trim())) {
        setGuests([...guests, guestEmail.trim()]);
      }
      setGuestEmail('');
    }
  };

  const handleSave = () => {
    const videoConference = hasVideoCall
      ? {
          id: `meet_${Date.now()}`,
          url: `https://meet.chronos.io/room-${Math.random().toString(36).substring(2, 8)}`,
          platform: 'Chronos Video Meet',
        }
      : undefined;

    const parsedGuests = guests.map(email => ({
      email,
      status: 'needs_action' as const,
    }));

    addEvent({
      type: activeTab,
      title: title.trim() || (activeTab === 'task' ? 'Untitled task' : 'Untitled event'),
      startDate: dateStr,
      endDate: dateStr,
      startTime: activeTab === 'task' ? undefined : startTime,
      endTime: activeTab === 'task' ? undefined : endTime,
      isAllDay: activeTab === 'task',
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      videoConference,
      guests: parsedGuests.length > 0 ? parsedGuests : undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    closeQuickCreate();
  };

  const handleMoreOptions = () => {
    closeQuickCreate();
    openEditor(null, {
      type: activeTab,
      title,
      startDate: dateStr,
      endDate: dateStr,
      startTime,
      endTime,
      location,
      description,
      guests: guests.map(email => ({ email, status: 'needs_action' })),
      attachments: attachments.length > 0 ? attachments : undefined,
      videoConference: hasVideoCall
        ? {
            id: `meet_${Date.now()}`,
            url: `https://meet.chronos.io/room-${Math.random().toString(36).substring(2, 8)}`,
            platform: 'Chronos Video Meet',
          }
        : undefined,
    });
  };

  // Compute position relative to viewport or anchor
  const style: React.CSSProperties = popoverAnchor
    ? {
        position: 'fixed',
        top: Math.min(window.innerHeight - 450, Math.max(80, popoverAnchor.y - 120)),
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
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
        onClick={closeQuickCreate}
      />

      <div
        style={style}
        className="w-96 md:w-[420px] rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 p-5 animate-in fade-in zoom-in-95 duration-150 select-none"
      >
        {/* Header Tabs: Event / Task / Appointment Schedule */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('event')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'event'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              <EventIcon className="w-3.5 h-3.5" />
              Event
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('task')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'task'
                  ? 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Task
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('appointment_schedule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'appointment_schedule'
                  ? 'bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              Schedule
            </button>
          </div>

          <button
            type="button"
            onClick={closeQuickCreate}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <input
            type="text"
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSave();
            }}
            placeholder={activeTab === 'task' ? 'Add title' : 'Add title and time'}
            className="w-full text-base font-semibold px-3 py-2 rounded-xl border-b-2 border-transparent focus:border-blue-600 dark:focus:border-blue-500 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Date / Time Line */}
        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300 mb-4 px-1">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>
            {dateStr} &bull; {formatTimeDisplay(startTime, settings.timeFormat)} – {formatTimeDisplay(endTime, settings.timeFormat)}
          </span>
        </div>

        {/* Action Buttons Row: Add Guests, Add Video, Add Location, Add Description */}
        <div className="space-y-2 mb-5">
          {/* Add Guests */}
          {showGuestInput ? (
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <input
                  type="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  onKeyDown={handleAddGuest}
                  placeholder="Type email and press Enter"
                  className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                />
              </div>
              {guests.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {guests.map((g, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                    >
                      {g}
                      <button
                        type="button"
                        onClick={() => setGuests(guests.filter((_, idx) => idx !== i))}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowGuestInput(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 w-full text-left transition-colors"
            >
              <Users className="w-4 h-4 text-gray-400" />
              <span>Add guests</span>
            </button>
          )}

          {/* Add Video Conferencing */}
          <button
            type="button"
            onClick={() => setHasVideoCall(prev => !prev)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs w-full text-left transition-colors ${
              hasVideoCall
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>
                {hasVideoCall ? 'Chronos Video Meeting Added' : 'Add Chronos Video Conferencing'}
              </span>
            </div>
            {hasVideoCall && (
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                meet.chronos.io/...
              </span>
            )}
          </button>

          {/* Add Location */}
          {showLocationInput ? (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Add location or meeting room"
                className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowLocationInput(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 w-full text-left transition-colors"
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Add location</span>
            </button>
          )}

          {/* Add Description / Attachments */}
          {showDescInput ? (
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 space-y-2">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add description..."
                rows={2}
                className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-gray-600">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAttachments([...attachments, { id: Date.now().toString(), name: file.name }]);
                    }
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300 hover:text-blue-600"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Add attachment</span>
                </button>
              </div>
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {attachments.map((att, i) => (
                    <span
                      key={att.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                    >
                      <Paperclip className="w-2.5 h-2.5" />
                      <span className="truncate max-w-[120px]">{att.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                        className="hover:text-red-500"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDescInput(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 w-full text-left transition-colors"
            >
              <AlignLeft className="w-4 h-4 text-gray-400" />
              <span>Add description or attachments</span>
            </button>
          )}
        </div>

        {/* Footer buttons: More Options & Save */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleMoreOptions}
            className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-xl transition-colors"
          >
            More options
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeQuickCreate}
              className="px-3.5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
