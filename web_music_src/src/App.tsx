import React, { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, initializeDatabase } from './db'
import { MusicProvider, useMusic } from './context/MusicContext'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

// Layout components
import { TopBar } from './components/layout/TopBar'
import { BottomNav } from './components/layout/BottomNav'
import { Sidebar } from './components/layout/Sidebar'
import { PhoneFrame } from './components/layout/PhoneFrame'

// Main Views
import { HomeTab } from './components/home/HomeTab'
import { TracksView } from './components/library/TracksView'
import { AlbumsView } from './components/library/AlbumsView'
import { ArtistsView } from './components/library/ArtistsView'
import { GenresView } from './components/library/GenresView'
import { FoldersView } from './components/library/FoldersView'
import { PlaylistsView } from './components/playlists/PlaylistsView'
import { SearchResultsView } from './components/common/SearchResultsView'

// Player & Overlays
import { MiniPlayer } from './components/player/MiniPlayer'
import { NowPlayingScreen } from './components/player/NowPlayingScreen'
import { QueuePanel } from './components/player/QueuePanel'
import { EqualizerModal } from './components/player/EqualizerModal'
import { SleepTimerModal } from './components/modals/SleepTimerModal'
import { StatsModal } from './components/modals/StatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { FolderImportModal } from './components/library/FolderImportModal'
import { EditTabsModal } from './components/modals/EditTabsModal'
import { ShortcutsHelpModal } from './components/modals/ShortcutsHelpModal'
import { CreatePlaylistModal } from './components/playlists/CreatePlaylistModal'
import { SmartPlaylistModal } from './components/playlists/SmartPlaylistModal'
import { TagEditorModal } from './components/modals/TagEditorModal'
import { TrackDetailsModal } from './components/modals/TrackDetailsModal'
import { Track } from './types/music'

const MainContent: React.FC = () => {
  // Activate keyboard shortcuts
  useKeyboardShortcuts()

  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    isNowPlayingOpen,
    setIsNowPlayingOpen,
    isQueueOpen,
    setIsQueueOpen,
    isEqualizerOpen,
    setIsEqualizerOpen,
    isSleepTimerOpen,
    setIsSleepTimerOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isStatsOpen,
    setIsStatsOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    isEditTabsOpen,
    setIsEditTabsOpen,
    isShortcutsOpen,
    setIsShortcutsOpen,
    settings,
  } = useMusic()

  const [isSearchActive, setIsSearchActive] = useState(false)
  const [tagEditorTrack, setTagEditorTrack] = useState<Track | null>(null)
  const [detailsTrack, setDetailsTrack] = useState<Track | null>(null)
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)
  const [isSmartPlaylistOpen, setIsSmartPlaylistOpen] = useState(false)
  const [addToPlaylistTrackIds, setAddToPlaylistTrackIds] = useState<string[]>([])

  // Live queries
  const tracks = useLiveQuery(() => db.tracks.toArray(), []) || []
  const playlists = useLiveQuery(() => db.playlists.toArray(), []) || []

  // Initialize DB with synthesized demo tracks on first launch
  useEffect(() => {
    initializeDatabase().catch(console.error)
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      {/* Sidebar for Desktop / Tablet */}
      {!settings.phoneFrame && <Sidebar />}

      {/* Main App Body */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <TopBar
          onToggleSearch={() => setIsSearchActive(prev => !prev)}
          isSearchActive={isSearchActive}
        />

        {/* Scrollable Views Container */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-5 max-w-7xl w-full mx-auto">
          {isSearchActive || searchQuery.trim() ? (
            <SearchResultsView
              query={searchQuery}
              tracks={tracks}
              playlists={playlists}
              onClose={() => {
                setIsSearchActive(false)
                setSearchQuery('')
              }}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeTab
                  tracks={tracks}
                  onOpenStats={() => setIsStatsOpen(true)}
                />
              )}
              {activeTab === 'tracks' && (
                <TracksView
                  tracks={tracks}
                  onOpenDetails={(t) => setDetailsTrack(t)}
                  onOpenTagEditor={(t) => setTagEditorTrack(t)}
                  onOpenAddToPlaylist={(ids) => {
                    setAddToPlaylistTrackIds(ids)
                    setIsCreatePlaylistOpen(true)
                  }}
                />
              )}
              {activeTab === 'playlists' && (
                <PlaylistsView
                  tracks={tracks}
                  onOpenCreatePlaylist={() => {
                    setAddToPlaylistTrackIds([])
                    setIsCreatePlaylistOpen(true)
                  }}
                  onOpenSmartPlaylist={() => setIsSmartPlaylistOpen(true)}
                />
              )}
              {activeTab === 'albums' && <AlbumsView tracks={tracks} />}
              {activeTab === 'artists' && <ArtistsView tracks={tracks} />}
              {activeTab === 'genres' && <GenresView tracks={tracks} />}
              {activeTab === 'folders' && <FoldersView tracks={tracks} />}
            </>
          )}
        </main>

        {/* Persistent Floating MiniPlayer */}
        <MiniPlayer />

        {/* Mobile Bottom Tab Bar */}
        <BottomNav />
      </div>

      {/* Full-Screen Now Playing View */}
      <NowPlayingScreen
        isOpen={isNowPlayingOpen}
        onClose={() => setIsNowPlayingOpen(false)}
        onOpenDetails={() => setDetailsTrack(tracks.find(t => t.id === tagEditorTrack?.id) || tracks[0] || null)}
        onOpenTagEditor={() => setTagEditorTrack(tracks.find(t => t.id === tagEditorTrack?.id) || tracks[0] || null)}
      />

      {/* Queue Drawer / Panel */}
      <QueuePanel
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />

      {/* 10-Band Graphic Equalizer */}
      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
      />

      {/* Sleep Timer */}
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
      />

      {/* Listening Stats & Insights */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        tracks={tracks}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Folder Selection & Import Modal */}
      <FolderImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Edit Tabs Modal */}
      <EditTabsModal
        isOpen={isEditTabsOpen}
        onClose={() => setIsEditTabsOpen(false)}
      />

      {/* Shortcuts Help Modal */}
      <ShortcutsHelpModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        tracks={tracks}
        initialSelectedTrackIds={addToPlaylistTrackIds}
      />

      {/* Smart Playlist Modal */}
      <SmartPlaylistModal
        isOpen={isSmartPlaylistOpen}
        onClose={() => setIsSmartPlaylistOpen(false)}
      />

      {/* Tag Editor Modal */}
      <TagEditorModal
        track={tagEditorTrack}
        isOpen={tagEditorTrack !== null}
        onClose={() => setTagEditorTrack(null)}
      />

      {/* Track Details Modal */}
      <TrackDetailsModal
        track={detailsTrack}
        isOpen={detailsTrack !== null}
        onClose={() => setDetailsTrack(null)}
      />
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <MusicProvider>
      <AppWithPhoneFrame />
    </MusicProvider>
  )
}

const AppWithPhoneFrame: React.FC = () => {
  const { settings } = useMusic()

  return (
    <PhoneFrame isEnabled={settings.phoneFrame}>
      <MainContent />
    </PhoneFrame>
  )
}
