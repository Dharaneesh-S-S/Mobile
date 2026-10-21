import React, { useState, useRef, useEffect } from 'react'
import {
  CheckSquare, Image as ImageIcon, PenTool, Palette,
  Bell, UserPlus, Archive, Plus, Trash2, X
} from 'lucide-react'
import { ChecklistItem, Note, NoteAttachment, DrawingData } from '../../types'
import { NOTE_COLORS, getCardThemeStyles } from '../../utils/colors'
import { NOTE_PATTERNS, getNotePattern } from '../../utils/patterns'

interface TakeNoteBarProps {
  onCreateNote: (noteData: Partial<Note>) => Promise<void>
  onOpenDrawingModal: (onSave: (url: string, data: DrawingData) => void) => void
  onOpenReminderModal: (onSave: (reminder: any) => void) => void
  onOpenCollaboratorsModal: (onSave: (collabs: any[]) => void) => void
}

export const TakeNoteBar: React.FC<TakeNoteBarProps> = ({
  onCreateNote,
  onOpenDrawingModal,
  onOpenReminderModal,
  onOpenCollaboratorsModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isChecklist, setIsChecklist] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [newItemText, setNewItemText] = useState('')
  const [color, setColor] = useState('default')
  const [pattern, setPattern] = useState<string | undefined>(undefined)
  const [attachments, setAttachments] = useState<NoteAttachment[]>([])
  const [reminder, setReminder] = useState<any>(undefined)
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [isArchived, setIsArchived] = useState(false)

  const [showColorPicker, setShowColorPicker] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Collapse on outside click if empty
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!title.trim() && !body.trim() && checklist.length === 0 && attachments.length === 0) {
          setIsExpanded(false)
          resetState()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [title, body, checklist, attachments])

  const resetState = () => {
    setTitle('')
    setBody('')
    setIsChecklist(false)
    setChecklist([])
    setNewItemText('')
    setColor('default')
    setPattern(undefined)
    setAttachments([])
    setReminder(undefined)
    setCollaborators([])
    setIsArchived(false)
    setShowColorPicker(false)
  }

  const handleCloseAndSave = async () => {
    const hasContent = title.trim() || body.trim() || checklist.length > 0 || attachments.length > 0

    if (hasContent) {
      const contentHtml = isChecklist
        ? `<ul data-type="taskList">${checklist.map(item => `<li data-type="taskItem" data-checked="${item.completed}">${item.text}</li>`).join('')}</ul>`
        : `<p>${body.replace(/\n/g, '<br/>')}</p>`

      const plainText = [
        title,
        body,
        checklist.map(c => c.text).join(' '),
      ].filter(Boolean).join(' ')

      await onCreateNote({
        title: title.trim(),
        content: contentHtml,
        plainText,
        size: 'quick',
        color,
        pattern,
        isChecklist,
        checklist,
        attachments,
        reminder,
        collaborators,
        isArchived,
        isPinned: false,
        isTrash: false,
        labels: [],
        versions: [],
      })
    }

    setIsExpanded(false)
    resetState()
  }

  // Add checklist item
  const handleAddChecklistItem = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newItemText.trim()) {
      e.preventDefault()
      setChecklist([
        ...checklist,
        {
          id: `item-${Date.now()}-${checklist.length}`,
          text: newItemText.trim(),
          completed: false,
          indent: 0,
          order: checklist.length,
        },
      ])
      setNewItemText('')
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        setAttachments(prev => [
          ...prev,
          {
            id: `att-${Date.now()}-${Math.random()}`,
            type: 'image',
            url,
            createdAt: new Date().toISOString(),
          },
        ])
        setIsExpanded(true)
      }
      reader.readAsDataURL(file)
    })
  }

  // Start with checklist mode
  const handleStartChecklist = () => {
    setIsChecklist(true)
    setIsExpanded(true)
  }

  // Start with drawing
  const handleStartDrawing = () => {
    onOpenDrawingModal((url, data) => {
      setAttachments(prev => [
        ...prev,
        {
          id: `draw-${Date.now()}`,
          type: 'drawing',
          url,
          createdAt: new Date().toISOString(),
        },
      ])
      setIsExpanded(true)
    })
  }

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const themeStyles = getCardThemeStyles(color, isDark)
  const patternObj = pattern && pattern !== 'none' ? getNotePattern(pattern) : null

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-3">
      <div
        ref={containerRef}
        className={`rounded-2xl transition-all duration-300 border shadow-md relative overflow-hidden ${
          themeStyles.className
        } ${
          isExpanded
            ? 'shadow-xl ring-2 ring-indigo-500/20'
            : 'hover:shadow-lg'
        }`}
        style={themeStyles.style}
      >
        {/* Subtle Corner Watermark if pattern selected */}
        {patternObj && patternObj.svgDataUri && (
          <div
            className="absolute -bottom-2 -right-2 w-24 h-24 pointer-events-none opacity-15 bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: patternObj.svgDataUri }}
          />
        )}

        {!isExpanded ? (
          /* COLLAPSED BAR: "Take a note..." */
          <div
            onClick={() => setIsExpanded(true)}
            className="p-3.5 flex items-center justify-between cursor-text bg-white dark:bg-slate-900 rounded-2xl"
          >
            <span className="text-slate-500 dark:text-slate-400 text-sm font-normal">
              Take a note...
            </span>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartChecklist()
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="New list"
              >
                <CheckSquare className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartDrawing()
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="New drawing"
              >
                <PenTool className="w-5 h-5" />
              </button>
              <label
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="New note with image"
              >
                <ImageIcon className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          /* EXPANDED NOTE EDITOR */
          <div className="p-4 space-y-3 relative z-10">
            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {attachments.map((att) => (
                  <div key={att.id} className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={att.url} alt="" className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent font-semibold text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              autoFocus
            />

            {/* Body or Checklist */}
            {!isChecklist ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Take a note..."
                rows={3}
                className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
              />
            ) : (
              <div className="space-y-1.5 text-xs">
                {checklist.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2 group">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) => {
                        const updated = [...checklist]
                        updated[idx].completed = e.target.checked
                        setChecklist(updated)
                      }}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => {
                        const updated = [...checklist]
                        updated[idx].text = e.target.value
                        setChecklist(updated)
                      }}
                      className={`flex-1 bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-200 ${item.completed ? 'line-through text-slate-400' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setChecklist(checklist.filter(c => c.id !== item.id))}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-1">
                  <Plus className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={handleAddChecklistItem}
                    placeholder="List item (press Enter to add)"
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 relative">
                {/* Remind me */}
                <button
                  type="button"
                  onClick={() => onOpenReminderModal((rem) => setReminder(rem))}
                  className={`p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors ${reminder ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
                  title="Remind me"
                >
                  <Bell className="w-4 h-4" />
                </button>

                {/* Collaborator */}
                <button
                  type="button"
                  onClick={() => onOpenCollaboratorsModal((collabs) => setCollaborators(collabs))}
                  className={`p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors ${collaborators.length > 0 ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
                  title="Collaborator"
                >
                  <UserPlus className="w-4 h-4" />
                </button>

                {/* Color and Pattern Palette */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                    title="Background options"
                  >
                    <Palette className="w-4 h-4" />
                  </button>
                  {showColorPicker && (
                    <div className="absolute left-0 bottom-full mb-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 w-56">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Color</div>
                      <div className="grid grid-cols-6 gap-1.5 mb-2.5">
                        {NOTE_COLORS.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setColor(c.id)}
                            className={`w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 transition-transform ${color === c.id ? 'scale-110 ring-2 ring-indigo-500 ring-offset-1' : 'hover:scale-105'}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>

                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Pattern</div>
                      <div className="grid grid-cols-4 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPattern(undefined)}
                          className={`h-7 rounded border text-[10px] font-medium transition-colors ${!pattern ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600' : 'border-slate-200 dark:border-slate-700'}`}
                        >
                          None
                        </button>
                        {NOTE_PATTERNS.filter(p => p.id !== 'none').map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPattern(p.id)}
                            className={`h-7 rounded border text-[10px] capitalize transition-colors ${pattern === p.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-medium' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Add Image */}
                <label className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Add image">
                  <ImageIcon className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Add Drawing */}
                <button
                  type="button"
                  onClick={handleStartDrawing}
                  className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Add drawing"
                >
                  <PenTool className="w-4 h-4" />
                </button>

                {/* Archive toggle */}
                <button
                  type="button"
                  onClick={() => setIsArchived(!isArchived)}
                  className={`p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors ${isArchived ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
                  title="Archive"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>

              {/* Close / Save Button */}
              <button
                type="button"
                onClick={handleCloseAndSave}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
