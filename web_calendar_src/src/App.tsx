import React from 'react';
import { CalendarProvider, useCalendar } from './context/CalendarContext';
import { TopBar } from './components/header/TopBar';
import { Sidebar } from './components/sidebar/Sidebar';
import { RightDock } from './components/sidebar/RightDock';
import { TasksPanel } from './components/sidebar/TasksPanel';
import { DayView } from './components/views/DayView';
import { WeekView } from './components/views/WeekView';
import { FourDayView } from './components/views/FourDayView';
import { MonthView } from './components/views/MonthView';
import { YearView } from './components/views/YearView';
import { ScheduleView } from './components/views/ScheduleView';
import { QuickCreatePopover } from './components/modals/QuickCreatePopover';
import { EventEditorModal } from './components/modals/EventEditorModal';
import { EventDetailsPopover } from './components/modals/EventDetailsPopover';
import { SettingsModal } from './components/modals/SettingsModal';
import { HelpModal } from './components/modals/HelpModal';
import { PublicBookingModal } from './components/modals/PublicBookingModal';
import { RecurringConfirmDialog } from './components/modals/RecurringConfirmDialog';
import { ToastContainer } from './components/common/ToastContainer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const CalendarApp: React.FC = () => {
  const { currentView, tasksSidebarOpen } = useCalendar();
  useKeyboardShortcuts();

  const renderActiveView = () => {
    switch (currentView) {
      case 'day':
        return <DayView />;
      case 'week':
        return <WeekView />;
      case 'four_day':
        return <FourDayView />;
      case 'month':
        return <MonthView />;
      case 'year':
        return <YearView />;
      case 'schedule':
        return <ScheduleView />;
      default:
        return <WeekView />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden select-none">
      {/* Top Bar */}
      <TopBar />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Collapsible Sidebar */}
        <Sidebar />

        {/* Central View Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {renderActiveView()}
        </main>

        {/* Right Tasks Slide-out Panel */}
        {tasksSidebarOpen && <TasksPanel />}

        {/* Right Slim Utility Rail */}
        <RightDock />
      </div>

      {/* Modals, Popovers & Dialogs */}
      <QuickCreatePopover />
      <EventEditorModal />
      <EventDetailsPopover />
      <SettingsModal />
      <HelpModal />
      <PublicBookingModal />
      <RecurringConfirmDialog />
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
