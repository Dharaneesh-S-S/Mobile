import Dexie, { type Table } from 'dexie'
import { Note, Label, UserSettings, SidebarSection } from '../types'
import { INITIAL_NOTES, INITIAL_LABELS, DEFAULT_SETTINGS } from './seedData'

export class AuraNotesDatabase extends Dexie {
  notes!: Table<Note, string>
  labels!: Table<Label, string>
  settings!: Table<UserSettings, string>

  constructor() {
    super('AuraNotesDB')
    this.version(1).stores({
      notes: 'id, title, size, isPinned, isArchived, isTrash, color, pattern, createdAt, updatedAt, orderIndex',
      labels: 'id, name',
      settings: 'id',
    })
  }
}

export const db = new AuraNotesDatabase()

export async function initializeDatabase(): Promise<void> {
  const notesCount = await db.notes.count()
  if (notesCount === 0) {
    await db.notes.bulkAdd(INITIAL_NOTES)
    await db.labels.bulkAdd(INITIAL_LABELS)
    await db.settings.put(DEFAULT_SETTINGS)
  } else {
    // Sanitize any existing demo notes so they have clean, readable backgrounds
    const demoIds = ['note_welcome_quick', 'note_project_launch_checklist', 'note_design_sketch', 'note_document_study']
    const existingDemos = await db.notes.where('id').anyOf(demoIds).toArray()
    for (const demo of existingDemos) {
      if (demo.pattern) {
        await db.notes.update(demo.id, { pattern: undefined })
      }
    }
  }
}

export const initDatabase = initializeDatabase

// Reset Demo Data
export async function resetDemoData(): Promise<void> {
  await db.notes.clear()
  await db.labels.clear()
  await db.notes.bulkAdd(INITIAL_NOTES)
  await db.labels.bulkAdd(INITIAL_LABELS)
  await db.settings.put(DEFAULT_SETTINGS)
}

// Clear all data
export async function clearAllDatabaseData(): Promise<void> {
  await db.notes.clear()
  await db.labels.clear()
  await db.settings.clear()
}

// Filtered notes query with full text search
export async function queryNotes(params: {
  section: SidebarSection
  searchQuery?: string
  filterLabel?: string | null
  filterColor?: string | null
  filterType?: 'all' | 'quick' | 'document' | 'checklist' | 'drawing' | 'image'
}): Promise<Note[]> {
  const { section, searchQuery = '', filterLabel, filterColor, filterType } = params

  let allNotes = await db.notes.toArray()

  // 1. Filter by section
  if (section === 'archive') {
    allNotes = allNotes.filter((n) => n.isArchived && !n.isTrash)
  } else if (section === 'trash') {
    allNotes = allNotes.filter((n) => n.isTrash)
  } else if (section === 'reminders') {
    allNotes = allNotes.filter((n) => !n.isTrash && !n.isArchived && Boolean(n.reminder))
  } else if (section === 'documents') {
    allNotes = allNotes.filter((n) => !n.isTrash && !n.isArchived && n.size === 'document')
  } else if (section === 'drawings') {
    allNotes = allNotes.filter(
      (n) => !n.isTrash && !n.isArchived && (Boolean(n.drawingData) || n.attachments.some((a) => a.type === 'drawing'))
    )
  } else if (section.startsWith('label:')) {
    const targetLabelName = section.replace('label:', '')
    allNotes = allNotes.filter(
      (n) => !n.isTrash && !n.isArchived && n.labels.includes(targetLabelName)
    )
  } else {
    // Normal 'notes' view: non-archived, non-trash
    allNotes = allNotes.filter((n) => !n.isTrash && !n.isArchived)
  }

  // 2. Filter by search query (across title, body, checklist, labels, and captions)
  const q = searchQuery.trim().toLowerCase()
  if (q) {
    allNotes = allNotes.filter((n) => {
      if (n.title.toLowerCase().includes(q)) return true
      if (n.plainText.toLowerCase().includes(q)) return true
      if (n.labels.some((l) => l.toLowerCase().includes(q))) return true
      if (n.checklist.some((c) => c.text.toLowerCase().includes(q))) return true
      if (n.attachments.some((a) => a.caption?.toLowerCase().includes(q))) return true
      return false
    })
  }

  // 3. Filter by label tag
  if (filterLabel) {
    allNotes = allNotes.filter((n) => n.labels.includes(filterLabel))
  }

  // 4. Filter by color
  if (filterColor && filterColor !== 'default') {
    allNotes = allNotes.filter((n) => n.color === filterColor)
  }

  // 5. Filter by type
  if (filterType && filterType !== 'all') {
    if (filterType === 'quick') {
      allNotes = allNotes.filter((n) => n.size === 'quick')
    } else if (filterType === 'document') {
      allNotes = allNotes.filter((n) => n.size === 'document')
    } else if (filterType === 'checklist') {
      allNotes = allNotes.filter((n) => n.isChecklist)
    } else if (filterType === 'drawing') {
      allNotes = allNotes.filter((n) => Boolean(n.drawingData))
    } else if (filterType === 'image') {
      allNotes = allNotes.filter((n) => n.attachments.length > 0)
    }
  }

  // Sort: pinned first, then by orderIndex or updatedAt descending
  return allNotes.sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}
