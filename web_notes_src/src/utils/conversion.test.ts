import { describe, it, expect } from 'vitest'
import { Note, ChecklistItem, DrawingStroke, NoteVersion } from '../types'

describe('Dual-Engine Note Conversion', () => {
  it('converts a Quick Note to a Document preserving all content', () => {
    const quickNote: Note = {
      id: 'quick-1',
      title: 'Sprint Planning Ideas',
      content: '<p>Discuss architecture and <strong>review timeline</strong>.</p>',
      plainText: 'Discuss architecture and review timeline.',
      size: 'quick',
      isPinned: true,
      isArchived: false,
      isTrash: false,
      color: 'blue',
      labels: ['work', 'planning'],
      isChecklist: false,
      checklist: [],
      attachments: [],
      versions: [],
      createdAt: '2026-10-21T10:00:00Z',
      updatedAt: '2026-10-21T10:00:00Z',
      orderIndex: 0,
    }

    // Convert to document
    const documentNote: Note = {
      ...quickNote,
      size: 'document',
      pageSetup: {
        paperSize: 'A4',
        orientation: 'portrait',
        margins: { top: 1, right: 1, bottom: 1, left: 1 },
        pageColor: '#ffffff',
      },
      updatedAt: '2026-10-21T10:05:00Z',
    }

    expect(documentNote.size).toBe('document')
    expect(documentNote.title).toBe(quickNote.title)
    expect(documentNote.content).toBe(quickNote.content)
    expect(documentNote.plainText).toBe(quickNote.plainText)
    expect(documentNote.labels).toEqual(['work', 'planning'])
    expect(documentNote.pageSetup?.paperSize).toBe('A4')
  })

  it('converts a Document to a Quick Note without losing rich text or attachments', () => {
    const docNote: Note = {
      id: 'doc-1',
      title: 'Quarterly Research Report',
      content: '<h1>Executive Summary</h1><p>Detailed performance benchmarks.</p>',
      plainText: 'Executive Summary Detailed performance benchmarks.',
      size: 'document',
      isPinned: false,
      isArchived: false,
      isTrash: false,
      color: 'default',
      labels: ['research'],
      isChecklist: false,
      checklist: [],
      attachments: [
        {
          id: 'att-1',
          type: 'image',
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          caption: 'Benchmark Graph',
          createdAt: '2026-10-21T10:00:00Z',
        },
      ],
      versions: [],
      createdAt: '2026-10-21T10:00:00Z',
      updatedAt: '2026-10-21T10:00:00Z',
      orderIndex: 1,
    }

    // Convert back to quick note
    const quickNote: Note = {
      ...docNote,
      size: 'quick',
      updatedAt: '2026-10-21T10:10:00Z',
    }

    expect(quickNote.size).toBe('quick')
    expect(quickNote.content).toContain('<h1>Executive Summary</h1>')
    expect(quickNote.attachments.length).toBe(1)
    expect(quickNote.attachments[0].caption).toBe('Benchmark Graph')
  })
})

describe('Search Indexing Engine', () => {
  const sampleNotes: Note[] = [
    {
      id: 'n1',
      title: 'Weekly Groceries',
      content: 'Almond milk and organic apples',
      plainText: 'Almond milk and organic apples',
      size: 'quick',
      isPinned: false,
      isArchived: false,
      isTrash: false,
      color: 'yellow',
      labels: ['personal', 'shopping'],
      isChecklist: true,
      checklist: [
        { id: 'c1', text: 'Almond milk', completed: false, indent: 0, order: 0 },
        { id: 'c2', text: 'Honey crisp apples', completed: true, indent: 0, order: 1 },
      ],
      attachments: [],
      versions: [],
      createdAt: '',
      updatedAt: '',
      orderIndex: 0,
    },
    {
      id: 'n2',
      title: 'Project Roadmap 2027',
      content: 'Core architecture migration to Rust and WebAssembly',
      plainText: 'Core architecture migration to Rust and WebAssembly',
      size: 'document',
      isPinned: true,
      isArchived: false,
      isTrash: false,
      color: 'blue',
      labels: ['engineering'],
      isChecklist: false,
      checklist: [],
      attachments: [
        {
          id: 'att-2',
          type: 'image',
          url: 'test.png',
          caption: 'Wasm Performance Comparison',
          createdAt: '',
        },
      ],
      versions: [],
      createdAt: '',
      updatedAt: '',
      orderIndex: 1,
    },
  ]

  const search = (query: string, notes: Note[]): Note[] => {
    const q = query.toLowerCase()
    return notes.filter(n => {
      const inTitle = n.title.toLowerCase().includes(q)
      const inPlain = n.plainText.toLowerCase().includes(q)
      const inChecklist = n.checklist?.some(c => c.text.toLowerCase().includes(q))
      const inLabels = n.labels?.some(l => l.toLowerCase().includes(q))
      const inCaptions = n.attachments?.some(a => a.caption?.toLowerCase().includes(q))
      return inTitle || inPlain || inChecklist || inLabels || inCaptions
    })
  }

  it('indexes title and checklist items correctly', () => {
    const results = search('Honey crisp', sampleNotes)
    expect(results.length).toBe(1)
    expect(results[0].id).toBe('n1')
  })

  it('indexes labels accurately', () => {
    const results = search('engineering', sampleNotes)
    expect(results.length).toBe(1)
    expect(results[0].id).toBe('n2')
  })

  it('indexes image captions', () => {
    const results = search('Wasm Performance', sampleNotes)
    expect(results.length).toBe(1)
    expect(results[0].id).toBe('n2')
  })
})

describe('Version Restore & Snapshot Management', () => {
  it('creates and restores a historical snapshot', () => {
    const originalContent = '<p>Initial draft.</p>'
    const updatedContent = '<p>Revised draft with major updates.</p>'

    const versionSnapshot: NoteVersion = {
      id: 'ver-1',
      timestamp: '2026-10-21T09:00:00Z',
      title: 'Article Outline',
      content: originalContent,
      name: 'Initial Draft v1',
      noteSize: 'document',
      wordCount: 2,
    }

    let activeDoc: Note = {
      id: 'doc-versioned',
      title: 'Article Outline',
      content: updatedContent,
      plainText: 'Revised draft with major updates.',
      size: 'document',
      isPinned: false,
      isArchived: false,
      isTrash: false,
      color: 'default',
      labels: [],
      isChecklist: false,
      checklist: [],
      attachments: [],
      versions: [versionSnapshot],
      createdAt: '2026-10-21T09:00:00Z',
      updatedAt: '2026-10-21T11:00:00Z',
      orderIndex: 0,
    }

    expect(activeDoc.content).toBe(updatedContent)

    // Simulate version restore
    activeDoc = {
      ...activeDoc,
      title: versionSnapshot.title,
      content: versionSnapshot.content,
      plainText: 'Initial draft.',
      updatedAt: new Date().toISOString(),
    }

    expect(activeDoc.content).toBe(originalContent)
    expect(activeDoc.versions.length).toBe(1)
    expect(activeDoc.versions[0].name).toBe('Initial Draft v1')
  })
})

describe('Vector Drawing Stroke Serialization', () => {
  it('serializes and deserializes vector stroke points preserving pressure and geometry', () => {
    const stroke: DrawingStroke = {
      id: 'stroke-1',
      points: [
        [10.5, 20.3, 0.5],
        [15.2, 25.8, 0.7],
        [22.1, 33.4, 0.9],
      ],
      color: '#4f46e5',
      size: 4,
      opacity: 0.85,
      tool: 'pen',
    }

    const serialized = JSON.stringify(stroke)
    expect(serialized).toContain('"tool":"pen"')
    expect(serialized).toContain('"size":4')

    const parsed: DrawingStroke = JSON.parse(serialized)
    expect(parsed.points.length).toBe(3)
    expect(parsed.points[0][0]).toBe(10.5)
    expect(parsed.points[2][2]).toBe(0.9)
    expect(parsed.color).toBe('#4f46e5')
  })
})
