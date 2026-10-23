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
      className="fixed bottom-14 md:bottom-4 left-0 right-0 md:left-64 md:right-4 z-20 mx-2 md:mx-auto max-w-2xl bg-[#061413]/95 backdrop-blur-xl border border-teal-500/25 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer select-none transition-all duration-200 hover:shadow-2xl hover:border-teal-400/40"
    >
      {/* Top thin progress line */}
      <div className="w-full h-1 bg-black/40 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-[#19E6C8] transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="px-3.5 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Song Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#061816] border border-teal-500/20 shrink-0 shadow-md">
            {currentTrack.coverArt ? (
              <img
                src={currentTrack.coverArt}
                alt=""
                className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-teal-500/50">
                <Disc className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-[#F4FFFD] truncate">
              {currentTrack.title}
            </h4>
            <p className="text-[11px] font-medium text-[#94B5B0] truncate">
              {currentTrack.artist} • {currentTrack.album}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-[#19E6C8] hover:bg-[#2DD4BF] text-[#04100F] flex items-center justify-center shadow-md shadow-teal-500/30 active:scale-95 transition-all"
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
            className="p-2 rounded-full hover:bg-teal-500/10 text-[#94B5B0] hover:text-[#F4FFFD] transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
}
