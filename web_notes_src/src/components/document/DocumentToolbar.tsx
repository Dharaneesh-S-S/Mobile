import React from 'react'
import { Editor } from '@tiptap/react'
import {
  Undo2, Redo2, Printer, CheckCheck,
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Highlighter, Palette, Link2, MessageSquarePlus, Image as ImageIcon,
  Table as TableIcon, PenTool, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Outdent, Indent, RemoveFormatting,
  Eye, Edit3, MessageCircle
} from 'lucide-react'

interface DocumentToolbarProps {
  editor: Editor | null
  mode: 'editing' | 'suggesting' | 'viewing'
  setMode: (mode: 'editing' | 'suggesting' | 'viewing') => void
  zoom: number
  setZoom: (zoom: number) => void
  onInsertImage: () => void
  onInsertTable: (rows: number, cols: number) => void
  onOpenDrawing: () => void
  onAddComment: () => void
  onPrint: () => void
  spellcheck: boolean
  setSpellcheck: (v: boolean) => void
}

const FONTS = [
  { name: 'Outfit (Default)', value: 'Outfit, sans-serif' },
  { name: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Merriweather (Serif)', value: 'Merriweather, Georgia, serif' },
  { name: 'Playfair Display', value: '"Playfair Display", Georgia, serif' },
  { name: 'Fira Code (Mono)', value: '"Fira Code", monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
]

const FONT_SIZES = [
  '8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'
]

const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff',
  '#9900ff', '#ff00ff', '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3'
]

const HIGHLIGHT_COLORS = [
  'transparent', '#fef08a', '#bbf7d0', '#bae6fd', '#fbcfe8', '#fed7aa', '#ddd6fe', '#e2e8f0'
]

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  editor,
  mode,
  setMode,
  zoom,
  setZoom,
  onInsertImage,
  onInsertTable,
  onOpenDrawing,
  onAddComment,
  onPrint,
  spellcheck,
  setSpellcheck,
}) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = React.useState(false)
  const [showTablePicker, setShowTablePicker] = React.useState(false)
  const [tableHover, setTableHover] = React.useState({ r: 3, c: 3 })
  const [formatBrushActive, setFormatBrushActive] = React.useState(false)
  const [storedFormat, setStoredFormat] = React.useState<{ bold?: boolean; italic?: boolean; color?: string; underline?: boolean } | null>(null)

  if (!editor) return null

  // Handle format brush
  const handleFormatBrush = () => {
    if (!formatBrushActive) {
      setStoredFormat({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
      })
      setFormatBrushActive(true)
    } else {
      setFormatBrushActive(false)
      setStoredFormat(null)
    }
  }

  // Set heading or normal style
  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val === 'p') {
      editor.chain().focus().setParagraph().run()
    } else if (val.startsWith('h')) {
      const level = parseInt(val.substring(1)) as 1 | 2 | 3 | 4 | 5 | 6
      editor.chain().focus().toggleHeading({ level }).run()
    }
  }

  const getCurrentStyle = () => {
    if (editor.isActive('heading', { level: 1 })) return 'h1'
    if (editor.isActive('heading', { level: 2 })) return 'h2'
    if (editor.isActive('heading', { level: 3 })) return 'h3'
    if (editor.isActive('heading', { level: 4 })) return 'h4'
    if (editor.isActive('heading', { level: 5 })) return 'h5'
    if (editor.isActive('heading', { level: 6 })) return 'h6'
    return 'p'
  }

  const isReadOnly = mode === 'viewing'

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 flex flex-wrap items-center gap-1 text-slate-700 dark:text-slate-300 shadow-sm z-30 select-none">
      {/* Undo / Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo() || isReadOnly}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo() || isReadOnly}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      {/* Print */}
      <button
        type="button"
        onClick={onPrint}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Print (Ctrl+P)"
        aria-label="Print"
      >
        <Printer className="w-4 h-4" />
      </button>

      {/* Spellcheck Toggle */}
      <button
        type="button"
        onClick={() => setSpellcheck(!spellcheck)}
        className={`p-1.5 rounded transition-colors ${spellcheck ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Spell Check Toggle"
        aria-label="Spell check"
      >
        <CheckCheck className="w-4 h-4" />
      </button>

      {/* Paint format */}
      <button
        type="button"
        onClick={handleFormatBrush}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${formatBrushActive ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 ring-2 ring-amber-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Paint format (copy and apply styling)"
        aria-label="Format brush"
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* Zoom dropdown */}
      <div className="flex items-center gap-1 mx-1">
        <select
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="Zoom document"
        >
          <option value={50}>50%</option>
          <option value={75}>75%</option>
          <option value={90}>90%</option>
          <option value={100}>100%</option>
          <option value={125}>125%</option>
          <option value={150}>150%</option>
          <option value={175}>175%</option>
          <option value={200}>200%</option>
        </select>
      </div>

      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Style dropdown */}
      <select
        value={getCurrentStyle()}
        onChange={handleStyleChange}
        disabled={isReadOnly}
        className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[125px]"
        aria-label="Text style"
      >
        <option value="p">Normal text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
      </select>

      {/* Font Family */}
      <select
        onChange={(e) => {
          // Setting font family
          const font = e.target.value
          document.execCommand('fontName', false, font)
        }}
        disabled={isReadOnly}
        className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[130px] truncate"
        aria-label="Font family"
      >
        {FONTS.map(f => (
          <option key={f.name} value={f.value}>{f.name}</option>
        ))}
      </select>

      {/* Font Size buttons */}
      <div className="flex items-center gap-0.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-xs">
        <button
          type="button"
          onClick={() => {
            // Decrease font size
            document.execCommand('fontSize', false, '2')
          }}
          disabled={isReadOnly}
          className="px-1.5 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l"
          title="Decrease font size"
        >
          -
        </button>
        <span className="px-1.5 font-mono text-[11px]">11</span>
        <button
          type="button"
          onClick={() => {
            // Increase font size
            document.execCommand('fontSize', false, '4')
          }}
          disabled={isReadOnly}
          className="px-1.5 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r"
          title="Increase font size"
        >
          +
        </button>
      </div>

      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Bold, Italic, Underline, Strike */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Bold (Ctrl+B)"
        aria-label="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Italic (Ctrl+I)"
        aria-label="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Underline (Ctrl+U)"
        aria-label="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive('strike') ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Strikethrough"
        aria-label="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      {/* Text Color Picker Popover */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowColorPicker(!showColorPicker)
            setShowHighlightPicker(false)
          }}
          disabled={isReadOnly}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-0.5"
          title="Text color"
          aria-label="Text color"
        >
          <span className="font-bold underline decoration-indigo-600 decoration-2 text-sm leading-none">A</span>
        </button>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 grid grid-cols-6 gap-1 w-44">
            {TEXT_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  editor.chain().focus().setColor(c).run()
                  setShowColorPicker(false)
                }}
                className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight Color Picker Popover */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowHighlightPicker(!showHighlightPicker)
            setShowColorPicker(false)
          }}
          disabled={isReadOnly}
          className={`p-1.5 rounded transition-colors ${editor.isActive('highlight') ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          title="Highlight color"
          aria-label="Highlight color"
        >
          <Highlighter className="w-4 h-4" />
        </button>
        {showHighlightPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 grid grid-cols-4 gap-1.5 w-36">
            {HIGHLIGHT_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  if (c === 'transparent') {
                    editor.chain().focus().unsetHighlight().run()
                  } else {
                    editor.chain().focus().toggleHighlight({ color: c }).run()
                  }
                  setShowHighlightPicker(false)
                }}
                className="w-6 h-6 rounded border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform flex items-center justify-center text-[10px]"
                style={{ backgroundColor: c === 'transparent' ? '#ffffff' : c }}
                title={c}
              >
                {c === 'transparent' ? '✕' : ''}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Link */}
      <button
        type="button"
        onClick={() => {
          const prev = editor.getAttributes('link').href || ''
          const url = window.prompt('Enter link URL (e.g. https://example.com):', prev)
          if (url === null) return
          if (url === '') {
            editor.chain().focus().unsetLink().run()
          } else {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Insert link (Ctrl+K)"
        aria-label="Insert link"
      >
        <Link2 className="w-4 h-4" />
      </button>

      {/* Comment */}
      <button
        type="button"
        onClick={onAddComment}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Add comment (Ctrl+Alt+M)"
        aria-label="Add comment"
      >
        <MessageSquarePlus className="w-4 h-4" />
      </button>

      {/* Image Insert */}
      <button
        type="button"
        onClick={onInsertImage}
        disabled={isReadOnly}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Insert Image"
        aria-label="Insert image"
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      {/* Table grid picker */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowTablePicker(!showTablePicker)}
          disabled={isReadOnly}
          className={`p-1.5 rounded transition-colors ${editor.isActive('table') ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          title="Insert table"
          aria-label="Insert table"
        >
          <TableIcon className="w-4 h-4" />
        </button>
        {showTablePicker && (
          <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50">
            <div className="text-xs font-medium text-slate-500 mb-2">
              {tableHover.r} × {tableHover.c} Table
            </div>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 6 }).map((_, rowIdx) =>
                Array.from({ length: 6 }).map((_, colIdx) => {
                  const isHighlighted = rowIdx < tableHover.r && colIdx < tableHover.c
                  return (
                    <button
                      key={`${rowIdx}-${colIdx}`}
                      type="button"
                      onMouseEnter={() => setTableHover({ r: rowIdx + 1, c: colIdx + 1 })}
                      onClick={() => {
                        onInsertTable(rowIdx + 1, colIdx + 1)
                        setShowTablePicker(false)
                      }}
                      className={`w-4 h-4 rounded-sm border ${isHighlighted ? 'bg-indigo-500 border-indigo-600' : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}`}
                    />
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drawing canvas modal launch */}
      <button
        type="button"
        onClick={onOpenDrawing}
        disabled={isReadOnly}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Insert drawing sketch"
        aria-label="Insert drawing sketch"
      >
        <PenTool className="w-4 h-4" />
      </button>

      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Align left"
        aria-label="Align left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Align center"
        aria-label="Align center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Align right"
        aria-label="Align right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Justify"
        aria-label="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Lists & Checklists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive('taskList') ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Checklist"
        aria-label="Checklist"
      >
        <CheckSquare className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Bulleted list (Ctrl+Shift+8)"
        aria-label="Bulleted list"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={isReadOnly}
        className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Numbered list (Ctrl+Shift+7)"
        aria-label="Numbered list"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      {/* Indents */}
      <button
        type="button"
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={isReadOnly}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Decrease indent (Shift+Tab)"
        aria-label="Decrease indent"
      >
        <Outdent className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={isReadOnly}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Increase indent (Tab)"
        aria-label="Increase indent"
      >
        <Indent className="w-4 h-4" />
      </button>

      {/* Clear Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        disabled={isReadOnly}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Clear formatting (Ctrl+\)"
        aria-label="Clear formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      {/* Mode switcher: Editing / Suggesting / Viewing */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
        <button
          type="button"
          onClick={() => setMode('editing')}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${mode === 'editing' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
          title="Editing mode: Edit document directly"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Editing</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('suggesting')}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${mode === 'suggesting' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
          title="Suggesting mode: Track changes as suggestions"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Suggesting</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('viewing')}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${mode === 'viewing' ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
          title="Viewing mode: Read or print final document"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Viewing</span>
        </button>
      </div>
    </div>
  )
}
