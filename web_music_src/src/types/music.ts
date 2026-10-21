export interface Track {
  id: string
  title: string
  artist: string
  album: string
  albumArtist?: string
  genre: string
  year?: number
  trackNo?: number
  discNo?: number
  duration: number // seconds
  coverArt?: string // Data URL / Blob URL
  lyrics?: string
  syncedLyrics?: LyricLine[]
  filePath: string
  fileName: string
  fileSize: number
  fileFormat: string
  bitrate?: number
  sampleRate?: number
  channels?: number
  dateAdded: string
  playCount: number
  lastPlayed?: string
  isFavorite: boolean
  audioBlob?: Blob
  isDemo?: boolean
}

export interface LyricLine {
  time: number // in seconds
  text: string
}

export interface Album {
  id: string
  name: string
  artist: string
  trackCount: number
  totalDuration: number
  coverArt?: string
  year?: number
}

export interface Artist {
  id: string
  name: string
  trackCount: number
  albumCount: number
  image?: string
}

export interface Playlist {
  id: string
  name: string
  description?: string
  coverArt?: string
  trackIds: string[]
  createdAt: string
  updatedAt: string
  isSmart?: boolean
  smartRules?: SmartRule[]
  smartMatchMode?: 'all' | 'any'
  smartSortBy?: 'title' | 'artist' | 'dateAdded' | 'playCount' | 'random'
  smartLimit?: number
}

export interface SmartRule {
  id: string
  field: 'genre' | 'year' | 'artist' | 'playCount' | 'dateAddedDays' | 'durationSeconds' | 'isFavorite'
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between'
  value: string | number | boolean
  secondValue?: number
}

export interface EqPreset {
  id: string
  name: string
  bands: number[] // 10 gain values in dB (-12 to +12)
  isBuiltIn: boolean
}

export interface UserSettings {
  id: 'music-settings'
  theme: 'light' | 'dark' | 'system' | 'amoled'
  accentColor: string
  nowPlayingBackground: 'gradient' | 'blur' | 'solid'
  albumArtShape: 'rounded' | 'square' | 'circle'
  phoneFrame: boolean
  activeTabs: string[]
  minTrackLengthSeconds: number
  crossfadeSeconds: number
  gapless: boolean
  skipSilence: boolean
  resumeOnStart: boolean
  soundEffectsEnabled: boolean
  bassBoost: number // 0 - 100
  virtualizer: number // 0 - 100
  reverbPreset: 'none' | 'small' | 'hall' | 'stadium'
  loudnessNorm: boolean
  preamp: number // -6 to +6 dB
  balance: number // -1.0 to +1.0
  mono: boolean
  playbackSpeed: number // 0.5 to 2.0
  mediaSessionEnabled: boolean
}

export interface PlayEvent {
  id: string
  trackId: string
  timestamp: string
  durationPlayed: number
}

export interface QueueItem {
  queueId: string
  track: Track
}

export type RepeatMode = 'off' | 'all' | 'one'
export type VisualizerStyle = 'bars' | 'wave' | 'circle' | 'particles'
export type NavTab = 'home' | 'tracks' | 'playlists' | 'albums' | 'artists' | 'genres' | 'folders'
