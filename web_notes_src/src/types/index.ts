export type NoteSize = 'quick' | 'document'

export type NoteViewMode = 'grid' | 'list'

export type SidebarSection = 'notes' | 'reminders' | 'documents' | 'drawings' | 'archive' | 'trash' | string

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  indent: number
  order: number
}

export interface NoteAttachment {
  id: string
  type: 'image' | 'drawing'
  url: string // Data URL or Blob URL
  caption?: string
  width?: number
  height?: number
  createdAt: string
}

export interface DrawingPoint {
  x: number
  y: number
  pressure?: number
}

export interface DrawingStroke {
  id: string
  points: number[][] // [x, y, pressure][]
  color: string
  size: number
  opacity: number
  tool: 'pen' | 'marker' | 'highlighter' | 'pencil' | 'eraser' | 'shape' | 'line' | 'arrow' | 'rect' | 'ellipse' | 'star'
  shapeType?: 'line' | 'arrow' | 'rect' | 'ellipse' | 'triangle' | 'star' | 'speech_bubble'
  startPoint?: [number, number]
  endPoint?: [number, number]
}

export interface DrawingLayer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  strokes: DrawingStroke[]
}

export interface DrawingData {
  layers: DrawingLayer[]
  background: 'blank' | 'grid' | 'dotted' | 'ruled'
  bgColor: string
  width: number
  height: number
}

export interface NoteReminder {
  id: string
  dateTime: string // ISO string
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  placeText?: string
  completed: boolean
}

export interface NoteCollaborator {
  email: string
  name: string
  avatarColor: string
  role: 'owner' | 'editor' | 'viewer'
}

export interface NoteVersion {
  id: string
  timestamp: string
  title: string
  content: string
  name?: string
  noteSize: NoteSize
  wordCount?: number
}

export interface DocComment {
  id: string
  text: string
  author: string
  createdAt: string
  resolved: boolean
  selectedText?: string
  replies: {
    id: string
    text: string
    author: string
    createdAt: string
  }[]
}

export interface TrackedChange {
  id: string
  type: 'insert' | 'delete'
  text: string
  author: string
  timestamp: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface PageSetup {
  paperSize: 'A4' | 'Letter' | 'Legal'
  orientation: 'portrait' | 'landscape'
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
  pageColor: string
  headerText?: string
  footerText?: string
  showPageNumbers?: boolean
}

export interface Note {
  id: string
  title: string
  content: string // HTML rich text content
  plainText: string // searchable plain text string
  size: NoteSize
  isPinned: boolean
  isArchived: boolean
  isTrash: boolean
  trashDate?: string
  color: string // color token/hex
  pattern?: string // pattern ID or none
  labels: string[] // label IDs or names
  isChecklist: boolean
  checklist: ChecklistItem[]
  attachments: NoteAttachment[]
  drawingData?: DrawingData
  reminder?: NoteReminder
  collaborators?: NoteCollaborator[]
  versions: NoteVersion[]
  comments?: DocComment[]
  trackedChanges?: TrackedChange[]
  pageSetup?: PageSetup
  createdAt: string
  updatedAt: string
  orderIndex: number
}

export interface Label {
  id: string
  name: string
  color?: string
}

export interface UserSettings {
  id: string
  theme: 'light' | 'dark' | 'system'
  viewMode: NoteViewMode
  defaultNoteSize: NoteSize
  defaultFont: string
  defaultPageSize: 'A4' | 'Letter' | 'Legal'
  spellcheck: boolean
  autosaveIntervalSeconds: number
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY'
  timeFormat: '12h' | '24h'
  notificationsEnabled: boolean
  addNewItemsToBottom: boolean
  moveCheckedToBottom: boolean
  displayLinkPreviews: boolean
}
