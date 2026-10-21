import React, { useState } from 'react'
import { X, Search, CheckSquare, Square, Disc, Plus } from 'lucide-react'
import { db } from '../../db'
import { Track, Playlist } from '../../types/music'

export const CreatePlaylistModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  tracks: Track[]
  initialSelectedTrackIds?: string[]
}> = ({ isOpen, onClose, tracks, initialSelectedTrackIds = [] }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedTrackIds)
  const [search, setSearch] = useState('')

  if (!isOpen) return null

  const filteredTracks = tracks.filter((t) => {
    const q = search.toLowerCase()
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  })

  const handleToggle = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleCreate = async () => {
    if (!name.trim()) return
    const now = new Date().toISOString()
    const firstCover = tracks.find(t => selectedIds.includes(t.id))?.coverArt

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      trackIds: selectedIds,
      coverArt: firstCover,
      createdAt: now,
      updatedAt: now,
    }

    await db.playlists.add(newPlaylist)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="font-extrabold text-base font-display">Create New Playlist</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name & Description Inputs */}
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Playlist Title (e.g. Chill Beats)"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-fuchsia-500 font-semibold"
            autoFocus
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-fuchsia-500"
          />
        </div>

        {/* Search Songs to Add */}
        <div className="space-y-2 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Select Songs ({selectedIds.length} selected)
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds(selectedIds.length === tracks.length ? [] : tracks.map(t => t.id))}
              className="text-xs text-fuchsia-400 hover:underline"
            >
              {selectedIds.length === tracks.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library to add..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          {/* List of Tracks with Checkboxes */}
          <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-slate-800/40 pr-1">
            {filteredTracks.map((track) => {
              const isSelected = selectedIds.includes(track.id)
              return (
                <div
                  key={track.id}
                  onClick={() => handleToggle(track.id)}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-fuchsia-950/40 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button type="button" className="text-fuchsia-500">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 fill-fuchsia-600 text-white" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold truncate">{track.title}</h5>
                      <p className="text-[10px] text-slate-400 truncate">{track.artist}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold shadow-md shadow-fuchsia-600/30 disabled:opacity-50"
          >
            Create Playlist
          </button>
        </div>
      </div>
    </div>
  )
}
