import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, ChevronRight } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';

interface CityTime {
  timeZone: string;
  cityName: string;
  timeStr: string;
  dayDiff: string;
}

export const WorldClock: React.FC = () => {
  const { settings } = useCalendar();
  const [isOpen, setIsOpen] = useState(true);
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  if (!settings.showWorldClock) return null;

  const cities = settings.worldClockCities || [
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Asia/Kolkata',
  ];

  const cityTimes: CityTime[] = cities.map(tz => {
    const cityName = tz.split('/').pop()?.replace(/_/g, ' ') || tz;
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: settings.timeFormat === '12h',
      });
      const timeStr = formatter.format(time);

      // Check day difference
      const localDay = time.getDate();
      const targetDayStr = new Intl.DateTimeFormat('en-US', { timeZone: tz, day: 'numeric' }).format(time);
      const targetDay = parseInt(targetDayStr, 10);
      let dayDiff = '';
      if (targetDay > localDay) dayDiff = '+1d';
      else if (targetDay < localDay) dayDiff = '-1d';

      return { timeZone: tz, cityName, timeStr, dayDiff };
    } catch {
      return { timeZone: tz, cityName, timeStr: '--:--', dayDiff: '' };
    }
  });

  return (
    <div className="py-1">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>World Clock</span>
        </div>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="px-3 py-1 space-y-1">
          {cityTimes.map(c => (
            <div
              key={c.timeZone}
              className="flex items-center justify-between py-1 px-2 rounded-lg bg-gray-50/60 dark:bg-gray-800/40 text-xs"
            >
              <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[110px]">
                {c.cityName}
              </span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-gray-600 dark:text-gray-400 font-semibold">
                <span>{c.timeStr}</span>
                {c.dayDiff && (
                  <span className="text-[9px] px-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                    {c.dayDiff}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
