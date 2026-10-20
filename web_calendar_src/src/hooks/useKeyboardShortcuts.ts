import { useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';

export const useKeyboardShortcuts = () => {
  const {
    settings,
    goToToday,
    navigateNext,
    navigatePrev,
    setCurrentView,
    openEditor,
    openHelp,
    selectedEvent,
    deleteEvent,
    closeEventDetails,
    closeQuickCreate,
    closeEditor,
    closeSettings,
    closeHelp,
    closeBookingPage,
    closeRecurringDialog,
    setIsSearchOpen,
  } = useCalendar();

  useEffect(() => {
    if (!settings.enableShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      switch (e.key) {
        case 'c':
        case 'C':
          e.preventDefault();
          openEditor(null);
          break;

        case '/':
          e.preventDefault();
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;

        case 't':
        case 'T':
          e.preventDefault();
          goToToday();
          break;

        case 'j':
        case 'J':
        case 'n':
        case 'N':
          e.preventDefault();
          navigateNext();
          break;

        case 'k':
        case 'K':
        case 'p':
        case 'P':
          e.preventDefault();
          navigatePrev();
          break;

        case 'd':
        case 'D':
          e.preventDefault();
          setCurrentView('day');
          break;

        case 'w':
        case 'W':
          e.preventDefault();
          setCurrentView('week');
          break;

        case 'm':
        case 'M':
          e.preventDefault();
          setCurrentView('month');
          break;

        case 'y':
        case 'Y':
          e.preventDefault();
          setCurrentView('year');
          break;

        case 'a':
        case 'A':
          e.preventDefault();
          setCurrentView('schedule');
          break;

        case 'x':
        case 'X':
          e.preventDefault();
          setCurrentView('four_day');
          break;

        case 'e':
        case 'E':
          if (selectedEvent) {
            e.preventDefault();
            openEditor(selectedEvent);
          }
          break;

        case 'Delete':
        case 'Backspace':
          if (selectedEvent) {
            e.preventDefault();
            deleteEvent(selectedEvent.id);
            closeEventDetails();
          }
          break;

        case '?':
          e.preventDefault();
          openHelp();
          break;

        case 'Escape':
          e.preventDefault();
          closeEventDetails();
          closeQuickCreate();
          closeEditor();
          closeSettings();
          closeHelp();
          closeBookingPage();
          closeRecurringDialog();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    settings.enableShortcuts,
    goToToday,
    navigateNext,
    navigatePrev,
    setCurrentView,
    openEditor,
    openHelp,
    selectedEvent,
    deleteEvent,
    closeEventDetails,
    closeQuickCreate,
    closeEditor,
    closeSettings,
    closeHelp,
    closeBookingPage,
    closeRecurringDialog,
  ]);
};
