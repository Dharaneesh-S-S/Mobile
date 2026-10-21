import React, { useState, useEffect } from 'react'
import {
  Pin, Check, Bell, UserPlus, Palette, Image as ImageIcon,
  Archive, MoreVertical, CheckSquare, Sparkles, Printer, Copy,
  Trash2, Tag, PenTool, Undo2, Redo2, Plus, X, ChevronDown, ChevronRight
} from 'lucide-react'
import { Note, ChecklistItem, NoteAttachment, DrawingData } from '../../types'
import { NOTE_COLORS, getCardThemeStyles } from '../../utils/colors'
import { NOTE_PATTERNS, getNotePattern } from '../../utils/patterns'

interface QuickNoteModalProps {
  note: Note
  onSave: (updatedNote: Partial<Note>) => void
  onClose: () => void
  onConvertToDocument: (note: Note) => void
  onOpenReminderModal: (note: Note) => void
  onOpenCollaboratorsModal: (note: Note) => void
  onOpenDrawingModal: (note: Note) => void
  onOpenLightbox: (attachments: NoteAttachment[], index: number) => void
  onPrint: (note: Note) => void
}

export const QuickNoteModal: React.FC<QuickNoteModalProps> = ({
  note,
  onSave,
  onClose,
  onConvertToDocument,
  onOpenReminderModal,
  onOpenCollaboratorsModal,
  onOpenDrawingModal,
  onOpenLightbox,
  onPrint,
}) => {
  const [title, setTitle] = useState(note.title || '')
  const [body, setBody] = useState(note.plainText || '')
  const [isChecklist, setIsChecklist] = useState(note.isChecklist || false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(note.checklist || [])
  const [newItemText, setNewItemText] = useState('')
  const [color, setColor] = useState(note.color || 'default')
  const [pattern, setPattern] = useState(note.pattern)
  const [isPinned, setIsPinned] = useState(note.isPinned || false)
  const [isArchived, setIsArchived] = useState(note.isArchived || false)
  const [attachments, setAttachments] = useState<NoteAttachment[]>(note.attachments || [])
  const [labels, setLabels] = useState<string[]>(note.labels || [])
  const [completedCollapsed, setCompletedCollapsed] = useState(false)
  const [newLabelInput, setNewLabelInput] = useState('')
  const [showLabelInput, setShowLabelInput] = useState(false)

  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  // Undo / Redo history for modal
  const [history, setHistory] = useState<{ title: string; body: string; checklist: ChecklistItem[] }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const handleSaveAndClose = () => {
    const plainText = isChecklist
      ? [title, checklist.map(c => c.text).join(' ')].join(' ')
      : [title, body].join(' ')

    const contentHtml = isChecklist
      ? `<ul data-type="taskList">${checklist.map(item => `<li data-type="taskItem" data-checked="${item.completed}">${item.text}</li>`).join('')}</ul>`
      : `<p>${body.replace(/\n/g, '<br/>')}</p>`

    onSave({
      title: title.trim(),
      content: contentHtml,
      plainText,
      color,
      pattern,
      isPinned,
      isArchived,
      isChecklist,
      checklist,
      attachments,
      labels,
      updatedAt: new Date().toISOString(),
    })
    onClose()
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

  // Move checked to bottom
  const moveCheckedToBottom = () => {
    const active = checklist.filter(c => !c.completed)
    const completed = checklist.filter(c => c.completed)
    setChecklist([...active, ...completed])
  }

  // Uncheck all items
  const uncheckAllItems = () => {
    setChecklist(checklist.map(c => ({ ...c, completed: false })))
  }

  // Delete completed items
  const deleteCompletedItems = () => {
    setChecklist(checklist.filter(c => !c.completed))
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
      }
      reader.readAsDataURL(file)
    })
  }

  // Add label tag
  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabelInput.trim()) return
    const tag = newLabelInput.trim().replace(/^#/, '')
    if (!labels.includes(tag)) {
      setLabels([...labels, tag])
    }
    setNewLabelInput('')
    setShowLabelInput(false)
  }

  const activeChecklist = checklist.filter(c => !c.completed)
  const completedChecklist = checklist.filter(c => c.completed)

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const themeStyles = getCardThemeStyles(color, isDark)
  const patternObj = pattern && pattern !== 'none' ? getNotePattern(pattern) : null

  return (
    <div
      onClick={handleSaveAndClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden relative animate-in zoom-in-95 duration-150 ${themeStyles.className}`}
        style={themeStyles.style}
      >
        {/* Subtle Corner Watermark if pattern selected */}
        {patternObj && patternObj.svgDataUri && (
          <div
            className="absolute -bottom-2 -right-2 w-28 h-28 pointer-events-none opacity-15 bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: patternObj.svgDataUri }}
          />
        )}

        {/* Modal Top Header */}
        <div className="p-4 pb-2 flex items-center justify-between relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border-b border-slate-100 dark:border-slate-800">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="flex-1 bg-transparent font-semibold text-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />

          <div className="flex items-center gap-1 shrink-0">
            {/* Expand to document button */}
            <button
              type="button"
              onClick={() => {
                handleSaveAndClose()
                onConvertToDocument(note)
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              title="Expand to full Word document"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Expand to doc</span>
            </button>

            {/* Pin note */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-full transition-colors ${
                isPinned ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' : 'text-slate-400 hover:text-slate-700'
              }`}
              title={isPinned ? 'Unpin' : 'Pin'}
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs">
          {/* Attachments collage */}
          {attachments.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {attachments.map((att, idx) => (
                <div
                  key={att.id}
                  onClick={() => onOpenLightbox(attachments, idx)}
                  className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 h-28 bg-slate-100 dark:bg-slate-800 cursor-pointer"
                >
                  <img src={att.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setAttachments(attachments.filter(a => a.id !== att.id))
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Note Body or Checklist */}
          {!isChecklist ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Note..."
              rows={6}
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
            />
          ) : (
            <div className="space-y-2 text-xs">
              {/* Active items */}
              {activeChecklist.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => {
                      const updated = [...checklist]
                      const targetIdx = checklist.findIndex(c => c.id === item.id)
                      if (targetIdx !== -1) updated[targetIdx].completed = e.target.checked
                      setChecklist(updated)
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const updated = [...checklist]
                      const targetIdx = checklist.findIndex(c => c.id === item.id)
                      if (targetIdx !== -1) updated[targetIdx].text = e.target.value
                      setChecklist(updated)
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setChecklist(checklist.filter(c => c.id !== item.id))}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add item row */}
              <div className="flex items-center gap-2 pt-1">
                <Plus className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={handleAddChecklistItem}
                  placeholder="List item (Enter to add)"
                  className="flex-1 bg-transparent border-none focus:outline-none text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Completed items accordion */}
              {completedChecklist.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCompletedCollapsed(!completedCollapsed)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 font-medium py-1"
                  >
                    {completedCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{completedChecklist.length} completed items</span>
                  </button>

                  {!completedCollapsed && (
                    <div className="space-y-1.5 pl-5 pt-1">
                      {completedChecklist.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 group">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={(e) => {
                              const updated = [...checklist]
                              const targetIdx = checklist.findIndex(c => c.id === item.id)
                              if (targetIdx !== -1) updated[targetIdx].completed = e.target.checked
                              setChecklist(updated)
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          />
                          <span className="flex-1 line-through text-slate-400 text-xs">{item.text}</span>
                          <button
                            type="button"
                            onClick={() => setChecklist(checklist.filter(c => c.id !== item.id))}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Label Chips & Add Label */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {labels.map((lbl) => (
              <span
                key={lbl}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
              >
                #{lbl}
                <button
                  type="button"
                  onClick={() => setLabels(labels.filter(l => l !== lbl))}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {showLabelInput ? (
              <form onSubmit={handleAddLabel} className="flex items-center gap-1">
                <input
                  type="text"
                  value={newLabelInput}
                  onChange={(e) => setNewLabelInput(e.target.value)}
                  placeholder="Label name..."
                  autoFocus
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full px-2 py-0.5 text-[11px] focus:outline-none"
                />
                <button type="submit" className="text-indigo-600 text-[11px] font-semibold">Add</button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowLabelInput(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-700 text-[11px]"
              >
                <Tag className="w-3 h-3" />
                <span>Add label</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-3 px-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/90 relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            {/* Remind me */}
            <button
              type="button"
              onClick={() => onOpenReminderModal(note)}
              className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Remind me"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Collaborator */}
            <button
              type="button"
              onClick={() => onOpenCollaboratorsModal(note)}
              className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Collaborator"
            >
              <UserPlus className="w-4 h-4" />
            </button>

            {/* Color & Pattern Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowColorPicker(!showColorPicker)
                  setShowMoreMenu(false)
                }}
                className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                title="Background options"
              >
                <Palette className="w-4 h-4" />
              </button>
              {showColorPicker && (
                <div className="absolute left-0 bottom-full mb-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 w-56">
                  <div className="grid grid-cols-6 gap-1.5 mb-2.5">
                    {NOTE_COLORS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setColor(c.id)
                          setShowColorPicker(false)
                        }}
                        className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPattern(undefined)
                        setShowColorPicker(false)
                      }}
                      className="h-7 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-medium"
                    >
                      None
                    </button>
                    {NOTE_PATTERNS.filter(p => p.id !== 'none').map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPattern(p.id)
                          setShowColorPicker(false)
                        }}
                        className="h-7 rounded border border-slate-200 dark:border-slate-700 text-[10px] capitalize"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add Image */}
            <label className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Add image">
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
              onClick={() => onOpenDrawingModal(note)}
              className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Add drawing"
            >
              <PenTool className="w-4 h-4" />
            </button>

            {/* Archive */}
            <button
              type="button"
              onClick={() => setIsArchived(!isArchived)}
              className={`p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors ${isArchived ? 'text-indigo-600' : ''}`}
              title={isArchived ? 'Unarchive' : 'Archive'}
            >
              <Archive className="w-4 h-4" />
            </button>

            {/* More menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(!showMoreMenu)
                  setShowColorPicker(false)
                }}
                className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                title="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMoreMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChecklist(!isChecklist)
                      setShowMoreMenu(false)
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    {isChecklist ? 'Hide checkboxes' : 'Show checkboxes'}
                  </button>

                  {isChecklist && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          moveCheckedToBottom()
                          setShowMoreMenu(false)
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Move checked items to bottom
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          uncheckAllItems()
                          setShowMoreMenu(false)
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Uncheck all items
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteCompletedItems()
                          setShowMoreMenu(false)
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-red-500"
                      >
                        Delete completed items
                      </button>
                    </>
                  )}

                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveAndClose()
                      onConvertToDocument(note)
                      setShowMoreMenu(false)
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center gap-2 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Expand to document
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onPrint(note)
                      setShowMoreMenu(false)
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print note
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
