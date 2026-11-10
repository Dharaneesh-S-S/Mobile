import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { ViewType } from '../../types/calendar';
import {
  RotateCw,
  Check,
  WifiOff,
} from 'lucide-react';
import { MOCK_ACCOUNTS } from '../../data/mockData';

export const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    currentView,
    setCurrentView,
    calendars,
    toggleCalendarVisibility,
    showToast,
  } = useCalendar();

  if (!sidebarOpen) return null;

  // View switcher items matching Screenshots 3 & 6
  const viewItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'schedule',
      label: 'Schedule',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="5" width="18" height="5" rx="2.5" />
          <rect x="3" y="14" width="18" height="5" rx="2.5" />
        </svg>
      ),
    },
    {
      id: 'day',
      label: 'Day',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
        </svg>
      ),
    },
    {
      id: 'three_day',
      label: '3 days',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="9" y1="4" x2="9" y2="22" />
          <line x1="15" y1="4" x2="15" y2="22" />
        </svg>
      ),
    },
    {
      id: 'week',
      label: 'Week',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="7.5" y1="4" x2="7.5" y2="22" />
          <line x1="12" y1="4" x2="12" y2="22" />
          <line x1="16.5" y1="4" x2="16.5" y2="22" />
        </svg>
      ),
    },
    {
      id: 'month',
      label: 'Month',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="4.5" height="4.5" rx="1" />
          <rect x="9.75" y="3" width="4.5" height="4.5" rx="1" />
          <rect x="16.5" y="3" width="4.5" height="4.5" rx="1" />
          <rect x="3" y="9.75" width="4.5" height="4.5" rx="1" />
          <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1" />
          <rect x="16.5" y="9.75" width="4.5" height="4.5" rx="1" />
          <rect x="3" y="16.5" width="4.5" height="4.5" rx="1" />
          <rect x="9.75" y="16.5" width="4.5" height="4.5" rx="1" />
          <rect x="16.5" y="16.5" width="4.5" height="4.5" rx="1" />
        </svg>
      ),
    },
  ];

  const handleRefresh = () => {
    showToast('Calendars synced', undefined, undefined, 'info');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        onClick={toggleSidebar}
      />

      {/* Slide-out Drawer */}
      <aside className="fixed inset-y-0 left-0 w-[290px] sm:w-[320px] max-w-[85vw] h-full z-50 bg-[#1e1f23] text-[#e3e3e3] shadow-2xl flex flex-col select-none overflow-y-auto animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="px-6 pt-5 pb-4">
          <h1 className="text-xl font-medium tracking-tight text-[#e3e3e3]">
            Google Calendar
          </h1>
        </div>

        {/* View Switcher items list */}
        <div className="px-3 py-1 space-y-1">
          {viewItems.map(item => {
            const isSelected = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentView(item.id);
                  toggleSidebar();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#37393e] text-white font-semibold shadow-xs'
                    : 'text-[#c4c7c5] hover:bg-[#282a2d] hover:text-white'
                }`}
              >
                <span className={isSelected ? 'text-[#a8c7fa]' : 'text-[#c4c7c5]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-[#2e3135]" />

        {/* Refresh row */}
        <div className="px-3 py-1">
          <button
            type="button"
            onClick={handleRefresh}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium text-[#c4c7c5] hover:bg-[#282a2d] hover:text-white transition-colors"
          >
            <RotateCw className="w-5 h-5 text-[#c4c7c5]" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-[#2e3135]" />

        {/* Calendars Section (Clean, no Gmail IDs) */}
        <div className="flex-1 px-4 py-2 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9aa0a6] px-1">
            Calendars
          </div>

          <div className="pl-1 space-y-2.5">
            {calendars.map(cal => {
              const isChecked = cal.isVisible;
              const color = cal.color || '#8ab4f8';

              return (
                <label
                  key={cal.id}
                  onClick={e => {
                    e.stopPropagation();
                    toggleCalendarVisibility(cal.id);
                  }}
                  className="flex items-center gap-3 py-1 cursor-pointer group"
                >
                  <div
                    className="w-4 h-4 rounded-xs border flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: isChecked ? color : 'transparent',
                      borderColor: isChecked ? color : '#8e918f',
                    }}
                  >
                    {isChecked && (
                      <Check className="w-3 h-3 text-[#041e49] stroke-[3]" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#c4c7c5] group-hover:text-white">
                    {cal.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};
