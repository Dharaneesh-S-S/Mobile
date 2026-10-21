import React, { useState, useMemo } from 'react'
import {
  X, BarChart2, TrendingUp, Flame, Disc, Radio,
  Calendar, Trash2, Clock, Sparkles
} from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { formatDuration } from '../../utils/formatters'
import { Track, PlayEvent } from '../../types/music'

export const StatsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  tracks: Track[]
}> = ({ isOpen, onClose, tracks }) => {
  const [range, setRange] = useState<'week' | 'month' | 'year' | 'all'>('week')
  const playEvents = useLiveQuery(() => db.playEvents.toArray(), []) || []

  if (!isOpen) return null

  // Filter events by range
  const filteredEvents = useMemo(() => {
    const now = Date.now()
    let cutoff = 0
    if (range === 'week') cutoff = now - 7 * 86400000
    else if (range === 'month') cutoff = now - 30 * 86400000
    else if (range === 'year') cutoff = now - 365 * 86400000

    return playEvents.filter(e => new Date(e.timestamp).getTime() >= cutoff)
  }, [playEvents, range])

  // Total listening time
  const totalSecondsListened = useMemo(() => {
    return filteredEvents.reduce((acc, e) => acc + (e.durationPlayed || 30), 0)
  }, [filteredEvents])

  // Top Tracks
  const topTracks = useMemo(() => {
    const counts = new Map<string, number>()
    filteredEvents.forEach(e => {
      counts.set(e.trackId, (counts.get(e.trackId) || 0) + 1)
    })
    const trackMap = new Map(tracks.map(t => [t.id, t]))

    return Array.from(counts.entries())
      .map(([id, plays]) => ({ track: trackMap.get(id), plays }))
      .filter(item => Boolean(item.track))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 5)
  }, [filteredEvents, tracks])

  // Top Artists
  const topArtists = useMemo(() => {
    const counts = new Map<string, number>()
    const trackMap = new Map(tracks.map(t => [t.id, t]))
    filteredEvents.forEach(e => {
      const tr = trackMap.get(e.trackId)
      if (tr) {
        counts.set(tr.artist, (counts.get(tr.artist) || 0) + 1)
      }
    })
    return Array.from(counts.entries())
      .map(([artist, plays]) => ({ artist, plays }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 5)
  }, [filteredEvents, tracks])

  // Top Genres
  const topGenres = useMemo(() => {
    const counts = new Map<string, number>()
    const trackMap = new Map(tracks.map(t => [t.id, t]))
    filteredEvents.forEach(e => {
      const tr = trackMap.get(e.trackId)
      if (tr) {
        const g = tr.genre || 'Other'
        counts.set(g, (counts.get(g) || 0) + 1)
      }
    })
    const total = filteredEvents.length || 1
    return Array.from(counts.entries())
      .map(([genre, plays]) => ({
        genre,
        plays,
        percent: Math.round((plays / total) * 100),
      }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 4)
  }, [filteredEvents, tracks])

  // Day of week distribution (last 7 days)
  const dailyDistribution = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayCounts = Array(7).fill(0)
    filteredEvents.forEach(e => {
      const dayIdx = new Date(e.timestamp).getDay()
      dayCounts[dayIdx] += e.durationPlayed || 30
    })
    const maxVal = Math.max(...dayCounts, 1)
    return days.map((day, idx) => ({
      day,
      minutes: Math.round(dayCounts[idx] / 60),
      percent: Math.round((dayCounts[idx] / maxVal) * 100),
    }))
  }, [filteredEvents])

  // Clear history
  const handleClearHistory = async () => {
    if (confirm('Clear all listening history and play events?')) {
      await db.playEvents.clear()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none overflow-y-auto">
      <div className="w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-white space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                Listening Stats & Insights
              </h2>
              <p className="text-xs text-slate-400">
                On-device audio analytics
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Range Selector & Clear */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex gap-1 bg-slate-950/80 p-1 rounded-xl text-xs font-semibold">
            {(['week', 'month', 'year', 'all'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  range === r ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'All Time' : r}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleClearHistory}
            className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 text-xs flex items-center gap-1"
            title="Clear listening history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Listening Time
              </span>
              <span className="block text-lg font-extrabold text-emerald-400 font-display mt-0.5">
                {Math.round(totalSecondsListened / 60)} min
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tracks Played
              </span>
              <span className="block text-lg font-extrabold text-fuchsia-400 font-display mt-0.5">
                {filteredEvents.length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Streak
              </span>
              <span className="block text-lg font-extrabold text-amber-400 font-display mt-0.5 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>3 days</span>
              </span>
            </div>
          </div>

          {/* Daily Listening Bar Chart */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="block text-xs font-bold text-slate-200">
              Daily Listening (Minutes)
            </span>
            <div className="grid grid-cols-7 gap-2 h-28 items-end pt-2">
              {dailyDistribution.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-mono text-slate-400">{item.minutes}m</span>
                  <div
                    className="w-full max-w-[28px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-lg transition-all duration-300"
                    style={{ height: `${Math.max(6, item.percent)}%` }}
                  />
                  <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Genres Progress Breakdown */}
          {topGenres.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
              <span className="block text-xs font-bold text-slate-200">
                Top Genres
              </span>
              <div className="space-y-2">
                {topGenres.map((g) => (
                  <div key={g.genre} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span>{g.genre}</span>
                      <span className="text-emerald-400 font-mono">{g.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full"
                        style={{ width: `${g.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Tracks List */}
          {topTracks.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="block text-xs font-bold text-slate-200">
                Most Played Tracks
              </span>
              <div className="space-y-1 divide-y divide-slate-800/40">
                {topTracks.map((item, idx) => (
                  <div key={item.track!.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-bold text-slate-500 font-mono w-4">{idx + 1}</span>
                      <div className="min-w-0">
                        <h5 className="font-bold truncate text-slate-200">{item.track!.title}</h5>
                        <p className="text-[10px] text-slate-400 truncate">{item.track!.artist}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-fuchsia-400">
                      {item.plays} plays
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
