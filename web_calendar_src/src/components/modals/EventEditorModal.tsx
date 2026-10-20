import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  MapPin,
  Video,
  Bell,
  Calendar as CalIcon,
  Users,
  Building,
  Paperclip,
  CheckSquare,
  Plane,
  Home,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Plus,
  Check,
  Globe,
  Lock,
  Eye,
  Sliders,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import {
  CalendarEvent,
  CalendarItemType,
  Guest,
  NotificationSetting,
  RecurrenceFrequency,
  RecurrenceRule,
} from '../../types/calendar';
import { formatDateToYYYYMMDD, formatTimeDisplay } from '../../utils/dateUtils';
import { MOCK_CONTACTS } from '../../data/mockData';

const MOCK_ROOMS = [
  { id: 'room_1', name: 'Apollo Boardroom (16 people)', capacity: 16 },
  { id: 'room_2', name: 'Nebula Huddle (6 people)', capacity: 6 },
  { id: 'room_3', name: 'Zenith Innovation Lab (10 people)', capacity: 10 },
  { id: 'room_4', name: 'Orion Quiet Pod (2 people)', capacity: 2 },
];

export const EventEditorModal: React.FC = () => {
  const {
    isEditorOpen,
    editingEvent,
    closeEditor,
    addEvent,
    updateEvent,
    deleteEvent,
    calendars,
    settings,
  } = useCalendar();

  if (!isEditorOpen) return null;

  const isEditingExisting = Boolean(editingEvent && editingEvent.id);

  // Form State
  const [activeTab, setActiveTab] = useState<'details' | 'guests' | 'rooms' | 'find_time'>('details');
  const [itemType, setItemType] = useState<CalendarItemType>(editingEvent?.type || 'event');
  const [title, setTitle] = useState(editingEvent?.title || '');
  const [calendarId, setCalendarId] = useState(editingEvent?.calendarId || calendars[0].id);

  // Date and Time
  const [startDate, setStartDate] = useState(editingEvent?.startDate || formatDateToYYYYMMDD(new Date()));
  const [startTime, setStartTime] = useState(editingEvent?.startTime || '10:00');
  const [endDate, setEndDate] = useState(editingEvent?.endDate || editingEvent?.startDate || formatDateToYYYYMMDD(new Date()));
  const [endTime, setEndTime] = useState(editingEvent?.endTime || '11:00');
  const [isAllDay, setIsAllDay] = useState(editingEvent?.isAllDay || false);

  // Timezones
  const [showTimeZones, setShowTimeZones] = useState(false);
  const [startCityTimeZone, setStartCityTimeZone] = useState(editingEvent?.startCityTimeZone || settings.timeZone);
  const [endCityTimeZone, setEndCityTimeZone] = useState(editingEvent?.endCityTimeZone || settings.timeZone);

  // Recurrence
  const [recurrenceFreq, setRecurrenceFreq] = useState<RecurrenceFrequency>(
    editingEvent?.recurrence?.frequency || 'none'
  );
  const [showCustomRecurrence, setShowCustomRecurrence] = useState(false);
  const [customInterval, setCustomInterval] = useState(editingEvent?.recurrence?.interval || 1);
  const [customWeekdays, setCustomWeekdays] = useState<number[]>(editingEvent?.recurrence?.weekdays || [1]);
  const [customEndType, setCustomEndType] = useState<'never' | 'on_date' | 'after_occurrences'>(
    editingEvent?.recurrence?.ends?.type || 'never'
  );
  const [customEndDate, setCustomEndDate] = useState(editingEvent?.recurrence?.ends?.date || '');
  const [customOccurrences, setCustomOccurrences] = useState(editingEvent?.recurrence?.ends?.occurrences || 10);

  // Details Tab
  const [location, setLocation] = useState(editingEvent?.location || '');
  const [description, setDescription] = useState(editingEvent?.description || '');
  const [colorOverride, setColorOverride] = useState(editingEvent?.colorOverride || '');
  const [busyStatus, setBusyStatus] = useState<'busy' | 'free'>(editingEvent?.busyStatus || 'busy');
  const [visibility, setVisibility] = useState<'default' | 'public' | 'private'>(editingEvent?.visibility || 'default');

  // Video Conference
  const [hasVideoMeet, setHasVideoMeet] = useState(Boolean(editingEvent?.videoConference));

  // Reminders / Notifications
  const [notifications, setNotifications] = useState<NotificationSetting[]>(
    editingEvent?.notifications || [{ type: 'notification', minutesBefore: 10 }]
  );

  // Attachments
  const [attachments, setAttachments] = useState<Array<{ id: string; name: string }>>(
    editingEvent?.attachments || []
  );

  // Guests Tab
  const [guests, setGuests] = useState<Guest[]>(editingEvent?.guests || []);
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [guestCanModify, setGuestCanModify] = useState(editingEvent?.guests?.[0]?.canModify ?? settings.defaultGuestCanModify);
  const [guestCanInvite, setGuestCanInvite] = useState(editingEvent?.guests?.[0]?.canInviteOthers ?? settings.defaultGuestCanInviteOthers);
  const [guestCanSeeOthers, setGuestCanSeeOthers] = useState(editingEvent?.guests?.[0]?.canSeeGuests ?? settings.defaultGuestCanSeeGuests);

  // Rooms Tab
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  // Specialized types state
  const [oooAutoDecline, setOooAutoDecline] = useState(editingEvent?.outOfOffice?.autoDecline ?? true);
  const [oooDeclineMessage, setOooDeclineMessage] = useState(
    editingEvent?.outOfOffice?.declineMessage || 'I am currently out of the office with no access to email.'
  );

  const [focusAutoDecline, setFocusAutoDecline] = useState(editingEvent?.focusTime?.autoDecline ?? true);
  const [focusDND, setFocusDND] = useState(editingEvent?.focusTime?.doNotDisturb ?? true);

  const [workingLoc, setWorkingLoc] = useState<'home' | 'office' | 'other'>(editingEvent?.workingLocation || 'office');

  const [appointDuration, setAppointDuration] = useState(editingEvent?.appointmentSchedule?.durationMinutes || 30);
  const [appointBuffer, setAppointBuffer] = useState(editingEvent?.appointmentSchedule?.bufferMinutes || 10);

  // Handle Recurrence dropdown change
  const handleRecurrenceChange = (freq: RecurrenceFrequency) => {
    setRecurrenceFreq(freq);
    if (freq === 'custom') {
      setShowCustomRecurrence(true);
    }
  };

  const handleAddGuest = () => {
    if (!newGuestEmail.trim()) return;
    const exists = guests.some(g => g.email.toLowerCase() === newGuestEmail.trim().toLowerCase());
    if (!exists) {
      const contact = MOCK_CONTACTS.find(c => c.email.toLowerCase() === newGuestEmail.trim().toLowerCase());
      setGuests([
        ...guests,
        {
          email: newGuestEmail.trim(),
          name: contact?.name,
          status: 'needs_action',
          canModify: guestCanModify,
          canInviteOthers: guestCanInvite,
          canSeeGuests: guestCanSeeOthers,
        },
      ]);
    }
    setNewGuestEmail('');
  };

  const handleAddAttachment = () => {
    const filename = prompt('Enter attachment file name (e.g. Q4_Project_Brief.pdf):');
    if (filename) {
      setAttachments([...attachments, { id: `att_${Date.now()}`, name: filename.trim() }]);
    }
  };

  const handleSave = () => {
    let recurrence: RecurrenceRule | undefined;
    if (recurrenceFreq !== 'none') {
      if (recurrenceFreq === 'custom') {
        recurrence = {
          frequency: 'custom',
          interval: customInterval,
          weekdays: customWeekdays,
          ends: {
            type: customEndType,
            date: customEndDate || undefined,
            occurrences: customOccurrences,
          },
        };
      } else {
        recurrence = { frequency: recurrenceFreq };
      }
    }

    const videoConference = hasVideoMeet
      ? editingEvent?.videoConference || {
          id: `meet_${Date.now()}`,
          url: `https://meet.chronos.io/room-${Math.random().toString(36).substring(2, 8)}`,
          platform: 'Chronos Video Meet',
        }
      : undefined;

    const selectedRoom = MOCK_ROOMS.find(r => r.id === selectedRoomId);
    const finalLocation = selectedRoom ? `${selectedRoom.name} - ${location}` : location;

    const payload: Partial<CalendarEvent> = {
      type: itemType,
      title: title.trim() || (itemType === 'task' ? 'Untitled task' : 'Untitled event'),
      calendarId,
      startDate,
      endDate: endDate < startDate ? startDate : endDate,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      isAllDay,
      startCityTimeZone: showTimeZones ? startCityTimeZone : undefined,
      endCityTimeZone: showTimeZones ? endCityTimeZone : undefined,
      recurrence,
      location: finalLocation || undefined,
      description: description || undefined,
      colorOverride: colorOverride || undefined,
      busyStatus,
      visibility,
      videoConference,
      notifications,
      attachments,
      guests,
      outOfOffice:
        itemType === 'out_of_office'
          ? { autoDecline: oooAutoDecline, declineMessage: oooDeclineMessage }
          : undefined,
      focusTime:
        itemType === 'focus_time'
          ? { autoDecline: focusAutoDecline, doNotDisturb: focusDND }
          : undefined,
      workingLocation: itemType === 'working_location' ? workingLoc : undefined,
      appointmentSchedule:
        itemType === 'appointment_schedule'
          ? {
              durationMinutes: appointDuration,
              availableDays: [1, 2, 3, 4, 5],
              startTime: '09:00',
              endTime: '17:00',
              bufferMinutes: appointBuffer,
              bookingWindowDays: 30,
              publicSlug: `chronos-book-${Math.random().toString(36).substring(2, 7)}`,
            }
          : undefined,
    };

    if (isEditingExisting && editingEvent) {
      updateEvent({ ...editingEvent, ...payload } as CalendarEvent);
    } else {
      addEvent(payload);
    }

    closeEditor();
  };

  const handleDelete = () => {
    if (editingEvent && editingEvent.id) {
      deleteEvent(editingEvent.id);
      closeEditor();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-850">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeEditor}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
              {isEditingExisting ? 'Edit item' : 'Create new item'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isEditingExisting && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={closeEditor}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title and Item Type Bar */}
          <div className="space-y-3">
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Add title"
              className="w-full text-2xl font-bold px-3 py-2 border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-500 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
            />

            {/* Type selector chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { type: 'event', label: 'Event' },
                { type: 'task', label: 'Task' },
                { type: 'out_of_office', label: 'Out of office' },
                { type: 'focus_time', label: 'Focus time' },
                { type: 'working_location', label: 'Working location' },
                { type: 'appointment_schedule', label: 'Appointment schedule' },
              ].map(opt => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setItemType(opt.type as CalendarItemType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    itemType === opt.type
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date, Time, All-Day & Recurrence */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {!isAllDay && itemType !== 'working_location' && (
                <>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400 text-xs">–</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              )}

              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300 ml-2">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={e => setIsAllDay(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                All day
              </label>

              <button
                type="button"
                onClick={() => setShowTimeZones(prev => !prev)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-auto flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" />
                Time zones
              </button>
            </div>

            {/* Time zone selectors */}
            {showTimeZones && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Event start time zone</label>
                  <select
                    value={startCityTimeZone}
                    onChange={e => setStartCityTimeZone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs"
                  >
                    <option value="Asia/Kolkata">India (GMT+5:30)</option>
                    <option value="America/New_York">Eastern Time (GMT-5:00)</option>
                    <option value="America/Los_Angeles">Pacific Time (GMT-8:00)</option>
                    <option value="Europe/London">London (GMT+0:00)</option>
                    <option value="Asia/Tokyo">Tokyo (GMT+9:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Event end time zone</label>
                  <select
                    value={endCityTimeZone}
                    onChange={e => setEndCityTimeZone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs"
                  >
                    <option value="Asia/Kolkata">India (GMT+5:30)</option>
                    <option value="America/New_York">Eastern Time (GMT-5:00)</option>
                    <option value="America/Los_Angeles">Pacific Time (GMT-8:00)</option>
                    <option value="Europe/London">London (GMT+0:00)</option>
                    <option value="Asia/Tokyo">Tokyo (GMT+9:00)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Recurrence Dropdown */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 font-medium">Recurrence:</span>
              <select
                value={recurrenceFreq}
                onChange={e => handleRecurrenceChange(e.target.value as RecurrenceFrequency)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly on this day</option>
                <option value="monthly">Monthly on this day</option>
                <option value="yearly">Annually</option>
                <option value="every_weekday">Every weekday (Monday to Friday)</option>
                <option value="custom">Custom...</option>
              </select>
            </div>

            {/* Custom Recurrence Options Drawer */}
            {showCustomRecurrence && recurrenceFreq === 'custom' && (
              <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span>Repeat every</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={customInterval}
                    onChange={e => setCustomInterval(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center font-bold"
                  />
                  <span>weeks</span>
                </div>

                {/* Weekday chips */}
                <div className="flex items-center gap-1.5">
                  <span className="mr-1">Repeat on:</span>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, dIdx) => {
                    const isSelected = customWeekdays.includes(dIdx);
                    return (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => {
                          setCustomWeekdays(prev =>
                            prev.includes(dIdx) ? prev.filter(x => x !== dIdx) : [...prev, dIdx]
                          );
                        }}
                        className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {dayChar}
                      </button>
                    );
                  })}
                </div>

                {/* Ends */}
                <div className="space-y-1.5 pt-1">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Ends:</p>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ends"
                      checked={customEndType === 'never'}
                      onChange={() => setCustomEndType('never')}
                    />
                    <span>Never</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ends"
                      checked={customEndType === 'on_date'}
                      onChange={() => setCustomEndType('on_date')}
                    />
                    <span>On</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={e => setCustomEndDate(e.target.value)}
                      className="px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ends"
                      checked={customEndType === 'after_occurrences'}
                      onChange={() => setCustomEndType('after_occurrences')}
                    />
                    <span>After</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={customOccurrences}
                      onChange={e => setCustomOccurrences(Number(e.target.value))}
                      className="w-14 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center"
                    />
                    <span>occurrences</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Conditional Item Type Specialized Fields */}
          {itemType === 'out_of_office' && (
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={oooAutoDecline}
                  onChange={e => setOooAutoDecline(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
                Automatically decline new and existing meetings
              </label>
              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1">Decline message</label>
                <textarea
                  value={oooDeclineMessage}
                  onChange={e => setOooDeclineMessage(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {itemType === 'focus_time' && (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={focusAutoDecline}
                  onChange={e => setFocusAutoDecline(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                Automatically decline conflicting meetings
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={focusDND}
                  onChange={e => setFocusDND(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                Mute notifications ("Do not disturb" mode)
              </label>
            </div>
          )}

          {itemType === 'working_location' && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3 text-xs">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">Set your location for this day:</p>
              <div className="flex items-center gap-3">
                {[
                  { id: 'office', label: 'Office', icon: <Building className="w-4 h-4" /> },
                  { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
                  { id: 'other', label: 'Elsewhere', icon: <MapPin className="w-4 h-4" /> },
                ].map(loc => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setWorkingLoc(loc.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      workingLoc === loc.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {loc.icon}
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {itemType === 'appointment_schedule' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Meeting Appointment Duration
                  </label>
                  <select
                    value={appointDuration}
                    onChange={e => setAppointDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-700 bg-white dark:bg-gray-800 text-xs"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Buffer Time Between Bookings
                  </label>
                  <select
                    value={appointBuffer}
                    onChange={e => setAppointBuffer(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-700 bg-white dark:bg-gray-800 text-xs"
                  >
                    <option value={0}>None</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs for Full Details: Event Details, Guests, Rooms, Find a Time */}
          <div>
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4">
              {[
                { id: 'details', label: 'Event Details', icon: <Sliders className="w-3.5 h-3.5" /> },
                { id: 'guests', label: `Guests (${guests.length})`, icon: <Users className="w-3.5 h-3.5" /> },
                { id: 'rooms', label: 'Rooms', icon: <Building className="w-3.5 h-3.5" /> },
                { id: 'find_time', label: 'Find a Time', icon: <Clock className="w-3.5 h-3.5" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Event Details */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Video Meet Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                        Chronos Video Conferencing
                      </p>
                      <p className="text-[11px] text-gray-400">Generates unique meeting link</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasVideoMeet(prev => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      hasVideoMeet
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {hasVideoMeet ? 'Active' : 'Add video call'}
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Add location or address"
                    className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                  />
                </div>

                {/* Calendar selector & Event Color override */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">Calendar</label>
                    <select
                      value={calendarId}
                      onChange={e => setCalendarId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-gray-800 dark:text-gray-100"
                    >
                      {calendars.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">
                        Color Override
                      </label>
                      <span className="text-xs font-mono uppercase text-gray-700 dark:text-gray-300">
                        {colorOverride || 'Calendar Default'}
                      </span>
                    </div>
                    <input
                      type="color"
                      value={colorOverride || '#3b82f6'}
                      onChange={e => setColorOverride(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>

                {/* Busy/Free and Visibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">Availability</label>
                    <select
                      value={busyStatus}
                      onChange={e => setBusyStatus(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-gray-800 dark:text-gray-100"
                    >
                      <option value="busy">Busy</option>
                      <option value="free">Free</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">Visibility</label>
                    <select
                      value={visibility}
                      onChange={e => setVisibility(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-gray-800 dark:text-gray-100"
                    >
                      <option value="default">Default visibility</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                {/* Notifications & Reminders */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-gray-400" />
                      Notifications & Reminders
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications([...notifications, { type: 'notification', minutesBefore: 30 }])
                      }
                      className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add reminder
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {notifications.map((notif, nIdx) => (
                      <div key={nIdx} className="flex items-center gap-2 text-xs">
                        <select
                          value={notif.type}
                          onChange={e => {
                            const updated = [...notifications];
                            updated[nIdx].type = e.target.value as any;
                            setNotifications(updated);
                          }}
                          className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                        >
                          <option value="notification">In-app Notification</option>
                          <option value="email">Email</option>
                        </select>
                        <select
                          value={notif.minutesBefore}
                          onChange={e => {
                            const updated = [...notifications];
                            updated[nIdx].minutesBefore = Number(e.target.value);
                            setNotifications(updated);
                          }}
                          className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                        >
                          <option value={5}>5 minutes before</option>
                          <option value={10}>10 minutes before</option>
                          <option value={15}>15 minutes before</option>
                          <option value={30}>30 minutes before</option>
                          <option value={60}>1 hour before</option>
                          <option value={1440}>1 day before</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setNotifications(notifications.filter((_, i) => i !== nIdx))}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rich-Text Description */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Description</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDescription(prev => `${prev} **bold text**`)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescription(prev => `${prev} *italic text*`)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescription(prev => `${prev} <u>underlined</u>`)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                        title="Underline"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescription(prev => `${prev}\n- List item`)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                        title="Bullet List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescription(prev => `${prev} [Link Title](https://example.com)`)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                        title="Insert Link"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Add detailed agenda, meeting links, or notes..."
                    className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-none font-sans"
                  />
                </div>

                {/* Attachments */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                      Attachments
                    </span>
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Attach file
                    </button>
                  </div>

                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {attachments.map(att => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 shadow-2xs"
                        >
                          <Paperclip className="w-3 h-3 text-blue-500" />
                          <span>{att.name}</span>
                          <button
                            type="button"
                            onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))}
                            className="p-0.5 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Guests */}
            {activeTab === 'guests' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Users className="w-4 h-4 text-gray-400 ml-1" />
                  <input
                    type="email"
                    value={newGuestEmail}
                    onChange={e => setNewGuestEmail(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGuest();
                      }
                    }}
                    placeholder="Add guest by email (e.g. alex.chen@chronos.io)"
                    className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddGuest}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Guest permissions */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Guest permissions:</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestCanModify}
                      onChange={e => setGuestCanModify(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Modify event</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestCanInvite}
                      onChange={e => setGuestCanInvite(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Invite others</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestCanSeeOthers}
                      onChange={e => setGuestCanSeeOthers(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>See guest list</span>
                  </label>
                </div>

                {/* Added Guests List */}
                <div className="space-y-2">
                  {guests.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-4 text-center">
                      No guests added yet. Add colleagues or attendees above.
                    </p>
                  ) : (
                    guests.map((g, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                            {g.name ? g.name.charAt(0) : g.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{g.name || g.email}</p>
                            {g.name && <p className="text-[10px] text-gray-400">{g.email}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...guests];
                              updated[idx].isOptional = !updated[idx].isOptional;
                              setGuests(updated);
                            }}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                              g.isOptional
                                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {g.isOptional ? 'Optional' : 'Required'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setGuests(guests.filter((_, i) => i !== idx))}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Rooms */}
            {activeTab === 'rooms' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  Select an available meeting room or physical conference space:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_ROOMS.map(room => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() =>
                        setSelectedRoomId(selectedRoomId === room.id ? '' : room.id)
                      }
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedRoomId === room.id
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{room.name}</span>
                        {selectedRoomId === room.id && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                      <span className="text-[10px] text-gray-400">Equipped with 4K display & whiteboard</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Find a Time (Free/Busy Availability) */}
            {activeTab === 'find_time' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500">
                  Attendee availability timeline for {startDate}:
                </p>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3">
                  {/* You */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">You (Organizer)</span>
                      <span className="text-emerald-600 font-medium">Available</span>
                    </div>
                    <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-[35%] w-[15%] bg-blue-500/80 rounded" title="Standup sync" />
                    </div>
                  </div>

                  {/* Sample Guests */}
                  {guests.map((g, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{g.name || g.email}</span>
                        <span className="text-emerald-600 font-medium">Free at selected time</span>
                      </div>
                      <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 bg-red-400/80 rounded"
                          style={{
                            left: `${(idx * 20 + 20) % 70}%`,
                            width: '20%',
                          }}
                          title="Busy"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700 font-mono">
                    <span>9:00 AM</span>
                    <span>11:00 AM</span>
                    <span>1:00 PM</span>
                    <span>3:00 PM</span>
                    <span>5:00 PM</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
