import React from 'react'
import {
  Play, Shuffle, FolderOpen, Heart, Sparkles, Clock,
  TrendingUp, Calendar, Disc, Flame, Sun, Zap, Moon, BarChart2
} from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { getTimeOfDayGreeting, formatDuration } from '../../utils/formatters'
import { Track } from '../../types/music'

export const HomeTab: React.FC<{
  tracks: Track[]
  onOpenStats: () => void
}> = ({ tracks, onOpenStats }) => {
  const {
    playTrack,
    toggleShuffle,
    setIsImportModalOpen,
    setActiveTab,
  } = useMusic()

  const greeting = getTimeOfDayGreeting()

  // Slices
  const favorites = tracks.filter(t => t.isFavorite)
  const recentlyAdded = [...tracks].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()).slice(0, 10)
  const mostPlayed = [...tracks].sort((a, b) => (b.playCount || 0) - (a.playCount || 0)).filter(t => (t.playCount || 0) > 0).slice(0, 10)
  const recentlyPlayed = [...tracks].filter(t => Boolean(t.lastPlayed)).sort((a, b) => new Date(b.lastPlayed!).getTime() - new Date(a.lastPlayed!).getTime()).slice(0, 10)

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks)
    }
  }

  const handleShuffleAll = () => {
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5)
      playTrack(shuffled[0], shuffled)
    }
  }

  return (
    <div className="space-y-6 pb-24 select-none">
      {/* Dynamic Time-of-Day Greeting Header */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-teal-950/60 via-[#062420]/70 to-[#031513]/80 border border-teal-500/30 overflow-hidden shadow-lg">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-[#19E6C8] font-bold text-xs uppercase tracking-wider">
            {greeting.icon === 'Sun' ? <Sun className="w-4 h-4" /> : greeting.icon === 'Zap' ? <Zap className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>Aura Daily Mix</span>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4FFFD] font-display tracking-tight">
              {greeting.greeting}
            </h2>
            <p className="text-xs text-[#94B5B0] mt-1">
              {greeting.subtitle} • {tracks.length} tracks available
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handlePlayAll}
              disabled={tracks.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-extrabold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play All</span>
            </button>
            <button
              type="button"
              onClick={handleShuffleAll}
              disabled={tracks.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/30 text-[#2DD4BF] font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-teal-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* Select Folder Banner (When user has only demo tracks or wants to add local songs) */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-[#061413]/70 border border-teal-500/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-[#19E6C8] border border-teal-400/30 flex items-center justify-center shrink-0">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F4FFFD]">
              Import Your Local Music Folder
            </h4>
            <p className="text-[11px] text-[#94B5B0]">
              Select a directory on your device to load your offline library
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsImportModalOpen(true)}
          className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0 transition-all active:scale-95"
        >
          Select Folder
        </button>
      </div>

      {/* 1. Recently Played Carousel */}
      {recentlyPlayed.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#19E6C8]" />
              <h3 className="text-sm font-bold text-[#F4FFFD] font-display">
                Recently Played
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('tracks')}
              className="text-xs font-semibold text-[#19E6C8] hover:text-[#2DD4BF] hover:underline"
            >
              See all
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {recentlyPlayed.map((track) => (
              <div
                key={`rec-${track.id}`}
                onClick={() => playTrack(track, recentlyPlayed)}
                className="w-36 shrink-0 group cursor-pointer"
              >
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-[#061816] border border-teal-500/20 shadow-md group-hover:shadow-[0_0_20px_rgba(25,230,200,0.2)] group-hover:border-teal-400/40 transition-all mb-2">
                  {track.coverArt ? (
                    <img src={track.coverArt} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-500/50">
                      <Disc className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-[#19E6C8] text-[#04100F] flex items-center justify-center shadow-lg shadow-teal-500/50">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-[#F4FFFD] truncate">
                  {track.title}
                </h4>
                <p className="text-[11px] font-medium text-[#94B5B0] truncate">
                  {track.artist}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Favorites Carousel */}
      {favorites.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#19E6C8] fill-[#19E6C8]" />
              <h3 className="text-sm font-bold text-[#F4FFFD] font-display">
                Favorites ({favorites.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('playlists')}
              className="text-xs font-semibold text-[#19E6C8] hover:text-[#2DD4BF] hover:underline"
            >
              Open playlist
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {favorites.map((track) => (
              <div
                key={`fav-${track.id}`}
                onClick={() => playTrack(track, favorites)}
                className="w-36 shrink-0 group cursor-pointer"
              >
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-[#061816] border border-teal-500/20 shadow-md group-hover:shadow-[0_0_20px_rgba(25,230,200,0.2)] group-hover:border-teal-400/40 transition-all mb-2">
                  {track.coverArt ? (
                    <img src={track.coverArt} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-500/50">
                      <Disc className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-[#19E6C8] text-[#04100F] flex items-center justify-center shadow-lg shadow-teal-500/50">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-[#F4FFFD] truncate">
                  {track.title}
                </h4>
                <p className="text-[11px] font-medium text-[#94B5B0] truncate">
                  {track.artist}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Most Played Carousel */}
      {mostPlayed.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#19E6C8]" />
            <h3 className="text-sm font-bold text-[#F4FFFD] font-display">
              Most Played
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {mostPlayed.map((track) => (
              <div
                key={`most-${track.id}`}
                onClick={() => playTrack(track, mostPlayed)}
                className="w-36 shrink-0 group cursor-pointer"
              >
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-[#061816] border border-teal-500/20 shadow-md group-hover:shadow-[0_0_20px_rgba(25,230,200,0.2)] group-hover:border-teal-400/40 transition-all mb-2">
                  {track.coverArt ? (
                    <img src={track.coverArt} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-500/50">
                      <Disc className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold font-mono text-[#19E6C8]">
                    {track.playCount} plays
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#F4FFFD] truncate">
                  {track.title}
                </h4>
                <p className="text-[11px] font-medium text-[#94B5B0] truncate">
                  {track.artist}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Listening Stats Preview Card */}
      <div
        onClick={onOpenStats}
        className="p-5 rounded-3xl bg-[#061413]/70 border border-teal-500/20 cursor-pointer hover:border-teal-400/40 shadow-sm transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-[#19E6C8] border border-teal-400/30 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F4FFFD] group-hover:text-[#19E6C8] transition-colors">
                Listening Stats & Insights
              </h4>
              <p className="text-xs text-[#94B5B0]">
                View your top artists, daily heatmap, and listening habits
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#19E6C8] group-hover:translate-x-1 transition-transform">
            View →
          </span>
        </div>
      </div>
    </div>
  )
}
