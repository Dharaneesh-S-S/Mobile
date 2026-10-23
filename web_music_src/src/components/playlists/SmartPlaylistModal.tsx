import React, { useState } from 'react'
import { X, Sparkles, Plus, Trash2 } from 'lucide-react'
import { db } from '../../db'
import { Playlist, SmartRule } from '../../types/music'

export const SmartPlaylistModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [matchMode, setMatchMode] = useState<'all' | 'any'>('all')
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'dateAdded' | 'playCount' | 'random'>('dateAdded')
  const [limit, setLimit] = useState<number>(50)
  const [rules, setRules] = useState<SmartRule[]>([
    { id: 'rule-1', field: 'genre', operator: 'contains', value: 'Electronic' },
  ])

  if (!isOpen) return null

  const handleAddRule = () => {
    setRules(prev => [
      ...prev,
      {
        id: `rule-${Date.now()}`,
        field: 'genre',
        operator: 'contains',
        value: '',
      },
    ])
  }

  const handleRemoveRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id))
  }

  const handleUpdateRule = (id: string, updates: Partial<SmartRule>) => {
    setRules(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)))
  }

  const handleSave = async () => {
    if (!name.trim()) return
    const now = new Date().toISOString()

    const newPlaylist: Playlist = {
      id: `smart-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Live-updating smart playlist',
      trackIds: [],
      isSmart: true,
      smartRules: rules,
      smartMatchMode: matchMode,
      smartSortBy: sortBy,
      smartLimit: limit,
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
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#19E6C8]" />
            <h3 className="font-extrabold text-base font-display text-[#F4FFFD]">
              Smart Playlist Builder
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Smart Playlist Name (e.g. 90s Rock Favorites)"
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

        {/* Match Mode & Sort */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#030d0c] border border-teal-500/20 rounded-xl p-2.5 space-y-1">
            <span className="block text-[11px] text-[#94B5B0] font-semibold">Match Condition</span>
            <select
              value={matchMode}
              onChange={(e) => setMatchMode(e.target.value as any)}
              className="w-full bg-transparent font-bold text-[#F4FFFD] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#051413]">Match ALL rules (AND)</option>
              <option value="any" className="bg-[#051413]">Match ANY rule (OR)</option>
            </select>
          </div>
          <div className="bg-[#030d0c] border border-teal-500/20 rounded-xl p-2.5 space-y-1">
            <span className="block text-[11px] text-[#94B5B0] font-semibold">Live Sort Order</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-transparent font-bold text-[#F4FFFD] focus:outline-none cursor-pointer"
            >
              <option value="dateAdded" className="bg-[#051413]">Recently Added</option>
              <option value="playCount" className="bg-[#051413]">Most Played</option>
              <option value="title" className="bg-[#051413]">Track Title</option>
              <option value="artist" className="bg-[#051413]">Artist</option>
              <option value="random" className="bg-[#051413]">Randomized</option>
            </select>
          </div>
        </div>

        {/* Dynamic Rules List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94B5B0]">Rules</span>
            <button
              type="button"
              onClick={handleAddRule}
              className="text-xs font-bold text-[#19E6C8] hover:text-[#2DD4BF] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Rule</span>
            </button>
          </div>

          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-3 rounded-2xl bg-[#030d0c] border border-teal-500/20 flex items-center gap-2 text-xs"
            >
              <select
                value={rule.field}
                onChange={(e) => handleUpdateRule(rule.id, { field: e.target.value as any })}
                className="bg-[#081f1d] rounded-lg px-2 py-1 text-[#F4FFFD] border border-teal-500/20 focus:outline-none"
              >
                <option value="genre">Genre</option>
                <option value="artist">Artist</option>
                <option value="year">Year</option>
                <option value="playCount">Play Count</option>
                <option value="dateAddedDays">Added (Days)</option>
                <option value="durationSeconds">Duration (Sec)</option>
              </select>

              <select
                value={rule.operator}
                onChange={(e) => handleUpdateRule(rule.id, { operator: e.target.value as any })}
                className="bg-[#081f1d] rounded-lg px-2 py-1 text-[#F4FFFD] border border-teal-500/20 focus:outline-none"
              >
                <option value="contains">contains</option>
                <option value="equals">is equal to</option>
                <option value="greaterThan">is greater than</option>
                <option value="lessThan">is less than</option>
              </select>

              <input
                type="text"
                value={String(rule.value)}
                onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                placeholder="Value..."
                className="flex-1 bg-[#051211] border border-teal-500/20 rounded-lg px-2.5 py-1 text-xs text-[#F4FFFD] focus:outline-none focus:border-[#19E6C8]"
              />

              <button
                type="button"
                onClick={() => handleRemoveRule(rule.id)}
                className="p-1 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
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
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-[#04100F] text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.22)] disabled:opacity-50 transition-all active:scale-95"
          >
            Create Smart Playlist
          </button>
        </div>
      </div>
    </div>
  )
}
