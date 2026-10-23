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
      <div className="w-full max-w-lg h-[85vh] sm:h-[650px] bg-[#051413]/95 border border-teal-500/25 rounded-t-[32px] sm:rounded-3xl flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-[#F4FFFD]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-teal-500/15 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base font-display text-[#F4FFFD]">Play Queue</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-[#19E6C8]">
                {queue.length} tracks
              </span>
            </div>
            {remainingDuration > 0 && (
              <p className="text-[11px] text-[#94B5B0] mt-0.5 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-teal-400/60" />
                <span>{formatDuration(remainingDuration)} remaining</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearQueue}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-teal-500/10 transition-colors"
              title="Clear Queue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch: Queue vs History */}
        <div className="px-5 py-2.5 flex items-center justify-between bg-[#030d0c] border-b border-teal-500/15 shrink-0">
          <div className="flex items-center gap-1 bg-[#051413] rounded-xl p-1 text-xs font-semibold border border-teal-500/20">
            <button
              type="button"
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'queue' ? 'bg-[#19E6C8] text-[#04100F] font-bold shadow-sm' : 'text-[#94B5B0] hover:text-[#F4FFFD]'
              }`}
            >
              Up Next
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                activeTab === 'history' ? 'bg-[#19E6C8] text-[#04100F] font-bold shadow-sm' : 'text-[#94B5B0] hover:text-[#F4FFFD]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setPlaylistNamePrompt(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#19E6C8] hover:text-[#2DD4BF] py-1 px-2.5 rounded-xl hover:bg-teal-500/10 transition-colors"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Save as Playlist</span>
          </button>
        </div>

        {/* Save Queue as Playlist Modal Prompt */}
        {playlistNamePrompt && (
          <div className="p-4 bg-[#061816] border-b border-teal-500/20 space-y-2 animate-in slide-in-from-top-2">
            <span className="block text-xs font-bold text-[#F4FFFD]">
              Save current queue as playlist:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name..."
                className="flex-1 bg-[#030d0c] border border-teal-500/20 rounded-xl px-3 py-1.5 text-xs text-[#F4FFFD] placeholder:text-teal-400/40 focus:outline-none focus:border-[#19E6C8]"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveQueueAsPlaylist}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 text-[#04100F] text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.22)] transition-all"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setPlaylistNamePrompt(false)}
                className="px-3 py-1.5 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] text-xs"
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
                        ? 'bg-teal-500/15 border border-teal-400/30 shadow-md'
                        : 'hover:bg-teal-500/5'
                    }`}
                  >
                    {/* Left: Cover art + Info */}
                    <div
                      onClick={() => playTrack(track, queue)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#061816] border border-teal-500/20 shrink-0 shadow-sm">
                        {track.coverArt ? (
                          <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-teal-500/50">
                            <Disc className="w-5 h-5" />
                          </div>
                        )}
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[#19E6C8]/40 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white animate-pulse" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-[#19E6C8]' : 'text-[#F4FFFD]'}`}>
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
