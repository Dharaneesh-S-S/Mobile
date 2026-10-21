import React, { useState } from 'react'
import {
  ListMusic, Plus, Play, Shuffle, Sparkles, Heart,
  Clock, Flame, Download, Trash2, Edit3, X, CheckSquare,
  Square, Disc, Layers, ArrowUp, ArrowDown
} from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'
import { filterTracksBySmartRules } from '../../utils/smartPlaylistRules'
import { exportPlaylistToM3u8, exportPlaylistToJson } from '../../utils/exportImport'
import { Track, Playlist, SmartRule } from '../../types/music'

export const PlaylistsView: React.FC<{
  tracks: Track[]
  onOpenCreatePlaylist: () => void
  onOpenSmartPlaylist: () => void
}> = ({ tracks, onOpenCreatePlaylist, onOpenSmartPlaylist }) => {
  const { playTrack, deleteTrack } = useMusic()
  const dbPlaylists = useLiveQuery(() => db.playlists.toArray(), []) || []

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [editingName, setEditingName] = useState<string | null>(null)

  // Auto playlists resolution
  const getPlaylistTracks = (pl: Playlist): Track[] => {
    if (pl.isSmart) {
      return filterTracksBySmartRules(tracks, pl)
    }
    // Match trackIds
    const trackMap = new Map(tracks.map(t => [t.id, t]))
    return pl.trackIds.map(id => trackMap.get(id)).filter(Boolean) as Track[]
  }

  // Cover Mosaic: up to 4 album arts for playlist cover
  const renderMosaicCover = (playlistTracks: Track[], fallbackCover?: string) => {
    const artList = playlistTracks.map(t => t.coverArt).filter(Boolean) as string[]
    const uniqueArts = Array.from(new Set(artList)).slice(0, 4)

    if (uniqueArts.length >= 4) {
      return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2">
          {uniqueArts.map((art, idx) => (
            <img key={idx} src={art} alt="" className="w-full h-full object-cover" />
          ))}
        </div>
      )
    } else if (uniqueArts.length > 0) {
      return <img src={uniqueArts[0]} alt="" className="w-full h-full object-cover" />
    } else if (fallbackCover) {
      return <img src={fallbackCover} alt="" className="w-full h-full object-cover" />
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
        <ListMusic className="w-8 h-8" />
      </div>
    )
  }

  const handleDeletePlaylist = async (playlistId: string) => {
    if (confirm('Delete this playlist?')) {
      await db.playlists.delete(playlistId)
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null)
      }
    }
  }

  const handleRemoveTrackFromPlaylist = async (trackId: string) => {
    if (!selectedPlaylist) return
    const updated = selectedPlaylist.trackIds.filter(id => id !== trackId)
    await db.playlists.update(selectedPlaylist.id, { trackIds: updated, updatedAt: new Date().toISOString() })
    setSelectedPlaylist(prev => prev ? { ...prev, trackIds: updated } : null)
  }

  const handleReorderPlaylistTrack = async (fromIdx: number, toIdx: number) => {
    if (!selectedPlaylist) return
    const copy = [...selectedPlaylist.trackIds]
    const [moved] = copy.splice(fromIdx, 1)
    copy.splice(toIdx, 0, moved)
    await db.playlists.update(selectedPlaylist.id, { trackIds: copy, updatedAt: new Date().toISOString() })
    setSelectedPlaylist(prev => prev ? { ...prev, trackIds: copy } : null)
  }

  return (
    <div className="space-y-5 pb-28 select-none">
      {/* Header with Create actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {dbPlaylists.length} Playlists
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSmartPlaylist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 text-purple-700 dark:text-purple-300 font-semibold text-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Smart Rule</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreatePlaylist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold text-xs shadow-sm shadow-fuchsia-600/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Playlist</span>
          </button>
        </div>
      </div>

      {/* Playlist Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dbPlaylists.map((playlist) => {
          const pTracks = getPlaylistTracks(playlist)
          return (
            <div
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              className="group cursor-pointer space-y-2"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 shadow-md group-hover:shadow-xl transition-all">
                {renderMosaicCover(pTracks, playlist.coverArt)}
                {playlist.isSmart && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Smart
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-fuchsia-600/50">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {playlist.name}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {pTracks.length} tracks
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Playlist Detail Modal */}
      {selectedPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
          <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Top Close & Menu */}
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => exportPlaylistToM3u8(selectedPlaylist, getPlaylistTracks(selectedPlaylist))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 flex items-center gap-1"
                  title="Export .m3u8"
                >
                  <Download className="w-3 h-3" />
                  <span>.m3u8</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportPlaylistToJson(selectedPlaylist, getPlaylistTracks(selectedPlaylist))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 flex items-center gap-1"
                  title="Export JSON"
                >
                  <Download className="w-3 h-3" />
                  <span>JSON</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeletePlaylist(selectedPlaylist.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800"
                  title="Delete Playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlaylist(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Playlist Header */}
            {(() => {
              const currentPTracks = getPlaylistTracks(selectedPlaylist)
              return (
                <>
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 shrink-0 shadow-lg">
                      {renderMosaicCover(currentPTracks, selectedPlaylist.coverArt)}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-fuchsia-400 tracking-wider flex items-center gap-1">
                        {selectedPlaylist.isSmart ? <Sparkles className="w-3 h-3" /> : <ListMusic className="w-3 h-3" />}
                        {selectedPlaylist.isSmart ? 'Smart Playlist' : 'Custom Playlist'}
                      </span>
                      <h3 className="text-lg font-extrabold truncate font-display">
                        {selectedPlaylist.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {selectedPlaylist.description || `${currentPTracks.length} tracks`}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {currentPTracks.length} tracks • {formatDuration(currentPTracks.reduce((acc, t) => acc + (t.duration || 0), 0))}
                      </p>
                    </div>
                  </div>

                  {/* Play & Shuffle buttons */}
                  <div className="flex gap-2 py-3">
                    <button
                      type="button"
                      disabled={currentPTracks.length === 0}
                      onClick={() => {
                        playTrack(currentPTracks[0], currentPTracks)
                        setSelectedPlaylist(null)
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs shadow-md shadow-fuchsia-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play All</span>
                    </button>
                    <button
                      type="button"
                      disabled={currentPTracks.length === 0}
                      onClick={() => {
                        const shuffled = [...currentPTracks].sort(() => Math.random() - 0.5)
                        playTrack(shuffled[0], shuffled)
                        setSelectedPlaylist(null)
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>Shuffle</span>
                    </button>
                  </div>

                  {/* Tracks List */}
                  <div className="flex-1 overflow-y-auto space-y-1 pt-2 divide-y divide-slate-800/50">
                    {currentPTracks.length > 0 ? (
                      currentPTracks.map((track, idx) => (
                        <div
                          key={`${track.id}-${idx}`}
                          className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-slate-800/60 transition-colors group"
                        >
                          <div
                            onClick={() => {
                              playTrack(track, currentPTracks)
                              setSelectedPlaylist(null)
                            }}
                            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                          >
                            <span className="w-4 text-[11px] font-mono text-slate-500 text-center">
                              {idx + 1}
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

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[11px] font-mono text-slate-500 px-1">
                              {formatDuration(track.duration)}
                            </span>
                            {!selectedPlaylist.isSmart && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => idx > 0 && handleReorderPlaylistTrack(idx, idx - 1)}
                                  disabled={idx === 0}
                                  className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => idx < currentPTracks.length - 1 && handleReorderPlaylistTrack(idx, idx + 1)}
                                  disabled={idx === currentPTracks.length - 1}
                                  className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTrackFromPlaylist(track.id)}
                                  className="p-1 text-slate-500 hover:text-red-400 ml-1"
                                  title="Remove from playlist"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-xs text-slate-500">
                        This playlist currently has no tracks.
                      </div>
                    )}
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
