# Chronos Calendar

A modern, responsive calendar web application inspired by Google Calendar's layout and feature set. Built with React, TypeScript, Vite, and Tailwind CSS. All data is persisted client-side in `localStorage` without requiring any backend.

![Chronos Logo](public/logo.svg)

---

## 🌟 Features Overview

### 1. Top Bar
- **Hamburger Toggle**: Collapses and expands the left sidebar with smooth transitions.
- **Brand Identity**: Custom Chronos Calendar SVG icon and typography (clicking returns to Today).
- **"Today" Button**: Instantly jumps to the current date across any active view.
- **Previous / Next Chevrons**: Navigates forward/backward by 1 day, 1 week, 4 days, 1 month, or 1 year depending on active view.
- **Date Title & Mini Date-Picker Dropdown**: Clicking the month/year title opens an interactive month picker for quick date selection.
- **Search & Advanced Filters**: Full-text search across titles, descriptions, locations, and guests. Includes an advanced dropdown filter with fields for *Who*, *What*, *Where*, *Date Range*, *Calendar Selector*, and *Doesn't Have* exclusion.
- **View Switcher Dropdown**: Switch dynamically between **Day**, **Week**, **Month**, **Year**, **Schedule (Agenda)**, and **4 Days** views (with hotkey badges).
- **Settings Gear Dropdown**: Fast access to Settings modal, Trash, Theme switcher (Light/Dark), Print view, Keyboard shortcuts, Restore Demo Data, and Clear All Data.
- **Apps Grid**: Quick suite shortcuts.
- **Account Avatar**: Profile popup with workspace badge and offline status.

### 2. Left Sidebar
- **"Create" Button with Dropdown**:
  - **Event**: Meetings, syncs, milestones.
  - **Task**: Action items with deadlines and subtasks.
  - **Out of Office**: Vacation periods with automatic meeting decline message.
  - **Focus Time**: Deep-work blocks with auto-decline and Do Not Disturb options.
  - **Working Location**: Office, Home, or Other badge for the day.
  - **Appointment Schedule**: Bookable consultation slots with public client booking page.
- **Interactive Mini Month Calendar**: Highlights current date and selected week; includes independent month navigation and date clicking.
- **World Clock**: Live digital clocks for global time zones (New York, London, Tokyo, IST, etc.) with day offset indicators (+1d / -1d), configurable in Settings.
- **"Search for People"**: Mock contact directory (Alex Chen, Priya Sharma, Marcus Vance) with color badges. Selecting contacts overlays their sample calendars onto the grid.
- **Booking Schedules**: List of active appointment schedules with direct links to preview their public client booking pages.
- **"My Calendars" (Collapsible)**:
  - Checkbox toggles visibility for each calendar.
  - Hover ⋮ menu: Color swatch picker (12 preset colors + custom hex picker), *Display this only*, *Settings and sharing*, and *Hide from list*.
  - Defaults: *My Calendar*, *Birthdays*, *Tasks*.
- **"Other Calendars" (Collapsible)** with `+` menu:
  - **Subscribe to calendar**: Subscribe to colleagues or teams by email.
  - **Create new calendar**: Add custom calendar categories.
  - **Browse calendars of interest**: Regional holidays (US & Global), Premier League sports fixtures.
  - **From URL**: Subscribe to public iCal / Webcal feeds.
  - **Import (.ics / .csv)**: Import events from both RFC iCalendar files and CSV tables.
  - **Export all data (.ics)**: Backup all local calendar data.

### 3. Main Calendar Views
- **Day View**: 24-hour hourly grid (00:00 - 23:00) with GMT/24h time gutter, red "current time" indicator line updated every minute, and all-day header shelf.
- **Week View**: 7-day layout (or 5-day if weekends are toggled off) with side-by-side clustering for overlapping events.
- **4-Day View**: 4 consecutive days starting from current date.
- **Month View**: Multi-week grid with day numbers, multi-day event pills, `+N more` overflow popover, drag-to-move, and optional ISO week numbers.
- **Year View**: 12-month calendar overview with event indicator dots and direct date jumps.
- **Schedule (Agenda) View**: Chronological agenda grouped by date with video call "Join" buttons and guest RSVP summaries.
- **Drag & Drop Interactions**:
  - Drag events between days and times with snap-to-15-minute grid and real-time ghost positioning.
  - Drag bottom edge of any event card in Day/Week/4-Day views to adjust duration.
  - Drag events between cells in Month view.
  - Click-drag on empty grid slot to quickly create events across time ranges.

### 4. Event Creation & Editing
- **Quick-Create Popover**: Click any empty grid slot to set title, switch item type (Event / Task / Schedule), choose video conferencing, add guests, add location, and add description or attachments with file picker.
- **Full Event Editor Modal**:
  - Title, date pickers, time selectors, All-Day toggle.
  - Time zone selector (separate start and end zones).
  - Recurrence rules: Daily, Weekly, Monthly, Annually, Every Weekday, and Custom (interval, weekday selection, ends never / on date / after N occurrences).
  - Tabs:
    - *Event Details*: Rich-text description (bold, italic, underline, list, link), multiple reminders (notification or email), attachments, busy/free status, visibility (public/private/default), and color override.
    - *Guests*: Add attendees by email, optional/required flags, and permissions (modify event, invite others, see guest list).
    - *Rooms*: Search and book conference rooms (*Apollo Boardroom*, *Nebula Huddle*, *Zenith Lab*, etc.).
    - *Find a Time*: Free/Busy availability timeline comparison across attendees.
- **Recurring Series Handling**: Editing or deleting a recurring event prompts:
  - *This event*
  - *This and following events*
  - *All events*

### 5. Specialized Item Types
- **Tasks**: Checkbox to mark complete, subtasks list with add/delete/toggle, integrated in right Tasks sidebar.
- **Out of Office**: Date range, auto-decline option, custom decline message.
- **Focus Time**: Duration, auto-decline, Do Not Disturb flag.
- **Working Location**: Office / Home / Other chips displayed on day headers.
- **Appointment Schedule**: Configurable duration, buffer time, and booking window with a **Public Client Booking Page** that allows clients to book slots directly.

### 6. Event Details Popover (Click an Event)
- Title, date/time, location, video meet link with **Join** button.
- Guest list with RSVP status badges.
- Interactive RSVP selector: **Yes**, **No**, **Maybe**.
- Action buttons: Edit (pencil), Delete (trash), Email guests, More options (⋮: Duplicate, Change color swatch picker, Print, Publish event).

### 7. Settings Page & Data Management
- **General**: Language, country, date format (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD), time format (12h/24h), primary & secondary time zones, world clock city selectors, start week on (Sun/Mon/Sat), default view, density (comfortable/compact), sound alerts, keyboard shortcuts toggle, and Demo data management (**Restore Demo Data** and **Clear Demo Data** buttons).
- **Event Settings**: Default duration, speedy meetings (-5/-10 min), default guest permissions, auto-add video meeting link.
- **View Options**: Show weekends, show declined events, show completed tasks, reduce brightness of past events, show week numbers.
- **Notifications**: Default notification reminders.
- **Working Hours & Location**: Default hours and workplace.
- **Per-Calendar Settings**: Name, description, color, sharing permissions, and iCal embed URLs.
- **Import & Export**: Full `.ics` and `.csv` import and RFC-compliant `.ics` export.
- **Trash**: Soft-deleted events kept for 30 days with **Restore**, **Delete Forever**, and **Empty Trash**.
- **Undo Toast**: Toast notifications with immediate **Undo** action button for event deletions and movements.
- **Print View**: Clean paper/PDF layout via `@media print`.

### 8. Keyboard Shortcuts
Press `?` anywhere to view the shortcuts dialog:
- `c`: Create event or task
- `/`: Focus search bar
- `t`: Jump to today
- `j` or `n`: Next date range
- `k` or `p`: Previous date range
- `d`: Day view
- `w`: Week view
- `m`: Month view
- `y`: Year view
- `a`: Schedule (Agenda) view
- `x`: 4-day view
- `e`: Edit selected event
- `Delete` / `Backspace`: Delete selected event
- `Esc`: Close popover / modal
- `?`: Open keyboard shortcuts panel

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. Navigate to the project directory:
   ```bash
   cd calendar-web
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

5. To create an optimized production bundle:
   ```bash
   npm run build
   ```

---

## 📝 Short List of Anything Not Implemented / External Constraints

1. **Backend & Cloud Sync**:
   - Per specification ("Store all data in localStorage (no backend)"), no external server or database is used. All data persists securely in browser `localStorage`.
2. **Real WebRTC Audio/Video Media Streaming**:
   - The video conferencing feature generates functional, unique meeting links (`https://meet.chronos.io/...`) and simulated meeting rooms rather than connecting to a live WebRTC signaling media server.
3. **Automated Playwright Driver**:
   - Automated browser session capture was blocked by Microsoft/Playwright Azure CDN 404 mirror response on the host environment; the app itself runs natively in any modern desktop or mobile browser.
