import React, { useState } from 'react'
import {
  Pin, Check, Bell, UserPlus, Palette, Image as ImageIcon,
  Archive, MoreVertical, FileText, CheckSquare, Sparkles,
  Printer, Copy, Trash2, Tag, PenTool, ExternalLink, Globe,
  Calendar, MapPin, AlignLeft, BookOpen
} from 'lucide-react'
import { Note, ChecklistItem } from '../../types'
import { NOTE_COLORS, getNoteColor, getCardThemeStyles } from '../../utils/colors'
import { NOTE_PATTERNS, getNotePattern } from '../../utils/patterns'
import { formatReminderDate, isPastDue } from '../../utils/dateUtils'
import { parseLinkPreviewFromText } from '../../utils/linkPreview'

interface NoteCardProps {
  note: Note
  isSelected: boolean
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
  onOpenLightbox: (images: any[], index: number) => void
  onPrint: (note: Note) => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent, id: string) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, targetId: string) => void
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isSelected,
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
  draggable = true,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Determine if dark mode is active from html class
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

  const themeStyles = getCardThemeStyles(note.color, isDark)
  const patternObj = note.pattern && note.pattern !== 'none' ? getNotePattern(note.pattern) : null

  // URL previews — ONLY returns data if a real http/https URL is actually in the text
  const linkPreview = parseLinkPreviewFromText(note.plainText || '')

  // Uncompleted & completed checklist items
  const activeItems = note.checklist?.filter(c => !c.completed) || []
  const completedItems = note.checklist?.filter(c => c.completed) || []

  const isDocument = note.size === 'document'

  // Approximate word count for document cards
  const wordCount = note.plainText ? note.plainText.trim().split(/\s+/).filter(Boolean).length : 0

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, note.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, note.id)}
      onClick={() => onOpenNote(note)}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        themeStyles.className
      } ${
        isSelected
          ? 'ring-2 ring-indigo-500 shadow-xl border-indigo-500'
          : 'hover:shadow-lg'
      } ${isDocument ? 'col-span-1 md:col-span-2' : ''}`}
      style={themeStyles.style}
    >
      {/* Subtle Corner Watermark (if pattern is explicitly chosen, non-intrusive) */}
      {patternObj && patternObj.svgDataUri && (
        <div
          className="absolute -bottom-2 -right-2 w-20 h-20 pointer-events-none opacity-15 bg-contain bg-no-repeat bg-right-bottom"
          style={{ backgroundImage: patternObj.svgDataUri }}
        />
      )}

      {/* Multi-select checkmark (visible on hover or when selected) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleSelect(note.id)
        }}
        className={`absolute top-3 left-3 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-200 dark:border-slate-700'
        }`}
        title="Select note"
      >
        <Check className="w-3.5 h-3.5" />
      </button>

      {/* Pin button (top right) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onTogglePin(note.id)
        }}
        className={`absolute top-3 right-3 z-20 p-1.5 rounded-full transition-all ${
          note.isPinned
            ? 'text-amber-500 opacity-100 bg-white/90 dark:bg-slate-800/90 shadow-sm border border-amber-200 dark:border-amber-900/60'
            : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-800 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 shadow-2xs border border-slate-200 dark:border-slate-700'
        }`}
        title={note.isPinned ? 'Unpin note' : 'Pin note'}
      >
        <Pin className="w-4 h-4 fill-current" />
      </button>

      {/* Attachments collage */}
      {note.attachments && note.attachments.length > 0 && (
        <div className={`grid gap-1 mb-1 ${note.attachments.length === 1 ? 'grid-cols-1' : note.attachments.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {note.attachments.slice(0, 3).map((att, idx) => (
            <div
              key={att.id}
              onClick={(e) => {
                e.stopPropagation()
                onOpenLightbox(note.attachments, idx)
              }}
              className="relative overflow-hidden h-36 bg-slate-100 dark:bg-slate-800/80 hover:opacity-90 transition-opacity"
            >
              <img src={att.url} alt="" className="w-full h-full object-cover" />
              {idx === 2 && note.attachments.length > 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                  +{note.attachments.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Card Body Container */}
      <div className="p-4 sm:p-5 space-y-2.5 relative z-10">
        {/* Document Header Badge & Stats */}
        {isDocument && (
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold tracking-wide uppercase">
                <FileText className="w-3 h-3 text-indigo-500" />
                Document Studio
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-400" />
                {wordCount} words
              </span>
              <span>•</span>
              <span>{note.pageSetup?.paperSize || 'A4'}</span>
            </div>
          </div>
        )}

        {/* Note Title */}
        {note.title && (
          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug tracking-tight">
            {note.title}
          </h3>
        )}

        {/* Note Body or Checklist */}
        {note.isChecklist ? (
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
            {activeItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2.5"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => onToggleChecklistItem(note.id, item.id, e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span className="truncate leading-normal">{item.text}</span>
              </div>
            ))}

            {completedItems.length > 0 && (
              <div className="text-[11px] text-slate-400 font-medium pt-1 flex items-center gap-1">
                <CheckSquare className="w-3 h-3 text-slate-400" />
                <span>{completedItems.length} completed {completedItems.length === 1 ? 'task' : 'tasks'}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 line-clamp-5 leading-relaxed break-words whitespace-pre-wrap font-normal">
            {note.plainText || 'Empty note'}
          </p>
        )}

        {/* Real Link Preview Chip (ONLY when actual valid http URL exists in text) */}
        {linkPreview && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              window.open(linkPreview.url, '_blank', 'noopener,noreferrer')
            }}
            className="mt-2 p-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs transition-colors group/link"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
              <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <div className="truncate text-[11px]">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{linkPreview.domain}</span>
                {linkPreview.title && linkPreview.title !== linkPreview.domain && (
                  <span className="text-slate-500 dark:text-slate-400 ml-1.5 truncate">• {linkPreview.title}</span>
                )}
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-indigo-500 shrink-0" />
          </div>
        )}

        {/* Reminder pill badge */}
        {note.reminder && (
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isPastDue(note.reminder.dateTime)
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {note.reminder.placeText ? (
              <>
                <MapPin className="w-3 h-3" />
                <span>{note.reminder.placeText}</span>
              </>
            ) : (
              <>
                <Bell className="w-3 h-3" />
                <span>{formatReminderDate(note.reminder.dateTime)}</span>
              </>
            )}
          </div>
        )}

        {/* Label chips & Collaborators */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {note.labels && note.labels.map((lbl) => (
            <span
              key={lbl}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold border border-slate-200 dark:border-slate-700"
            >
              #{lbl}
            </span>
          ))}

          {/* Collaborator avatars */}
          {note.collaborators && note.collaborators.length > 0 && (
            <div className="flex -space-x-1.5 ml-auto">
              {note.collaborators.map((c) => (
                <div
                  key={c.email}
                  className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs"
                  style={{ backgroundColor: c.avatarColor }}
                  title={`${c.name} (${c.role})`}
                >
                  {c.name.charAt(0)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hover bottom action toolbar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="px-3 py-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs relative z-20"
      >
        <div className="flex items-center gap-0.5 text-slate-500 dark:text-slate-400">
          {/* Remind me */}
          <button
            type="button"
            onClick={() => onOpenReminderModal(note)}
            className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Remind me"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          {/* Collaborator */}
          <button
            type="button"
            onClick={() => onOpenCollaboratorsModal(note)}
            className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Collaborator"
          >
            <UserPlus className="w-3.5 h-3.5" />
          </button>

          {/* Background options */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker)
                setShowMoreMenu(false)
              }}
              className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Background options"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
            {showColorPicker && (
              <div className="absolute left-0 bottom-full mb-1.5 p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 w-52 animate-in zoom-in-95">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Color</div>
                <div className="grid grid-cols-6 gap-1.5 mb-2.5">
                  {NOTE_COLORS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onColorChange(note.id, c.id)
                        setShowColorPicker(false)
                      }}
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: isDark ? c.darkBg : c.lightBg }}
                      title={c.name}
                    />
                  ))}
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Corner Accent</div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onPatternChange(note.id, undefined)
                      setShowColorPicker(false)
                    }}
                    className="h-6 rounded border border-slate-200 dark:border-slate-700 text-[9px] font-medium"
                  >
                    None
                  </button>
                  {NOTE_PATTERNS.filter(p => p.id !== 'none').slice(0, 5).map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onPatternChange(note.id, p.id)
                        setShowColorPicker(false)
                      }}
                      className="h-6 rounded border border-slate-200 dark:border-slate-700 text-[9px] capitalize"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Drawing */}
          <button
            type="button"
            onClick={() => onOpenDrawingModal(note)}
            className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Add drawing"
          >
            <PenTool className="w-3.5 h-3.5" />
          </button>

          {/* Archive */}
          <button
            type="button"
            onClick={() => onToggleArchive(note.id)}
            className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title={note.isArchived ? 'Unarchive' : 'Archive'}
          >
            <Archive className="w-3.5 h-3.5" />
          </button>

          {/* More options menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowMoreMenu(!showMoreMenu)
                setShowColorPicker(false)
              }}
              className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="More"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
            {showMoreMenu && (
              <div className="absolute left-0 bottom-full mb-1.5 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs animate-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteNote(note.id)
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete note
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onMakeCopy(note)
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" /> Make a copy
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                {isDocument ? (
                  <button
                    type="button"
                    onClick={() => {
                      onConvertToQuickNote(note)
                      setShowMoreMenu(false)
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center gap-2 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Shrink to quick note
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onConvertToDocument(note)
                      setShowMoreMenu(false)
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center gap-2 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Expand to document
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onPrint(note)
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
