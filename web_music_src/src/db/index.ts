import Dexie, { type Table } from 'dexie'
import {
  Track, Playlist, EqPreset, UserSettings, PlayEvent
} from '../types/music'
import { generateDemoTracks, createGradientCover } from './demoTracks'

export class AuraBeatDatabase extends Dexie {
  tracks!: Table<Track, string>
  playlists!: Table<Playlist, string>
  eqPresets!: Table<EqPreset, string>
  settings!: Table<UserSettings, string>
  playEvents!: Table<PlayEvent, string>
  recentSearches!: Table<{ id: string; query: string; timestamp: string }, string>

  constructor() {
    super('AuraBeatDB')
    this.version(1).stores({
      tracks: 'id, title, artist, album, genre, year, dateAdded, playCount, isFavorite, filePath, fileName, isDemo',
      playlists: 'id, name, createdAt, isSmart',
      eqPresets: 'id, name, isBuiltIn',
      settings: 'id',
      playEvents: 'id, trackId, timestamp',
      recentSearches: 'id, timestamp',
    })
  }
}

export const db = new AuraBeatDatabase()

export const DEFAULT_EQ_PRESETS: EqPreset[] = [
  { id: 'preset-normal', name: 'Normal', bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], isBuiltIn: true },
  { id: 'preset-pop', name: 'Pop', bands: [-1, 1, 3, 4, 3, 0, -1, -2, -1, 1], isBuiltIn: true },
  { id: 'preset-rock', name: 'Rock', bands: [5, 3, 1, 0, -1, 0, 2, 4, 5, 5], isBuiltIn: true },
  { id: 'preset-jazz', name: 'Jazz', bands: [3, 2, 0, 1, 2, 2, 1, 2, 3, 3], isBuiltIn: true },
  { id: 'preset-classical', name: 'Classical', bands: [4, 3, 2, 1, -1, -1, 0, 2, 3, 4], isBuiltIn: true },
  { id: 'preset-dance', name: 'Dance', bands: [6, 5, 2, 0, 0, 1, 3, 4, 4, 0], isBuiltIn: true },
  { id: 'preset-bass-boost', name: 'Bass Boost', bands: [7, 6, 5, 3, 1, 0, 0, 0, 0, 0], isBuiltIn: true },
  { id: 'preset-treble-boost', name: 'Treble Boost', bands: [0, 0, 0, 0, 0, 1, 3, 5, 7, 8], isBuiltIn: true },
  { id: 'preset-vocal', name: 'Vocal', bands: [-2, -1, 0, 2, 4, 4, 3, 1, 0, -1], isBuiltIn: true },
  { id: 'preset-acoustic', name: 'Acoustic', bands: [4, 3, 1, 1, 2, 2, 3, 3, 4, 3], isBuiltIn: true },
  { id: 'preset-electronic', name: 'Electronic', bands: [5, 4, 1, 0, -2, 2, 1, 2, 4, 5], isBuiltIn: true },
]

export const DEFAULT_USER_SETTINGS: UserSettings = {
  id: 'music-settings',
  theme: 'dark',
  accentColor: '#19E6C8', // Neon Cyan / Teal per DESIGN_SPEC.md
  nowPlayingBackground: 'gradient',
  albumArtShape: 'rounded',
  phoneFrame: false,
  activeTabs: ['home', 'tracks', 'playlists', 'albums', 'artists', 'genres', 'folders'],
  minTrackLengthSeconds: 30,
  crossfadeSeconds: 2,
  gapless: true,
  skipSilence: false,
  resumeOnStart: true,
  soundEffectsEnabled: true,
  bassBoost: 20,
  virtualizer: 15,
  reverbPreset: 'none',
  loudnessNorm: true,
  preamp: 0,
  balance: 0,
  mono: false,
  playbackSpeed: 1.0,
  mediaSessionEnabled: true,
}

// Database Initializer
export async function initializeDatabase(): Promise<void> {
  const settingsCount = await db.settings.count()
  if (settingsCount === 0) {
    await db.settings.put(DEFAULT_USER_SETTINGS)
  } else {
    const cur = await db.settings.get('music-settings')
    if (cur && (!cur.accentColor || cur.accentColor.toLowerCase() === '#d946ef')) {
      await db.settings.update('music-settings', { accentColor: '#19E6C8' })
    }
  }

  // Ensure any existing demo tracks with legacy magenta/purple/orange covers get upgraded to teal
  try {
    const existingTracks = await db.tracks.toArray()
    for (const t of existingTracks) {
      if (t.isDemo) {
        if (t.id === 'demo-track-1') {
          const c = createGradientCover('Neon Horizon', 'Aura Soundscapes', '#064E3B', '#19E6C8')
          await db.tracks.update(t.id, { coverArt: c })
        } else if (t.id === 'demo-track-2') {
          const c = createGradientCover('Midnight Lofi', 'Echo Drift', '#042F2E', '#2DD4BF')
          await db.tracks.update(t.id, { coverArt: c })
        } else if (t.id === 'demo-track-3') {
          const c = createGradientCover('Acoustic Sunrise', 'Solar Strings', '#08332F', '#14B8A6')
          await db.tracks.update(t.id, { coverArt: c })
        } else if (t.id === 'demo-track-4') {
          const c = createGradientCover('Cyber Pulse', 'HyperWave', '#062420', '#38BDF8')
          await db.tracks.update(t.id, { coverArt: c })
        }
      }
    }
  } catch (err) {
    console.warn('[AuraBeat] Migration error:', err)
  }

  const presetCount = await db.eqPresets.count()
  if (presetCount === 0) {
    await db.eqPresets.bulkPut(DEFAULT_EQ_PRESETS)
  }

  const trackCount = await db.tracks.count()
  if (trackCount === 0) {
    // Generate synthesized demo tracks so player is 100% playable with zero imported files!
    try {
      const demoTracks = await generateDemoTracks()
      await db.tracks.bulkPut(demoTracks)

      // Create default starter playlists
      const now = new Date().toISOString()
      const demoFavs = demoTracks.filter(t => t.isFavorite).map(t => t.id)
      const allDemoIds = demoTracks.map(t => t.id)

      await db.playlists.bulkPut([
        {
          id: 'playlist-favorites',
          name: 'Favorites',
          description: 'Your favorite tracks',
          coverArt: demoTracks[0]?.coverArt,
          trackIds: demoFavs,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'playlist-vibes',
          name: 'Studio Vibes',
          description: 'Curated energetic electronic & chill beats',
          coverArt: demoTracks[1]?.coverArt,
          trackIds: allDemoIds,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'smart-electronic',
          name: 'Electronic Beats',
          description: 'Live-updating smart playlist of Electronic & Synthwave',
          trackIds: [],
          isSmart: true,
          smartRules: [
            { id: 'r1', field: 'genre', operator: 'contains', value: 'Electronic' },
            { id: 'r2', field: 'genre', operator: 'contains', value: 'Synthwave' },
          ],
          smartMatchMode: 'any',
          createdAt: now,
          updatedAt: now,
        },
      ])
    } catch (e) {
      console.warn('[AuraBeat] Error generating demo tracks:', e)
    }
  }
}

// Clear demo tracks helper
export async function clearDemoTracks(): Promise<number> {
  const demoTracks = await db.tracks.where('isDemo').equals(1).toArray()
  const demoIds = demoTracks.map(t => t.id)

  await db.transaction('rw', db.tracks, db.playlists, async () => {
    await db.tracks.where('isDemo').equals(1).delete()

    // Clean up playlists
    const playlists = await db.playlists.toArray()
    for (const pl of playlists) {
      const remaining = pl.trackIds.filter(id => !demoIds.includes(id))
      if (remaining.length !== pl.trackIds.length) {
        await db.playlists.update(pl.id, { trackIds: remaining, updatedAt: new Date().toISOString() })
      }
    }
  })

  return demoIds.length
}

// Record play event and update track stats
export async function recordPlayEvent(trackId: string, durationPlayed: number): Promise<void> {
  const track = await db.tracks.get(trackId)
  if (!track) return

  const now = new Date().toISOString()
  await db.transaction('rw', db.tracks, db.playEvents, async () => {
    await db.tracks.update(trackId, {
      playCount: (track.playCount || 0) + 1,
      lastPlayed: now,
    })

    await db.playEvents.add({
      id: `play-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      trackId,
      timestamp: now,
      durationPlayed,
    })
  })
}
