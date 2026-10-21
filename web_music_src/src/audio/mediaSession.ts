import { Track } from '../types/music'

export interface MediaSessionCallbacks {
  onPlay: () => void
  onPause: () => void
  onPrev: () => void
  onNext: () => void
  onSeek: (toSeconds: number) => void
  onStop: () => void
}

export function updateMediaSession(track: Track | null, isPlaying: boolean, callbacks: MediaSessionCallbacks): void {
  if (!('mediaSession' in navigator)) return

  if (!track) {
    navigator.mediaSession.metadata = null
    navigator.mediaSession.playbackState = 'none'
    return
  }

  // Set Metadata
  const artwork = track.coverArt
    ? [
        { src: track.coverArt, sizes: '96x96', type: 'image/jpeg' },
        { src: track.coverArt, sizes: '256x256', type: 'image/jpeg' },
        { src: track.coverArt, sizes: '512x512', type: 'image/jpeg' },
      ]
    : []

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: track.album || 'AuraBeat Music',
    artwork,
  })

  navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'

  // Action handlers
  try {
    navigator.mediaSession.setActionHandler('play', () => callbacks.onPlay())
    navigator.mediaSession.setActionHandler('pause', () => callbacks.onPause())
    navigator.mediaSession.setActionHandler('previoustrack', () => callbacks.onPrev())
    navigator.mediaSession.setActionHandler('nexttrack', () => callbacks.onNext())
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skipTime = details.seekOffset || 5
      callbacks.onSeek(Math.max(0, -skipTime))
    })
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset || 5
      callbacks.onSeek(skipTime)
    })
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (typeof details.seekTime === 'number') {
        callbacks.onSeek(details.seekTime)
      }
    })
    navigator.mediaSession.setActionHandler('stop', () => callbacks.onStop())
  } catch (err) {
    console.warn('[AuraBeat] MediaSession action registration:', err)
  }
}

export function updateMediaSessionPosition(position: number, duration: number, speed: number = 1.0): void {
  if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return
  if (duration <= 0 || isNaN(duration)) return

  try {
    navigator.mediaSession.setPositionState({
      duration: Math.max(0, duration),
      playbackRate: speed,
      position: Math.min(position, duration),
    })
  } catch {
    // Ignore transient position sync errors
  }
}
