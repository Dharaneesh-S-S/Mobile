import React, { useState } from 'react';
import { CalendarCategory, AdvancedSearchFilters } from '../../types/calendar';
import { X, Search, RotateCcw } from 'lucide-react';

interface AdvancedSearchPanelProps {
  calendars: CalendarCategory[];
  currentFilters: AdvancedSearchFilters | null;
  onApplyFilters: (filters: AdvancedSearchFilters | null) => void;
  onClose: () => void;
}

export const AdvancedSearchPanel: React.FC<AdvancedSearchPanelProps> = ({
  calendars,
  currentFilters,
  onApplyFilters,
  onClose,
}) => {
  const [what, setWhat] = useState(currentFilters?.what || currentFilters?.query || '');
  const [who, setWho] = useState(currentFilters?.who || '');
  const [where, setWhere] = useState(currentFilters?.where || '');
  const [doesntHave, setDoesntHave] = useState(currentFilters?.doesntHave || '');
  const [startDate, setStartDate] = useState(currentFilters?.startDate || '');
  const [endDate, setEndDate] = useState(currentFilters?.endDate || '');
  const [calendarId, setCalendarId] = useState(currentFilters?.calendarId || '');
  const [hasAttachment, setHasAttachment] = useState(currentFilters?.hasAttachment || false);

  const handleReset = () => {
    setWhat('');
    setWho('');
    setWhere('');
    setDoesntHave('');
    setStartDate('');
    setEndDate('');
    setCalendarId('');
    setHasAttachment(false);
    onApplyFilters(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!what && !who && !where && !doesntHave && !startDate && !endDate && !calendarId && !hasAttachment) {
      onApplyFilters(null);
      onClose();
      return;
    }
    onApplyFilters({
      query: what,
      what,
      who,
      where,
      doesntHave,
      startDate,
      endDate,
      calendarId,
      hasAttachment,
    });
    onClose();
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Advanced Search Options
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              What (keywords / title)
            </label>
            <input
              type="text"
              value={what}
              onChange={e => setWhat(e.target.value)}
              placeholder="e.g. Planning sync, Review"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Who (attendee or guest)
            </label>
            <input
              type="text"
              value={who}
              onChange={e => setWho(e.target.value)}
              placeholder="e.g. Alex, priya@chronos.io"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Where (location or room)
            </label>
            <input
              type="text"
              value={where}
              onChange={e => setWhere(e.target.value)}
              placeholder="e.g. Main Hall, Zoom"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Doesn't have
            </label>
            <input
              type="text"
              value={doesntHave}
              onChange={e => setDoesntHave(e.target.value)}
              placeholder="Words to exclude"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              In Calendar
            </label>
            <select
              value={calendarId}
              onChange={e => setCalendarId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All calendars</option>
              {calendars.map(cal => (
                <option key={cal.id} value={cal.id}>
                  {cal.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="adv_has_attachment"
            checked={hasAttachment}
            onChange={e => setHasAttachment(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="adv_has_attachment" className="text-xs text-gray-700 dark:text-gray-300 select-none cursor-pointer">
            Has attachments
          </label>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset filters
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Apply Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
