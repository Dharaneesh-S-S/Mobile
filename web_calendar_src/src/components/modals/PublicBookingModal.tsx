import React, { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2, User, Mail, AlignLeft } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { formatDateToYYYYMMDD, formatTimeDisplay, addDays } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';

export const PublicBookingModal: React.FC = () => {
  const { isBookingPageOpen, bookingScheduleEvent, closeBookingPage, addEvent } = useCalendar();

  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateToYYYYMMDD(addDays(new Date(), 1)));
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [bookerNotes, setBookerNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!isBookingPageOpen || !bookingScheduleEvent) return null;

  const duration = bookingScheduleEvent.appointmentSchedule?.durationMinutes || 30;

  const availableSlots = [
    '09:00', '09:45', '10:30', '11:15', '14:00', '14:45', '15:30', '16:15',
  ];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookerName || !bookerEmail) return;

    const [h, m] = selectedTime.split(':').map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${endH < 10 ? `0${endH}` : endH}:${endM < 10 ? `0${endM}` : endM}`;

    // Create the booked event
    addEvent({
      type: 'event',
      title: `${bookingScheduleEvent.title} with ${bookerName}`,
      startDate: selectedDate,
      endDate: selectedDate,
      startTime: selectedTime,
      endTime,
      isAllDay: false,
      description: `Booked via public Chronos appointment page.\nBooker: ${bookerName} (${bookerEmail})\nNotes: ${bookerNotes || 'None'}`,
      videoConference: {
        id: `meet_${Date.now()}`,
        url: `https://meet.chronos.io/booked-${Math.random().toString(36).substring(2, 7)}`,
        platform: 'Chronos Video Meet',
      },
      guests: [
        { email: 'user@chronos.local', name: 'Host', status: 'yes' },
        { email: bookerEmail, name: bookerName, status: 'yes' },
      ],
    });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // safe fallback
    }

    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 dark:bg-black/70 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative select-none">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeBookingPage}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isBooked ? (
          <div className="p-8 md:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Appointment Confirmed!
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Your meeting with <span className="font-semibold text-gray-800 dark:text-gray-200">Chronos Host</span> has been scheduled for{' '}
              <span className="font-semibold text-blue-600">{selectedDate}</span> at{' '}
              <span className="font-semibold text-blue-600">{selectedTime}</span>.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={closeBookingPage}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left Info Panel */}
            <div className="md:col-span-2 p-6 md:p-8 bg-gray-50/70 dark:bg-gray-850 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                Public Booking Page
              </span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug">
                {bookingScheduleEvent.title}
              </h2>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>Chronos Video Meeting link provided</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{selectedDate} at {selectedTime}</span>
                </div>
              </div>
            </div>

            {/* Right Booking Form */}
            <div className="md:col-span-3 p-6 md:p-8 space-y-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                Select Date & Available Time
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-500 mb-1">Pick a Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">Time Slot</label>
                  <select
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Your Full Name</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:border-blue-500">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={bookerName}
                      onChange={e => setBookerName(e.target.value)}
                      placeholder="e.g. Jordan Smith"
                      className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Your Email Address</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:border-blue-500">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={bookerEmail}
                      onChange={e => setBookerEmail(e.target.value)}
                      placeholder="jordan.smith@example.com"
                      className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Meeting Notes / Agenda</label>
                  <textarea
                    value={bookerNotes}
                    onChange={e => setBookerNotes(e.target.value)}
                    rows={2}
                    placeholder="Topics to discuss or questions..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
