import React, { useState, useMemo } from 'react'
import {
  Play, MoreVertical, Heart, ArrowUpDown, CheckSquare,
  Square, Disc, Trash2, ListPlus, BookmarkPlus, Info,
  Edit3, BellRing, Share2, CornerDownRight, Music2
} from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'
import { Track } from '../../types/music'

type SortField = 'title' | 'artist' | 'album' | 'dateAdded' | 'duration' | 'playCount'

export const TracksView: React.FC<{
  tracks: Track[]
  onOpenDetails: (track: Track) => void
  onOpenTagEditor: (track: Track) => void
  onOpenAddToPlaylist: (trackIds: string[]) => void
}> = ({ tracks, onOpenDetails, onOpenTagEditor, onOpenAddToPlaylist }) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    playNextInQueue,
    addToQueue,
    toggleFavorite,
    deleteTrack,
    bulkDeleteTracks,
    selectedTrackIds,
    setSelectedTrackIds,
  } = useMusic()

  const [sortField, setSortField] = useState<SortField>('title')
  const [sortAsc, setSortAsc] = useState(true)
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null)
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2500)
  }

  // Sorting
  const sortedTracks = useMemo(() => {
    return [...tracks].sort((a, b) => {
      let cmp = 0
      if (sortField === 'title') cmp = a.title.localeCompare(b.title)
      else if (sortField === 'artist') cmp = a.artist.localeCompare(b.artist)
      else if (sortField === 'album') cmp = a.album.localeCompare(b.album)
      else if (sortField === 'dateAdded') cmp = new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      else if (sortField === 'duration') cmp = (a.duration || 0) - (b.duration || 0)
      else if (sortField === 'playCount') cmp = (b.playCount || 0) - (a.playCount || 0)

      return sortAsc ? cmp : -cmp
    })
  }, [tracks, sortField, sortAsc])

  // Alphabet Quick Scroll Letters
  const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`letter-${letter}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Multi-select handlers
  const handleToggleSelect = (id: string) => {
    setSelectedTrackIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedTrackIds.length === tracks.length) {
      setSelectedTrackIds([])
    } else {
      setSelectedTrackIds(tracks.map(t => t.id))
    }
  }

  const handlePlaySelected = () => {
    const selected = tracks.filter(t => selectedTrackIds.includes(t.id))
    if (selected.length > 0) {
      playTrack(selected[0], selected)
      setIsMultiSelectMode(false)
      setSelectedTrackIds([])
    }
  }

  const handleQueueSelected = () => {
    const selected = tracks.filter(t => selectedTrackIds.includes(t.id))
    addToQueue(selected)
    showToast(`Added ${selected.length} tracks to queue`)
    setIsMultiSelectMode(false)
    setSelectedTrackIds([])
  }

  const handleDeleteSelected = async () => {
    if (confirm(`Remove ${selectedTrackIds.length} tracks from your library?`)) {
      await bulkDeleteTracks(selectedTrackIds)
      setIsMultiSelectMode(false)
    }
  }

  return (
    <div className="relative pb-28 select-none">
      {/* Top Controls: Track Count, Sort by, Multi-select toggle */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {tracks.length} Tracks
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2 font-mono">
            {formatDuration(tracks.reduce((acc, t) => acc + (t.duration || 0), 0))} total
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Multi-select Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsMultiSelectMode(!isMultiSelectMode)
              setSelectedTrackIds([])
            }}
            className={`p-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isMultiSelectMode
                ? 'bg-fuchsia-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title="Multi-select mode"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Select</span>
          </button>

          {/* Sort Field Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1 text-xs">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="title">Title</option>
              <option value="artist">Artist</option>
              <option value="album">Album</option>
              <option value="dateAdded">Date Added</option>
              <option value="duration">Duration</option>
              <option value="playCount">Play Count</option>
            </select>
            <button
              type="button"
              onClick={() => setSortAsc(!sortAsc)}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              title={sortAsc ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Track List with Alphabet Sidebar */}
      <div className="relative flex">
        <div className="flex-1 space-y-1 pr-6">
          {sortedTracks.length > 0 ? (
            sortedTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id
              const isSelected = selectedTrackIds.includes(track.id)
              const firstLetter = (track.title[0] || '#').toUpperCase()
              const prevFirstLetter = idx > 0 ? (sortedTracks[idx - 1].title[0] || '#').toUpperCase() : ''
              const isSectionHeader = sortField === 'title' && firstLetter !== prevFirstLetter

              return (
                <React.Fragment key={track.id}>
                  {isSectionHeader && (
                    <div
                      id={`letter-${firstLetter}`}
                      className="pt-3 pb-1 text-xs font-extrabold text-fuchsia-600 dark:text-fuchsia-400 font-display uppercase tracking-wider"
                    >
                      {firstLetter}
                    </div>
                  )}

                  <div
                    className={`flex items-center justify-between p-2.5 rounded-2xl group transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-fuchsia-100 dark:bg-fuchsia-950/60 border border-fuchsia-500/40 shadow-sm'
                        : isCurrent
                        ? 'bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-500/20'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Multi-select checkbox or Track Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {isMultiSelectMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleSelect(track.id)
                          }}
                          className="text-fuchsia-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 fill-fuchsia-600 text-white" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                      )}

                      {/* Cover thumbnail */}
                      <div
                        onClick={() => {
                          if (isMultiSelectMode) {
                            handleToggleSelect(track.id)
                          } else {
                            playTrack(track, sortedTracks)
                          }
                        }}
                        className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-sm"
                      >
                        {track.coverArt ? (
                          <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Disc className="w-5 h-5" />
                          </div>
                        )}
                        {isCurrent && isPlaying && (
                          <div className="absolute inset-0 bg-fuchsia-600/40 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white animate-pulse" />
                          </div>
                        )}
                      </div>

                      {/* Title & Artist */}
                      <div
                        onClick={() => {
                          if (isMultiSelectMode) {
                            handleToggleSelect(track.id)
                          } else {
                            playTrack(track, sortedTracks)
                          }
                        }}
                        className="min-w-0 flex-1"
                      >
                        <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-slate-900 dark:text-white'}`}>
                          {track.title}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                          {track.artist} • {track.album}
                        </p>
                      </div>
                    </div>

                    {/* Right: Duration, Favorite Heart, Context Menu ⋮ */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(track.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          track.isFavorite
                            ? 'text-rose-500'
                            : 'text-slate-300 dark:text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100'
                        }`}
                        title="Favorite"
                      >
                        <Heart className={`w-4 h-4 ${track.isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      <span className="text-[11px] font-mono text-slate-400 px-1">
                        {formatDuration(track.duration)}
                      </span>

                      {/* Track Context Menu ⋮ */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuTrackId(activeMenuTrackId === track.id ? null : track.id)}
                          className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuTrackId === track.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveMenuTrackId(null)} />
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-1.5 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => {
                                  setActiveMenuTrackId(null)
                                  playNextInQueue(track)
                                  showToast('Playing next in queue')
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <CornerDownRight className="w-3.5 h-3.5 text-fuchsia-500" />
                                <span>Play Next</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuTrackId(null)
                                  addToQueue(track)
                                  showToast('Added to queue')
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <ListPlus className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Add to Queue</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuTrackId(null)
                                  onOpenAddToPlaylist([track.id])
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <BookmarkPlus className="w-3.5 h-3.5 text-purple-500" />
                                <span>Add to Playlist</span>
                              </button>
                              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                              <button
                                onClick={() => {
                                  setActiveMenuTrackId(null)
                                  onOpenTagEditor(track)
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit Tags</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuTrackId(null)
                                  onOpenDetails(track)
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Info className="w-3.5 h-3.5 text-slate-400" />
                                <span>Details</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuTrackId(null)
                                  showToast('Track set as ringtone (Mock notification)')
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <BellRing className="w-3.5 h-3.5 text-amber-500" />
                                <span>Set as Ringtone</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuTrackId(null)
                                  if (navigator.share) {
                                    navigator.share({ title: track.title, text: `${track.title} by ${track.artist}` }).catch(() => {})
                                  } else {
                                    showToast('Sharing link copied to clipboard')
                                  }
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Share</span>
                              </button>
                              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                              <button
                                onClick={() => {
                                  setActiveMenuTrackId(null)
                                  deleteTrack(track.id)
                                  showToast('Removed from library')
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete from Library</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )
            })
          ) : (
            <div className="py-20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Music2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No tracks found in library
              </h4>
              <p className="text-xs text-slate-500">
                Import audio files or select your music folder to get started.
              </p>
            </div>
          )}
        </div>

        {/* Fast-scroll Alphabet Bar */}
        {sortField === 'title' && tracks.length > 5 && (
          <div className="absolute right-0 top-0 bottom-0 w-5 flex flex-col justify-center items-center py-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 select-none">
            {alphabet.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => scrollToLetter(letter)}
                className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors py-0.5"
              >
                {letter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contextual Multi-Select Bottom Bar */}
      {isMultiSelectMode && selectedTrackIds.length > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3 text-xs font-semibold">
          <span className="font-bold text-fuchsia-400">
            {selectedTrackIds.length} selected
          </span>
          <button
            type="button"
            onClick={handleSelectAll}
            className="hover:underline text-slate-300"
          >
            {selectedTrackIds.length === tracks.length ? 'Deselect All' : 'Select All'}
          </button>
          <div className="h-4 w-px bg-slate-700" />
          <button
            type="button"
            onClick={handlePlaySelected}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenAddToPlaylist(selectedTrackIds)}
            className="flex items-center gap-1.5 hover:text-fuchsia-400"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add to Playlist</span>
          </button>
          <button
            type="button"
            onClick={handleQueueSelected}
            className="flex items-center gap-1.5 hover:text-indigo-400"
          >
            <ListPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Queue</span>
          </button>
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="text-red-400 hover:text-red-300"
            title="Delete Selected"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-fuchsia-500/40 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          {toastMsg}
        </div>
      )}
    </div>
  )
}
