import React, { useState } from 'react'
import {
  X, Trash2, BookmarkPlus, Play, Disc, GripVertical,
  Clock, ArrowUp, ArrowDown, History
} from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'
import { Track } from '../../types/music'

export const QueuePanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentTrack,
    queue,
    queueIndex,
    history,
    playTrack,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    addTracksToPlaylist,
  } = useMusic()

  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue')
  const [playlistNamePrompt, setPlaylistNamePrompt] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')

  if (!isOpen) return null

  // Calculate remaining queue duration
  const remainingDuration = queue
    .slice(queueIndex + 1)
    .reduce((acc, t) => acc + (t.duration || 0), 0)

  const handleSaveQueueAsPlaylist = async () => {
    if (!newPlaylistName.trim() || queue.length === 0) return
    const now = new Date().toISOString()
    const id = `playlist-${Date.now()}`
    await addTracksToPlaylist(id, queue.map(t => t.id))
    setPlaylistNamePrompt(false)
    setNewPlaylistName('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg h-[85vh] sm:h-[650px] bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base font-display">Play Queue</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-fuchsia-950/70 border border-fuchsia-800/40 text-fuchsia-300">
                {queue.length} tracks
              </span>
            </div>
            {remainingDuration > 0 && (
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{formatDuration(remainingDuration)} remaining</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearQueue}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Clear Queue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch: Queue vs History */}
        <div className="px-5 py-2.5 flex items-center justify-between bg-slate-950/40 border-b border-slate-800/50 shrink-0">
          <div className="flex items-center gap-1 bg-slate-800/80 rounded-xl p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'queue' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Up Next
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                activeTab === 'history' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setPlaylistNamePrompt(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-fuchsia-400 hover:text-fuchsia-300 py-1 px-2.5 rounded-xl hover:bg-fuchsia-950/40 transition-colors"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Save as Playlist</span>
          </button>
        </div>

        {/* Save Queue as Playlist Modal Prompt */}
        {playlistNamePrompt && (
          <div className="p-4 bg-slate-800/90 border-b border-slate-700 space-y-2 animate-in slide-in-from-top-2">
            <span className="block text-xs font-bold text-slate-200">
              Save current queue as playlist:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveQueueAsPlaylist}
                className="px-3 py-1.5 rounded-xl bg-fuchsia-600 text-white text-xs font-bold shadow-md shadow-fuchsia-600/30"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setPlaylistNamePrompt(false)}
                className="px-2 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-800/40">
          {activeTab === 'queue' ? (
            queue.length > 0 ? (
              queue.map((track, idx) => {
                const isCurrent = idx === queueIndex
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className={`flex items-center justify-between p-2.5 rounded-2xl group transition-all ${
                      isCurrent
                        ? 'bg-fuchsia-950/60 border border-fuchsia-800/50 shadow-md'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Left: Cover art + Info */}
                    <div
                      onClick={() => playTrack(track, queue)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-sm">
                        {track.coverArt ? (
                          <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Disc className="w-5 h-5" />
                          </div>
                        )}
                        {isCurrent && (
                          <div className="absolute inset-0 bg-fuchsia-600/40 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white animate-pulse" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-fuchsia-400' : 'text-slate-200'}`}>
                          {track.title}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-400 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    {/* Right: Duration + Reorder + Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[11px] font-mono text-slate-500 px-2">
                        {formatDuration(track.duration)}
                      </span>

                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        onClick={() => idx > 0 && reorderQueue(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 rounded-lg text-slate-500 hover:text-white disabled:opacity-20 hover:bg-slate-700/60"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => idx < queue.length - 1 && reorderQueue(idx, idx + 1)}
                        disabled={idx === queue.length - 1}
                        className="p-1 rounded-lg text-slate-500 hover:text-white disabled:opacity-20 hover:bg-slate-700/60"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromQueue(idx)}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors ml-1"
                        title="Remove from queue"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-500">
                Queue is empty.
              </div>
            )
          ) : (
            /* History Tab */
            history.length > 0 ? (
              history.map((track, idx) => (
                <div
                  key={`hist-${track.id}-${idx}`}
                  onClick={() => playTrack(track)}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-800/50 cursor-pointer transition-colors"
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
                      <h4 className="text-xs font-bold text-slate-200 truncate">
                        {track.title}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-400 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-500">
                No recent playback history yet.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
