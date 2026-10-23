import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, recordPlayEvent, DEFAULT_USER_SETTINGS } from '../db'
import {
  Track, Playlist, UserSettings, RepeatMode, NavTab
} from '../types/music'
import { audioEngine } from '../audio/AudioEngine'
import { updateMediaSession, updateMediaSessionPosition } from '../audio/mediaSession'

interface MusicContextType {
  // Playback state
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  speed: number
  shuffle: boolean
  repeat: RepeatMode

  // Queue
  queue: Track[]
  queueIndex: number
  history: Track[]

  // Modals & Screen Overlays
  isNowPlayingOpen: boolean
  setIsNowPlayingOpen: React.Dispatch<React.SetStateAction<boolean>>
  isQueueOpen: boolean
  setIsQueueOpen: React.Dispatch<React.SetStateAction<boolean>>
  isEqualizerOpen: boolean
  setIsEqualizerOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSleepTimerOpen: boolean
  setIsSleepTimerOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSettingsOpen: boolean
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isStatsOpen: boolean
  setIsStatsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isImportModalOpen: boolean
  setIsImportModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isEditTabsOpen: boolean
  setIsEditTabsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isShortcutsOpen: boolean
  setIsShortcutsOpen: React.Dispatch<React.SetStateAction<boolean>>

  // Navigation & Filter
  activeTab: NavTab
  setActiveTab: (tab: NavTab) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedTrackIds: string[]
  setSelectedTrackIds: React.Dispatch<React.SetStateAction<string[]>>

  // User Settings
  settings: UserSettings
  updateSettings: (partial: Partial<UserSettings>) => Promise<void>

  // Playback Actions
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>
  togglePlayPause: () => void
  seek: (seconds: number) => void
  seekRelative: (offsetSeconds: number) => void
  nextTrack: () => void
  prevTrack: () => void
  setVolume: (vol: number) => void
  toggleMute: () => void
  setSpeed: (speed: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void

  // Queue operations
  playNextInQueue: (track: Track) => void
  addToQueue: (tracks: Track | Track[]) => void
  removeFromQueue: (index: number) => void
  reorderQueue: (fromIdx: number, toIdx: number) => void
  clearQueue: () => void

  // Track operations
  toggleFavorite: (trackId: string) => Promise<void>
  updateTrackTags: (trackId: string, updates: Partial<Track>) => Promise<void>
  deleteTrack: (trackId: string) => Promise<void>
  bulkDeleteTracks: (trackIds: string[]) => Promise<void>
  addTracksToPlaylist: (playlistId: string, trackIds: string[]) => Promise<void>

  // A-B Repeat
  markerA: number | null
  markerB: number | null
  isAbRepeatActive: boolean
  setMarkerA: (time?: number) => void
  setMarkerB: (time?: number) => void
  clearAbRepeat: () => void

  // Sleep Timer
  sleepRemainingSeconds: number | null
  setSleepTimer: (minutes: number | 'end-of-track') => void
  cancelSleepTimer: () => void
}

const MusicContext = createContext<MusicContextType | null>(null)

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Database Live Queries
  const tracks = useLiveQuery(() => db.tracks.toArray(), []) || []
  const settingsLive = useLiveQuery(() => db.settings.get('music-settings'), [])
  const settings: UserSettings = settingsLive || DEFAULT_USER_SETTINGS

  // State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.85)
  const [isMuted, setIsMuted] = useState(false)
  const [speed, setSpeedState] = useState(1.0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<RepeatMode>('off')

  // Queue
  const [queue, setQueue] = useState<Track[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [history, setHistory] = useState<Track[]>([])

  // Overlays
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false)
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isEditTabsOpen, setIsEditTabsOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

  // Navigation & Multi-select
  const [activeTab, setActiveTab] = useState<NavTab>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([])

  // A-B Repeat
  const [markerA, setMarkerAState] = useState<number | null>(null)
  const [markerB, setMarkerBState] = useState<number | null>(null)
  const [isAbRepeatActive, setIsAbRepeatActiveState] = useState(false)

  // Sleep Timer
  const [sleepRemainingSeconds, setSleepRemainingSeconds] = useState<number | null>(null)
  const sleepIntervalRef = useRef<number | null>(null)

  // Refs for access inside callbacks
  const queueRef = useRef(queue)
  queueRef.current = queue
  const queueIndexRef = useRef(queueIndex)
  queueIndexRef.current = queueIndex
  const repeatRef = useRef(repeat)
  repeatRef.current = repeat
  const shuffleRef = useRef(shuffle)
  shuffleRef.current = shuffle
  const currentTrackRef = useRef(currentTrack)
  currentTrackRef.current = currentTrack
  const historyRef = useRef(history)
  historyRef.current = history

  // Synchronize AudioEngine Callbacks
  useEffect(() => {
    audioEngine.onTimeUpdate = (cur, dur) => {
      setCurrentTime(cur)
      setDuration(dur)
      updateMediaSessionPosition(cur, dur, speed)
    }

    audioEngine.onStateChange = (playing) => {
      setIsPlaying(playing)
    }

    audioEngine.onPlayCountThresholdReached = (track) => {
      recordPlayEvent(track.id, Math.round(audioEngine.audio.currentTime))
    }

    audioEngine.onTrackEnd = () => {
      handleTrackEnd()
    }

    audioEngine.onError = (msg) => {
      console.warn('[AuraBeat Player error]:', msg)
    }
  }, [speed])

  // Update Media Session whenever current track or playing state changes
  useEffect(() => {
    if (settings.mediaSessionEnabled) {
      updateMediaSession(currentTrack, isPlaying, {
        onPlay: () => togglePlayPause(),
        onPause: () => togglePlayPause(),
        onPrev: () => prevTrack(),
        onNext: () => nextTrack(),
        onSeek: (offset) => seekRelative(offset),
        onStop: () => {
          audioEngine.pause()
          setIsPlaying(false)
        },
      })
    }
  }, [currentTrack, isPlaying, settings.mediaSessionEnabled])

  // Theme effect (Light, Dark, AMOLED)
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'amoled')

    if (settings.theme === 'dark') {
      root.classList.add('dark')
    } else if (settings.theme === 'amoled') {
      root.classList.add('dark', 'amoled')
    } else if (settings.theme === 'light') {
      // Light mode default
    } else {
      // System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark')
      }
    }

    // Set accent color CSS variables (Enforce obsidian neon cyan #19E6C8)
    const effectiveAccent = (!settings.accentColor || settings.accentColor.toLowerCase() === '#d946ef') ? '#19E6C8' : settings.accentColor
    root.style.setProperty('--accent-color', effectiveAccent)
    root.style.setProperty('--accent-glow', `${effectiveAccent}55`)
  }, [settings.theme, settings.accentColor])

  // Apply sound settings to AudioEngine
  useEffect(() => {
    audioEngine.applySettings(settings)
  }, [settings])

  // Play a specific track
  const playTrack = useCallback(async (track: Track, newQueue?: Track[]) => {
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue)
      const foundIdx = newQueue.findIndex(t => t.id === track.id)
      setQueueIndex(foundIdx >= 0 ? foundIdx : 0)
    } else if (queueRef.current.length === 0) {
      setQueue([track])
      setQueueIndex(0)
    }

    if (currentTrackRef.current && currentTrackRef.current.id !== track.id) {
      setHistory(prev => [currentTrackRef.current!, ...prev.slice(0, 49)])
    }

    setCurrentTrack(track)
    await audioEngine.playTrack(track, 0, settings.crossfadeSeconds)

    // Reset A-B
    setMarkerAState(null)
    setMarkerBState(null)
    setIsAbRepeatActiveState(false)
  }, [settings.crossfadeSeconds])

  // Play next track in queue
  const nextTrack = useCallback(() => {
    const q = queueRef.current
    const idx = queueIndexRef.current
    if (q.length === 0) return

    if (repeatRef.current === 'one' && currentTrackRef.current) {
      audioEngine.seek(0)
      audioEngine.resume()
      return
    }

    let nextIdx = idx + 1
    if (shuffleRef.current) {
      nextIdx = Math.floor(Math.random() * q.length)
    }

    if (nextIdx < q.length) {
      setQueueIndex(nextIdx)
      playTrack(q[nextIdx])
    } else if (repeatRef.current === 'all') {
      setQueueIndex(0)
      playTrack(q[0])
    } else {
      // End of queue
      audioEngine.pause()
    }
  }, [playTrack])

  // Previous track
  const prevTrack = useCallback(() => {
    const curTime = audioEngine.audio.currentTime
    // If more than 3 seconds in, seek to beginning like on Android
    if (curTime > 3) {
      audioEngine.seek(0)
      return
    }

    const q = queueRef.current
    const idx = queueIndexRef.current
    if (q.length === 0) return

    const prevIdx = idx > 0 ? idx - 1 : q.length - 1
    setQueueIndex(prevIdx)
    playTrack(q[prevIdx])
  }, [playTrack])

  // Handle Track End
  const handleTrackEnd = useCallback(() => {
    if (repeatRef.current === 'one') {
      audioEngine.seek(0)
      audioEngine.resume()
      return
    }
    nextTrack()
  }, [nextTrack])

  const togglePlayPause = () => {
    if (!currentTrack) {
      // Pick first track from library if nothing loaded
      if (tracks.length > 0) {
        playTrack(tracks[0], tracks)
      }
      return
    }
    audioEngine.togglePlayPause()
  }

  const seek = (seconds: number) => {
    audioEngine.seek(seconds)
    setCurrentTime(seconds)
  }

  const seekRelative = (offsetSeconds: number) => {
    audioEngine.seekRelative(offsetSeconds)
  }

  const setVolume = (vol: number) => {
    setVolumeState(vol)
    audioEngine.setVolume(vol)
  }

  const toggleMute = () => {
    const muted = audioEngine.toggleMute()
    setIsMuted(muted)
  }

  const setSpeed = (newSpeed: number) => {
    setSpeedState(newSpeed)
    audioEngine.setSpeed(newSpeed)
  }

  const toggleShuffle = () => {
    setShuffle(prev => !prev)
  }

  const toggleRepeat = () => {
    setRepeat(prev => {
      if (prev === 'off') return 'all'
      if (prev === 'all') return 'one'
      return 'off'
    })
  }

  // Queue Operations
  const playNextInQueue = (track: Track) => {
    setQueue(prev => {
      const copy = [...prev]
      const insertAt = queueIndex + 1
      copy.splice(insertAt, 0, track)
      return copy
    })
  }

  const addToQueue = (newTracks: Track | Track[]) => {
    const arr = Array.isArray(newTracks) ? newTracks : [newTracks]
    setQueue(prev => [...prev, ...arr])
  }

  const removeFromQueue = (index: number) => {
    setQueue(prev => {
      const copy = [...prev]
      copy.splice(index, 1)
      return copy
    })
    if (index < queueIndex) {
      setQueueIndex(prev => Math.max(0, prev - 1))
    }
  }

  const reorderQueue = (fromIdx: number, toIdx: number) => {
    setQueue(prev => {
      const copy = [...prev]
      const [moved] = copy.splice(fromIdx, 1)
      copy.splice(toIdx, 0, moved)
      return copy
    })
  }

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack])
      setQueueIndex(0)
    } else {
      setQueue([])
      setQueueIndex(0)
    }
  }

  // Track CRUD
  const toggleFavorite = async (trackId: string) => {
    const tr = await db.tracks.get(trackId)
    if (!tr) return

    const newFav = !tr.isFavorite
    await db.tracks.update(trackId, { isFavorite: newFav })

    // Also update currentTrack if it matches
    if (currentTrack?.id === trackId) {
      setCurrentTrack(prev => prev ? { ...prev, isFavorite: newFav } : null)
    }

    // Sync with Favorites playlist
    const favPlaylist = await db.playlists.get('playlist-favorites')
    if (favPlaylist) {
      const updated = newFav
        ? [...new Set([...favPlaylist.trackIds, trackId])]
        : favPlaylist.trackIds.filter(id => id !== trackId)
      await db.playlists.update('playlist-favorites', {
        trackIds: updated,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  const updateTrackTags = async (trackId: string, updates: Partial<Track>) => {
    await db.tracks.update(trackId, updates)
    if (currentTrack?.id === trackId) {
      setCurrentTrack(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const deleteTrack = async (trackId: string) => {
    await db.tracks.delete(trackId)
    // Remove from queue
    setQueue(prev => prev.filter(t => t.id !== trackId))
    if (currentTrack?.id === trackId) {
      nextTrack()
    }
  }

  const bulkDeleteTracks = async (trackIds: string[]) => {
    await db.tracks.bulkDelete(trackIds)
    setQueue(prev => prev.filter(t => !trackIds.includes(t.id)))
    setSelectedTrackIds([])
    if (currentTrack && trackIds.includes(currentTrack.id)) {
      nextTrack()
    }
  }

  const addTracksToPlaylist = async (playlistId: string, trackIds: string[]) => {
    const pl = await db.playlists.get(playlistId)
    if (!pl) return
    const combined = [...new Set([...pl.trackIds, ...trackIds])]
    await db.playlists.update(playlistId, {
      trackIds: combined,
      updatedAt: new Date().toISOString(),
    })
  }

  // A-B Repeat methods
  const setMarkerA = (time?: number) => {
    audioEngine.setMarkerA(time)
    setMarkerAState(audioEngine.markerA)
    setIsAbRepeatActiveState(audioEngine.isAbRepeatActive)
  }

  const setMarkerB = (time?: number) => {
    audioEngine.setMarkerB(time)
    setMarkerBState(audioEngine.markerB)
    setIsAbRepeatActiveState(audioEngine.isAbRepeatActive)
  }

  const clearAbRepeat = () => {
    audioEngine.clearAbRepeat()
    setMarkerAState(null)
    setMarkerBState(null)
    setIsAbRepeatActiveState(false)
  }

  // Sleep Timer
  const setSleepTimer = (target: number | 'end-of-track') => {
    cancelSleepTimer()

    let seconds = 0
    if (target === 'end-of-track') {
      seconds = Math.max(1, Math.round(duration - currentTime))
    } else {
      seconds = target * 60
    }

    setSleepRemainingSeconds(seconds)

    audioEngine.startSleepFade(seconds, () => {
      setIsPlaying(false)
      setSleepRemainingSeconds(null)
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current)
    })

    sleepIntervalRef.current = window.setInterval(() => {
      setSleepRemainingSeconds(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(sleepIntervalRef.current!)
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelSleepTimer = () => {
    audioEngine.cancelSleepTimer()
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current)
      sleepIntervalRef.current = null
    }
    setSleepRemainingSeconds(null)
  }

  const updateSettings = async (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial }
    await db.settings.put(updated as UserSettings)
  }

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        speed,
        shuffle,
        repeat,
        queue,
        queueIndex,
        history,
        isNowPlayingOpen,
        setIsNowPlayingOpen,
        isQueueOpen,
        setIsQueueOpen,
        isEqualizerOpen,
        setIsEqualizerOpen,
        isSleepTimerOpen,
        setIsSleepTimerOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isStatsOpen,
        setIsStatsOpen,
        isImportModalOpen,
        setIsImportModalOpen,
        isEditTabsOpen,
        setIsEditTabsOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedTrackIds,
        setSelectedTrackIds,
        settings,
        updateSettings,
        playTrack,
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
        playNextInQueue,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        toggleFavorite,
        updateTrackTags,
        deleteTrack,
        bulkDeleteTracks,
        addTracksToPlaylist,
        markerA,
        markerB,
        isAbRepeatActive,
        setMarkerA,
        setMarkerB,
        clearAbRepeat,
        sleepRemainingSeconds,
        setSleepTimer,
        cancelSleepTimer,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}
