import React, { useState, useMemo } from 'react'
import { Mic2, Play, Disc, X, Music2 } from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'
import { Track } from '../../types/music'

export const ArtistsView: React.FC<{
  tracks: Track[]
}> = ({ tracks }) => {
  const { playTrack } = useMusic()
  const [selectedArtist, setSelectedArtist] = useState<{
    name: string
    image?: string
    albums: string[]
    tracks: Track[]
  } | null>(null)
  const [artistTab, setArtistTab] = useState<'tracks' | 'albums'>('tracks')

  // Aggregate artists
  const artists = useMemo(() => {
    const map = new Map<string, { name: string; image?: string; albums: Set<string>; tracks: Track[] }>()

    tracks.forEach((track) => {
      const name = track.artist || 'Unknown Artist'
      if (!map.has(name)) {
        map.set(name, {
          name,
          image: track.coverArt,
          albums: new Set<string>(),
          tracks: [],
        })
      }
      const entry = map.get(name)!
      if (track.album) entry.albums.add(track.album)
      entry.tracks.push(track)
      if (!entry.image && track.coverArt) entry.image = track.coverArt
    })

    return Array.from(map.values())
      .map(a => ({ ...a, albums: Array.from(a.albums) }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [tracks])

  return (
    <div className="space-y-4 pb-28 select-none">
      <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {artists.length} Artists
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.name}
            onClick={() => setSelectedArtist(artist)}
            className="flex flex-col items-center text-center p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-all group"
          >
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-slate-800 shadow-md group-hover:shadow-xl transition-all mb-2 ring-2 ring-transparent group-hover:ring-fuchsia-500">
              {artist.image ? (
                <img src={artist.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <Mic2 className="w-10 h-10" />
                </div>
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full">
              {artist.name}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {artist.albums.length} albums • {artist.tracks.length} tracks
            </p>
          </div>
        ))}
      </div>

      {/* Artist Detail Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
          <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden text-white">
            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={() => setSelectedArtist(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Artist Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-800 shrink-0 shadow-lg ring-2 ring-fuchsia-500/50">
                {selectedArtist.image ? (
                  <img src={selectedArtist.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Mic2 className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-[10px] uppercase font-bold text-fuchsia-400 tracking-wider">
                  Artist
                </span>
                <h3 className="text-lg font-extrabold truncate font-display">
                  {selectedArtist.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedArtist.albums.length} Albums • {selectedArtist.tracks.length} Tracks
                </p>
              </div>
            </div>

            {/* Tab switch: Tracks vs Albums */}
            <div className="flex gap-2 py-3 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setArtistTab('tracks')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  artistTab === 'tracks' ? 'bg-fuchsia-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Tracks ({selectedArtist.tracks.length})
              </button>
              <button
                type="button"
                onClick={() => setArtistTab('albums')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  artistTab === 'albums' ? 'bg-fuchsia-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Albums ({selectedArtist.albums.length})
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto space-y-1 pt-2 divide-y divide-slate-800/50">
              {artistTab === 'tracks' ? (
                selectedArtist.tracks.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => {
                      playTrack(track, selectedArtist.tracks)
                      setSelectedArtist(null)
                    }}
                    className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-slate-800/60 cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-200 truncate">
                        {track.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate">
                        {track.album}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                ))
              ) : (
                selectedArtist.albums.map((albumName) => (
                  <div
                    key={albumName}
                    className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-slate-800/60"
                  >
                    <Disc className="w-5 h-5 text-fuchsia-400" />
                    <span className="text-xs font-bold text-slate-200">
                      {albumName}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
