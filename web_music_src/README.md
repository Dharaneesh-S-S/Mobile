# AuraBeat Music Studio 🎵

AuraBeat is a full-featured, on-device audio player and music studio web app inspired by modern Android music apps. It uses the Web Audio API for an interactive 10-band graphic equalizer, acoustic effects, and real-time visualizers, `music-metadata-browser` for local ID3 tag and album art extraction, Dexie IndexedDB for local persistence, and the Media Session API for lock-screen and notification controls.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### Run Locally
```bash
cd web_music_src
npm install
npm run dev -- --port 5177
```
Open **http://127.0.0.1:5177/** in your browser.

### Run Tests
```bash
npm run test
```

### Production Build
```bash
npm run build
```

---

## 🌟 Key Features

### 1. Folder Selection & Local Library Import
- **Select Music Folder:** Browse an entire directory via the modern File System Access API (`showDirectoryPicker`) with an automatic recursive fallback (`webkitdirectory`).
- **Supported Formats:** MP3, FLAC, M4A, AAC, WAV, OGG, OPUS.
- **Tag Extraction:** Automatically parses ID3 tags (title, artist, album, genre, year, track #, embedded high-res cover art, embedded lyrics) with graceful filename fallbacks.
- **Progress Tracking:** Real-time animated progress bar with track-by-track status and duplicate detection.
- **Demo Mode:** Procedurally synthesizes 4 royalty-free demo tracks via Web Audio `OfflineAudioContext` with generated artwork gradients on first launch. "Clear demo tracks" button available.

### 2. Audio Engine & 10-Band Graphic Equalizer
- **10-Band Graphic EQ:** 31 Hz to 16 kHz peaking filters with -12 dB to +12 dB adjustments.
- **Live Acoustic Curve:** Real-time frequency response curve rendered on an HTML `<canvas>`.
- **Built-in Presets:** Normal, Pop, Rock, Jazz, Classical, Dance, Bass Boost, Treble Boost, Vocal, Acoustic, Electronic, plus Custom preset creator.
- **Acoustic Effects:** Bass boost filter (80 Hz shelf), Stereo virtualizer, ConvolverNode reverb (Small Room, Concert Hall, Stadium Arena), Loudness normalization compressor, Preamp gain (-6 to +6 dB), and Left/Right balance.
- **Playback Controls:** Crossfade (0 to 12s), Gapless playback, A–B loop repeat markers, Playback speed (0.5x to 2.0x) with pitch preservation.

### 3. Visualizer & Synced Lyrics
- **4 Visualizer Modes:** Neon Frequency Bars, Mirrored Waveform Oscilloscope, Circular Radial Spectrum, and Floating Audio Particles. Fullscreen toggle included.
- **Synced Lyrics:** Auto-scrolling synced `.lrc` lyrics that highlight the active line in sync with playback. Tap any lyric line to jump directly to that timestamp. Built-in editor to paste or import `.lrc` / `.txt` files.

### 4. Smart Playlists & Queue
- **Live Smart Playlists:** Build dynamic playlists based on genre, year ranges, artist, play count, duration, and date added.
- **Queue Management:** Up Next, Now Playing, and History drawers with drag-and-drop reordering, swipe removal, and "Save queue as playlist".
- **Playlist Export/Import:** Export to standard `.m3u8` and structured JSON.

### 5. Sleep Timer & Analytics
- **Sleep Timer:** 15, 30, 45, 60, 90 mins or "End of current track", complete with a 30-second gentle volume fade-out.
- **Listening Insights:** Daily listening time bar chart, top tracks, top artists, genre breakdown, streak counter, and range filtering.

### 6. Media Session API & Ergonomics
- **OS Controls:** Lock screen and system notifications with track artwork, title, artist, and seek/skip controls.
- **Phone-First Layout:** Max ~420px width on mobile, optional phone frame mockup on desktop, and tablet/desktop sidebar.
- **Keyboard Shortcuts:** Space (Play/Pause), Left/Right (Seek 5s), Shift+Left/Right (Prev/Next), Up/Down (Volume), M (Mute), S (Shuffle), R (Repeat), L (Like), Q (Queue), N (Now Playing), / (Search), ? (Shortcuts Help).

---

## ⚠️ Browser Limitations & Notes
1. **No Automatic Background Device Scan:** Web browsers do not permit arbitrary background file system scanning for privacy reasons. The user must grant permission via the **"Select Music Folder"** or file picker once.
2. **Background Audio Playback:** Browsers allow continuous background tab playback via the Web Audio and HTMLAudioElement APIs. However, if the tab is completely suspended or killed by mobile OS memory management, audio will pause until re-focused.
3. **Embedded ID3 Writing:** Editing tags modifies metadata in the local IndexedDB database; browsers do not modify the original audio file on the user's hard drive to prevent accidental file corruption.
