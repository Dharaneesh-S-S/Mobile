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
        <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-850/60 dark:bg-[#121929]/70 backdrop-blur-md p-1 rounded-2xl border border-slate-300/50 dark:border-white/[0.06]">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
            aria-label="Previous date"
          >
            <ChevronLeft size={17} strokeWidth={2.2} />
          </button>

          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            aria-label="Open date calendar"
          >
            <CalendarIcon size={14} className="text-emerald-500 shrink-0" />
            <span className="tracking-tight">{formatDateLabel(currentDate)}</span>
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
            aria-label="Next date"
          >
            <ChevronRight size={17} strokeWidth={2.2} />
          </button>
        </div>

        {/* Day / Week segmented toggle */}
        <div className="flex items-center bg-slate-200/60 dark:bg-[#121929]/70 backdrop-blur-md p-1 rounded-2xl text-xs font-bold border border-slate-300/50 dark:border-white/[0.06]">
          <button
            onClick={() => onToggleViewMode('day')}
            className={`px-3 py-1 rounded-xl transition-all ${
              viewMode === 'day'
                ? 'bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-sm font-bold border border-transparent dark:border-emerald-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => onToggleViewMode('week')}
            className={`px-3 py-1 rounded-xl transition-all ${
              viewMode === 'week'
                ? 'bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-sm font-bold border border-transparent dark:border-emerald-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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
        <div className="flex flex-col gap-3">
          {/* Native HTML5 Date Input for quick manual entry */}
          <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Recent Days
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
            {recentDays.map((d) => (
              <button
                key={d}
                onClick={() => {
                  onSelectDate(d)
                  setIsCalendarOpen(false)
                }}
                className={`p-3 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between ${
                  d === currentDate
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="font-bold">{formatDateLabel(d)}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{d}</span>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
