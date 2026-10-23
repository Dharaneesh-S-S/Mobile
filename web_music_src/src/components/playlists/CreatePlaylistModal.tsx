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
      <div className="w-full max-w-lg max-h-[85vh] bg-[#051413]/95 border border-teal-500/25 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-[#F4FFFD] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-teal-500/15">
          <h3 className="font-extrabold text-base font-display text-[#F4FFFD]">Create New Playlist</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10"
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
            className="w-full bg-[#030d0c] border border-teal-500/20 rounded-xl px-3.5 py-2 text-xs text-[#F4FFFD] placeholder:text-teal-400/40 focus:outline-none focus:border-[#19E6C8] font-semibold"
            autoFocus
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            className="w-full bg-[#030d0c] border border-teal-500/20 rounded-xl px-3.5 py-2 text-xs text-[#F4FFFD] placeholder:text-teal-400/40 focus:outline-none focus:border-[#19E6C8]"
          />
        </div>

        {/* Search Songs to Add */}
        <div className="space-y-2 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94B5B0]">
              Select Songs ({selectedIds.length} selected)
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds(selectedIds.length === tracks.length ? [] : tracks.map(t => t.id))}
              className="text-xs text-[#19E6C8] hover:underline"
            >
              {selectedIds.length === tracks.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-teal-400/60 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library to add..."
              className="w-full bg-[#030d0c] border border-teal-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F4FFFD] placeholder:text-teal-400/40 focus:outline-none focus:border-[#19E6C8]"
            />
          </div>

          {/* List of Tracks with Checkboxes */}
          <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-teal-500/10 pr-1">
            {filteredTracks.map((track) => {
              const isSelected = selectedIds.includes(track.id)
              return (
                <div
                  key={track.id}
                  onClick={() => handleToggle(track.id)}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-teal-500/15 border border-teal-400/30 text-[#19E6C8]' : 'hover:bg-teal-500/5 text-[#94B5B0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button type="button" className="text-[#19E6C8]">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 fill-[#19E6C8] text-[#04100F]" />
                      ) : (
                        <Square className="w-4 h-4 text-teal-400/40" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold truncate text-[#F4FFFD]">{track.title}</h5>
                      <p className="text-[10px] text-[#94B5B0] truncate">{track.artist}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end gap-2 border-t border-teal-500/15">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#94B5B0] hover:text-[#F4FFFD]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-[#04100F] text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.22)] disabled:opacity-50 transition-all active:scale-95"
          >
            Create Playlist
          </button>
        </div>
      </div>
    </div>
  )
}
