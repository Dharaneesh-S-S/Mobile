import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Plus,
  Check,
  Palette,
  Eye,
  Settings,
  Trash2,
  Download,
  Upload,
  Globe,
  Radio,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { CalendarCategory } from '../../types/calendar';

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#0284c7', // Sky
  '#0d9488', // Teal
  '#10b981', // Emerald
  '#16a34a', // Green
  '#ca8a04', // Yellow
  '#d97706', // Amber
  '#ea580c', // Orange
  '#dc2626', // Red
  '#e11d48', // Rose
  '#9333ea', // Purple
  '#4f46e5', // Indigo
];

export const CalendarList: React.FC = () => {
  const {
    calendars,
    toggleCalendarVisibility,
    setCalendarColor,
    displayOnlyCalendar,
    deleteCalendar,
    addCalendar,
    openSettings,
    importICS,
    exportICS,
  } = useCalendar();

  // Collapsible section toggles
  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [otherCalendarsOpen, setOtherCalendarsOpen] = useState(true);

  // Active menu and color picker popovers
  const [activeMenuCalId, setActiveMenuCalId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [colorPickerCalId, setColorPickerCalId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setActiveMenuCalId(null);
        setColorPickerCalId(null);
      }
      if (addMenuRef.current && !addMenuRef.current.contains(target)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const myCalendars = calendars.filter(c => !c.isSubscribed);
  const otherCalendars = calendars.filter(c => c.isSubscribed);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      if (content) {
        importICS(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowAddMenu(false);
  };

  const renderCalendarRow = (cal: CalendarCategory) => {
    const isMenuOpen = activeMenuCalId === cal.id;
    const isColorPickerOpen = colorPickerCalId === cal.id;

    return (
      <div
        key={cal.id}
        className="group relative flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleCalendarVisibility(cal.id)}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
        >
          <div
            className="w-4 h-4 rounded-md flex items-center justify-center transition-all flex-shrink-0"
            style={{
              backgroundColor: cal.isVisible ? cal.color : 'transparent',
              borderColor: cal.color,
              borderWidth: '2px',
            }}
          >
            {cal.isVisible && <Check className="w-3 h-3 text-white stroke-[3]" />}
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300 truncate font-medium">
            {cal.name}
          </span>
        </button>

        {/* Hover ⋮ Menu Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setActiveMenuCalId(isMenuOpen ? null : cal.id);
              setColorPickerCalId(null);
            }}
            className={`p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity ${
              isMenuOpen ? 'opacity-100 bg-gray-200 dark:bg-gray-700' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* Context Popover */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-1 w-52 rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-2xl border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Color Swatches Grid */}
              <div className="p-1 mb-1">
                <p className="text-[10px] uppercase font-semibold text-gray-400 mb-1.5 px-1">Calendar Color</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setCalendarColor(cal.id, color);
                        setActiveMenuCalId(null);
                      }}
                      className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    >
                      {cal.color.toLowerCase() === color.toLowerCase() && (
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
                {/* Custom Hex input */}
                <div className="mt-2 flex items-center gap-1.5 px-1">
                  <Palette className="w-3 h-3 text-gray-400" />
                  <input
                    type="color"
                    value={cal.color}
                    onChange={e => setCalendarColor(cal.id, e.target.value)}
                    className="w-6 h-5 rounded cursor-pointer border-0 bg-transparent"
                    title="Custom Color"
                  />
                  <span className="text-[10px] text-gray-500 font-mono uppercase">{cal.color}</span>
                </div>
              </div>

              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

              <div className="space-y-0.5 text-xs text-gray-700 dark:text-gray-300">
                <button
                  type="button"
                  onClick={() => {
                    displayOnlyCalendar(cal.id);
                    setActiveMenuCalId(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                  <span>Display this only</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openSettings('calendars');
                    setActiveMenuCalId(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-gray-400" />
                  <span>Settings and sharing</span>
                </button>

                {!cal.isPrimary && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${cal.name}" and all its events?`)) {
                        deleteCalendar(cal.id);
                        setActiveMenuCalId(null);
                      }
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-left transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hide from list</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="px-3 py-1 space-y-4 select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".ics,.ifb,.ical"
        className="hidden"
      />

      {/* My Calendars Section */}
      <div>
        <div className="flex items-center justify-between py-1 group">
          <button
            type="button"
            onClick={() => setMyCalendarsOpen(prev => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {myCalendarsOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <span>My calendars</span>
          </button>
        </div>

        {myCalendarsOpen && <div className="mt-1 space-y-0.5">{myCalendars.map(renderCalendarRow)}</div>}
      </div>

      {/* Other Calendars Section */}
      <div>
        <div className="flex items-center justify-between py-1">
          <button
            type="button"
            onClick={() => setOtherCalendarsOpen(prev => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {otherCalendarsOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <span>Other calendars</span>
          </button>

          {/* Plus Menu */}
          <div className="relative" ref={addMenuRef}>
            <button
              type="button"
              onClick={() => setShowAddMenu(prev => !prev)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Add other calendars"
            >
              <Plus className="w-4 h-4" />
            </button>

            {showAddMenu && (
              <div className="absolute right-0 top-full mt-1 w-60 rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-2xl border border-gray-100 dark:border-gray-700 z-50 text-xs text-gray-700 dark:text-gray-200 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    const name = prompt('Enter calendar name:');
                    if (name) addCalendar({ name, color: '#3b82f6' });
                    setShowAddMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Create new calendar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addCalendar({
                      name: 'Sports & Premier League',
                      color: '#059669',
                      isSubscribed: true,
                      description: 'Match schedule fixtures',
                    });
                    setShowAddMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Browse calendars of interest</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter public iCal / Webcal URL:');
                    if (url) {
                      addCalendar({
                        name: 'Subscribed Webcal',
                        color: '#8b5cf6',
                        isSubscribed: true,
                        description: url,
                      });
                    }
                    setShowAddMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-purple-500" />
                  <span>From URL</span>
                </button>

                <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Import (.ics)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportICS();
                    setShowAddMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Export all data (.ics)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {otherCalendarsOpen && (
          <div className="mt-1 space-y-0.5">
            {otherCalendars.length === 0 ? (
              <p className="px-2 py-1 text-[11px] text-gray-400">No subscribed calendars</p>
            ) : (
              otherCalendars.map(renderCalendarRow)
            )}
          </div>
        )}
      </div>
    </div>
  );
};
