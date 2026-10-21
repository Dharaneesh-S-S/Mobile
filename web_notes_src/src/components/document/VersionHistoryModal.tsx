import React, { useState } from 'react'
import { NoteVersion } from '../../types'
import { X, History, RotateCcw, Tag, Calendar, FileText, Check } from 'lucide-react'

interface VersionHistoryModalProps {
  versions: NoteVersion[]
  currentContent: string
  currentTitle: string
  onRestore: (version: NoteVersion) => void
  onSaveNamedVersion: (name: string) => void
  onClose: () => void
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  versions,
  currentContent,
  currentTitle,
  onRestore,
  onSaveNamedVersion,
  onClose,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(versions[0] || null)
  const [newVersionName, setNewVersionName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)

  const handleCreateNamedVersion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVersionName.trim()) return
    onSaveNamedVersion(newVersionName.trim())
    setNewVersionName('')
    setShowNameInput(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <History className="w-4 h-4 text-indigo-600" />
            <span>Version History</span>
          </div>
          <div className="flex items-center gap-2">
            {!showNameInput ? (
              <button
                type="button"
                onClick={() => setShowNameInput(true)}
                className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Name current version
              </button>
            ) : (
              <form onSubmit={handleCreateNamedVersion} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="e.g. Final Draft"
                  autoFocus
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs"
                />
                <button
                  type="submit"
                  disabled={!newVersionName.trim()}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium disabled:opacity-40"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowNameInput(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content body: Sidebar on left, Snapshot preview on right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Version List */}
          <div className="w-72 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-50/50 dark:bg-slate-900/50 text-xs shrink-0">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Timeline Snapshots ({versions.length})
            </div>

            {versions.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                No past versions saved yet. Versions are automatically recorded on edit.
              </div>
            ) : (
              versions.map((ver) => {
                const isSelected = selectedVersion?.id === ver.id
                return (
                  <button
                    key={ver.id}
                    type="button"
                    onClick={() => setSelectedVersion(ver)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-indigo-500/30'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {ver.name || 'Auto-saved version'}
                      </span>
                      {ver.name && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-medium shrink-0">
                          Named
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(ver.timestamp).toLocaleString()}</span>
                    </div>
                    {ver.wordCount !== undefined && (
                      <div className="mt-1 text-[10px] text-slate-400">
                        {ver.wordCount} words
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>

          {/* Preview Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-100 dark:bg-slate-950">
            {selectedVersion ? (
              <>
                <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xs text-slate-900 dark:text-white">
                      {selectedVersion.title || 'Untitled'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Snapshot from {new Date(selectedVersion.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Restore this version? Your current edits will be preserved in a new snapshot.')) {
                        onRestore(selectedVersion)
                        onClose()
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore this version
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex justify-center">
                  <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 prose dark:prose-invert text-xs max-w-none">
                    <h1 className="text-xl font-bold mb-4">{selectedVersion.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: selectedVersion.content }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                Select a version on the left to preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
