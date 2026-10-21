import React, { useRef, useState } from 'react'
import { Play, Pause, SkipForward, Disc } from 'lucide-react'
import { useMusic } from '../../context/MusicContext'

export const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    nextTrack,
    prevTrack,
    setIsNowPlayingOpen,
  } = useMusic()

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  if (!currentTrack) return null

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  // Touch Swipe Handlers (Swipe left = next, swipe right = prev, swipe down = dismiss)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return

    const diffX = e.changedTouches[0].clientX - touchStartX
    const diffY = e.changedTouches[0].clientY - touchStartY

    // Horizontal swipe threshold
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextTrack() // Swiped left -> next
      } else {
        prevTrack() // Swiped right -> prev
      }
    }

    setTouchStartX(null)
    setTouchStartY(null)
  }

  return (
    <div
      onClick={() => setIsNowPlayingOpen(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed bottom-14 md:bottom-4 left-0 right-0 md:left-64 md:right-4 z-20 mx-2 md:mx-auto max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer select-none transition-all duration-200 hover:shadow-2xl hover:border-fuchsia-500/30"
    >
      {/* Top thin progress line */}
      <div className="w-full h-1 bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="px-3.5 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Song Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-md">
            {currentTrack.coverArt ? (
              <img
                src={currentTrack.coverArt}
                alt=""
                className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <Disc className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentTrack.title}
            </h4>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {currentTrack.artist} • {currentTrack.album}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white flex items-center justify-center shadow-md shadow-fuchsia-600/30 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
}
