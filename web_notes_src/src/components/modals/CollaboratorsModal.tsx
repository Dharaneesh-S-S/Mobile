import React, { useState } from 'react'
import { NoteCollaborator } from '../../types'
import { Users, X, UserPlus, Trash2, Shield, Check } from 'lucide-react'

interface CollaboratorsModalProps {
  collaborators: NoteCollaborator[]
  onSave: (collaborators: NoteCollaborator[]) => void
  onClose: () => void
}

const AVATAR_COLORS = [
  '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
]

export const CollaboratorsModal: React.FC<CollaboratorsModalProps> = ({
  collaborators,
  onSave,
  onClose,
}) => {
  const [list, setList] = useState<NoteCollaborator[]>(collaborators || [])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'editor' | 'viewer'>('editor')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    // Pick random color
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    const name = email.split('@')[0]

    setList([
      ...list,
      {
        email: email.trim(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        avatarColor: color,
        role,
      },
    ])
    setEmail('')
  }

  const handleRemove = (emailToRemove: string) => {
    setList(list.filter(c => c.email !== emailToRemove))
  }

  const handleSave = () => {
    onSave(list)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden text-slate-800 dark:text-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Collaborators</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Owner row */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                Y
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">You (Owner)</div>
                <div className="text-[11px] text-slate-400">you@auranotes.local</div>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium">
              Owner
            </span>
          </div>

          {/* Collaborator List */}
          {list.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                Invited Members ({list.length})
              </span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {list.map((c) => (
                  <div
                    key={c.email}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center font-semibold text-xs shadow-2xs"
                        style={{ backgroundColor: c.avatarColor }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] capitalize text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {c.role}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(c.email)}
                        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add member form */}
          <form onSubmit={handleAdd} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-medium text-slate-500 block">Add Person by Email</span>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-xs"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <button
                type="submit"
                disabled={!email.trim()}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                Add
              </button>
            </div>
          </form>

          {/* Footer Save */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
