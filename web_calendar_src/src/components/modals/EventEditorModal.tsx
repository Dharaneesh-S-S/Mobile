import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  MapPin,
  Bell,
  Users,
  Paperclip,
  AlignLeft,
  Calendar as CalIcon,
  Repeat,
  Target,
  List as ListIcon,
  Cake,
  Headphones,
  CalendarX,
  Briefcase,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import {
  CalendarEvent,
  CalendarItemType,
  NotificationSetting,
  RecurrenceRule,
} from '../../types/calendar';
import { formatDateToYYYYMMDD } from '../../utils/dateUtils';
import { ZenithTaskList } from '../../utils/taskIntegration';

export const EventEditorModal: React.FC = () => {
  const {
    isEditorOpen,
    editingEvent,
    closeEditor,
    addEvent,
    updateEvent,
    deleteEvent,
    taskLists,
    currentDate,
    showToast,
  } = useCalendar();

  if (!isEditorOpen) return null;

  const isEditingExisting = Boolean(editingEvent && editingEvent.id);

  // Form State
  const [itemType, setItemType] = useState<CalendarItemType>(
    editingEvent?.type || 'event'
  );
  const [title, setTitle] = useState(editingEvent?.title || '');

  // Dates & Times
  const initialDateStr = editingEvent?.startDate || formatDateToYYYYMMDD(currentDate || new Date());
  const [startDate, setStartDate] = useState(initialDateStr);
  const [startTime, setStartTime] = useState(editingEvent?.startTime || '10:00');
  const [endDate, setEndDate] = useState(editingEvent?.endDate || initialDateStr);
  const [endTime, setEndTime] = useState(editingEvent?.endTime || '11:00');
  const [isAllDay, setIsAllDay] = useState(
    editingEvent ? editingEvent.isAllDay : itemType === 'task' || itemType === 'birthday' || itemType === 'holiday'
  );

  // Recurrence
  const [recurrenceRule, setRecurrenceRule] = useState<string>(() => {
    if (editingEvent?.recurrence) {
      if (editingEvent.recurrence.frequency === 'every_weekday') {
        return 'Only on working days (Monday to Friday)';
      }
      if (editingEvent.recurrence.frequency === 'daily') return 'Every day';
      if (editingEvent.recurrence.frequency === 'weekly') return 'Every week';
      if (editingEvent.recurrence.frequency === 'monthly') return 'Every month';
      if (editingEvent.recurrence.frequency === 'yearly') return 'Every year';
    }
    return 'Does not repeat';
  });
  const [showRecurrenceMenu, setShowRecurrenceMenu] = useState(false);

  // Task-specific state
  const [selectedListId, setSelectedListId] = useState<string>(
    editingEvent?.taskListId || taskLists[0]?.id || 'list_valeo_work'
  );
  const [showListPicker, setShowListPicker] = useState(false);
  const [deadline, setDeadline] = useState<string>('');
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);
  const [details, setDetails] = useState<string>(editingEvent?.description || '');

  // Event-specific state
  const [location, setLocation] = useState(editingEvent?.location || '');
  const [people, setPeople] = useState<string>('');
  const [colorOverride, setColorOverride] = useState<string>(
    editingEvent?.colorOverride || ''
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSetting[]>(
    editingEvent?.notifications || [
      { type: 'notification', minutesBefore: 60 * 17 }, // 5 pm day before
    ]
  );

  const selectedList = taskLists.find(l => l.id === selectedListId) || taskLists[0] || {
    id: 'list_valeo_work',
    name: 'Valeo Work',
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const chips: { type: CalendarItemType; label: string }[] = [
    { type: 'event', label: 'Event' },
    { type: 'task', label: 'Task' },
    { type: 'birthday', label: 'Birthday' },
    { type: 'holiday', label: 'Holiday' },
  ];

  const colorsList = [
    { name: 'Default colour', hex: '#8ab4f8' },
    { name: 'Peacock', hex: '#26c6da' },
    { name: 'Basil', hex: '#4caf50' },
    { name: 'Sage', hex: '#81c995' },
    { name: 'Banana', hex: '#fdd663' },
    { name: 'Tangerine', hex: '#ffb74d' },
    { name: 'Flamingo', hex: '#f28b82' },
    { name: 'Grape', hex: '#c58af9' },
    { name: 'Lavender', hex: '#b388ff' },
  ];

  const handleSave = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const finalTitle = title.trim() || (itemType === 'task' ? 'Untitled task' : itemType === 'birthday' ? 'Birthday' : itemType === 'holiday' ? 'Holiday' : 'Untitled event');

    let recurrence: RecurrenceRule | undefined = undefined;
    if (recurrenceRule === 'Only on working days (Monday to Friday)') {
      recurrence = { frequency: 'every_weekday', weekdays: [1, 2, 3, 4, 5] };
    } else if (recurrenceRule === 'Every day') {
      recurrence = { frequency: 'daily' };
    } else if (recurrenceRule === 'Every week') {
      recurrence = { frequency: 'weekly' };
    } else if (recurrenceRule === 'Every month') {
      recurrence = { frequency: 'monthly' };
    } else if (recurrenceRule === 'Every year') {
      recurrence = { frequency: 'yearly' };
    }

    const payload: Partial<CalendarEvent> = {
      type: itemType,
      title: finalTitle,
      startDate,
      endDate: endDate < startDate ? startDate : endDate,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      isAllDay,
      description: details || undefined,
      location: location || undefined,
      recurrence,
      colorOverride:
        colorOverride ||
        (itemType === 'task'
          ? '#19E6C8'
          : itemType === 'birthday'
          ? '#EC4899'
          : itemType === 'holiday'
          ? '#EF4444'
          : undefined),
      calendarId:
        itemType === 'task'
          ? 'cal_tasks'
          : itemType === 'birthday'
          ? 'cal_birthdays'
          : itemType === 'holiday'
          ? 'cal_holidays'
          : 'cal_my_calendar',
      taskListId: itemType === 'task' ? selectedList.id : undefined,
      taskListName: itemType === 'task' ? selectedList.name : undefined,
      createdFromCalendar: true, // Created from calendar with date timeline
      notifications,
    };

    if (isEditingExisting && editingEvent) {
      updateEvent({ ...editingEvent, ...payload } as CalendarEvent);
    } else {
      addEvent(payload);
    }

    if (itemType === 'task') {
      showToast(`Task added to "${selectedList.name}"`, undefined, undefined, 'success');
    }

    closeEditor();
  };

  const formatDisplayDate = (dStr: string) => {
    try {
      const [y, m, d] = dStr.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="w-full h-full sm:h-auto sm:max-h-[92vh] max-w-lg bg-[#1b1b1f] rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-[#2d2f34] flex flex-col text-[#e3e3e3] overflow-hidden">
        {/* Top Bar (Screenshots 1, 4, 9) */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#2d2f34] bg-[#1b1b1f] flex-shrink-0">
          <button
            type="button"
            onClick={closeEditor}
            className="p-1.5 rounded-full text-[#c4c7c5] hover:bg-[#282a2d] hover:text-white transition-colors"
            title="Discard"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Pull Handle Pill */}
          <div className="w-10 h-1 bg-[#44474f] rounded-full mx-auto" />

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className={`px-5 py-1.5 rounded-full bg-[#a8c7fa] text-[#041e49] font-bold text-sm hover:bg-[#b9d3fc] active:scale-95 transition-all shadow-md ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Save
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Title Input */}
          <div className="flex items-center gap-3 pt-1">
            {itemType === 'birthday' && (
              <Cake className="w-7 h-7 text-[#81c995] flex-shrink-0" />
            )}
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={itemType === 'birthday' ? 'Add name' : 'Add title'}
              className="w-full bg-transparent text-2xl font-normal text-white placeholder-[#74777f] focus:outline-none"
              autoFocus
            />
          </div>

          {/* Horizontal Chips Row (Screenshots 1, 4, 9) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {chips.map(chip => {
              const isSelected = itemType === chip.type;
              return (
                <button
                  key={chip.type}
                  type="button"
                  onClick={() => {
                    setItemType(chip.type);
                    if (chip.type === 'task' || chip.type === 'birthday' || chip.type === 'holiday') {
                      setIsAllDay(true);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#374151] text-white border border-[#4b5563] shadow-xs'
                      : 'border border-[#44474f] text-[#c4c7c5] hover:bg-[#282a2d]'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Category Info Row (Clean, no Gmail IDs) */}
          <div className="flex items-center gap-3 py-1">
            {itemType === 'task' ? (
              <>
                <span className="w-3 h-3 rounded-full bg-[#19E6C8] ml-1 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-semibold text-white">Tasks</span>
                </div>
              </>
            ) : itemType === 'birthday' ? (
              <>
                <span className="w-3 h-3 rounded-full bg-[#81c995] ml-1 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-semibold text-white">Birthdays</span>
                </div>
              </>
            ) : itemType === 'holiday' ? (
              <>
                <span className="w-3 h-3 rounded-full bg-[#EF4444] ml-1 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-semibold text-white">Holidays</span>
                </div>
              </>
            ) : (
              <>
                <span className="w-3 h-3 rounded-full bg-[#8ab4f8] ml-1 flex-shrink-0" />
                <div className="text-sm flex items-center gap-2">
                  <span className="font-semibold text-white">Events</span>
                </div>
              </>
            )}
          </div>

          {/* Time & Date Row */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-[#e3e3e3]">
                <Clock className="w-5 h-5 text-[#9aa0a6]" />
                <span>All-day</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={e => setIsAllDay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#35383e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a8c7fa] peer-checked:after:bg-[#041e49]"></div>
              </label>
            </div>

            {/* Date Selection */}
            <div className="pl-8 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => {
                    setStartDate(e.target.value);
                    if (endDate < e.target.value) setEndDate(e.target.value);
                  }}
                  className="bg-[#282a2d] border border-[#3c4043] rounded-lg px-3 py-1.5 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#a8c7fa]"
                />
                {!isAllDay && (
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="bg-[#282a2d] border border-[#3c4043] rounded-lg px-2.5 py-1.5 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#a8c7fa]"
                  />
                )}
              </div>

              {itemType !== 'task' && itemType !== 'birthday' && (
                <div className="flex items-center justify-between text-sm">
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="bg-[#282a2d] border border-[#3c4043] rounded-lg px-3 py-1.5 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#a8c7fa]"
                  />
                  {!isAllDay && (
                    <input
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="bg-[#282a2d] border border-[#3c4043] rounded-lg px-2.5 py-1.5 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#a8c7fa]"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recurrence Row */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRecurrenceMenu(prev => !prev)}
              className="flex items-center gap-3 text-sm text-[#c4c7c5] hover:text-white w-full text-left py-1"
            >
              <Repeat className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
              <span>{recurrenceRule}</span>
            </button>

            {showRecurrenceMenu && (
              <div className="absolute left-8 top-full mt-1 w-48 rounded-2xl bg-[#282a2d] p-1.5 shadow-2xl border border-[#3c4043] z-50">
                {[
                  'Does not repeat',
                  'Only on working days (Monday to Friday)',
                  'Every day',
                  'Every week',
                  'Every month',
                  'Every year',
                ].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRecurrenceRule(r);
                      setShowRecurrenceMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                      recurrenceRule === r
                        ? 'bg-[#3c4043] text-[#a8c7fa] font-bold'
                        : 'text-[#c4c7c5] hover:bg-[#323539]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TASK MODE EXCLUSIVE ROWS (Screenshots 4 & 8) */}
          {itemType === 'task' && (
            <>
              {/* Deadline row */}
              <div className="flex items-center gap-3 text-sm text-[#c4c7c5] py-1">
                <Target className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
                {showDeadlineInput ? (
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="bg-[#282a2d] border border-[#3c4043] rounded-lg px-3 py-1 text-xs text-white"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeadlineInput(true)}
                    className="hover:text-white"
                  >
                    Add deadline
                  </button>
                )}
              </div>

              {/* Details row */}
              <div className="flex items-start gap-3 text-sm text-[#c4c7c5] py-1">
                <AlignLeft className="w-5 h-5 text-[#9aa0a6] mt-1 flex-shrink-0" />
                <textarea
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Add details"
                  rows={2}
                  className="w-full bg-transparent text-sm text-[#e3e3e3] placeholder-[#74777f] focus:outline-none resize-none"
                />
              </div>

              {/* TASK LIST SELECTOR ROW (Screenshots 4 & 8) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowListPicker(prev => !prev)}
                  className="flex items-center gap-3 text-sm text-[#e3e3e3] hover:text-white w-full text-left py-1 group"
                >
                  <ListIcon className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
                  <span className="font-medium group-hover:underline">
                    {selectedList.name}
                  </span>
                </button>

                {/* TASK LIST PICKER DIALOG POPUP (Screenshot 8) */}
                {showListPicker && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/40"
                      onClick={() => setShowListPicker(false)}
                    />
                    <div className="absolute left-8 top-full mt-2 w-64 rounded-2xl bg-[#24262b] p-3 shadow-2xl border border-[#363940] z-50 space-y-1">
                      {taskLists.map(list => {
                        const isChosen = list.id === selectedListId;
                        return (
                          <button
                            key={list.id}
                            type="button"
                            onClick={() => {
                              setSelectedListId(list.id);
                              setShowListPicker(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                              isChosen
                                ? 'bg-[#31343a] text-white font-medium'
                                : 'text-[#c4c7c5] hover:bg-[#2c2f35] hover:text-white'
                            }`}
                          >
                            {/* Radio Circle */}
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isChosen
                                  ? 'border-[#a8c7fa]'
                                  : 'border-[#74777f]'
                              }`}
                            >
                              {isChosen && (
                                <div className="w-2 h-2 rounded-full bg-[#a8c7fa]" />
                              )}
                            </div>
                            <span className="truncate">{list.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Attachment row */}
              <div className="flex items-center gap-3 text-sm text-[#c4c7c5] py-1">
                <Paperclip className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
                <span className="hover:text-white cursor-pointer">
                  Add Google Drive attachment
                </span>
              </div>
            </>
          )}

          {/* EVENT MODE EXCLUSIVE ROWS (Screenshot 9) */}
          {itemType === 'event' && (
            <>
              {/* Add people */}
              <div className="flex items-center justify-between text-sm text-[#c4c7c5] py-1">
                <div className="flex items-center gap-3 flex-1">
                  <Users className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
                  <input
                    type="text"
                    value={people}
                    onChange={e => setPeople(e.target.value)}
                    placeholder="Add people"
                    className="w-full bg-transparent text-sm text-[#e3e3e3] placeholder-[#74777f] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="px-3 py-1 rounded-full border border-[#44474f] text-xs text-[#a8c7fa] hover:bg-[#282a2d]"
                >
                  View schedules
                </button>
              </div>

              {/* Add location */}
              <div className="flex items-center gap-3 text-sm text-[#c4c7c5] py-1">
                <MapPin className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Add location"
                  className="w-full bg-transparent text-sm text-[#e3e3e3] placeholder-[#74777f] focus:outline-none"
                />
              </div>

              {/* Notifications */}
              <div className="space-y-2 py-1">
                {notifications.map((notif, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm text-[#c4c7c5]">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
                      <span>The day before at 5 pm</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications(prev => prev.filter((_, i) => i !== idx))}
                      className="p-1 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setNotifications(prev => [
                      ...prev,
                      { type: 'notification', minutesBefore: 30 },
                    ])
                  }
                  className="pl-8 text-xs text-[#a8c7fa] hover:underline"
                >
                  Add notification
                </button>
              </div>

              {/* Default color */}
              <div className="relative py-1">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(prev => !prev)}
                  className="flex items-center gap-3 text-sm text-[#c4c7c5] hover:text-white"
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colorOverride || '#8ab4f8' }}
                  />
                  <span>Default colour</span>
                </button>

                {showColorPicker && (
                  <div className="absolute left-8 top-full mt-1 p-2 rounded-2xl bg-[#282a2d] border border-[#3c4043] shadow-2xl flex items-center gap-2 z-50">
                    {colorsList.map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => {
                          setColorOverride(c.hex);
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 rounded-full hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Add description */}
              <div className="flex items-start gap-3 text-sm text-[#c4c7c5] py-1">
                <AlignLeft className="w-5 h-5 text-[#9aa0a6] mt-1 flex-shrink-0" />
                <textarea
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Add description"
                  rows={2}
                  className="w-full bg-transparent text-sm text-[#e3e3e3] placeholder-[#74777f] focus:outline-none resize-none"
                />
              </div>
            </>
          )}

          {/* BIRTHDAY MODE EXCLUSIVE ROWS (Screenshot 1) */}
          {itemType === 'birthday' && (
            <>
              {/* Notifications for birthday */}
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between text-sm text-[#c4c7c5]">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#9aa0a6] flex-shrink-0" />
                    <span>The day before at 9 pm</span>
                  </div>
                  <X className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
                <div className="flex items-center justify-between text-sm text-[#c4c7c5]">
                  <div className="flex items-center gap-3 pl-8">
                    <span>On the day at 6 am</span>
                  </div>
                  <X className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
                <button
                  type="button"
                  className="pl-8 text-xs text-[#a8c7fa] hover:underline"
                >
                  Add notification
                </button>
              </div>

              {/* Birthday Color */}
              <div className="flex items-center gap-3 text-sm text-[#c4c7c5] py-1">
                <span className="w-4 h-4 rounded-full bg-[#81c995] flex-shrink-0" />
                <span>Default colour</span>
              </div>
            </>
          )}

          {/* Delete button if editing */}
          {isEditingExisting && (
            <div className="pt-4 border-t border-[#2d2f34] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (editingEvent?.id) {
                    deleteEvent(editingEvent.id);
                    closeEditor();
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#f28b82] hover:bg-[#f28b82]/10 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
