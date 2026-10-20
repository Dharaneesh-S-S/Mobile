import React, { useState, useRef } from 'react';
import {
  X,
  Settings as SettingsIcon,
  Clock,
  Eye,
  Bell,
  MapPin,
  Calendar as CalIcon,
  Upload,
  Download,
  Trash2,
  Keyboard,
  RotateCcw,
  Check,
  Share2,
  Code,
  Globe,
  Sun,
  Moon,
  Shield,
  Layers,
  HardDrive,
  Database,
  Sparkles,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { Settings, ViewType } from '../../types/calendar';
import { formatBytes } from '../../utils/compressedStorage';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    settingsInitialTab,
    closeSettings,
    settings,
    updateSettings,
    calendars,
    updateCalendar,
    deleteCalendar,
    trash,
    restoreFromTrash,
    deleteForeverFromTrash,
    emptyTrash,
    exportICS,
    importICS,
    importCSV,
    seedDemoData,
    clearDemoData,
    storageStats,
    refreshStorageStats,
    optimizeStorage,
  } = useCalendar();

  const [activeTab, setActiveTab] = useState<string>(settingsInitialTab || 'general');
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>(calendars[0]?.id || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSettingsOpen) return null;

  const currentCal = calendars.find(c => c.id === selectedCalendarId) || calendars[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      if (content) {
        if (isCsv) {
          importCSV(content);
        } else {
          importICS(content);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const navItems = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'events', label: 'Event settings', icon: <Clock className="w-4 h-4" /> },
    { id: 'views', label: 'View options', icon: <Eye className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'working', label: 'Working hours & location', icon: <MapPin className="w-4 h-4" /> },
    { id: 'calendars', label: 'Calendars & sharing', icon: <CalIcon className="w-4 h-4" /> },
    { id: 'import_export', label: 'Import & Export', icon: <Upload className="w-4 h-4" /> },
    { id: 'storage', label: 'Local Storage & Compression', icon: <HardDrive className="w-4 h-4 text-emerald-500" /> },
    { id: 'trash', label: `Trash (${trash.length})`, icon: <Trash2 className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 dark:bg-black/70 flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-150">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".ics,.ical,.csv"
        className="hidden"
      />

      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row h-[88vh] select-none">
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-850 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-blue-600" />
              Settings
            </h2>
            <button
              type="button"
              onClick={closeSettings}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Quick theme toggler in settings */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
            <span className="font-medium">Theme mode</span>
            <button
              type="button"
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 font-semibold text-[11px]"
            >
              {settings.theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              <span className="capitalize">{settings.theme}</span>
            </button>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
          {/* Top Bar with Close button */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 capitalize">
              {navItems.find(n => n.id === activeTab)?.label}
            </h3>
            <button
              type="button"
              onClick={closeSettings}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-gray-700 dark:text-gray-300">
            {/* 1. GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-5 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Language</label>
                    <select
                      value={settings.language}
                      onChange={e => updateSettings({ language: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish (Español)</option>
                      <option>French (Français)</option>
                      <option>German (Deutsch)</option>
                      <option>Hindi (हिन्दी)</option>
                      <option>Japanese (日本語)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={settings.country}
                      onChange={e => updateSettings({ country: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={e => updateSettings({ dateFormat: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY (10/19/2026)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (19/10/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-19)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Time Format</label>
                    <select
                      value={settings.timeFormat}
                      onChange={e => updateSettings({ timeFormat: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value="12h">12-hour (1:00 pm)</option>
                      <option value="24h">24-hour (13:00)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Primary Time Zone</label>
                    <select
                      value={settings.timeZone}
                      onChange={e => updateSettings({ timeZone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value="Asia/Kolkata">(GMT+5:30) India Standard Time</option>
                      <option value="America/New_York">(GMT-5:00) Eastern Time (US & Canada)</option>
                      <option value="America/Los_Angeles">(GMT-8:00) Pacific Time (US & Canada)</option>
                      <option value="Europe/London">(GMT+0:00) London / GMT</option>
                      <option value="Europe/Paris">(GMT+1:00) Paris / Berlin</option>
                      <option value="Asia/Tokyo">(GMT+9:00) Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Secondary Time Zone</label>
                    <select
                      value={settings.secondaryTimeZone || ''}
                      onChange={e => updateSettings({ secondaryTimeZone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value="">None</option>
                      <option value="America/New_York">Eastern Time (New York)</option>
                      <option value="Europe/London">GMT (London)</option>
                      <option value="Asia/Tokyo">JST (Tokyo)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Start Week On</label>
                    <select
                      value={settings.startWeekOn}
                      onChange={e => updateSettings({ startWeekOn: Number(e.target.value) as any })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value={0}>Sunday</option>
                      <option value={1}>Monday</option>
                      <option value={6}>Saturday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Default View</label>
                    <select
                      value={settings.defaultView}
                      onChange={e => updateSettings({ defaultView: e.target.value as ViewType })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                      <option value="schedule">Schedule</option>
                      <option value="four_day">4 days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">Density</label>
                    <select
                      value={settings.density}
                      onChange={e => updateSettings({ density: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value="comfortable">Comfortable</option>
                      <option value="compact">Compact</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 space-y-3 border-t border-gray-100 dark:border-gray-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showWeekends}
                      onChange={e => updateSettings({ showWeekends: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Show weekends</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.eventNotificationSound}
                      onChange={e => updateSettings({ eventNotificationSound: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Play event notification sound & trigger reminder popups</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableShortcuts}
                      onChange={e => updateSettings({ enableShortcuts: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Enable keyboard shortcuts (c, /, t, d, w, m, y, etc.)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showWorldClock}
                      onChange={e => updateSettings({ showWorldClock: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Show World Clock in sidebar</span>
                  </label>

                  {settings.showWorldClock && (
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2 mt-2">
                      <p className="font-semibold text-gray-700 dark:text-gray-300">World Clock Cities:</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {[
                          { tz: 'America/New_York', label: 'New York (EDT/EST)' },
                          { tz: 'America/Los_Angeles', label: 'Los Angeles (PDT/PST)' },
                          { tz: 'Europe/London', label: 'London (GMT/BST)' },
                          { tz: 'Europe/Paris', label: 'Paris / Berlin (CET)' },
                          { tz: 'Asia/Tokyo', label: 'Tokyo (JST)' },
                          { tz: 'Asia/Kolkata', label: 'India (IST)' },
                          { tz: 'Asia/Dubai', label: 'Dubai (GST)' },
                          { tz: 'Australia/Sydney', label: 'Sydney (AEST)' },
                        ].map(city => {
                          const isSelected = settings.worldClockCities?.includes(city.tz);
                          return (
                            <label key={city.tz} className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => {
                                  const current = settings.worldClockCities || [];
                                  const updated = e.target.checked
                                    ? [...current, city.tz]
                                    : current.filter(c => c !== city.tz);
                                  updateSettings({ worldClockCities: updated });
                                }}
                                className="rounded text-blue-600"
                              />
                              <span className="truncate">{city.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Demo data management */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={seedDemoData}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 transition-colors"
                    >
                      Restore demo data
                    </button>
                    <button
                      type="button"
                      onClick={clearDemoData}
                      className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Clear demo data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. EVENT SETTINGS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 font-medium mb-1">
                    Default Meeting Duration
                  </label>
                  <select
                    value={settings.defaultEventDuration}
                    onChange={e => updateSettings({ defaultEventDuration: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.speedyMeetings}
                    onChange={e => updateSettings({ speedyMeetings: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <div>
                    <span className="font-semibold block">Speedy meetings</span>
                    <span className="text-[11px] text-gray-400">
                      End 30-minute meetings 5 minutes early, and longer meetings 10 minutes early.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoAddVideoCall}
                    onChange={e => updateSettings({ autoAddVideoCall: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Automatically add Chronos Video Meet link to newly scheduled events</span>
                </label>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Default guest permissions:</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.defaultGuestCanModify}
                      onChange={e => updateSettings({ defaultGuestCanModify: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Modify event</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.defaultGuestCanInviteOthers}
                      onChange={e => updateSettings({ defaultGuestCanInviteOthers: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Invite others</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.defaultGuestCanSeeGuests}
                      onChange={e => updateSettings({ defaultGuestCanSeeGuests: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>See guest list</span>
                  </label>
                </div>
              </div>
            )}

            {/* 3. VIEW OPTIONS TAB */}
            {activeTab === 'views' && (
              <div className="space-y-3 max-w-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showWeekends}
                    onChange={e => updateSettings({ showWeekends: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Show weekends in Month and Week views</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showDeclinedEvents}
                    onChange={e => updateSettings({ showDeclinedEvents: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Show declined events</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showCompletedTasks}
                    onChange={e => updateSettings({ showCompletedTasks: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Show completed tasks</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dimPastEvents}
                    onChange={e => updateSettings({ dimPastEvents: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Reduce brightness of past events</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showWeekNumbers}
                    onChange={e => updateSettings({ showWeekNumbers: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Show week numbers in Month view</span>
                </label>
              </div>
            )}

            {/* 4. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 max-w-xl">
                <p className="text-gray-600 dark:text-gray-400">
                  Configure default reminders applied to new appointments:
                </p>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Event notifications</span>
                    <span className="text-gray-500">10 minutes before</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">All-day event notifications</span>
                    <span className="text-gray-500">9:00 AM on day of event</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. WORKING HOURS & LOCATION TAB */}
            {activeTab === 'working' && (
              <div className="space-y-4 max-w-xl">
                <p className="text-gray-600 dark:text-gray-400">
                  Specify regular hours and working location for colleagues:
                </p>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Working days:</span>
                    <span className="font-semibold text-blue-600">Monday – Friday</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Working hours:</span>
                    <span className="font-semibold text-blue-600">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Default location:</span>
                    <span className="font-semibold text-emerald-600">Main Office</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. CALENDARS & SHARING TAB */}
            {activeTab === 'calendars' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="font-semibold">Select Calendar:</label>
                  <select
                    value={selectedCalendarId}
                    onChange={e => setSelectedCalendarId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold"
                  >
                    {calendars.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.isPrimary ? '(Primary)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {currentCal && (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 mb-1">Calendar Name</label>
                        <input
                          type="text"
                          value={currentCal.name}
                          onChange={e => updateCalendar({ ...currentCal, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentCal.color}
                            onChange={e => updateCalendar({ ...currentCal, color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent"
                          />
                          <span className="font-mono">{currentCal.color}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-500 mb-1">Description</label>
                      <input
                        type="text"
                        value={currentCal.description || ''}
                        onChange={e => updateCalendar({ ...currentCal, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                      />
                    </div>

                    {/* Sharing with specific people */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Share with specific people:
                      </p>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                        <span>alex.chen@chronos.io</span>
                        <span className="text-gray-400 font-medium">Make changes to events</span>
                      </div>
                    </div>

                    {/* Integration embed code & iCal secret URL */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Integrate calendar:</p>
                      <div className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-mono text-[11px] select-all truncate text-gray-500">
                        {`https://calendar.chronos.local/ical/${currentCal.id}.ics`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7. IMPORT & EXPORT TAB */}
            {activeTab === 'import_export' && (
              <div className="space-y-6 max-w-xl">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" /> Import events (.ics / .csv)
                  </h4>
                  <p className="text-gray-500">
                    Import events from iCalendar (.ics) or comma-separated value (.csv) files exported from other calendar apps.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Select .ics or .csv file
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-600" /> Export calendar data
                  </h4>
                  <p className="text-gray-500">
                    Download an RFC-compliant .ics backup file containing all your local calendar events and tasks.
                  </p>
                  <button
                    type="button"
                    onClick={exportICS}
                    className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export All (.ics)
                  </button>
                </div>
              </div>
            )}

            {/* STORAGE & COMPRESSION TAB */}
            {activeTab === 'storage' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-emerald-500" />
                    Local Storage & Compression Engine
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    All calendar items, tasks, and settings are saved locally on your device in browser LocalStorage. Data is automatically compressed on save and decompressed on demand to prevent storage quota limits.
                  </p>
                </div>

                {/* Storage Health & Compression Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                        {storageStats.totalSavingsPercent}% Storage Space Saved
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        LZ-String UTF-16 compression active on all LocalStorage keys
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={refreshStorageStats}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={optimizeStorage}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Database className="w-3.5 h-3.5" />
                      Optimize Storage
                    </button>
                  </div>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Original Size</span>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
                      {formatBytes(storageStats.totalOriginalBytes)}
                    </p>
                    <span className="text-[10px] text-gray-500">Uncompressed JSON</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Compressed</span>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {formatBytes(storageStats.totalCompressedBytes)}
                    </p>
                    <span className="text-[10px] text-gray-500">Stored in LocalStorage</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Compression</span>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {storageStats.totalSavingsPercent}%
                    </p>
                    <span className="text-[10px] text-gray-500">Footprint reduction</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Quota Left</span>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
                      {formatBytes(storageStats.estimatedRemainingQuotaBytes)}
                    </p>
                    <span className="text-[10px] text-gray-500">Of 5 MB browser limit</span>
                  </div>
                </div>

                {/* Quota Progress Bar */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600 dark:text-gray-400">LocalStorage Capacity Used</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {formatBytes(storageStats.totalCompressedBytes)} / 5.0 MB ({((storageStats.totalCompressedBytes / (5 * 1024 * 1024)) * 100).toFixed(2)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(1, (storageStats.totalCompressedBytes / (5 * 1024 * 1024)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Breakdown by Managed Key */}
                <div>
                  <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Storage Breakdown by Category
                  </h4>
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-850">
                    {storageStats.items.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-400">No stored keys detected</div>
                    ) : (
                      storageStats.items.map(item => (
                        <div key={item.key} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                              {item.key}
                            </span>
                            {item.isCompressed && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold">
                                LZ16
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                            <span>Orig: {formatBytes(item.originalBytes)}</span>
                            <span>&rarr;</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              Stored: {formatBytes(item.compressedBytes)}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                              -{item.savingsPercent}%
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Explanatory Architecture Note */}
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Offline-First Local Storage Security & Integrity
                  </p>
                  <p className="text-[11px] leading-relaxed text-blue-800/80 dark:text-blue-300/80">
                    Your data never leaves your browser. Because web browsers impose a strict 5 MB limit on LocalStorage, all serialized JSON is compressed into safe UTF-16 character buffers before persistence. Whenever you view or edit your calendar, items are seamlessly decompressed into React memory with zero latency.
                  </p>
                </div>
              </div>
            )}

            {/* 8. TRASH TAB */}
            {activeTab === 'trash' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500">
                    Items in trash will be permanently deleted after 30 days.
                  </p>
                  {trash.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Empty trash completely? This cannot be undone.')) {
                          emptyTrash();
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold transition-colors"
                    >
                      Empty trash
                    </button>
                  )}
                </div>

                {trash.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <Trash2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Trash is empty</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {trash.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                          <p className="text-[11px] text-gray-400">
                            {item.startDate} &bull; Deleted on {item.deletedAt?.split('T')[0]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => restoreFromTrash(item.id)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Restore
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteForeverFromTrash(item.id)}
                            className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete forever"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
