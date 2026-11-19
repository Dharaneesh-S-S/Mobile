import React, { useRef } from 'react';
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
import { RecurringConfirmDialog } from './components/modals/RecurringConfirmDialog';
import { DayMoneyDetailsModal } from './components/modals/DayMoneyDetailsModal';
import { SpeedDialFAB } from './components/common/SpeedDialFAB';
import { ToastContainer } from './components/common/ToastContainer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const CalendarApp: React.FC = () => {
  const { currentView, navigateNext, navigatePrev } = useCalendar();
  useKeyboardShortcuts();

  // Horizontal swipe navigation support across all calendar views
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum horizontal distance 45px and dominant over vertical scrolling
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped Left -> Next
        navigateNext();
      } else {
        // Swiped Right -> Previous
        navigatePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

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
      {/* Top Bar */}
      <TopBar />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side Navigation Drawer */}
        <Sidebar />

        {/* Central View Area with Swipe Gestures */}
        <main
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 flex flex-col min-w-0 overflow-hidden relative touch-pan-y"
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Speed Dial Floating Action Button */}
      <SpeedDialFAB />

      {/* Modals & Popovers */}
      <EventEditorModal />
      <EventDetailsPopover />
      <RecurringConfirmDialog />
      <DayMoneyDetailsModal />
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
