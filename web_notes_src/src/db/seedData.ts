import { Note, Label, UserSettings } from '../types'

export const DEFAULT_SETTINGS: UserSettings = {
  id: 'current_user_settings',
  theme: 'dark',
  viewMode: 'grid',
  defaultNoteSize: 'quick',
  defaultFont: 'Plus Jakarta Sans',
  defaultPageSize: 'A4',
  spellcheck: true,
  autosaveIntervalSeconds: 3,
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '12h',
  notificationsEnabled: true,
  addNewItemsToBottom: false,
  moveCheckedToBottom: true,
  displayLinkPreviews: true,
}

export const INITIAL_LABELS: Label[] = [
  { id: 'label_work', name: 'Work', color: '#3b82f6' },
  { id: 'label_personal', name: 'Personal', color: '#10b981' },
  { id: 'label_ideas', name: 'Ideas', color: '#f59e0b' },
  { id: 'label_study', name: 'Study & Research', color: '#8b5cf6' },
  { id: 'label_travel', name: 'Travel', color: '#ec4899' },
]

export const INITIAL_NOTES: Note[] = [
  // 1. Quick Note
  {
    id: 'note_welcome_quick',
    title: 'Welcome to AuraNotes ✦',
    content: `<p>AuraNotes bridges the <strong>speed of quick capture</strong> with the <strong>depth of a Word-style document studio</strong>.</p>
<p>⚡ <em>Try these features:</em></p>
<ul>
  <li>Click <strong>Expand to document</strong> in the note menu to turn this into an essay.</li>
  <li>Pick background colors or atmospheric SVG patterns.</li>
  <li>Add labels, voice typing, sketches, and checklists!</li>
</ul>`,
    plainText: 'Welcome to AuraNotes. AuraNotes bridges the speed of quick capture with the depth of a Word-style document studio. Try these features: Click Expand to document, pick background colors or patterns, add labels, voice typing, sketches and checklists.',
    size: 'quick',
    isPinned: true,
    isArchived: false,
    isTrash: false,
    color: 'default',
    pattern: undefined,
    labels: ['Personal', 'Ideas'],
    isChecklist: false,
    checklist: [],
    attachments: [],
    versions: [],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    orderIndex: 0,
  },

  // 2. Checklist Quick Note
  {
    id: 'note_project_launch_checklist',
    title: 'Product Launch Deliverables 🚀',
    content: '',
    plainText: 'Product Launch Deliverables. Core app architecture, Dexie IndexedDB sync layer, TipTap Word-style editor, Pressure-sensitive drawing studio, Multi-size note conversion, Dark and light mode themes, User testing feedback review.',
    size: 'quick',
    isPinned: true,
    isArchived: false,
    isTrash: false,
    color: 'emerald',
    pattern: undefined,
    labels: ['Work'],
    isChecklist: true,
    checklist: [
      { id: 'c1', text: 'Core app architecture & responsive layout', completed: true, indent: 0, order: 0 },
      { id: 'c2', text: 'Dexie IndexedDB storage engine', completed: true, indent: 0, order: 1 },
      { id: 'c3', text: 'TipTap Word-style document canvas', completed: true, indent: 0, order: 2 },
      { id: 'c4', text: 'Pressure-sensitive canvas drawing studio', completed: true, indent: 0, order: 3 },
      { id: 'c5', text: 'Seamless Quick Note ↔ Document conversion', completed: true, indent: 0, order: 4 },
      { id: 'c6', text: 'Multi-select batch actions & search indexing', completed: false, indent: 0, order: 5 },
      { id: 'c7', text: 'Offline PWA & JSON full backup export', completed: false, indent: 0, order: 6 },
    ],
    attachments: [],
    reminder: {
      id: 'rem_1',
      dateTime: new Date(Date.now() + 3600000 * 12).toISOString(),
      repeat: 'daily',
      placeText: 'Office Studio',
      completed: false,
    },
    versions: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    orderIndex: 1,
  },

  // 3. Drawing Note
  {
    id: 'note_design_sketch',
    title: 'Architecture Blueprint & Ideas ✏️',
    content: '<p>Hand-drawn diagram of the AuraNotes dual-engine system. Vector strokes are preserved with sub-pixel accuracy.</p>',
    plainText: 'Architecture Blueprint & Ideas. Hand-drawn diagram of the AuraNotes dual-engine system. Vector strokes are preserved with sub-pixel accuracy.',
    size: 'quick',
    isPinned: false,
    isArchived: false,
    isTrash: false,
    color: 'storm',
    pattern: undefined,
    labels: ['Ideas', 'Study & Research'],
    isChecklist: false,
    checklist: [],
    attachments: [],
    drawingData: {
      background: 'grid',
      bgColor: '#0f172a',
      width: 600,
      height: 400,
      layers: [
        {
          id: 'layer_1',
          name: 'Sketch Layer',
          visible: true,
          locked: false,
          opacity: 1,
          strokes: [
            {
              id: 's1',
              tool: 'pen',
              color: '#38bdf8',
              size: 5,
              opacity: 1,
              points: [
                [80, 100, 0.5], [100, 95, 0.6], [140, 90, 0.7], [200, 90, 0.8], [240, 95, 0.7], [260, 100, 0.5],
                [260, 160, 0.6], [240, 170, 0.7], [200, 180, 0.8], [140, 180, 0.7], [100, 170, 0.6], [80, 160, 0.5],
                [80, 100, 0.5]
              ],
            },
            {
              id: 's2',
              tool: 'highlighter',
              color: '#facc15',
              size: 24,
              opacity: 0.35,
              points: [
                [70, 130, 0.5], [120, 130, 0.5], [180, 130, 0.5], [250, 130, 0.5]
              ],
            },
            {
              id: 's3',
              tool: 'pen',
              color: '#a855f7',
              size: 4,
              opacity: 0.9,
              points: [
                [260, 130, 0.5], [300, 130, 0.6], [340, 130, 0.7], [350, 125, 0.8], [360, 130, 0.8], [350, 135, 0.8]
              ],
            },
          ],
        },
      ],
    },
    versions: [],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    orderIndex: 2,
  },

  // 4. Multi-Page Document (Full-Scale Word-like Note)
  {
    id: 'note_future_pkm_doc',
    title: 'The Future of Personal Knowledge Management',
    content: `<h1>The Future of Personal Knowledge Management</h1>
<p><strong>Author:</strong> Aura Studio Research &bull; <strong>Status:</strong> Published &bull; <strong>Classification:</strong> Open Whitepaper</p>
<hr />

<h2>1. Executive Summary</h2>
<p>Knowledge workers, researchers, and creators often find themselves fractured between two disconnected tool paradigms: lightweight <em>sticky-note capture pads</em> for quick thoughts, and heavy <em>word-processing suites</em> for structured reports. <strong>AuraNotes</strong> resolves this dichotomy through an isomorphic, fluid document model that scales from sticky note to paginated document seamlessly.</p>

<blockquote>
  <p>"Simplicity does not precede complexity, but follows it." &mdash; Alan Perlis</p>
</blockquote>

<h2>2. Core Architectural Principles</h2>
<p>When capturing fleeting inspiration, cognitive friction must approach zero. When elaborating on a thesis or technical proposal, formatting precision and typographic elegance become paramount.</p>

<table style="width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 1rem;">
  <thead>
    <tr style="background-color: rgba(59, 130, 246, 0.15); border-bottom: 2px solid #3b82f6;">
      <th style="padding: 10px; text-align: left;">Paradigm</th>
      <th style="padding: 10px; text-align: left;">Interaction Latency</th>
      <th style="padding: 10px; text-align: left;">Formatting Depth</th>
      <th style="padding: 10px; text-align: left;">Target Output</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
      <td style="padding: 10px;"><strong>Quick Note (Keep-style)</strong></td>
      <td style="padding: 10px; color: #10b981;">Instant (&lt; 50ms)</td>
      <td style="padding: 10px;">Checklist, text, tags</td>
      <td style="padding: 10px;">Scratchpad, tasks, memos</td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
      <td style="padding: 10px;"><strong>Document (Word-style)</strong></td>
      <td style="padding: 10px; color: #6366f1;">Focused Session</td>
      <td style="padding: 10px;">A4 pagination, tables, styles</td>
      <td style="padding: 10px;">Essays, technical whitepapers</td>
    </tr>
    <tr>
      <td style="padding: 10px;"><strong>AuraNotes Isomorphic</strong></td>
      <td style="padding: 10px; color: #f59e0b;">Zero-Loss Dynamic Switch</td>
      <td style="padding: 10px;">Full ProseMirror Spec</td>
      <td style="padding: 10px;">Universal Knowledge Vault</td>
    </tr>
  </tbody>
</table>

<h2>3. Mathematical Modeling of Thought Retention</h2>
<p>Retention curves demonstrate that immediate vector sketching paired with structured indexing decreases information degradation:</p>
<pre><code>R(t) = e^(-t / S) &bull; (1 + &psi; &bull; &nabla;VisualContext)</code></pre>
<p>Where <em>R(t)</em> denotes recall over time <em>t</em>, <em>S</em> represents memory stability, and <em>&psi;</em> signifies visual-tactile reinforcement.</p>

<h2>4. Implementation Roadmap</h2>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><p>ProseMirror rich-text table manipulation and cell merging</p></li>
  <li data-type="taskItem" data-checked="true"><p>Tracked changes & suggestion mode with accept/reject cards</p></li>
  <li data-type="taskItem" data-checked="true"><p>True A4/Letter page view pagination simulation with margins</p></li>
  <li data-type="taskItem" data-checked="false"><p>Speech-to-text live dictation and speech-synthesis read-aloud</p></li>
  <li data-type="taskItem" data-checked="false"><p>High-fidelity PDF and Word DOCX export rendering</p></li>
</ul>

<hr />
<p style="font-size: 0.85em; opacity: 0.7;"><em>Footnote 1: Empirical studies demonstrate a 38% increase in synthesis speed when drafting in distraction-free continuous view.</em></p>`,
    plainText: 'The Future of Personal Knowledge Management. Author: Aura Studio Research. Executive Summary: Knowledge workers, researchers, and creators often find themselves fractured between two disconnected tool paradigms. AuraNotes resolves this dichotomy through an isomorphic, fluid document model that scales from sticky note to paginated document seamlessly.',
    size: 'document',
    isPinned: true,
    isArchived: false,
    isTrash: false,
    color: 'default',
    pattern: undefined,
    labels: ['Study & Research', 'Work'],
    isChecklist: false,
    checklist: [],
    attachments: [],
    pageSetup: {
      paperSize: 'A4',
      orientation: 'portrait',
      margins: { top: 25, right: 25, bottom: 25, left: 25 },
      pageColor: '#ffffff',
      headerText: 'AuraNotes Whitepaper — Confidential Draft',
      footerText: 'Page 1 of Document',
      showPageNumbers: true,
    },
    comments: [
      {
        id: 'comm_1',
        text: 'Ensure the mathematical formula has clear variable definitions in section 3.',
        author: 'Elena Vance (Lead Reviewer)',
        createdAt: 'Yesterday at 16:30',
        resolved: false,
        selectedText: 'Mathematical Modeling of Thought Retention',
        replies: [
          {
            id: 'rep_1',
            text: 'Updated with parameter descriptions for stability and visual context.',
            author: 'You',
            createdAt: 'Today at 09:15',
          },
        ],
      },
    ],
    trackedChanges: [
      {
        id: 'tc_1',
        type: 'insert',
        text: 'and technical proposals',
        author: 'Elena Vance',
        timestamp: 'Today at 10:05',
        status: 'pending',
      },
    ],
    versions: [
      {
        id: 'v1',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        title: 'The Future of Personal Knowledge Management (Draft 1)',
        content: '<h1>Draft 1</h1><p>Initial notes and thoughts.</p>',
        name: 'Initial Outline',
        noteSize: 'document',
        wordCount: 85,
      },
    ],
    collaborators: [
      {
        email: 'elena.vance@auranotes.io',
        name: 'Elena Vance',
        avatarColor: '#ec4899',
        role: 'editor',
      },
      {
        email: 'marcus.brody@research.org',
        name: 'Dr. Marcus Brody',
        avatarColor: '#3b82f6',
        role: 'viewer',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    orderIndex: 3,
  },
]
