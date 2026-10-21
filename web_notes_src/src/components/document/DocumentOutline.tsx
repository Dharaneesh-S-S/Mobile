import React, { useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'
import { List, ChevronRight, X } from 'lucide-react'

interface HeadingItem {
  id: string
  text: string
  level: number
}

interface DocumentOutlineProps {
  editor: Editor | null
  onClose: () => void
}

export const DocumentOutline: React.FC<DocumentOutlineProps> = ({ editor, onClose }) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([])

  useEffect(() => {
    if (!editor) return

    const updateHeadings = () => {
      const items: HeadingItem[] = []
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          const text = node.textContent.trim()
          if (text) {
            items.push({
              id: `pos-${pos}`,
              text,
              level: node.attrs.level,
            })
          }
        }
      })
      setHeadings(items)
    }

    updateHeadings()
    editor.on('update', updateHeadings)
    return () => {
      editor.off('update', updateHeadings)
    }
  }, [editor])

  const scrollToHeading = (text: string) => {
    if (!editor) return
    const el = document.querySelector('.ProseMirror')
    if (!el) return

    // Find heading element by text
    const headingElements = el.querySelectorAll('h1, h2, h3, h4, h5, h6')
    for (const h of Array.from(headingElements)) {
      if (h.textContent?.trim() === text) {
        h.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Add brief highlight flash
        h.classList.add('bg-indigo-100', 'dark:bg-indigo-950/70', 'transition-colors', 'duration-500')
        setTimeout(() => {
          h.classList.remove('bg-indigo-100', 'dark:bg-indigo-950/70')
        }, 1200)
        break
      }
    }
  }

  return (
    <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full text-slate-800 dark:text-slate-200 shadow-sm shrink-0">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-xs text-slate-700 dark:text-slate-300">
          <List className="w-4 h-4 text-indigo-600" />
          <span>Document Outline</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          title="Close Outline"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
        {headings.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <p>No headings yet.</p>
            <p className="mt-1 text-[11px] text-slate-400/80">Add Heading 1-3 to see your document outline.</p>
          </div>
        ) : (
          headings.map((h, i) => (
            <button
              key={`${h.id}-${i}`}
              type="button"
              onClick={() => scrollToHeading(h.text)}
              className="w-full text-left py-1.5 px-2 rounded hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors group"
              style={{ paddingLeft: `${(h.level - 1) * 12 + 8}px` }}
            >
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 shrink-0" />
              <span className={`truncate ${h.level === 1 ? 'font-semibold text-slate-900 dark:text-white' : ''}`}>
                {h.text}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
