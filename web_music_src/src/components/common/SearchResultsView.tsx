import React, { useState, useEffect } from 'react'
import {
  Music2, Disc, Mic2, ListMusic, Play, Clock, X, Search
} from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'
import { Track, Playlist } from '../../types/music'

export const SearchResultsView: React.FC<{
  query: string
  tracks: Track[]
  playlists: Playlist[]
  onClose: () => void
}> = ({ query, tracks, playlists, onClose }) => {
  const { playTrack, setSearchQuery } = useMusic()
  const recentSearches = useLiveQuery(() => db.recentSearches.orderBy('timestamp').reverse().toArray(), []) || []

  // Record query into recentSearches when query is at least 2 chars
  useEffect(() => {
    if (query.trim().length >= 2) {
      const timer = setTimeout(() => {
        db.recentSearches.put({
          id: query.trim().toLowerCase(),
          query: query.trim(),
          timestamp: new Date().toISOString(),
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [query])

  const q = query.toLowerCase().trim()

  // Match Tracks
  const matchedTracks = tracks.filter(t =>
    t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q)
  ).slice(0, 8)

  // Match Albums
  const matchedAlbums = useMemo(() => {
    const map = new Map<string, { name: string; artist: string; coverArt?: string; tracks: Track[] }>()
    tracks.forEach(t => {
      if (t.album && t.album.toLowerCase().includes(q)) {
        if (!map.has(t.album)) {
          map.set(t.album, { name: t.album, artist: t.artist, coverArt: t.coverArt, tracks: [] })
        }
        map.get(t.album)!.tracks.push(t)
      }
    })
    return Array.from(map.values()).slice(0, 4)
  }, [tracks, q])

  // Match Artists
  const matchedArtists = useMemo(() => {
    const map = new Map<string, { name: string; image?: string; tracks: Track[] }>()
    tracks.forEach(t => {
      if (t.artist && t.artist.toLowerCase().includes(q)) {
        if (!map.has(t.artist)) {
          map.set(t.artist, { name: t.artist, image: t.coverArt, tracks: [] })
        }
        map.get(t.artist)!.tracks.push(t)
      }
    })
    return Array.from(map.values()).slice(0, 4)
  }, [tracks, q])

  // Match Playlists
  const matchedPlaylists = playlists.filter(p =>
    p.name.toLowerCase().includes(q)
  ).slice(0, 4)

  const hasAnyResults = matchedTracks.length > 0 || matchedAlbums.length > 0 || matchedArtists.length > 0 || matchedPlaylists.length > 0

  const handleClearHistory = async () => {
    await db.recentSearches.clear()
  }

  if (!query.trim()) {
    return (
      <div className="py-6 space-y-4 select-none">
        {/* Recent Searches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Recent Searches</span>
          </div>
          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs text-[#19E6C8] hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {recentSearches.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {recentSearches.slice(0, 8).map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSearchQuery(s.query)}
                className="px-3 py-1.5 rounded-xl bg-[#051211] hover:bg-[#071f1d] border border-teal-500/20 text-xs font-semibold text-slate-300 transition-colors"
              >
                {s.query}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No recent searches yet.</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-28 select-none">
      {!hasAnyResults ? (
        <div className="py-16 text-center space-y-2">
          <Search className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">No results found for "{query}"</h4>
          <p className="text-xs text-slate-500">Check spelling or search for another artist or title.</p>
        </div>
      ) : (
        <>
          {/* Matched Tracks */}
          {matchedTracks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#19E6C8] uppercase tracking-wider">
                <Music2 className="w-4 h-4" />
                <span>Songs</span>
              </div>
              <div className="space-y-1 divide-y divide-slate-800/40">
                {matchedTracks.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track, matchedTracks)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                        {track.coverArt ? (
                          <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Disc className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {track.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {track.artist} • {track.album}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Artists */}
          {matchedArtists.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                <Mic2 className="w-4 h-4" />
                <span>Artists</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {matchedArtists.map((artist) => (
                  <div
                    key={artist.name}
                    onClick={() => playTrack(artist.tracks[0], artist.tracks)}
                    className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 shrink-0">
                      {artist.image ? (
                        <img src={artist.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Mic2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold truncate text-slate-900 dark:text-white">{artist.name}</h5>
                      <p className="text-[10px] text-slate-400">{artist.tracks.length} tracks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Albums */}
          {matchedAlbums.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Disc className="w-4 h-4" />
                <span>Albums</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {matchedAlbums.map((album) => (
                  <div
                    key={album.name}
                    onClick={() => playTrack(album.tracks[0], album.tracks)}
                    className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                      {album.coverArt ? (
                        <img src={album.coverArt} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Disc className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold truncate text-slate-900 dark:text-white">{album.name}</h5>
                      <p className="text-[10px] text-slate-400 truncate">{album.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Playlists */}
          {matchedPlaylists.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <ListMusic className="w-4 h-4" />
                <span>Playlists</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {matchedPlaylists.map((pl) => (
                  <div
                    key={pl.id}
                    className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <ListMusic className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold truncate text-slate-900 dark:text-white">{pl.name}</h5>
                      <p className="text-[10px] text-slate-400">{pl.trackIds.length} songs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function useMemo<T>(factory: () => T, deps: any[]): T {
  return React.useMemo(factory, deps)
}
