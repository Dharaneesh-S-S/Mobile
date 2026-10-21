import React, { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'

import { Note, PageSetup, NoteVersion, DocComment, DrawingData } from '../../types'
import { DocumentMenuBar } from './DocumentMenuBar'
import { DocumentToolbar } from './DocumentToolbar'
import { DocumentOutline } from './DocumentOutline'
import { DocumentComments } from './DocumentComments'
import { DocumentFindReplace } from './DocumentFindReplace'
import { PageSetupModal } from './PageSetupModal'
import { WordCountModal } from './WordCountModal'
import { VersionHistoryModal } from './VersionHistoryModal'
import { DrawingCanvas } from '../drawing/DrawingCanvas'
import { exportNoteAs, printDocument } from '../../utils/exportImport'

import {
  ArrowLeft, Check, Cloud, Share2, Sparkles,
  MessageSquare, History, CheckCircle2, ChevronDown
} from 'lucide-react'

interface DocumentEditorProps {
  note: Note
  onSave: (updatedNote: Partial<Note>) => void
  onClose: () => void
  onConvertToQuickNote: () => void
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  note,
  onSave,
  onClose,
  onConvertToQuickNote,
}) => {
  const [title, setTitle] = useState(note.title || 'Untitled Document')
  const [mode, setMode] = useState<'editing' | 'suggesting' | 'viewing'>('editing')
  const [zoom, setZoom] = useState(100)
  const [isPageView, setIsPageView] = useState(true)
  const [showRuler, setShowRuler] = useState(true)
  const [showOutline, setShowOutline] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [isDistractionFree, setIsDistractionFree] = useState(false)
  const [isDarkPage, setIsDarkPage] = useState(false)
  const [spellcheck, setSpellcheck] = useState(true)

  // Modals & panels
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [showPageSetup, setShowPageSetup] = useState(false)
  const [showWordCount, setShowWordCount] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showDrawingModal, setShowDrawingModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Selected text for comments
  const [selectedText, setSelectedText] = useState('')

  // Speech features
  const [isVoiceTyping, setIsVoiceTyping] = useState(false)
  const [isReadingAloud, setIsReadingAloud] = useState(false)
  const speechRecognitionRef = useRef<any>(null)

  // Save status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now')

  // Search state
  const [searchMatches, setSearchMatches] = useState<{ index: number; total: number }>({ index: 0, total: 0 })

  // Setup
  const [pageSetup, setPageSetup] = useState<PageSetup>(
    note.pageSetup || {
      paperSize: 'A4',
      orientation: 'portrait',
      margins: { top: 1, right: 1, bottom: 1, left: 1 },
      pageColor: '#ffffff',
      headerText: '',
      footerText: '',
      showPageNumbers: true,
    }
  )

  const [comments, setComments] = useState<DocComment[]>(note.comments || [])
  const [versions, setVersions] = useState<NoteVersion[]>(note.versions || [])

  // TipTap Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Placeholder.configure({
        placeholder: 'Type something or type "/" for commands...',
      }),
      CharacterCount,
    ],
    content: note.content || '<p></p>',
    editable: mode !== 'viewing',
    onUpdate: ({ editor }) => {
      setSaveStatus('saving')
      debouncedSave()
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection
      const text = editor.state.doc.textBetween(from, to, ' ')
      setSelectedText(text)
    },
  })

  // Debounced auto-save
  const saveTimeoutRef = useRef<any>(null)
  const debouncedSave = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      if (!editor) return
      const html = editor.getHTML()
      const text = editor.getText()

      // Record version snapshot if significant change or every few minutes
      const now = new Date().toISOString()
      const newVersion: NoteVersion = {
        id: `ver-${Date.now()}`,
        timestamp: now,
        title,
        content: html,
        noteSize: 'document',
        wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
      }

      onSave({
        title,
        content: html,
        plainText: text,
        pageSetup,
        comments,
        updatedAt: now,
      })
      setSaveStatus('saved')
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 1500)
  }

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setShowFindReplace(true)
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        handlePrint()
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        setShowWordCount(true)
      } else if (e.key === 'Escape') {
        if (showFindReplace) setShowFindReplace(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showFindReplace])

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop() } catch (err) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Voice Typing
  const toggleVoiceTyping = () => {
    if (isVoiceTyping) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop()
      }
      setIsVoiceTyping(false)
      return
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) {
      alert('Voice typing is not supported in this browser.')
      return
    }

    const recognition = new SpeechRec()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        }
      }
      if (finalTranscript && editor) {
        editor.chain().focus().insertContent(finalTranscript).run()
      }
    }

    recognition.onerror = () => {
      setIsVoiceTyping(false)
    }

    recognition.onend = () => {
      setIsVoiceTyping(false)
    }

    try {
      recognition.start()
      speechRecognitionRef.current = recognition
      setIsVoiceTyping(true)
    } catch (e) {
      console.error(e)
    }
  }

  // Read Aloud (TTS)
  const toggleReadAloud = () => {
    if (isReadingAloud) {
      window.speechSynthesis.cancel()
      setIsReadingAloud(false)
      return
    }

    if (!editor || !window.speechSynthesis) return
    const text = editor.getText()
    if (!text.trim()) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.onend = () => setIsReadingAloud(false)
    utterance.onerror = () => setIsReadingAloud(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setIsReadingAloud(true)
  }

  // Find & Replace
  const handleFind = (query: string, matchCase: boolean, wholeWord: boolean, isRegex: boolean): number => {
    if (!editor || !query) {
      setSearchMatches({ index: 0, total: 0 })
      return 0
    }
    const text = editor.getText()
    let regex: RegExp
    try {
      const flags = matchCase ? 'g' : 'gi'
      const pattern = isRegex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      regex = new RegExp(wholeWord ? `\\b${pattern}\\b` : pattern, flags)
    } catch (e) {
      return 0
    }

    const matches = text.match(regex)
    const count = matches ? matches.length : 0
    setSearchMatches({ index: 0, total: count })
    return count
  }

  const handleReplace = (query: string, replaceWith: string, matchCase: boolean) => {
    if (!editor || !query) return
    const currentHtml = editor.getHTML()
    const flags = matchCase ? '' : 'i'
    const newHtml = currentHtml.replace(new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags), replaceWith)
    editor.commands.setContent(newHtml)
  }

  const handleReplaceAll = (query: string, replaceWith: string, matchCase: boolean) => {
    if (!editor || !query) return
    const currentHtml = editor.getHTML()
    const flags = matchCase ? 'g' : 'gi'
    const newHtml = currentHtml.replace(new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags), replaceWith)
    editor.commands.setContent(newHtml)
  }

  // Print
  const handlePrint = () => {
    if (!editor) return
    printDocument({
      ...note,
      title,
      content: editor.getHTML(),
    })
  }

  // Insert Table
  const handleInsertTable = (rows: number, cols: number) => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
  }

  // Insert Image via URL or File Upload
  const handleInsertImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const url = event.target?.result as string
          editor?.chain().focus().setImage({ src: url }).run()
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  // Save Vector Drawing from DrawingCanvas modal into document
  const handleSaveDrawing = (drawingData: DrawingData, pngUrl: string) => {
    if (!editor) return
    editor.chain().focus().setImage({ src: pngUrl, alt: 'AuraNotes Drawing' }).run()
    setShowDrawingModal(false)
  }

  // Comment Handlers
  const handleAddComment = (text: string, quotedText?: string) => {
    const newComment: DocComment = {
      id: `comment-${Date.now()}`,
      text,
      author: 'You',
      createdAt: new Date().toISOString(),
      resolved: false,
      selectedText: quotedText,
      replies: [],
    }
    const updated = [newComment, ...comments]
    setComments(updated)
    debouncedSave()
  }

  const handleAddReply = (commentId: string, replyText: string) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: `reply-${Date.now()}`,
              text: replyText,
              author: 'You',
              createdAt: new Date().toISOString(),
            },
          ],
        }
      }
      return c
    })
    setComments(updated)
    debouncedSave()
  }

  const handleToggleResolveComment = (commentId: string) => {
    const updated = comments.map(c => c.id === commentId ? { ...c, resolved: !c.resolved } : c)
    setComments(updated)
    debouncedSave()
  }

  const handleDeleteComment = (commentId: string) => {
    const updated = comments.filter(c => c.id !== commentId)
    setComments(updated)
    debouncedSave()
  }

  // Restore snapshot version
  const handleRestoreVersion = (version: NoteVersion) => {
    if (!editor) return
    setTitle(version.title)
    editor.commands.setContent(version.content)
    debouncedSave()
  }

  // Create named version
  const handleSaveNamedVersion = (name: string) => {
    if (!editor) return
    const newVersion: NoteVersion = {
      id: `ver-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title,
      name,
      content: editor.getHTML(),
      noteSize: 'document',
      wordCount: editor.getText().trim().split(/\s+/).length,
    }
    setVersions([newVersion, ...versions])
  }

  // Dimensions based on pageSetup
  const getPageDimensions = () => {
    const isLandscape = pageSetup.orientation === 'landscape'
    if (pageSetup.paperSize === 'Letter') {
      return isLandscape ? { width: '1056px', minHeight: '816px' } : { width: '816px', minHeight: '1056px' }
    }
    if (pageSetup.paperSize === 'Legal') {
      return isLandscape ? { width: '1344px', minHeight: '816px' } : { width: '816px', minHeight: '1344px' }
    }
    // A4 default
    return isLandscape ? { width: '1123px', minHeight: '794px' } : { width: '794px', minHeight: '1123px' }
  }

  const pageDims = getPageDimensions()

  return (
    <div className="fixed inset-0 z-40 bg-slate-100 dark:bg-slate-950 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 select-none">
      {/* TOP BAR: Logo/Back, Title, Save status, Action buttons */}
      {!isDistractionFree && (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
            {/* Back button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Return to Notes Grid"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Document icon & editable title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    debouncedSave()
                  }}
                  placeholder="Document Title..."
                  className="font-bold text-base md:text-lg bg-transparent text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 rounded transition-all w-full max-w-md truncate"
                />

                {/* Document badge */}
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                  Document
                </span>
              </div>

              {/* Menu Bar */}
              <div className="mt-0.5">
                <DocumentMenuBar
                  editor={editor}
                  title={title}
                  onTitleChange={setTitle}
                  onSaveAsQuickNote={onConvertToQuickNote}
                  onMakeCopy={() => alert('Document copied!')}
                  onExport={(fmt) => editor && exportNoteAs({ ...note, title, content: editor.getHTML() }, fmt)}
                  onImport={() => handleInsertImage()}
                  onOpenPageSetup={() => setShowPageSetup(true)}
                  onOpenVersionHistory={() => setShowVersionHistory(true)}
                  onOpenDocDetails={() => setShowWordCount(true)}
                  onPrint={handlePrint}
                  onOpenFindReplace={() => setShowFindReplace(true)}
                  isPageView={isPageView}
                  setIsPageView={setIsPageView}
                  showRuler={showRuler}
                  setShowRuler={setShowRuler}
                  showOutline={showOutline}
                  setShowOutline={setShowOutline}
                  showComments={showComments}
                  setShowComments={setShowComments}
                  isDistractionFree={isDistractionFree}
                  setIsDistractionFree={setIsDistractionFree}
                  isDarkPage={isDarkPage}
                  setIsDarkPage={setIsDarkPage}
                  onInsertImage={handleInsertImage}
                  onInsertTable={handleInsertTable}
                  onOpenDrawing={() => setShowDrawingModal(true)}
                  onInsertDate={() => editor?.chain().focus().insertContent(new Date().toLocaleDateString(undefined, { dateStyle: 'long' })).run()}
                  onInsertEquation={() => editor?.chain().focus().insertContent('∫ f(x) dx = F(x) + C').run()}
                  onInsertSpecialChar={() => editor?.chain().focus().insertContent('— © ™ ® • € £ ¥').run()}
                  onInsertEmoji={() => editor?.chain().focus().insertContent('✨ 🚀 📝 💡').run()}
                  onInsertTableOfContents={() => editor?.chain().focus().insertContent('<div style="background:#f1f5f9;padding:12px;border-radius:8px;margin:12px 0;"><strong>Table of Contents</strong><ul style="list-style-type:none;padding-left:8px;margin-top:6px;"><li>• Introduction</li><li>• Key Findings</li><li>• Next Steps</li></ul></div>').run()}
                  onOpenWordCount={() => setShowWordCount(true)}
                  onOpenDictionary={() => alert('AuraNotes Dictionary: Select a term in the document to lookup definition.')}
                  onToggleVoiceTyping={toggleVoiceTyping}
                  isVoiceTyping={isVoiceTyping}
                  onToggleReadAloud={toggleReadAloud}
                  isReadingAloud={isReadingAloud}
                  onOpenShortcuts={() => alert('Press Ctrl+B for Bold, Ctrl+I for Italic, Ctrl+U for Underline, Ctrl+K for Link, Ctrl+F for Find.')}
                />
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* Auto-save Status Indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
              <Cloud className={`w-3.5 h-3.5 ${saveStatus === 'saving' ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`} />
              <span className="text-[11px]">{saveStatus === 'saving' ? 'Saving...' : `Saved (${lastSavedTime})`}</span>
            </div>

            {/* Version History Button */}
            <button
              onClick={() => setShowVersionHistory(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Version history"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Comments Toggle Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`p-1.5 rounded-lg transition-colors relative ${
                showComments ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Toggle Comments panel"
            >
              <MessageSquare className="w-4 h-4" />
              {comments.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {comments.length}
                </span>
              )}
            </button>

            {/* Convert to quick note button */}
            <button
              onClick={onConvertToQuickNote}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              title="Shrink to quick note card"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shrink to quick note</span>
            </button>

            {/* Share Button (Mock) */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}

      {/* FORMATTING TOOLBAR */}
      {!isDistractionFree && (
        <DocumentToolbar
          editor={editor}
          mode={mode}
          setMode={setMode}
          zoom={zoom}
          setZoom={setZoom}
          onInsertImage={handleInsertImage}
          onInsertTable={handleInsertTable}
          onOpenDrawing={() => setShowDrawingModal(true)}
          onAddComment={() => {
            setShowComments(true)
            handleAddComment('Please review this section.', selectedText)
          }}
          onPrint={handlePrint}
          spellcheck={spellcheck}
          setSpellcheck={setSpellcheck}
        />
      )}

      {/* WORKSPACE AREA: Outline + Page Canvas Workspace + Comments Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Outline Sidebar */}
        {showOutline && !isDistractionFree && (
          <DocumentOutline
            editor={editor}
            onClose={() => setShowOutline(false)}
          />
        )}

        {/* Center Page Canvas Container */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center justify-start bg-slate-200/70 dark:bg-slate-950 transition-all">
          {/* Simulated Page Ruler */}
          {showRuler && isPageView && !isDistractionFree && (
            <div
              className="bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-t-sm h-4 flex items-center justify-between px-2 text-[9px] text-slate-400 select-none mb-1 shadow-xs"
              style={{ width: pageDims.width, transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
            </div>
          )}

          {/* Actual Page Sheet Canvas */}
          <div
            className={`transition-all duration-200 select-text ${
              isPageView
                ? 'rounded-sm shadow-xl border border-slate-300/80 dark:border-slate-800'
                : 'w-full max-w-4xl rounded-xl shadow-md border border-slate-200 dark:border-slate-800'
            }`}
            style={{
              width: isPageView ? pageDims.width : '100%',
              minHeight: isPageView ? pageDims.minHeight : '85vh',
              backgroundColor: isDarkPage ? '#0f172a' : (pageSetup.pageColor || '#ffffff'),
              color: isDarkPage ? '#f8fafc' : '#0f172a',
              padding: isPageView
                ? `${pageSetup.margins.top * 48}px ${pageSetup.margins.right * 48}px ${pageSetup.margins.bottom * 48}px ${pageSetup.margins.left * 48}px`
                : '36px 48px',
              transform: isPageView ? `scale(${zoom / 100})` : 'none',
              transformOrigin: 'top center',
            }}
          >
            {/* Page Header (if configured) */}
            {isPageView && pageSetup.headerText && (
              <div className="text-[11px] text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 flex justify-between items-center">
                <span>{pageSetup.headerText}</span>
                <span className="font-mono text-[10px]">{title}</span>
              </div>
            )}

            {/* TipTap Editor Content */}
            <div className={`prose max-w-none text-sm leading-relaxed ${isDarkPage ? 'prose-invert' : ''}`}>
              <EditorContent
                editor={editor}
                spellCheck={spellcheck}
                className="focus:outline-none min-h-[500px]"
              />
            </div>

            {/* Page Footer (if configured) */}
            {isPageView && (pageSetup.footerText || pageSetup.showPageNumbers) && (
              <div className="text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3 mt-12 flex justify-between items-center">
                <span>{pageSetup.footerText || ''}</span>
                {pageSetup.showPageNumbers && (
                  <span className="font-mono text-[10px]">Page 1 of 1</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comments Sidebar */}
        {showComments && !isDistractionFree && (
          <DocumentComments
            comments={comments}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onToggleResolve={handleToggleResolveComment}
            onDeleteComment={handleDeleteComment}
            onClose={() => setShowComments(false)}
            selectedText={selectedText}
          />
        )}

        {/* Floating Find & Replace */}
        {showFindReplace && (
          <DocumentFindReplace
            onClose={() => setShowFindReplace(false)}
            onFind={handleFind}
            onReplace={handleReplace}
            onReplaceAll={handleReplaceAll}
            onNext={() => {}}
            onPrev={() => {}}
            matchIndex={searchMatches.index}
            totalMatches={searchMatches.total}
          />
        )}
      </div>

      {/* STATUS BAR AT BOTTOM */}
      {!isDistractionFree && editor && (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0 select-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowWordCount(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Words: <strong>{editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0}</strong>
            </button>
            <span>
              Characters: <strong>{editor.getText().length}</strong>
            </span>
            <span className="hidden sm:inline">
              Page: <strong>1 of 1</strong> ({pageSetup.paperSize})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPageView(!isPageView)}
              className="hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              {isPageView ? 'Page View' : 'Continuous View'}
            </button>
            <span>Zoom: {zoom}%</span>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showPageSetup && (
        <PageSetupModal
          initialSetup={pageSetup}
          onSave={(newSetup) => {
            setPageSetup(newSetup)
            debouncedSave()
          }}
          onClose={() => setShowPageSetup(false)}
        />
      )}

      {showWordCount && editor && (
        <WordCountModal
          content={editor.getHTML()}
          selectedText={selectedText}
          onClose={() => setShowWordCount(false)}
        />
      )}

      {showVersionHistory && editor && (
        <VersionHistoryModal
          versions={versions}
          currentTitle={title}
          currentContent={editor.getHTML()}
          onRestore={handleRestoreVersion}
          onSaveNamedVersion={handleSaveNamedVersion}
          onClose={() => setShowVersionHistory(false)}
        />
      )}

      {showDrawingModal && (
        <DrawingCanvas
          initialData={note.drawingData}
          onSave={handleSaveDrawing}
          onClose={() => setShowDrawingModal(false)}
        />
      )}

      {/* Mock Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-5 text-slate-800 dark:text-slate-200">
            <h3 className="font-semibold text-sm mb-1 text-slate-900 dark:text-white">Share "{title}"</h3>
            <p className="text-xs text-slate-500 mb-4">Anyone with this link can view this document.</p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                readOnly
                value={`https://auranotes.app/d/${note.id}`}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs select-all"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://auranotes.app/d/${note.id}`)
                  alert('Share link copied to clipboard!')
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
              >
                Copy
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
