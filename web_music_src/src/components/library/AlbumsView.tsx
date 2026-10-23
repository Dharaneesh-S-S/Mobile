import React, { useState, useMemo } from 'react'
import { Disc, LayoutGrid, List, Play, Shuffle, Clock, X } from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'
import { Track, Album } from '../../types/music'

export const AlbumsView: React.FC<{
  tracks: Track[]
}> = ({ tracks }) => {
  const { playTrack } = useMusic()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAlbum, setSelectedAlbum] = useState<{
    name: string
    artist: string
    coverArt?: string
    year?: number
    tracks: Track[]
  } | null>(null)

  // Aggregate albums
  const albums = useMemo(() => {
    const map = new Map<string, { name: string; artist: string; coverArt?: string; year?: number; tracks: Track[] }>()

    tracks.forEach((track) => {
      const albumKey = track.album || 'Unknown Album'
      if (!map.has(albumKey)) {
        map.set(albumKey, {
          name: albumKey,
          artist: track.albumArtist || track.artist || 'Unknown Artist',
          coverArt: track.coverArt,
          year: track.year,
          tracks: [],
        })
      }
      map.get(albumKey)!.tracks.push(track)
    })

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [tracks])

  return (
    <div className="space-y-4 pb-28 select-none">
      {/* Header controls: Count & View Switch */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {albums.length} Albums
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#030d0c] border border-teal-500/20 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-[#19E6C8] text-[#04100F] font-bold shadow-sm' : 'text-[#94B5B0] hover:text-[#F4FFFD]'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list' ? 'bg-[#19E6C8] text-[#04100F] font-bold shadow-sm' : 'text-[#94B5B0] hover:text-[#F4FFFD]'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Albums Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map((album) => (
            <div
              key={album.name}
              onClick={() => setSelectedAlbum(album)}
              className="group cursor-pointer space-y-2"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#061816] border border-teal-500/20 shadow-md group-hover:shadow-[0_0_20px_rgba(25,230,200,0.2)] group-hover:border-teal-400/40 transition-all">
                {album.coverArt ? (
                  <img src={album.coverArt} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-teal-500/50">
                    <Disc className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-[#19E6C8] text-[#04100F] flex items-center justify-center shadow-lg shadow-teal-500/50">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {album.name}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {album.artist} • {album.tracks.length} tracks
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="space-y-1">
          {albums.map((album) => (
            <div
              key={album.name}
              onClick={() => setSelectedAlbum(album)}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  {album.coverArt ? (
                    <img src={album.coverArt} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Disc className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {album.name}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {album.artist}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {album.tracks.length} songs
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Album Detail Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
          <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Top Close */}
            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={() => setSelectedAlbum(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Album Header Banner */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 shrink-0 shadow-lg">
                {selectedAlbum.coverArt ? (
                  <img src={selectedAlbum.coverArt} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Disc className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#19E6C8] tracking-wider">
                  Album
                </span>
                <h3 className="text-lg font-extrabold truncate font-display text-[#F4FFFD]">
                  {selectedAlbum.name}
                </h3>
                <p className="text-xs font-semibold text-[#94B5B0] truncate">
                  {selectedAlbum.artist} {selectedAlbum.year ? `• ${selectedAlbum.year}` : ''}
                </p>
                <p className="text-[11px] text-teal-400/80 font-mono">
                  {selectedAlbum.tracks.length} tracks • {formatDuration(selectedAlbum.tracks.reduce((acc, t) => acc + (t.duration || 0), 0))}
                </p>
              </div>
            </div>

            {/* Play & Shuffle buttons */}
            <div className="flex gap-2 py-3">
              <button
                type="button"
                onClick={() => {
                  playTrack(selectedAlbum.tracks[0], selectedAlbum.tracks)
                  setSelectedAlbum(null)
                }}
                className="flex-1 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.22)] flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Album</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const shuffled = [...selectedAlbum.tracks].sort(() => Math.random() - 0.5)
                  playTrack(shuffled[0], shuffled)
                  setSelectedAlbum(null)
                }}
                className="flex-1 py-2.5 rounded-full bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/30 text-[#2DD4BF] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Shuffle className="w-4 h-4" />
                <span>Shuffle</span>
              </button>
            </div>

            {/* Track List */}
            <div className="flex-1 overflow-y-auto space-y-1 pt-2 divide-y divide-slate-800/50">
              {selectedAlbum.tracks.map((track, i) => (
                <div
                  key={track.id}
                  onClick={() => {
                    playTrack(track, selectedAlbum.tracks)
                    setSelectedAlbum(null)
                  }}
                  className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-5 text-[11px] font-mono font-bold text-slate-500 text-center">
                      {track.trackNo || i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-200 truncate">
                        {track.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
