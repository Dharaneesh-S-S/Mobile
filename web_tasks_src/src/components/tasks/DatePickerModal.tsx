import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Repeat,
  Calendar as CalIcon,
  X,
  Check,
} from 'lucide-react';
import { RecurrenceRule, RecurrenceFrequency, RecurrenceEndType } from '../../types/tasks';
import {
  formatDateToYYYYMMDD,
  parseYYYYMMDD,
  formatTime,
} from '../../utils/dateHelpers';

interface DatePickerModalProps {
  initialDate?: string;
  initialTime?: string;
  initialRecurrence?: RecurrenceRule;
  onSave: (date?: string, time?: string, recurrence?: RecurrenceRule) => void;
  onClose: () => void;
  timeFormat?: '12h' | '24h';
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  initialDate,
  initialTime,
  initialRecurrence,
  onSave,
  onClose,
  timeFormat = '12h',
}) => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(initialTime);
  const [hasTime, setHasTime] = useState<boolean>(!!initialTime);
  const [recurrence, setRecurrence] = useState<RecurrenceRule>(
    initialRecurrence || { frequency: 'none', interval: 1, endType: 'never' }
  );
  const [isCustomRepeat, setIsCustomRepeat] = useState(recurrence.frequency === 'custom');

  // Month navigation
  const initialNavDate = selectedDate ? parseYYYYMMDD(selectedDate) : new Date();
  const [navYear, setNavYear] = useState(initialNavDate.getFullYear());
  const [navMonth, setNavMonth] = useState(initialNavDate.getMonth());

  // Generate calendar days for current nav month
  const firstDayOfMonth = new Date(navYear, navMonth, 1).getDay();
  const daysInMonth = new Date(navYear, navMonth + 1, 0).getDate();

  const prevMonthDays = new Date(navYear, navMonth, 0).getDate();
  const leadingDays = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: prevMonthDays - firstDayOfMonth + i + 1,
    isCurrentMonth: false,
    dateStr: formatDateToYYYYMMDD(new Date(navYear, navMonth - 1, prevMonthDays - firstDayOfMonth + i + 1)),
  }));

  const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
    dateStr: formatDateToYYYYMMDD(new Date(navYear, navMonth, i + 1)),
  }));

  const totalSlots = Math.ceil((leadingDays.length + currentDays.length) / 7) * 7;
  const trailingCount = totalSlots - (leadingDays.length + currentDays.length);
  const trailingDays = Array.from({ length: trailingCount }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: false,
    dateStr: formatDateToYYYYMMDD(new Date(navYear, navMonth + 1, i + 1)),
  }));

  const allCalendarDays = [...leadingDays, ...currentDays, ...trailingDays];

  const handlePrevMonth = () => {
    if (navMonth === 0) {
      setNavMonth(11);
      setNavYear(navYear - 1);
    } else {
      setNavMonth(navMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (navMonth === 11) {
      setNavMonth(0);
      setNavYear(navYear + 1);
    } else {
      setNavMonth(navMonth + 1);
    }
  };

  // Quick options
  const handleQuickOption = (type: 'today' | 'tomorrow' | 'nextWeek') => {
    const d = new Date();
    if (type === 'tomorrow') {
      d.setDate(d.getDate() + 1);
    } else if (type === 'nextWeek') {
      d.setDate(d.getDate() + 7);
    }
    const str = formatDateToYYYYMMDD(d);
    setSelectedDate(str);
    setNavYear(d.getFullYear());
    setNavMonth(d.getMonth());
  };

  // 15-minute time slots generator
  const timeSlots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      timeSlots.push(`${hh}:${mm}`);
    }
  }

  const handleDone = () => {
    onSave(
      selectedDate,
      hasTime ? selectedTime || '09:00' : undefined,
      recurrence.frequency !== 'none' ? recurrence : undefined
    );
    onClose();
  };

  const handleClear = () => {
    onSave(undefined, undefined, undefined);
    onClose();
  };

  const toggleDayOfWeek = (dayIdx: number) => {
    const current = recurrence.daysOfWeek || [];
    const exists = current.includes(dayIdx);
    const updated = exists ? current.filter(d => d !== dayIdx) : [...current, dayIdx].sort((a, b) => a - b);
    setRecurrence({ ...recurrence, daysOfWeek: updated });
  };

  const monthTitle = new Date(navYear, navMonth, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const todayStr = formatDateToYYYYMMDD(new Date());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-[#051211]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-teal-500/20 p-4 animate-pop-in max-h-[92vh] overflow-y-auto text-[#F4FFFD]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/20 mb-3">
          <div className="flex items-center gap-2">
            <CalIcon className="w-5 h-5 text-[#19E6C8]" />
            <h3 className="text-base font-bold text-[#F4FFFD]">Set date & time</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-teal-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Options */}
        <div className="grid grid-cols-3 gap-1.5 mb-3.5">
          <button
            type="button"
            onClick={() => handleQuickOption('today')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#081a18] hover:bg-teal-500/20 text-[#94B5B0] hover:text-[#19E6C8] border border-teal-500/20 transition"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleQuickOption('tomorrow')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#081a18] hover:bg-teal-500/20 text-[#94B5B0] hover:text-[#19E6C8] border border-teal-500/20 transition"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handleQuickOption('nextWeek')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#081a18] hover:bg-teal-500/20 text-[#94B5B0] hover:text-[#19E6C8] border border-teal-500/20 transition"
          >
            Next week
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-sm font-bold text-[#F4FFFD]">{monthTitle}</span>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-1 rounded-lg text-teal-400/70 hover:bg-teal-500/10 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNextMonth} className="p-1 rounded-lg text-teal-400/70 hover:bg-teal-500/10 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-4">
          {WEEKDAYS.map((w, idx) => (
            <div key={idx} className="text-[11px] font-bold text-teal-400/60 py-1 uppercase">
              {w}
            </div>
          ))}
          {allCalendarDays.map((d, idx) => {
            const isSelected = selectedDate === d.dateStr;
            const isCurrentToday = todayStr === d.dateStr;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDate(d.dateStr)}
                className={`h-8 rounded-lg text-xs font-medium flex items-center justify-center transition relative ${
                  isSelected
                    ? 'bg-[#19E6C8] text-[#030707] font-extrabold shadow-md shadow-teal-500/25'
                    : isCurrentToday
                    ? 'border border-[#19E6C8] text-[#19E6C8] font-bold'
                    : d.isCurrentMonth
                    ? 'text-[#F4FFFD] hover:bg-teal-500/15'
                    : 'text-teal-400/30 hover:bg-teal-500/10'
                }`}
              >
                {d.day}
              </button>
            );
          })}
        </div>

        {/* Time Selector */}
        <div className="border-t border-teal-500/20 pt-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#19E6C8]" />
              <span className="text-xs font-semibold text-[#F4FFFD]">Set time</span>
            </div>
            <input
              type="checkbox"
              id="enableTime"
              checked={hasTime}
              onChange={e => {
                setHasTime(e.target.checked);
                if (e.target.checked && !selectedTime) {
                  setSelectedTime('09:00');
                }
              }}
              className="w-4 h-4 rounded accent-[#19E6C8] cursor-pointer"
            />
          </div>

          {hasTime && (
            <select
              value={selectedTime || '09:00'}
              onChange={e => setSelectedTime(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-teal-500/30 bg-[#081a18] text-[#F4FFFD] text-xs focus:ring-2 focus:ring-[#19E6C8]/40"
            >
              {timeSlots.map(t => (
                <option key={t} value={t} className="bg-[#051211] text-[#F4FFFD]">
                  {formatTime(t, timeFormat)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Recurrence Dropdown */}
        <div className="border-t border-teal-500/20 pt-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="w-4 h-4 text-[#19E6C8]" />
            <span className="text-xs font-semibold text-[#F4FFFD]">Repeat</span>
          </div>

          <select
            value={recurrence.frequency}
            onChange={e => {
              const freq = e.target.value as RecurrenceFrequency;
              setRecurrence({ ...recurrence, frequency: freq });
              setIsCustomRepeat(freq === 'custom');
            }}
            className="w-full px-3 py-1.5 rounded-lg border border-teal-500/30 bg-[#081a18] text-[#F4FFFD] text-xs focus:ring-2 focus:ring-[#19E6C8]/40 mb-2"
          >
            <option value="none" className="bg-[#051211] text-[#F4FFFD]">Does not repeat</option>
            <option value="daily" className="bg-[#051211] text-[#F4FFFD]">Daily</option>
            <option value="weekly" className="bg-[#051211] text-[#F4FFFD]">Weekly</option>
            <option value="monthly" className="bg-[#051211] text-[#F4FFFD]">Monthly</option>
            <option value="yearly" className="bg-[#051211] text-[#F4FFFD]">Yearly</option>
            <option value="custom" className="bg-[#051211] text-[#F4FFFD]">Custom repeat...</option>
          </select>

          {/* Custom repeat options */}
          {isCustomRepeat && (
            <div className="p-3 bg-[#081a18] rounded-xl space-y-2.5 text-xs text-[#94B5B0] border border-teal-500/25">
              <div className="flex items-center gap-2">
                <span>Every</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={recurrence.interval}
                  onChange={e => setRecurrence({ ...recurrence, interval: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-14 px-2 py-1 rounded border border-teal-500/30 bg-[#051211] text-[#F4FFFD] text-center"
                />
                <span>day(s) / week(s)</span>
              </div>

              {/* Weekday chips */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {WEEKDAYS_FULL.map((name, idx) => {
                  const active = (recurrence.daysOfWeek || []).includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDayOfWeek(idx)}
                      className={`w-7 h-7 rounded-full text-[11px] font-bold transition ${
                        active
                          ? 'bg-[#19E6C8] text-[#030707] shadow-xs'
                          : 'bg-[#051211] text-[#94B5B0] border border-teal-500/20'
                      }`}
                    >
                      {name[0]}
                    </button>
                  );
                })}
              </div>

              {/* Ends */}
              <div className="pt-1 space-y-1.5">
                <div className="font-bold text-teal-400 text-[11px]">Ends</div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="endType"
                      checked={recurrence.endType === 'never'}
                      onChange={() => setRecurrence({ ...recurrence, endType: 'never' })}
                      className="accent-[#19E6C8]"
                    />
                    <span>Never</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="endType"
                      checked={recurrence.endType === 'after_count'}
                      onChange={() => setRecurrence({ ...recurrence, endType: 'after_count', endCount: 5 })}
                      className="accent-[#19E6C8]"
                    />
                    <span>After times</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-teal-500/20">
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition"
          >
            Clear
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#94B5B0] hover:bg-teal-500/10 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDone}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#19E6C8] text-[#030707] transition shadow-[0_0_15px_rgba(25,230,200,0.3)] hover:bg-[#2DD4BF]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
