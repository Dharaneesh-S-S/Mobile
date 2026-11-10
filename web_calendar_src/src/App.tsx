import React from 'react';
import { CalendarProvider, useCalendar } from './context/CalendarContext';
import { TopBar } from './components/header/TopBar';
import { Sidebar } from './components/sidebar/Sidebar';
import { DayView } from './components/views/DayView';
import { ThreeDayView } from './components/views/ThreeDayView';
import { WeekView } from './components/views/WeekView';
import { FourDayView } from './components/views/FourDayView';
import { MonthView } from './components/views/MonthView';
import { YearView } from './components/views/YearView';
import { ScheduleView } from './components/views/ScheduleView';
import { EventEditorModal } from './components/modals/EventEditorModal';
import { EventDetailsPopover } from './components/modals/EventDetailsPopover';
import { SpeedDialFAB } from './components/common/SpeedDialFAB';
import { ToastContainer } from './components/common/ToastContainer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const CalendarApp: React.FC = () => {
  const { currentView } = useCalendar();
  useKeyboardShortcuts();

  const renderActiveView = () => {
    switch (currentView) {
      case 'schedule':
        return <ScheduleView />;
      case 'day':
        return <DayView />;
      case 'three_day':
        return <ThreeDayView />;
      case 'week':
        return <WeekView />;
      case 'four_day':
        return <FourDayView />;
      case 'month':
        return <MonthView />;
      case 'year':
        return <YearView />;
      default:
        return <MonthView />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#030707] text-[#e3e3e3] font-sans overflow-hidden select-none">
      {/* Top Bar (Screenshots 2 & 10) */}
      <TopBar />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side Navigation Drawer (Screenshots 3 & 6) */}
        <Sidebar />

        {/* Central View Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Speed Dial Floating Action Button (Screenshot 11) */}
      <SpeedDialFAB />

      {/* Modals & Popovers */}
      <EventEditorModal />
      <EventDetailsPopover />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CalendarProvider>
      <CalendarApp />
    </CalendarProvider>
  );
}
