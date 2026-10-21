# AuraNotes - Quick-Capture & Document Studio

**AuraNotes** combines the quick-capture feel of Google Keep with the full writing power of a Word-style document editor. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **TipTap v2 (ProseMirror)**, **perfect-freehand (HTML5 Canvas)**, and **Dexie v4 (IndexedDB)** for local zero-backend storage.

---

## 🌟 Core Architecture & Key Features

### 1. Dual-Engine Note Sizes (The Core Idea)
Every note has a dynamic size mode that can be converted back and forth seamlessly with zero data loss:
- **Quick Note (Keep-Style Card):**
  - Small card rendered in a responsive masonry grid.
  - Edited in a centered popup modal with quick checklists, image collage attachments, and vector drawings.
  - Markdown shortcuts, auto-linking, interactive checkboxes, and custom color/pattern backgrounds.
- **Document (Word-Style Full Canvas):**
  - Opens in a full-screen, page-style editor (A4, Letter, Legal) with simulated ruler and zoom (50%–200%).
  - Shown in the grid as a 2-column wide card with a "Document" badge and page thumbnail preview.
  - Real-time Word statistics (words, characters, paragraphs, reading time, estimated pages).
- **Instant Mode Conversion:**
  - "Expand to document" converts a quick note into a rich document canvas.
  - "Shrink to quick note" converts back to a card while preserving all rich text, tables, and attachments.

### 2. Full Word-Style Document Editor Suite
- **Cascading Menu Bar:**
  - **File:** Make a copy, Convert to quick note, Import, Download as (PDF, DOCX, Markdown, HTML, RTF, TXT), Page setup (Paper size, margins, page colors), Print, Version history, Document details.
  - **Edit:** Undo, Redo, Cut, Copy, Paste, Select all, Find and Replace (with match case, whole word, regex, replace all, next/previous).
  - **View:** Page view vs Continuous web view, Zoom selector, Show ruler, Outline panel, Comments panel, Dark canvas toggle, Distraction-free focus mode.
  - **Insert:** Image (upload, paste, URL), Table (grid selector up to 10×10), Drawing sketch, Horizontal line, Link (Ctrl+K), Table of contents, Date, Equations, Special characters, Emoji, Code blocks, Blockquotes.
  - **Format:** Text (Bold, Italic, Underline, Strikethrough, Superscript, Subscript), Heading levels (Normal, Title, Subtitle, H1–H6), Alignments (Left, Center, Right, Justify), Task lists, Bulleted/Numbered lists, Indent/Outdent, Clear formatting.
  - **Tools:** Browser spellcheck & grammar toggle, Word count dialog, Offline dictionary lookup, Voice typing (Web Speech Recognition), Read aloud (SpeechSynthesis text-to-speech).
- **Single-Row Formatting Toolbar:**
  - Clean tooltips, shortcut hints, font family picker (Outfit, Plus Jakarta Sans, Inter, Roboto, Merriweather, Playfair Display, Fira Code, Georgia, Arial, Times New Roman), font size stepper, text color, and highlight palette.
  - Mode switcher: **Editing** (direct edit), **Suggesting** (tracked changes), and **Viewing** (read-only).
- **Sidebar Panels:**
  - **Document Outline:** Automatically parses headings (H1–H6) into a live, clickable tree to scroll directly to sections.
  - **Comments System:** Select any text in the document, attach a comment, reply in threads, resolve, or delete.

### 3. Vector Drawing Studio (Canvas & Stored Vectors)
- Built on **perfect-freehand** for smooth strokes with stylus pressure sensitivity.
- **Tools:** Pen, Marker, Highlighter (semi-transparent), Pencil, Eraser, Geometric Shapes (Line, Arrow, Rectangle, Ellipse, Star), Eyedropper, Brush Size & Opacity sliders.
- **Layers Manager:** 3 distinct layers with visibility toggle, locking, opacity control, and layer reordering.
- **Backgrounds:** Blank, Grid, Dotted, Ruled lines, and background color palette.
- **Dual Export:** Saved as both lossless vector stroke data in IndexedDB and a crisp PNG preview for fast rendering.

### 4. Search, Organization & Dexie IndexedDB
- **Full-Text Multi-Attribute Search:** Searches across note titles, plain text bodies, checklist items, custom label tags, and image captions.
- **Multi-Select & Bulk Actions:** Hover checkmark on any card activates the contextual top bar to bulk pin, set colors, assign labels, archive, or move to trash.
- **Drag & Drop Reordering:** HTML5 drag-and-drop to freely reorder notes between Pinned and Others sections.
- **Reminders & Notifications:** Time-based (presets + custom date/time) and location-based reminders with automatic in-app toast alerts and browser notifications.
- **Collaborator Management (Mock):** Assign members by email with Owner, Editor, and Viewer roles.
- **Label Studio:** Create, color-code, inline rename, and delete labels.
- **7-Day Trash Retention:** Warning banner and one-click "Empty Trash" purge.
- **Offline Data Portability:** Download complete `.json` database backup or export single notes into Markdown/HTML/Plain Text.

---

## 🚀 How to Run Locally

### Requirements
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### Development Server
```bash
# 1. Navigate to the web notes project
cd e:\Mobile\web_notes_src

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the Vite development server
npm run dev -- --host 127.0.0.1 --port 5176
```
Open your browser and navigate to:
**`http://127.0.0.1:5176/`**

### Run Unit Tests
```bash
npm run test
```
Runs the Vitest suite verifying:
- Dual-engine conversion between Quick Note and Document mode without content loss.
- Multi-attribute search indexing (titles, bodies, checklists, labels, captions).
- Historical version snapshot creation and restoration.
- Vector drawing stroke serialization.

### Production Build
```bash
npm run build
```
Generates the optimized static bundle in `dist/`. The compiled output is also automatically deployed to `e:\Mobile\web\notes\`.

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Description |
|---|---|
| `C` | Create a new Quick Note |
| `L` | Create a new Checklist |
| `/` | Focus global search bar |
| `?` | Open Keyboard Shortcuts guide |
| `Escape` | Deselect cards / Close open modal |
| `Ctrl + B` | Bold |
| `Ctrl + I` | Italic |
| `Ctrl + U` | Underline |
| `Ctrl + K` | Insert Hyperlink |
| `Ctrl + F` / `Ctrl + H` | Find and Replace |
| `Ctrl + P` | Print document / note |
| `Ctrl + Alt + 1-6` | Heading levels 1 to 6 |
| `Ctrl + Shift + 7` | Numbered list |
| `Ctrl + Shift + 8` | Bulleted list |
| `Ctrl + Shift + C` | Word count statistics dialog |
| `Ctrl + \` | Clear all formatting |
| `Tab` / `Shift + Tab` | Indent / Outdent list item |

---

## 📋 Short List of Not-Implemented / Offline Mock Scope
In accordance with the prompt's instruction ("No backend. Support light and dark mode... Seed demo data on first launch"):
1. **Real-Time Multi-User Collaboration Sync:** Collaborators are simulated locally (you can invite emails, assign roles, view avatars, and manage permission badges). Real multi-user WebSocket syncing requires a remote backend server.
2. **Real Geolocation Trigger for Place Reminders:** Location reminders store the designated place name (e.g., "Office", "Supermarket") and notify the user; native background GPS geofencing requires native OS background location services.
3. **Machine Translation:** The mock translation tool generates local formatted summaries rather than calling a paid external cloud translation API without a backend key.
All requested document editing, canvas drawing, storage, conversion, search, and styling features are 100% functional and implemented locally.
