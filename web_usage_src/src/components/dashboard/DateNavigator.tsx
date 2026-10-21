import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { formatDateLabel, getOffsetDateStr } from '../../utils/formatters'
import { BottomSheet } from '../common/BottomSheet'

interface DateNavigatorProps {
  currentDate: string
  onSelectDate: (date: string) => void
  viewMode: 'day' | 'week'
  onToggleViewMode: (mode: 'day' | 'week') => void
  minDate?: string
  maxDate?: string
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  currentDate,
  onSelectDate,
  viewMode,
  onToggleViewMode,
  minDate,
  maxDate,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handlePrev = () => {
    const prev = getOffsetDateStr(viewMode === 'day' ? -1 : -7, currentDate)
    if (!minDate || prev >= minDate) {
      onSelectDate(prev)
    }
  }

  const handleNext = () => {
    const next = getOffsetDateStr(viewMode === 'day' ? 1 : 7, currentDate)
    if (!maxDate || next <= maxDate) {
      onSelectDate(next)
    }
  }

  // Quick picker list for recent 14 days
  const recentDays = Array.from({ length: 14 }, (_, i) => {
    return getOffsetDateStr(-i)
  })

  return (
    <div className="flex flex-col gap-2.5 px-4 mb-3">
      <div className="flex items-center justify-between">
        {/* Date Selector with prev/next buttons */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-800/80 p-1 rounded-2xl">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 transition-colors"
            aria-label="Previous date"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            aria-label="Open date calendar"
          >
            <CalendarIcon size={14} className="text-emerald-500" />
            <span>{formatDateLabel(currentDate)}</span>
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 transition-colors"
            aria-label="Next date"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day / Week segmented toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-neutral-800/80 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => onToggleViewMode('day')}
            className={`px-3 py-1 rounded-xl transition-all ${
              viewMode === 'day'
                ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => onToggleViewMode('week')}
            className={`px-3 py-1 rounded-xl transition-all ${
              viewMode === 'week'
                ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Bottom Sheet */}
      <BottomSheet
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        title="Select Day"
        subtitle="Jump to any recorded date in the last 90 days"
      >
        <div className="flex flex-col gap-2">
          {/* Native HTML5 Date Input for quick manual entry */}
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
              Choose Specific Date
            </label>
            <input
              type="date"
              value={currentDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => {
                if (e.target.value) {
                  onSelectDate(e.target.value)
                  setIsCalendarOpen(false)
                }
              }}
              className="w-full px-3 py-2.5 rounded-2xl bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Recent Days
          </p>
          <div className="grid grid-cols-2 gap-2">
            {recentDays.map((d) => (
              <button
                key={d}
                onClick={() => {
                  onSelectDate(d)
                  setIsCalendarOpen(false)
                }}
                className={`p-3 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between ${
                  d === currentDate
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/60 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{formatDateLabel(d)}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">{d}</span>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
