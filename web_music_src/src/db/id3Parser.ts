import * as mm from 'music-metadata-browser'
import { Track, LyricLine } from '../types/music'
import { createGradientCover } from './demoTracks'

// Convert Uint8Array to Base64 data URL
export function uint8ArrayToDataUrl(data: Uint8Array, mimeType: string): string {
  let binary = ''
  const len = data.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i])
  }
  return `data:${mimeType};base64,${btoa(binary)}`
}

// Parse Synced LRC lyrics format: [mm:ss.xx] line
export function parseLrcLyrics(lrcText: string): LyricLine[] {
  if (!lrcText || typeof lrcText !== 'string') return []
  const lines = lrcText.split('\n')
  const result: LyricLine[] = []
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]/g

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    const matches = [...line.matchAll(timeRegex)]
    if (matches.length > 0) {
      const text = line.replace(timeRegex, '').trim()
      for (const match of matches) {
        const min = parseInt(match[1], 10)
        const sec = parseInt(match[2], 10)
        const msStr = match[3] || '0'
        const ms = parseFloat(`0.${msStr}`)
        const time = min * 60 + sec + ms
        result.push({ time, text })
      }
    }
  }

  return result.sort((a, b) => a.time - b.time)
}

// Fallback metadata parser from filename
export function parseFilenameMetadata(fileName: string): { title: string; artist: string; album: string; trackNo?: number } {
  // Strip extension
  const base = fileName.replace(/\.[^/.]+$/, '').trim()
  let title = base
  let artist = 'Unknown Artist'
  let album = 'Unknown Album'
  let trackNo: number | undefined = undefined

  // Match "01 - Artist - Title" or "01. Artist - Title"
  const trackNumMatch = base.match(/^(\d{1,3})[\s.-]+(.*)$/)
  let remainder = base
  if (trackNumMatch) {
    trackNo = parseInt(trackNumMatch[1], 10)
    remainder = trackNumMatch[2].trim()
  }

  // Match "Artist - Title"
  if (remainder.includes(' - ')) {
    const parts = remainder.split(' - ')
    if (parts.length >= 2) {
      artist = parts[0].trim()
      title = parts.slice(1).join(' - ').trim()
    }
  } else {
    title = remainder
  }

  return { title: title || 'Untitled Track', artist: artist || 'Unknown Artist', album, trackNo }
}

// Get audio duration using HTMLAudioElement fallback
export async function getAudioDuration(file: File | Blob): Promise<number> {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file)
      const audio = new Audio()
      audio.preload = 'metadata'
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url)
        resolve(Math.round(audio.duration) || 0)
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(0)
      }
      audio.src = url
    } catch {
      resolve(0)
    }
  })
}

// Palette options for generated covers
const GRADIENT_PALETTES = [
  ['#8b5cf6', '#ec4899'],
  ['#06b6d4', '#3b82f6'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#06b6d4'],
  ['#6366f1', '#a855f7'],
  ['#f43f5e', '#fb923c'],
]

export function pickGradientForName(name: string): [string, string] {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % GRADIENT_PALETTES.length
  return GRADIENT_PALETTES[idx] as [string, string]
}

// Master track parser from File
export async function parseAudioFile(file: File, relativePath?: string): Promise<Track> {
  const filePath = relativePath || file.webkitRelativePath || file.name
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3'

  let title = ''
  let artist = ''
  let album = ''
  let albumArtist: string | undefined = undefined
  let genre = 'Unknown'
  let year: number | undefined = undefined
  let trackNo: number | undefined = undefined
  let discNo: number | undefined = undefined
  let duration = 0
  let coverArt: string | undefined = undefined
  let lyrics: string | undefined = undefined
  let syncedLyrics: LyricLine[] | undefined = undefined
  let bitrate: number | undefined = undefined
  let sampleRate: number | undefined = undefined
  let channels: number | undefined = undefined

  try {
    const metadata = await mm.parseBlob(file, { duration: true, skipCovers: false })
    const common = metadata.common
    const format = metadata.format

    title = common.title?.trim() || ''
    artist = common.artist?.trim() || ''
    album = common.album?.trim() || ''
    albumArtist = common.albumartist?.trim() || undefined
    genre = Array.isArray(common.genre) ? common.genre.join(', ') : (common.genre || 'Music')
    year = common.year || undefined
    trackNo = common.track?.no || undefined
    discNo = common.disk?.no || undefined
    duration = Math.round(format.duration || 0)
    bitrate = format.bitrate ? Math.round(format.bitrate / 1000) : undefined
    sampleRate = format.sampleRate || undefined
    channels = format.numberOfChannels || undefined

    // Picture
    if (common.picture && common.picture.length > 0) {
      const pic = common.picture[0]
      coverArt = uint8ArrayToDataUrl(pic.data, pic.format || 'image/jpeg')
    }

    // Lyrics
    if (common.lyrics && common.lyrics.length > 0) {
      lyrics = common.lyrics[0]
      syncedLyrics = parseLrcLyrics(lyrics)
    }
  } catch (err) {
    console.warn(`[AuraBeat] ID3 parser fallback for ${file.name}:`, err)
  }

  // Fallbacks if metadata was empty or missing
  const fallback = parseFilenameMetadata(file.name)
  if (!title) title = fallback.title
  if (!artist || artist === 'Unknown Artist') artist = fallback.artist
  if (!album || album === 'Unknown Album') album = fallback.album
  if (!trackNo && fallback.trackNo) trackNo = fallback.trackNo

  if (!duration) {
    duration = await getAudioDuration(file)
  }

  if (!coverArt) {
    const [fromColor, toColor] = pickGradientForName(artist + title)
    coverArt = createGradientCover(title, artist, fromColor, toColor)
  }

  const trackId = `track-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  return {
    id: trackId,
    title,
    artist,
    album,
    albumArtist,
    genre,
    year,
    trackNo,
    discNo,
    duration,
    coverArt,
    lyrics,
    syncedLyrics: syncedLyrics && syncedLyrics.length > 0 ? syncedLyrics : undefined,
    filePath,
    fileName: file.name,
    fileSize: file.size,
    fileFormat: ext,
    bitrate,
    sampleRate,
    channels,
    dateAdded: new Date().toISOString(),
    playCount: 0,
    isFavorite: false,
    audioBlob: file,
    isDemo: false,
  }
}
