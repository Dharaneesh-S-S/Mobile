import { Track, Playlist, UserSettings, PlayEvent } from '../types/music'

// Generate standard M3U8 playlist content
export function exportPlaylistToM3u8(playlist: Playlist, tracks: Track[]): void {
  let content = '#EXTM3U\n'
  content += `#PLAYLIST:${playlist.name}\n\n`

  for (const track of tracks) {
    content += `#EXTINF:${Math.round(track.duration || 0)},${track.artist} - ${track.title}\n`
    content += `${track.filePath}\n\n`
  }

  const blob = new Blob([content], { type: 'audio/x-mpegurl;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${playlist.name.replace(/[/\\?%*:|"<>]/g, '_')}.m3u8`
  a.click()
  URL.revokeObjectURL(url)
}

// Export single playlist as JSON
export function exportPlaylistToJson(playlist: Playlist, tracks: Track[]): void {
  const data = {
    aurabeat_version: '1.0',
    type: 'playlist',
    playlist,
    tracksSummary: tracks.map(t => ({
      title: t.title,
      artist: t.artist,
      album: t.album,
      duration: t.duration,
      fileName: t.fileName,
    })),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${playlist.name.replace(/[/\\?%*:|"<>]/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Full app backup JSON (Playlists, Favorites, Settings, Play Count history)
export function exportFullBackupJson(
  playlists: Playlist[],
  settings: UserSettings,
  playEvents: PlayEvent[],
  favoriteTrackKeys: { title: string; artist: string }[]
): void {
  const backup = {
    aurabeat_version: '1.0',
    exportDate: new Date().toISOString(),
    settings,
    playlists,
    playEvents,
    favoriteTracks: favoriteTrackKeys,
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `AuraBeat_Backup_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
