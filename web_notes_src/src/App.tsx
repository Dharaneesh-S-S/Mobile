import React, { useState, useEffect, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, initDatabase } from './db'
import {
  Note, ChecklistItem, NoteAttachment, DrawingData,
  SidebarSection, NoteViewMode, UserSettings, Label
} from './types'

import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { TakeNoteBar } from './components/note/TakeNoteBar'
import { MasonryGrid } from './components/home/MasonryGrid'
import { BulkActionBar } from './components/home/BulkActionBar'
import { QuickNoteModal } from './components/note/QuickNoteModal'
import { DocumentEditor } from './components/document/DocumentEditor'
import { DrawingCanvas } from './components/drawing/DrawingCanvas'

import { LightboxModal } from './components/modals/LightboxModal'
import { RemindersModal } from './components/modals/RemindersModal'
import { CollaboratorsModal } from './components/modals/CollaboratorsModal'
import { LabelsModal } from './components/modals/LabelsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { ShortcutsHelpModal } from './components/modals/ShortcutsHelpModal'

import { exportAllDataAsJson, printDocument } from './utils/exportImport'
import { RotateCcw, X, Bell } from 'lucide-react'

export const App: React.FC = () => {
  // DB Live Queries
  const notes = useLiveQuery(() => db.notes.orderBy('orderIndex').toArray(), []) || []
  const labels = useLiveQuery(() => db.labels.toArray(), []) || []
  const settingsLive = useLiveQuery(() => db.settings.get('user-settings'), [])

  // App State
  const [currentSection, setCurrentSection] = useState<SidebarSection>('notes')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([])

  // Active Editors & Overlays
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [activeDrawingCallback, setActiveDrawingCallback] = useState<{
    note?: Note
    onSave: (data: DrawingData, previewDataUrl: string) => void
  } | null>(null)

  // Modals
  const [reminderModalNote, setReminderModalNote] = useState<Note | null>(null)
  const [collaboratorsModalNote, setCollaboratorsModalNote] = useState<Note | null>(null)
  const [lightboxState, setLightboxState] = useState<{ attachments: NoteAttachment[]; index: number } | null>(null)
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

  // Undo Toast
  const [undoToast, setUndoToast] = useState<{ message: string; onUndo: () => void } | null>(null)

  // Settings State
  const settings: UserSettings = settingsLive || {
    id: 'user-settings',
    theme: 'system',
    viewMode: 'grid',
    defaultNoteSize: 'quick',
    defaultFont: 'Outfit, sans-serif',
    defaultPageSize: 'A4',
    spellcheck: true,
    autosaveIntervalSeconds: 2,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12h',
    notificationsEnabled: true,
    addNewItemsToBottom: true,
    moveCheckedToBottom: true,
    displayLinkPreviews: true,
  }

  // Initialize DB with seed demo data on first load
  useEffect(() => {
    initDatabase().catch(console.error)
  }, [])

  // Theme effect
  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.classList.add('dark')
    } else if (settings.theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [settings.theme])

  // Reminder interval checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      notes.forEach((note) => {
        if (note.reminder && !note.reminder.completed) {
          const remTime = new Date(note.reminder.dateTime).getTime()
          // Check if due within last 60 seconds
          if (now >= remTime && now - remTime < 60000) {
            // Trigger in-app toast notification
            showNotificationToast(`Reminder: "${note.title || 'Untitled Note'}"`)
            // Mark reminder as completed
            db.notes.update(note.id, {
              'reminder.completed': true,
            })
            // Browser notification if permitted
            if (Notification.permission === 'granted') {
              new Notification('AuraNotes Reminder', {
                body: note.title || 'Your reminder is due now.',
              })
            }
          }
        }
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [notes])

  // Notification Toast Helper
  const showNotificationToast = (msg: string) => {
    setUndoToast({
      message: msg,
      onUndo: () => setUndoToast(null),
    })
  }

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is actively typing in an input or textarea or modal, ignore global shortcuts
      if (
        ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName) ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        handleCreateQuickNote()
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault()
        handleCreateChecklist()
      } else if (e.key === '/') {
        e.preventDefault()
        document.getElementById('main-search-input')?.focus()
      } else if (e.key === '?') {
        e.preventDefault()
        setIsShortcutsOpen(true)
      } else if (e.key === 'Escape') {
        setSelectedNoteIds([])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [notes])

  // Note Actions
  const handleCreateNote = async (noteData: Partial<Note>) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: noteData.title || '',
      content: noteData.content || '',
      plainText: noteData.plainText || '',
      size: noteData.size || settings.defaultNoteSize,
      isPinned: noteData.isPinned || false,
      isArchived: noteData.isArchived || false,
      isTrash: false,
      color: noteData.color || 'default',
      pattern: noteData.pattern,
      labels: noteData.labels || [],
      isChecklist: noteData.isChecklist || false,
      checklist: noteData.checklist || [],
      attachments: noteData.attachments || [],
      drawingData: noteData.drawingData,
      reminder: noteData.reminder,
      collaborators: noteData.collaborators,
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderIndex: 0,
    }

    await db.notes.add(newNote)
    return newNote
  }

  const handleCreateQuickNote = async () => {
    const n = await handleCreateNote({ size: 'quick' })
    setEditingNote(n)
  }

  const handleCreateChecklist = async () => {
    const n = await handleCreateNote({ size: 'quick', isChecklist: true })
    setEditingNote(n)
  }

  const handleCreateDrawing = () => {
    setActiveDrawingCallback({
      onSave: async (data, url) => {
        await handleCreateNote({
          title: 'Drawing Sketch',
          size: 'quick',
          attachments: [
            {
              id: `draw-${Date.now()}`,
              type: 'drawing',
              url,
              createdAt: new Date().toISOString(),
            },
          ],
          drawingData: data,
        })
        setActiveDrawingCallback(null)
      },
    })
  }

  const handleCreateDocument = async () => {
    const n = await handleCreateNote({
      title: 'Untitled Document',
      size: 'document',
      content: '<p>Start writing your document here...</p>',
    })
    setEditingNote(n)
  }

  // Update existing note
  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    await db.notes.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    if (editingNote && editingNote.id === id) {
      setEditingNote(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  // Toggle checklist item status directly from card
  const handleToggleChecklistItem = async (noteId: string, itemId: string, completed: boolean) => {
    const target = notes.find(n => n.id === noteId)
    if (!target || !target.checklist) return

    const updatedChecklist = target.checklist.map(c =>
      c.id === itemId ? { ...c, completed } : c
    )

    await db.notes.update(noteId, {
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString(),
    })
  }

  // Pin toggle
  const handleTogglePin = async (id: string) => {
    const n = notes.find(n => n.id === id)
    if (!n) return
    await db.notes.update(id, { isPinned: !n.isPinned })
  }

  // Archive toggle
  const handleToggleArchive = async (id: string) => {
    const n = notes.find(n => n.id === id)
    if (!n) return
    const willArchive = !n.isArchived
    await db.notes.update(id, { isArchived: willArchive })

    setUndoToast({
      message: willArchive ? 'Note archived' : 'Note unarchived',
      onUndo: async () => {
        await db.notes.update(id, { isArchived: !willArchive })
        setUndoToast(null)
      },
    })
  }

  // Delete note (Move to Trash)
  const handleDeleteNote = async (id: string) => {
    const n = notes.find(n => n.id === id)
    if (!n) return

    if (n.isTrash) {
      // Permanently delete
      await db.notes.delete(id)
      setUndoToast({
        message: 'Note deleted permanently',
        onUndo: () => setUndoToast(null),
      })
    } else {
      // Move to trash
      await db.notes.update(id, { isTrash: true, trashDate: new Date().toISOString() })
      setUndoToast({
        message: 'Note moved to Trash',
        onUndo: async () => {
          await db.notes.update(id, { isTrash: false })
          setUndoToast(null)
        },
      })
    }
  }

  // Dynamic Conversion between Quick Note and Document
  const handleConvertToDocument = async (note: Note) => {
    await db.notes.update(note.id, { size: 'document' })
    const updated = { ...note, size: 'document' as const }
    setEditingNote(updated)

    setUndoToast({
      message: 'Expanded to document mode',
      onUndo: async () => {
        await db.notes.update(note.id, { size: 'quick' })
        setEditingNote(prev => prev?.id === note.id ? { ...prev, size: 'quick' } : prev)
        setUndoToast(null)
      },
    })
  }

  const handleConvertToQuickNote = async (note: Note) => {
    await db.notes.update(note.id, { size: 'quick' })
    const updated = { ...note, size: 'quick' as const }
    setEditingNote(updated)

    setUndoToast({
      message: 'Shrunk to quick note card (no content was lost)',
      onUndo: async () => {
        await db.notes.update(note.id, { size: 'document' })
        setEditingNote(prev => prev?.id === note.id ? { ...prev, size: 'document' } : prev)
        setUndoToast(null)
      },
    })
  }

  // Duplicate / Make a Copy
  const handleMakeCopy = async (note: Note) => {
    const copy: Note = {
      ...note,
      id: `note-${Date.now()}`,
      title: `${note.title || 'Untitled'} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
    }
    await db.notes.add(copy)
    showNotificationToast('Note copied')
  }

  // Drag and drop reordering
  const handleReorderNotes = async (draggedId: string, targetId: string) => {
    const draggedIdx = notes.findIndex(n => n.id === draggedId)
    const targetIdx = notes.findIndex(n => n.id === targetId)
    if (draggedIdx === -1 || targetIdx === -1) return

    const reordered = [...notes]
    const [moved] = reordered.splice(draggedIdx, 1)
    reordered.splice(targetIdx, 0, moved)

    // Update orderIndices
    await Promise.all(
      reordered.map((item, idx) => db.notes.update(item.id, { orderIndex: idx }))
    )
  }

  // Bulk operations
  const handleBulkPin = async () => {
    const allPinned = selectedNoteIds.every(id => notes.find(n => n.id === id)?.isPinned)
    await Promise.all(
      selectedNoteIds.map(id => db.notes.update(id, { isPinned: !allPinned }))
    )
    setSelectedNoteIds([])
  }

  const handleBulkColor = async (color: string) => {
    await Promise.all(
      selectedNoteIds.map(id => db.notes.update(id, { color }))
    )
    setSelectedNoteIds([])
  }

  const handleBulkArchive = async () => {
    await Promise.all(
      selectedNoteIds.map(id => db.notes.update(id, { isArchived: true }))
    )
    setSelectedNoteIds([])
    showNotificationToast('Selected notes archived')
  }

  const handleBulkDelete = async () => {
    await Promise.all(
      selectedNoteIds.map(id => db.notes.update(id, { isTrash: true, trashDate: new Date().toISOString() }))
    )
    setSelectedNoteIds([])
    showNotificationToast('Selected notes moved to Trash')
  }

  const handleBulkAddLabel = async (label: string) => {
    await Promise.all(
      selectedNoteIds.map(async (id) => {
        const note = notes.find(n => n.id === id)
        if (note && !note.labels?.includes(label)) {
          await db.notes.update(id, { labels: [...(note.labels || []), label] })
        }
      })
    )
    setSelectedNoteIds([])
  }

  // Labels CRUD
  const handleCreateLabel = async (name: string, color?: string) => {
    await db.labels.add({
      id: `label-${Date.now()}`,
      name,
      color,
    })
  }

  const handleRenameLabel = async (id: string, newName: string) => {
    const l = labels.find(l => l.id === id)
    if (!l) return
    const oldName = l.name

    await db.labels.update(id, { name: newName })

    // Update references across all notes
    const affected = notes.filter(n => n.labels?.includes(oldName))
    await Promise.all(
      affected.map(n =>
        db.notes.update(n.id, {
          labels: n.labels.map(name => name === oldName ? newName : name),
        })
      )
    )
  }

  const handleDeleteLabel = async (id: string) => {
    const l = labels.find(l => l.id === id)
    if (!l) return
    const labelName = l.name

    await db.labels.delete(id)

    // Remove from notes
    const affected = notes.filter(n => n.labels?.includes(labelName))
    await Promise.all(
      affected.map(n =>
        db.notes.update(n.id, {
          labels: n.labels.filter(name => name !== labelName),
        })
      )
    )
  }

  // Empty Trash Permanently
  const handleEmptyTrash = async () => {
    if (window.confirm('Empty trash? All items will be permanently erased.')) {
      const trashNotes = notes.filter(n => n.isTrash)
      await Promise.all(trashNotes.map(n => db.notes.delete(n.id)))
      showNotificationToast('Trash emptied')
    }
  }

  // Clear Demo Data
  const handleClearDemoData = async () => {
    const demoIds = ['demo-note-1', 'demo-note-2', 'demo-note-3', 'demo-note-4']
    await Promise.all(demoIds.map(id => db.notes.delete(id)))
  }

  // Delete All Data & Reset Database
  const handleDeleteAllData = async () => {
    await db.notes.clear()
    await db.labels.clear()
  }

  // View Mode toggle
  const toggleViewMode = async () => {
    const nextMode: NoteViewMode = settings.viewMode === 'grid' ? 'list' : 'grid'
    await db.settings.update('user-settings', { viewMode: nextMode })
  }

  const trashCount = notes.filter(n => n.isTrash).length

  return (
    <div className="min-h-screen bg-[#030707] text-[#F4FFFD] flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={settings.viewMode}
        onToggleViewMode={toggleViewMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onCreateQuickNote={handleCreateQuickNote}
        onCreateChecklist={handleCreateChecklist}
        onCreateDrawing={handleCreateDrawing}
        onCreateDocument={handleCreateDocument}
      />

      {/* Main Workspace Layout: Sidebar on left + Content grid on right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={(sec) => setCurrentSection(sec)}
          isCollapsed={isSidebarCollapsed}
          labels={labels}
          onOpenEditLabels={() => setIsLabelsModalOpen(true)}
          trashCount={trashCount}
          onEmptyTrash={handleEmptyTrash}
        />

        {/* Scrollable Center Content Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {/* Expanding "Take a note..." Bar (only in notes section and not searching) */}
          {currentSection === 'notes' && !searchQuery && (
            <TakeNoteBar
              onCreateNote={async (data) => {
                await handleCreateNote(data)
              }}
              onOpenDrawingModal={(onSave) => setActiveDrawingCallback({
                onSave: (data, url) => onSave(url, data)
              })}
              onOpenReminderModal={(_onSave) => {
                handleCreateQuickNote()
              }}
              onOpenCollaboratorsModal={(_onSave) => {
                handleCreateQuickNote()
              }}
            />
          )}

          {/* Masonry / List Notes Grid */}
          <MasonryGrid
            notes={notes}
            currentSection={currentSection}
            searchQuery={searchQuery}
            viewMode={settings.viewMode}
            selectedNoteIds={selectedNoteIds}
            onToggleSelect={(id) => {
              setSelectedNoteIds(prev =>
                prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
              )
            }}
            onOpenNote={(note) => setEditingNote(note)}
            onTogglePin={handleTogglePin}
            onToggleArchive={handleToggleArchive}
            onDeleteNote={handleDeleteNote}
            onColorChange={(id, color) => db.notes.update(id, { color })}
            onPatternChange={(id, pattern) => db.notes.update(id, { pattern })}
            onToggleChecklistItem={handleToggleChecklistItem}
            onConvertToDocument={handleConvertToDocument}
            onConvertToQuickNote={handleConvertToQuickNote}
            onMakeCopy={handleMakeCopy}
            onOpenReminderModal={(note) => setReminderModalNote(note)}
            onOpenCollaboratorsModal={(note) => setCollaboratorsModalNote(note)}
            onOpenDrawingModal={(note) => {
              setActiveDrawingCallback({
                note,
                onSave: async (data, url) => {
                  const updatedAtts = [
                    ...(note.attachments || []),
                    {
                      id: `draw-${Date.now()}`,
                      type: 'drawing' as const,
                      url,
                      createdAt: new Date().toISOString(),
                    },
                  ]
                  await db.notes.update(note.id, {
                    attachments: updatedAtts,
                    drawingData: data,
                  })
                  setActiveDrawingCallback(null)
                },
              })
            }}
            onOpenLightbox={(atts, idx) => setLightboxState({ attachments: atts, index: idx })}
            onPrint={(note) => printDocument(note)}
            onReorderNotes={handleReorderNotes}
          />
        </main>
      </div>

      {/* Bulk Action Context Bar (when 1+ notes selected) */}
      <BulkActionBar
        selectedCount={selectedNoteIds.length}
        totalCount={notes.length}
        onSelectAll={() => {
          if (selectedNoteIds.length === notes.length) {
            setSelectedNoteIds([])
          } else {
            setSelectedNoteIds(notes.map(n => n.id))
          }
        }}
        onClearSelection={() => setSelectedNoteIds([])}
        onBulkPin={handleBulkPin}
        onBulkReminder={() => alert('Bulk reminder setting applies to all selected notes.')}
        onBulkColor={handleBulkColor}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
        onBulkAddLabel={handleBulkAddLabel}
      />

      {/* QUICK NOTE POPUP MODAL (When editing a Quick Note) */}
      {editingNote && editingNote.size === 'quick' && (
        <QuickNoteModal
          note={editingNote}
          onSave={(updates) => handleUpdateNote(editingNote.id, updates)}
          onClose={() => setEditingNote(null)}
          onConvertToDocument={handleConvertToDocument}
          onOpenReminderModal={(note) => setReminderModalNote(note)}
          onOpenCollaboratorsModal={(note) => setCollaboratorsModalNote(note)}
          onOpenDrawingModal={(note) => {
            setActiveDrawingCallback({
              note,
              onSave: async (data, url) => {
                const updatedAtts = [
                  ...(note.attachments || []),
                  {
                    id: `draw-${Date.now()}`,
                    type: 'drawing' as const,
                    url,
                    createdAt: new Date().toISOString(),
                  },
                ]
                await handleUpdateNote(note.id, {
                  attachments: updatedAtts,
                  drawingData: data,
                })
                setActiveDrawingCallback(null)
              },
            })
          }}
          onOpenLightbox={(atts, idx) => setLightboxState({ attachments: atts, index: idx })}
          onPrint={(note) => printDocument(note)}
        />
      )}

      {/* FULL-SCALE WORD DOCUMENT EDITOR (When editing a Document) */}
      {editingNote && editingNote.size === 'document' && (
        <DocumentEditor
          note={editingNote}
          onSave={(updates) => handleUpdateNote(editingNote.id, updates)}
          onClose={() => setEditingNote(null)}
          onConvertToQuickNote={() => handleConvertToQuickNote(editingNote)}
        />
      )}

      {/* VECTOR DRAWING CANVAS OVERLAY */}
      {activeDrawingCallback && (
        <DrawingCanvas
          initialData={activeDrawingCallback.note?.drawingData}
          onSave={activeDrawingCallback.onSave}
          onClose={() => setActiveDrawingCallback(null)}
        />
      )}

      {/* REMINDER MODAL */}
      {reminderModalNote && (
        <RemindersModal
          initialReminder={reminderModalNote.reminder}
          onSave={async (rem) => {
            await db.notes.update(reminderModalNote.id, { reminder: rem })
            setReminderModalNote(null)
            showNotificationToast('Reminder scheduled')
          }}
          onRemove={async () => {
            await db.notes.update(reminderModalNote.id, { reminder: undefined })
            setReminderModalNote(null)
            showNotificationToast('Reminder removed')
          }}
          onClose={() => setReminderModalNote(null)}
        />
      )}

      {/* COLLABORATORS MODAL */}
      {collaboratorsModalNote && (
        <CollaboratorsModal
          collaborators={collaboratorsModalNote.collaborators || []}
          onSave={async (collabs) => {
            await db.notes.update(collaboratorsModalNote.id, { collaborators: collabs })
            setCollaboratorsModalNote(null)
            showNotificationToast('Collaborators updated')
          }}
          onClose={() => setCollaboratorsModalNote(null)}
        />
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxState && (
        <LightboxModal
          attachments={lightboxState.attachments}
          initialIndex={lightboxState.index}
          onClose={() => setLightboxState(null)}
        />
      )}

      {/* LABELS MANAGEMENT MODAL */}
      {isLabelsModalOpen && (
        <LabelsModal
          labels={labels}
          onCreateLabel={handleCreateLabel}
          onRenameLabel={handleRenameLabel}
          onDeleteLabel={handleDeleteLabel}
          onClose={() => setIsLabelsModalOpen(false)}
        />
      )}

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={async (updated) => {
            await db.settings.update('user-settings', updated)
          }}
          onClearDemoData={handleClearDemoData}
          onDeleteAllData={handleDeleteAllData}
          onExportAllData={() => exportAllDataAsJson(notes, labels)}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* SHORTCUTS HELP MODAL */}
      {isShortcutsOpen && (
        <ShortcutsHelpModal onClose={() => setIsShortcutsOpen(false)} />
      )}

      {/* FLOATING UNDO / STATUS TOAST */}
      {undoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 select-none">
          <span>{undoToast.message}</span>
          <button
            onClick={() => undoToast.onUndo()}
            className="flex items-center gap-1 text-amber-400 dark:text-amber-600 font-bold hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo
          </button>
          <button
            onClick={() => setUndoToast(null)}
            className="p-0.5 rounded-full hover:bg-white/10 dark:hover:bg-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
