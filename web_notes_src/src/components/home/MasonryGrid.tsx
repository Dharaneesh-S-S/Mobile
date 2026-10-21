import React from 'react'
import { NoteCard } from '../note/NoteCard'
import { Note, NoteViewMode, SidebarSection } from '../../types'
import {
  Lightbulb, Bell, FileText, PenTool, Archive, Trash2, Search, Inbox, Tag
} from 'lucide-react'

interface MasonryGridProps {
  notes: Note[]
  currentSection: SidebarSection
  searchQuery: string
  viewMode: NoteViewMode
  selectedNoteIds: string[]
  onToggleSelect: (id: string) => void
  onOpenNote: (note: Note) => void
  onTogglePin: (id: string) => void
  onToggleArchive: (id: string) => void
  onDeleteNote: (id: string) => void
  onColorChange: (id: string, color: string) => void
  onPatternChange: (id: string, pattern?: string) => void
  onToggleChecklistItem: (noteId: string, itemId: string, completed: boolean) => void
  onConvertToDocument: (note: Note) => void
  onConvertToQuickNote: (note: Note) => void
  onMakeCopy: (note: Note) => void
  onOpenReminderModal: (note: Note) => void
  onOpenCollaboratorsModal: (note: Note) => void
  onOpenDrawingModal: (note: Note) => void
  onOpenLightbox: (attachments: any[], index: number) => void
  onPrint: (note: Note) => void
  onReorderNotes: (draggedId: string, targetId: string) => void
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  notes,
  currentSection,
  searchQuery,
  viewMode,
  selectedNoteIds,
  onToggleSelect,
  onOpenNote,
  onTogglePin,
  onToggleArchive,
  onDeleteNote,
  onColorChange,
  onPatternChange,
  onToggleChecklistItem,
  onConvertToDocument,
  onConvertToQuickNote,
  onMakeCopy,
  onOpenReminderModal,
  onOpenCollaboratorsModal,
  onOpenDrawingModal,
  onOpenLightbox,
  onPrint,
  onReorderNotes,
}) => {
  // Drag and drop state
  const [draggedId, setDraggedId] = React.useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (draggedId && draggedId !== targetId) {
      onReorderNotes(draggedId, targetId)
    }
    setDraggedId(null)
  }

  // Filter notes based on section and search query
  const filteredNotes = notes.filter((note) => {
    // Trash
    if (currentSection === 'trash') {
      return note.isTrash
    }
    if (note.isTrash) return false

    // Archive
    if (currentSection === 'archive') {
      return note.isArchived
    }
    if (note.isArchived) return false

    // Reminders
    if (currentSection === 'reminders') {
      return !!note.reminder
    }

    // Documents
    if (currentSection === 'documents') {
      return note.size === 'document'
    }

    // Drawings
    if (currentSection === 'drawings') {
      return (
        note.attachments?.some(a => a.type === 'drawing') ||
        !!note.drawingData
      )
    }

    // Label filter (case-insensitive)
    if (typeof currentSection === 'string' && currentSection.startsWith('label:')) {
      const labelName = currentSection.replace('label:', '').toLowerCase()
      return note.labels?.some(l => l.toLowerCase() === labelName)
    }

    // Default 'notes' section: unarchived, non-trash notes
    return true
  }).filter((note) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const inTitle = note.title.toLowerCase().includes(q)
    const inPlain = note.plainText.toLowerCase().includes(q)
    const inChecklist = note.checklist?.some(c => c.text.toLowerCase().includes(q))
    const inLabels = note.labels?.some(l => l.toLowerCase().includes(q))
    return inTitle || inPlain || inChecklist || inLabels
  })

  // Separate pinned vs others (only relevant in standard views)
  const isTrashOrArchive = currentSection === 'trash' || currentSection === 'archive'
  const pinnedNotes = !isTrashOrArchive ? filteredNotes.filter(n => n.isPinned) : []
  const otherNotes = !isTrashOrArchive ? filteredNotes.filter(n => !n.isPinned) : filteredNotes

  // Section Header metadata
  const getSectionHeader = () => {
    if (currentSection.startsWith('label:')) {
      const labelName = currentSection.replace('label:', '')
      return {
        icon: <Tag className="w-5 h-5 text-indigo-500" />,
        title: `#${labelName}`,
        count: `${filteredNotes.length} notes`,
      }
    }
    if (currentSection === 'documents') {
      return {
        icon: <FileText className="w-5 h-5 text-indigo-500" />,
        title: 'Documents Studio',
        count: `${filteredNotes.length} long-form documents`,
      }
    }
    if (currentSection === 'drawings') {
      return {
        icon: <PenTool className="w-5 h-5 text-amber-500" />,
        title: 'Canvas Sketches & Drawings',
        count: `${filteredNotes.length} vector drawings`,
      }
    }
    if (currentSection === 'reminders') {
      return {
        icon: <Bell className="w-5 h-5 text-indigo-500" />,
        title: 'Reminders',
        count: `${filteredNotes.length} scheduled alerts`,
      }
    }
    if (currentSection === 'archive') {
      return {
        icon: <Archive className="w-5 h-5 text-slate-400" />,
        title: 'Archive',
        count: `${filteredNotes.length} archived notes`,
      }
    }
    if (currentSection === 'trash') {
      return {
        icon: <Trash2 className="w-5 h-5 text-red-500" />,
        title: 'Trash',
        count: `${filteredNotes.length} deleted items`,
      }
    }
    return null
  }

  const sectionHeader = getSectionHeader()

  // Empty state rendering
  if (filteredNotes.length === 0) {
    let icon = <Inbox className="w-14 h-14 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
    let title = 'No notes here yet'
    let sub = 'Tap the bar above or press "C" to capture your thoughts.'

    if (searchQuery.trim()) {
      icon = <Search className="w-14 h-14 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
      title = `No matching results for "${searchQuery}"`
      sub = 'Try different keywords or check spelling.'
    } else if (currentSection === 'reminders') {
      icon = <Bell className="w-14 h-14 text-indigo-400/60 dark:text-indigo-900/60 mx-auto mb-3" />
      title = 'No active reminders'
      sub = 'Notes with upcoming reminders will appear here.'
    } else if (currentSection === 'documents') {
      icon = <FileText className="w-14 h-14 text-indigo-400/60 dark:text-indigo-900/60 mx-auto mb-3" />
      title = 'No documents yet'
      sub = 'Create reports, essays, and long-form documents using the Word-style editor.'
    } else if (currentSection === 'drawings') {
      icon = <PenTool className="w-14 h-14 text-amber-400/60 dark:text-amber-900/60 mx-auto mb-3" />
      title = 'No drawings yet'
      sub = 'Sketches and canvas vector artwork will appear here.'
    } else if (currentSection === 'archive') {
      icon = <Archive className="w-14 h-14 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
      title = 'Archive is empty'
      sub = 'Archived notes are stored safely out of sight.'
    } else if (currentSection === 'trash') {
      icon = <Trash2 className="w-14 h-14 text-red-400/60 dark:text-red-950/60 mx-auto mb-3" />
      title = 'Trash is empty'
      sub = 'Deleted notes will be permanently purged after 7 days.'
    }

    return (
      <div className="py-20 text-center max-w-sm mx-auto px-4 animate-in fade-in">
        {icon}
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
    )
  }

  // Card grid container style (Masonry multi-column or Single column list)
  const gridClasses = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start'
    : 'flex flex-col gap-3 max-w-2xl mx-auto'

  return (
    <div className="space-y-6 pb-16">
      {/* Optional Section Header Banner */}
      {sectionHeader && !searchQuery && (
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
            {sectionHeader.icon}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {sectionHeader.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {sectionHeader.count}
            </p>
          </div>
        </div>
      )}

      {/* PINNED SECTION */}
      {pinnedNotes.length > 0 && (
        <section>
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 mb-3 flex items-center gap-1.5">
            <span>Pinned</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </div>
          <div className={gridClasses}>
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={selectedNoteIds.includes(note.id)}
                onToggleSelect={onToggleSelect}
                onOpenNote={onOpenNote}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                onDeleteNote={onDeleteNote}
                onColorChange={onColorChange}
                onPatternChange={onPatternChange}
                onToggleChecklistItem={onToggleChecklistItem}
                onConvertToDocument={onConvertToDocument}
                onConvertToQuickNote={onConvertToQuickNote}
                onMakeCopy={onMakeCopy}
                onOpenReminderModal={onOpenReminderModal}
                onOpenCollaboratorsModal={onOpenCollaboratorsModal}
                onOpenDrawingModal={onOpenDrawingModal}
                onOpenLightbox={onOpenLightbox}
                onPrint={onPrint}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </section>
      )}

      {/* OTHERS SECTION */}
      {otherNotes.length > 0 && (
        <section>
          {pinnedNotes.length > 0 && (
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 mb-3">
              Others
            </div>
          )}
          <div className={gridClasses}>
            {otherNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={selectedNoteIds.includes(note.id)}
                onToggleSelect={onToggleSelect}
                onOpenNote={onOpenNote}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                onDeleteNote={onDeleteNote}
                onColorChange={onColorChange}
                onPatternChange={onPatternChange}
                onToggleChecklistItem={onToggleChecklistItem}
                onConvertToDocument={onConvertToDocument}
                onConvertToQuickNote={onConvertToQuickNote}
                onMakeCopy={onMakeCopy}
                onOpenReminderModal={onOpenReminderModal}
                onOpenCollaboratorsModal={onOpenCollaboratorsModal}
                onOpenDrawingModal={onOpenDrawingModal}
                onOpenLightbox={onOpenLightbox}
                onPrint={onPrint}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
