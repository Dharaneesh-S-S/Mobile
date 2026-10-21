import React, { useState } from 'react'
import { Label } from '../../types'
import { Tag, X, Plus, Check, Edit2, Trash2 } from 'lucide-react'

interface LabelsModalProps {
  labels: Label[]
  onCreateLabel: (name: string, color?: string) => Promise<void>
  onRenameLabel: (id: string, newName: string) => Promise<void>
  onDeleteLabel: (id: string) => Promise<void>
  onClose: () => void
}

const LABEL_COLORS = [
  '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'
]

export const LabelsModal: React.FC<LabelsModalProps> = ({
  labels,
  onCreateLabel,
  onRenameLabel,
  onDeleteLabel,
  onClose,
}) => {
  const [newLabelName, setNewLabelName] = useState('')
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabelName.trim()) return
    await onCreateLabel(newLabelName.trim(), selectedColor)
    setNewLabelName('')
  }

  const handleStartEdit = (l: Label) => {
    setEditingId(l.id)
    setEditingName(l.name)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return
    await onRenameLabel(id, editingName.trim())
    setEditingId(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden text-slate-800 dark:text-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Tag className="w-4 h-4 text-indigo-600" />
            <span>Edit Labels</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Create new label input */}
          <form onSubmit={handleCreate} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Create new label..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={!newLabelName.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-40 transition-colors"
                title="Add label"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Color chips for new label */}
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-[10px] text-slate-400 mr-1">Color:</span>
              {LABEL_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-4 h-4 rounded-full transition-transform ${selectedColor === c ? 'scale-125 ring-2 ring-indigo-500 ring-offset-1' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </form>

          {/* List of existing labels */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {labels.length === 0 ? (
              <div className="py-6 text-center text-slate-400">
                No labels created yet.
              </div>
            ) : (
              labels.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: l.color || '#6366f1' }}
                    />
                    {editingId === l.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(l.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                        className="flex-1 bg-white dark:bg-slate-700 border border-indigo-500 rounded px-1.5 py-0.5 text-xs"
                      />
                    ) : (
                      <span className="font-medium truncate">{l.name}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {editingId === l.id ? (
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(l.id)}
                        className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                        title="Save name"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(l)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Rename label"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteLabel(l.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                      title="Delete label"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
