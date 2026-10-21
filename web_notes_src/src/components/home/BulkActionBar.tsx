import React, { useState } from 'react'
import {
  X, Pin, Bell, Palette, Archive, Trash2, Tag, Check, MoreVertical
} from 'lucide-react'
import { NOTE_COLORS } from '../../utils/colors'

interface BulkActionBarProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkPin: () => void
  onBulkReminder: () => void
  onBulkColor: (color: string) => void
  onBulkArchive: () => void
  onBulkDelete: () => void
  onBulkAddLabel: (label: string) => void
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkPin,
  onBulkReminder,
  onBulkColor,
  onBulkArchive,
  onBulkDelete,
  onBulkAddLabel,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLabelInput, setShowLabelInput] = useState(false)
  const [labelName, setLabelName] = useState('')

  if (selectedCount === 0) return null

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!labelName.trim()) return
    onBulkAddLabel(labelName.trim().replace(/^#/, ''))
    setLabelName('')
    setShowLabelInput(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-900 px-4 md:px-8 py-2.5 flex items-center justify-between shadow-lg text-slate-800 dark:text-slate-100 select-none animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <button
          onClick={onClearSelection}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          title="Clear selection"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="font-semibold text-sm text-indigo-600 dark:text-indigo-400">
          {selectedCount} selected
        </span>
        <button
          onClick={onSelectAll}
          className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline font-medium ml-2"
        >
          {selectedCount === totalCount ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Pin */}
        <button
          onClick={onBulkPin}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Pin / Unpin selected"
        >
          <Pin className="w-4 h-4" />
        </button>

        {/* Color Popover */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Change color of selected"
          >
            <Palette className="w-4 h-4" />
          </button>
          {showColorPicker && (
            <div className="absolute right-0 top-full mt-2 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 grid grid-cols-6 gap-1.5 w-52">
              {NOTE_COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    onBulkColor(c.id)
                    setShowColorPicker(false)
                  }}
                  className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Label */}
        <div className="relative">
          <button
            onClick={() => setShowLabelInput(!showLabelInput)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Add label to selected"
          >
            <Tag className="w-4 h-4" />
          </button>
          {showLabelInput && (
            <form
              onSubmit={handleAddLabel}
              className="absolute right-0 top-full mt-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex gap-1 w-48"
            >
              <input
                type="text"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                placeholder="Label name..."
                autoFocus
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </form>
          )}
        </div>

        {/* Archive */}
        <button
          onClick={onBulkArchive}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Archive selected"
        >
          <Archive className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={onBulkDelete}
          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors"
          title="Move selected to Trash"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
