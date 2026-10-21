# Zenith Tasks - Focus & Flow

A task management web application inspired by Google Tasks' clean, focused UX. Built with React, TypeScript, Vite, and Tailwind CSS. All tasks and settings are persisted locally in `localStorage` with transparent LZ-String compression for efficiency and zero backend dependencies.

## Key Features

1. **Responsive Multi-Layout Architecture:**
   - **Narrow Side-Panel Mode (~380px wide):** Exactly like a docked sidebar in Gmail or Google Calendar.
   - **Full-Screen Desktop Mode:** Expansive workspace with side-by-side task editing pane.
   - **Mobile Mode:** Touch-optimized full-screen interface with gestures.
   - "Open in full screen" / "Collapse to side panel" toggle.

2. **Lists Management:**
   - Default list: "My Tasks" (protected from deletion).
   - Create, Rename, and Delete custom lists with confirmation dialogs.
   - Switch lists with a quick dropdown switcher with active checkmark.
   - Per-list custom sort order and show/hide completed preference.
   - Drag-and-drop list reordering in switcher.

3. **Task Creation & Rapid Entry:**
   - Top "+ Add a task" button inserts an inline editable row.
   - Rapid entry: Pressing `Enter` saves the task and immediately creates the next row below.
   - `Esc` cancels empty rows.
   - Automatic keyboard focus on newly created rows.
   - Empty state illustration with celebratory "All tasks complete!" view.

4. **Task Row & Inline Editing:**
   - Circular checkbox with animated checkmark and strike-through transition.
   - Single line title with instant inline editing.
   - Date/time chip with overdue visual warning (red highlight).
   - Recurrence badge icon and subtask progress count (e.g., `1/3`).
   - Star icon toggle (filled amber when starred).
   - Drag handle (`⋮⋮`) and quick delete button on hover.

5. **Detail Pane & Date/Time Picker:**
   - Multi-line Details description textarea.
   - Interactive date & time picker modal with quick shortcuts (Today, Tomorrow, Next week).
   - Month calendar grid and 15-minute time selector dropdown.
   - Recurrence selector (Daily, Weekly, Monthly, Yearly, Custom with weekday chips and end limits).
   - Move to another list dropdown.
   - Autosave indicator with subtle checkmark.

6. **Subtasks:**
   - 1-level hierarchy under parent tasks.
   - Subtasks have their own checkbox, title, date, star, and delete.
   - Indent (`Tab`) and outdent (`Shift+Tab`).
   - Collapsible subtasks chevron.

7. **Sorting & Drag-and-Drop:**
   - Sort by: My order, Date (earliest first, no-date last), Starred recently, Title (A–Z).
   - Drag and drop reordering with visual drop indicator lines.
   - Keyboard reordering: `Ctrl + ↑` / `Ctrl + ↓`.

8. **Completed Tasks Section:**
   - Collapsible "Completed (N)" section at the bottom.
   - Unchecking restores task to the active list.
   - "Delete all completed tasks" action with confirmation.

9. **Special Views:**
   - **Starred View:** Pinned pseudo-list grouping all starred tasks across all lists by their source list.
   - **Calendar View:** Integrated week/month calendar showing scheduled task chips with drag-to-reschedule support!
   - **Search:** Global real-time search across task titles and details, grouped by list.

10. **Productivity & Extras:**
    - Undo/redo toasts for completion, deletion, moving, and list actions.
    - Bulk actions: multi-select (Shift/Ctrl+click) to star, move, complete, or delete together.
    - JSON export and import for seamless backup and transfer.
    - CSV export for spreadsheets.
    - Print view with clean printable stylesheet.
    - Seed demo data and clear all data utilities.
    - Keyboard shortcuts modal (`?`).

## Running Locally

```bash
# Navigate to web_tasks_src
cd web_tasks_src

# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Build production bundle
npm run build
```
