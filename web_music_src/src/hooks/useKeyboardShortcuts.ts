import { useEffect } from 'react'
import { useMusic } from '../context/MusicContext'

export function useKeyboardShortcuts(): void {
  const {
    currentTrack,
    togglePlayPause,
    seekRelative,
    prevTrack,
    nextTrack,
    volume,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    setIsNowPlayingOpen,
    setIsQueueOpen,
    setIsShortcutsOpen,
  } = useMusic()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input or textarea
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlayPause()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (e.shiftKey) {
            prevTrack()
          } else {
            seekRelative(-5)
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (e.shiftKey) {
            nextTrack()
          } else {
            seekRelative(5)
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(Math.min(1.0, volume + 0.05))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(Math.max(0.0, volume - 0.05))
          break
        case 'm':
        case 'M':
          toggleMute()
          break
        case 's':
        case 'S':
          toggleShuffle()
          break
        case 'r':
        case 'R':
          toggleRepeat()
          break
        case 'l':
        case 'L':
          if (currentTrack) {
            toggleFavorite(currentTrack.id)
          }
          break
        case 'q':
        case 'Q':
          setIsQueueOpen(prev => !prev)
          break
        case 'n':
        case 'N':
          setIsNowPlayingOpen(prev => !prev)
          break
        case '/':
          e.preventDefault()
          const searchInput = document.getElementById('music-search-input')
          searchInput?.focus()
          break
        case '?':
          setIsShortcutsOpen(true)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    currentTrack,
    togglePlayPause,
    seekRelative,
    prevTrack,
    nextTrack,
    volume,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    setIsNowPlayingOpen,
    setIsQueueOpen,
    setIsShortcutsOpen,
  ])
}
