import React, { useState, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import {
  FileText, Undo2, Redo2, Scissors, Copy, Clipboard, CheckSquare,
  Search, Eye, ZoomIn, Maximize2, SplitSquareVertical,
  Table, Image, PenTool, Minus, Link2, Hash,
  Smile, Sigma, Calendar, FileCode, Quote, MessageSquare,
  Bold, Italic, Underline, Strikethrough, Superscript, Subscript,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Mic, Volume2, Globe, HelpCircle, Check, ChevronRight, Download, Upload,
  Sparkles, Minimize2, Bookmark, Sliders
} from 'lucide-react'

interface DocumentMenuBarProps {
  editor: Editor | null
  title: string
  onTitleChange: (newTitle: string) => void
  onSaveAsQuickNote: () => void
  onMakeCopy: () => void
  onExport: (format: 'pdf' | 'docx' | 'html' | 'md' | 'txt' | 'rtf') => void
  onImport: () => void
  onOpenPageSetup: () => void
  onOpenVersionHistory: () => void
  onOpenDocDetails: () => void
  onPrint: () => void
  onOpenFindReplace: () => void
  isPageView: boolean
  setIsPageView: (v: boolean) => void
  showRuler: boolean
  setShowRuler: (v: boolean) => void
  showOutline: boolean
  setShowOutline: (v: boolean) => void
  showComments: boolean
  setShowComments: (v: boolean) => void
  isDistractionFree: boolean
  setIsDistractionFree: (v: boolean) => void
  isDarkPage: boolean
  setIsDarkPage: (v: boolean) => void
  onInsertImage: () => void
  onInsertTable: (r: number, c: number) => void
  onOpenDrawing: () => void
  onInsertDate: () => void
  onInsertEquation: () => void
  onInsertSpecialChar: () => void
  onInsertEmoji: () => void
  onInsertTableOfContents: () => void
  onOpenWordCount: () => void
  onOpenDictionary: () => void
  onToggleVoiceTyping: () => void
  isVoiceTyping: boolean
  onToggleReadAloud: () => void
  isReadingAloud: boolean
  onOpenShortcuts: () => void
}

export const DocumentMenuBar: React.FC<DocumentMenuBarProps> = ({
  editor,
  onSaveAsQuickNote,
  onMakeCopy,
  onExport,
  onImport,
  onOpenPageSetup,
  onOpenVersionHistory,
  onOpenDocDetails,
  onPrint,
  onOpenFindReplace,
  isPageView,
  setIsPageView,
  showRuler,
  setShowRuler,
  showOutline,
  setShowOutline,
  showComments,
  setShowComments,
  isDistractionFree,
  setIsDistractionFree,
  isDarkPage,
  setIsDarkPage,
  onInsertImage,
  onInsertTable,
  onOpenDrawing,
  onInsertDate,
  onInsertEquation,
  onInsertSpecialChar,
  onInsertEmoji,
  onInsertTableOfContents,
  onOpenWordCount,
  onOpenDictionary,
  onToggleVoiceTyping,
  isVoiceTyping,
  onToggleReadAloud,
  isReadingAloud,
  onOpenShortcuts,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const menuBarRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  const handleMouseEnter = (menu: string) => {
    if (activeMenu) {
      setActiveMenu(menu)
    }
  }

  const closeMenu = () => setActiveMenu(null)

  return (
    <div ref={menuBarRef} className="flex items-center gap-0.5 text-xs text-slate-700 dark:text-slate-300 relative select-none">
      {/* FILE MENU */}
      <div className="relative">
        <button
          type="button"
          onClick={() => handleMenuClick('file')}
          onMouseEnter={() => handleMouseEnter('file')}
          className={`px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activeMenu === 'file' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : ''}`}
        >
          File
        </button>
        {activeMenu === 'file' && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
            <button
              onClick={() => { onMakeCopy(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Make a copy</span>
            </button>
            <button
              onClick={() => { onSaveAsQuickNote(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-between font-medium"
            >
              <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Convert to quick note</span>
            </button>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { onImport(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Upload className="w-3.5 h-3.5" /> Import document...</span>
            </button>
            
            {/* Download As submenu trigger */}
            <div className="group relative">
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><Download className="w-3.5 h-3.5" /> Download as</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="hidden group-hover:block absolute left-full top-0 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                <button onClick={() => { onExport('pdf'); closeMenu() }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">PDF Document (.pdf)</button>
                <button onClick={() => { onExport('docx'); closeMenu() }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">Microsoft Word (.docx)</button>
                <button onClick={() => { onExport('md'); closeMenu() }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">Markdown (.md)</button>
                <button onClick={() => { onExport('html'); closeMenu() }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">Web Page (.html)</button>
                <button onClick={() => { onExport('rtf'); closeMenu() }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">Rich Text (.rtf)</button>
                <button onClick={() => { onExport('txt'); closeMenu() }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">Plain Text (.txt)</button>
              </div>
            </div>

            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { onOpenPageSetup(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Sliders className="w-3.5 h-3.5" /> Page setup</span>
            </button>
            <button
              onClick={() => { onOpenVersionHistory(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Version history</span>
            </button>
            <button
              onClick={() => { onOpenDocDetails(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Document details</span>
            </button>
            <button
              onClick={() => { onPrint(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Download className="w-3.5 h-3.5" /> Print</span>
              <span className="text-slate-400 text-[10px]">Ctrl+P</span>
            </button>
          </div>
        )}
      </div>

      {/* EDIT MENU */}
      <div className="relative">
        <button
          type="button"
          onClick={() => handleMenuClick('edit')}
          onMouseEnter={() => handleMouseEnter('edit')}
          className={`px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activeMenu === 'edit' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : ''}`}
        >
          Edit
        </button>
        {activeMenu === 'edit' && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
            <button
              onClick={() => { editor?.chain().focus().undo().run(); closeMenu() }}
              disabled={!editor?.can().undo()}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between disabled:opacity-40"
            >
              <span className="flex items-center gap-2"><Undo2 className="w-3.5 h-3.5" /> Undo</span>
              <span className="text-slate-400 text-[10px]">Ctrl+Z</span>
            </button>
            <button
              onClick={() => { editor?.chain().focus().redo().run(); closeMenu() }}
              disabled={!editor?.can().redo()}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between disabled:opacity-40"
            >
              <span className="flex items-center gap-2"><Redo2 className="w-3.5 h-3.5" /> Redo</span>
              <span className="text-slate-400 text-[10px]">Ctrl+Y</span>
            </button>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { document.execCommand('cut'); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Scissors className="w-3.5 h-3.5" /> Cut</span>
              <span className="text-slate-400 text-[10px]">Ctrl+X</span>
            </button>
            <button
              onClick={() => { document.execCommand('copy'); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Copy</span>
              <span className="text-slate-400 text-[10px]">Ctrl+C</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.readText().then(text => {
                  editor?.chain().focus().insertContent(text).run()
                }).catch(() => document.execCommand('paste'))
                closeMenu()
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Clipboard className="w-3.5 h-3.5" /> Paste</span>
              <span className="text-slate-400 text-[10px]">Ctrl+V</span>
            </button>
            <button
              onClick={() => { editor?.chain().focus().selectAll().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><CheckSquare className="w-3.5 h-3.5" /> Select all</span>
              <span className="text-slate-400 text-[10px]">Ctrl+A</span>
            </button>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { onOpenFindReplace(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Search className="w-3.5 h-3.5" /> Find and replace</span>
              <span className="text-slate-400 text-[10px]">Ctrl+H</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW MENU */}
      <div className="relative">
        <button
          type="button"
          onClick={() => handleMenuClick('view')}
          onMouseEnter={() => handleMouseEnter('view')}
          className={`px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activeMenu === 'view' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : ''}`}
        >
          View
        </button>
        {activeMenu === 'view' && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
            <button
              onClick={() => { setIsPageView(!isPageView); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <SplitSquareVertical className="w-3.5 h-3.5" />
                Page layout view
              </span>
              {isPageView && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
            <button
              onClick={() => { setShowRuler(!showRuler); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Minus className="w-3.5 h-3.5" />
                Show ruler
              </span>
              {showRuler && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
            <button
              onClick={() => { setShowOutline(!showOutline); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <List className="w-3.5 h-3.5" />
                Show outline panel
              </span>
              {showOutline && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
            <button
              onClick={() => { setShowComments(!showComments); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Show comments panel
              </span>
              {showComments && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
            <button
              onClick={() => { setIsDarkPage(!isDarkPage); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                Dark canvas mode
              </span>
              {isDarkPage && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { setIsDistractionFree(!isDistractionFree); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                {isDistractionFree ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                Distraction-free focus
              </span>
            </button>
          </div>
        )}
      </div>

      {/* INSERT MENU */}
      <div className="relative">
        <button
          type="button"
          onClick={() => handleMenuClick('insert')}
          onMouseEnter={() => handleMouseEnter('insert')}
          className={`px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activeMenu === 'insert' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : ''}`}
        >
          Insert
        </button>
        {activeMenu === 'insert' && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
            <button
              onClick={() => { onInsertImage(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Image className="w-3.5 h-3.5" /> Image...
            </button>
            <button
              onClick={() => { onInsertTable(3, 3); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Table className="w-3.5 h-3.5" /> Table (3×3)
            </button>
            <button
              onClick={() => { onOpenDrawing(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <PenTool className="w-3.5 h-3.5" /> Drawing sketch...
            </button>
            <button
              onClick={() => { editor?.chain().focus().setHorizontalRule().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Minus className="w-3.5 h-3.5" /> Horizontal line
            </button>
            <button
              onClick={() => {
                const url = window.prompt('Enter link URL:')
                if (url) editor?.chain().focus().setLink({ href: url }).run()
                closeMenu()
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Link2 className="w-3.5 h-3.5" /> Link</span>
              <span className="text-slate-400 text-[10px]">Ctrl+K</span>
            </button>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { onInsertTableOfContents(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <List className="w-3.5 h-3.5" /> Table of contents
            </button>
            <button
              onClick={() => { onInsertDate(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" /> Current date
            </button>
            <button
              onClick={() => { onInsertEquation(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Sigma className="w-3.5 h-3.5" /> Equation / Math symbol
            </button>
            <button
              onClick={() => { onInsertSpecialChar(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Hash className="w-3.5 h-3.5" /> Special characters
            </button>
            <button
              onClick={() => { onInsertEmoji(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Smile className="w-3.5 h-3.5" /> Emoji
            </button>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { editor?.chain().focus().toggleCodeBlock().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <FileCode className="w-3.5 h-3.5" /> Code block
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleBlockquote().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Quote className="w-3.5 h-3.5" /> Blockquote
            </button>
          </div>
        )}
      </div>

      {/* FORMAT MENU */}
      <div className="relative">
        <button
          type="button"
          onClick={() => handleMenuClick('format')}
          onMouseEnter={() => handleMouseEnter('format')}
          className={`px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activeMenu === 'format' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : ''}`}
        >
          Format
        </button>
        {activeMenu === 'format' && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
            <button
              onClick={() => { editor?.chain().focus().toggleBold().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2 font-bold"><Bold className="w-3.5 h-3.5" /> Bold</span>
              <span className="text-slate-400 text-[10px]">Ctrl+B</span>
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleItalic().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2 italic"><Italic className="w-3.5 h-3.5" /> Italic</span>
              <span className="text-slate-400 text-[10px]">Ctrl+I</span>
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleUnderline().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2 underline"><Underline className="w-3.5 h-3.5" /> Underline</span>
              <span className="text-slate-400 text-[10px]">Ctrl+U</span>
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleStrike().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2 line-through"><Strikethrough className="w-3.5 h-3.5" /> Strikethrough</span>
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleSuperscript().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Superscript className="w-3.5 h-3.5" /> Superscript
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleSubscript().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <Subscript className="w-3.5 h-3.5" /> Subscript
            </button>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { editor?.chain().focus().clearNodes().unsetAllMarks().run(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span>Clear formatting</span>
              <span className="text-slate-400 text-[10px]">Ctrl+\</span>
            </button>
          </div>
        )}
      </div>

      {/* TOOLS MENU */}
      <div className="relative">
        <button
          type="button"
          onClick={() => handleMenuClick('tools')}
          onMouseEnter={() => handleMouseEnter('tools')}
          className={`px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activeMenu === 'tools' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : ''}`}
        >
          Tools
        </button>
        {activeMenu === 'tools' && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
            <button
              onClick={() => { onOpenWordCount(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Word count</span>
              <span className="text-slate-400 text-[10px]">Ctrl+Shift+C</span>
            </button>
            <button
              onClick={() => { onOpenDictionary(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Dictionary & definition
            </button>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { onToggleVoiceTyping(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Mic className={`w-3.5 h-3.5 ${isVoiceTyping ? 'text-red-500 animate-pulse' : ''}`} />
                Voice typing
              </span>
              {isVoiceTyping && <span className="text-red-500 text-[10px] font-semibold">Active</span>}
            </button>
            <button
              onClick={() => { onToggleReadAloud(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Volume2 className={`w-3.5 h-3.5 ${isReadingAloud ? 'text-indigo-600 animate-pulse' : ''}`} />
                Read document aloud
              </span>
              {isReadingAloud && <span className="text-indigo-600 text-[10px] font-semibold">Playing</span>}
            </button>
          </div>
        )}
      </div>

      {/* HELP MENU */}
      <div className="relative">
        <button
          type="button"
          onClick={() => handleMenuClick('help')}
          onMouseEnter={() => handleMouseEnter('help')}
          className={`px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activeMenu === 'help' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : ''}`}
        >
          Help
        </button>
        {activeMenu === 'help' && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
            <button
              onClick={() => { onOpenShortcuts(); closeMenu() }}
              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><HelpCircle className="w-3.5 h-3.5" /> Keyboard shortcuts</span>
              <span className="text-slate-400 text-[10px]">?</span>
            </button>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <div className="px-3 py-1.5 text-slate-500 text-[11px]">
              AuraNotes v1.0.0
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
