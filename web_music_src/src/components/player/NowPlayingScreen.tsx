import React, { useState, useEffect, useRef } from 'react'
import {
  ChevronDown, Heart, Shuffle, Repeat, Play, Pause,
  SkipBack, SkipForward, Volume2, VolumeX, SlidersHorizontal,
  FileText, Activity, Moon, BookmarkPlus, Share2, MoreVertical,
  Gauge, Disc, Info, Edit3, BellRing, Repeat1
} from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'
import { extractColorsFromImage } from '../../utils/colorExtractor'
import { VisualizerView } from './VisualizerView'
import { LyricsView } from './LyricsView'

export const NowPlayingScreen: React.FC<{
  isOpen: boolean
  onClose: () => void
  onOpenDetails: () => void
  onOpenTagEditor: () => void
}> = ({ isOpen, onClose, onOpenDetails, onOpenTagEditor }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    speed,
    shuffle,
    repeat,
    togglePlayPause,
    seek,
    seekRelative,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    setSpeed,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    setIsQueueOpen,
    setIsEqualizerOpen,
    setIsSleepTimerOpen,
    markerA,
    markerB,
    isAbRepeatActive,
    setMarkerA,
    setMarkerB,
    clearAbRepeat,
    settings,
  } = useMusic()

  const [ambientColors, setAmbientColors] = useState<{ primary: string; secondary: string; glow: string }>({
    primary: '#8b5cf6',
    secondary: '#d946ef',
    glow: 'rgba(217, 70, 239, 0.4)',
  })
  const [activeTabOverlay, setActiveTabOverlay] = useState<'none' | 'visualizer' | 'lyrics'>('none')
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [ringtoneToast, setRingtoneToast] = useState(false)
  const [scrubPreviewTime, setScrubPreviewTime] = useState<number | null>(null)

  // Hold-to-seek timers
  const holdIntervalRef = useRef<number | null>(null)

  // Touch Swipe for Artwork
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const lastTapRef = useRef<number>(0)

  // Dynamic Ambient Lighting from Cover Art
  useEffect(() => {
    if (currentTrack?.coverArt) {
      extractColorsFromImage(currentTrack.coverArt).then(setAmbientColors)
    }
  }, [currentTrack?.coverArt])

  if (!isOpen || !currentTrack) return null

  // Tap-and-hold Seek handlers
  const handleStartSeekHold = (direction: 'back' | 'forward') => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    const step = direction === 'forward' ? 5 : -5
    seekRelative(step)
    holdIntervalRef.current = window.setInterval(() => {
      seekRelative(step)
    }, 400)
  }

  const handleStopSeekHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }

  // Double tap to play/pause & horizontal swipe
  const handleArtTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
  }

  const handleArtTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return

    const diffX = e.changedTouches[0].clientX - touchStartXRef.current
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current

    // Double tap check
    const now = Date.now()
    if (now - lastTapRef.current < 300 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
      togglePlayPause()
      lastTapRef.current = 0
      return
    }
    lastTapRef.current = now

    // Horizontal Swipe
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextTrack()
      } else {
        prevTrack()
      }
    }

    touchStartXRef.current = null
    touchStartYRef.current = null
  }

  const handleMockRingtone = () => {
    setShowMoreMenu(false)
    setRingtoneToast(true)
    setTimeout(() => setRingtoneToast(false), 3000)
  }

  const artShapeClasses = {
    rounded: 'rounded-3xl',
    square: 'rounded-none',
    circle: 'rounded-full',
  }[settings.albumArtShape || 'rounded']

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white select-none overflow-y-auto animate-in fade-in slide-in-from-bottom duration-300">
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 blur-3xl transition-all duration-700 -z-10"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${ambientColors.glow} 0%, rgba(15, 23, 42, 0.95) 75%)`,
        }}
      />

      {/* Top Header Bar */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Minimize Player"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Playing From
          </span>
          <span className="block text-xs font-bold text-white max-w-[200px] truncate">
            {currentTrack.album || 'Library'}
          </span>
        </div>

        {/* More Options ⋮ */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMoreMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-1.5 text-xs">
                <button
                  onClick={() => {
                    setShowMoreMenu(false)
                    onOpenDetails()
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-800 text-slate-200"
                >
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span>Track Details</span>
                </button>
                <button
                  onClick={() => {
                    setShowMoreMenu(false)
                    onOpenTagEditor()
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-800 text-slate-200"
                >
                  <Edit3 className="w-4 h-4 text-fuchsia-400" />
                  <span>Edit Tags & Cover</span>
                </button>
                <button
                  onClick={handleMockRingtone}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-800 text-slate-200"
                >
                  <BellRing className="w-4 h-4 text-amber-400" />
                  <span>Set as Ringtone</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Player Body */}
      <div className="flex-1 flex flex-col justify-between max-w-md w-full mx-auto px-6 py-2">
        {/* Center: Album Artwork OR Active Overlay (Lyrics / Visualizer) */}
        <div className="flex-1 flex items-center justify-center my-3 min-h-[260px]">
          {activeTabOverlay === 'none' ? (
            <div
              onTouchStart={handleArtTouchStart}
              onTouchEnd={handleArtTouchEnd}
              className={`relative w-72 h-72 sm:w-80 sm:h-80 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all cursor-pointer group select-none ring-1 ring-white/10 ${artShapeClasses}`}
              style={{ boxShadow: `0 20px 60px ${ambientColors.glow}` }}
            >
              {currentTrack.coverArt ? (
                <img
                  src={currentTrack.coverArt}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <Disc className="w-20 h-20" />
                </div>
              )}

              {/* Tap hint overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-semibold">
                Double tap: Play/Pause • Swipe: Change
              </div>
            </div>
          ) : activeTabOverlay === 'visualizer' ? (
            <VisualizerView
              isOpen={true}
              onClose={() => setActiveTabOverlay('none')}
              accentColor={ambientColors.primary}
            />
          ) : (
            <LyricsView
              isOpen={true}
              onClose={() => setActiveTabOverlay('none')}
            />
          )}
        </div>

        {/* Track Title, Artist, & Favorite Heart */}
        <div className="flex items-center justify-between gap-4 py-2 shrink-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold text-white truncate font-display tracking-tight">
              {currentTrack.title}
            </h1>
            <p className="text-sm font-semibold text-slate-400 truncate mt-0.5">
              {currentTrack.artist}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(currentTrack.id)}
            className={`p-2.5 rounded-full transition-all active:scale-90 ${
              currentTrack.isFavorite
                ? 'text-rose-500 bg-rose-500/20 shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white bg-white/10'
            }`}
            title={currentTrack.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-6 h-6 ${currentTrack.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Seek Bar & Timers & A-B Repeat Markers */}
        <div className="space-y-1.5 py-2 shrink-0">
          {/* A-B Repeat Marker Indicators */}
          {(markerA !== null || markerB !== null) && (
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-fuchsia-400 px-1">
              <span>{markerA !== null ? `A: ${formatDuration(markerA)}` : 'A: unset'}</span>
              <button
                type="button"
                onClick={clearAbRepeat}
                className="text-slate-400 hover:text-red-400 uppercase tracking-wider"
              >
                Clear A-B
              </button>
              <span>{markerB !== null ? `B: ${formatDuration(markerB)}` : 'B: unset'}</span>
            </div>
          )}

          <div className="relative group">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono font-medium text-slate-400">
            <span>{formatDuration(currentTime)}</span>
            <span>-{formatDuration(Math.max(0, duration - currentTime))}</span>
          </div>
        </div>

        {/* Playback Controls (Shuffle, Prev, Play/Pause, Next, Repeat) */}
        <div className="flex items-center justify-between py-3 shrink-0">
          <button
            type="button"
            onClick={toggleShuffle}
            className={`p-3 rounded-full transition-colors ${
              shuffle ? 'text-fuchsia-400 bg-fuchsia-950/60' : 'text-slate-400 hover:text-white'
            }`}
            title={`Shuffle: ${shuffle ? 'On' : 'Off'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            type="button"
            onMouseDown={() => handleStartSeekHold('back')}
            onMouseUp={handleStopSeekHold}
            onMouseLeave={handleStopSeekHold}
            onTouchStart={() => handleStartSeekHold('back')}
            onTouchEnd={handleStopSeekHold}
            onClick={() => prevTrack()}
            className="p-3 rounded-full text-slate-300 hover:text-white active:scale-95 transition-all"
            title="Previous (Hold to seek -5s)"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          {/* Large Main Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-fuchsia-600/40 active:scale-95 hover:scale-105 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          <button
            type="button"
            onMouseDown={() => handleStartSeekHold('forward')}
            onMouseUp={handleStopSeekHold}
            onMouseLeave={handleStopSeekHold}
            onTouchStart={() => handleStartSeekHold('forward')}
            onTouchEnd={handleStopSeekHold}
            onClick={() => nextTrack()}
            className="p-3 rounded-full text-slate-300 hover:text-white active:scale-95 transition-all"
            title="Next (Hold to seek +5s)"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            type="button"
            onClick={toggleRepeat}
            className={`p-3 rounded-full transition-colors ${
              repeat !== 'off' ? 'text-fuchsia-400 bg-fuchsia-950/60' : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>
        </div>

        {/* Secondary Bar: Volume & Speed & A-B Repeat Trigger */}
        <div className="flex items-center justify-between gap-3 py-2 bg-slate-900/60 rounded-2xl px-4 border border-white/5 shrink-0">
          {/* Volume */}
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={toggleMute}
              className="text-slate-400 hover:text-white"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 accent-fuchsia-500 cursor-pointer"
            />
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-xs">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-transparent text-slate-300 font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value="0.5" className="bg-slate-900">0.5x</option>
              <option value="0.75" className="bg-slate-900">0.75x</option>
              <option value="1.0" className="bg-slate-900">1.0x</option>
              <option value="1.25" className="bg-slate-900">1.25x</option>
              <option value="1.5" className="bg-slate-900">1.5x</option>
              <option value="2.0" className="bg-slate-900">2.0x</option>
            </select>
          </div>

          {/* A-B Repeat Action Buttons */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setMarkerA()}
              className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold text-[10px]"
              title="Set point A at current position"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setMarkerB()}
              className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold text-[10px]"
              title="Set point B at current position"
            >
              B
            </button>
          </div>
        </div>

        {/* Bottom Toolbar Icons (Lyrics, Visualizer, Sleep, EQ, Queue) */}
        <div className="flex items-center justify-around py-3 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTabOverlay(prev => prev === 'lyrics' ? 'none' : 'lyrics')}
            className={`p-2.5 rounded-2xl transition-colors ${
              activeTabOverlay === 'lyrics' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Lyrics (.lrc)"
          >
            <FileText className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTabOverlay(prev => prev === 'visualizer' ? 'none' : 'visualizer')}
            className={`p-2.5 rounded-2xl transition-colors ${
              activeTabOverlay === 'visualizer' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Visualizer"
          >
            <Activity className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsSleepTimerOpen(true)}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white transition-colors"
            title="Sleep Timer"
          >
            <Moon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsEqualizerOpen(true)}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white transition-colors"
            title="10-Band EQ"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsQueueOpen(true)}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white transition-colors"
            title="Play Queue"
          >
            <BookmarkPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ringtone Toast */}
      {ringtoneToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <BellRing className="w-4 h-4 text-emerald-400" />
          <span>Track set as phone ringtone (Mock notification)</span>
        </div>
      )}
    </div>
  )
}
