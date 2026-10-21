import React, { useState, useMemo } from 'react'
import {
  Folder, FolderOpen, ChevronRight, Play, Disc, ArrowLeft, Music
} from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'
import { Track } from '../../types/music'

export const FoldersView: React.FC<{
  tracks: Track[]
}> = ({ tracks }) => {
  const { playTrack, setIsImportModalOpen } = useMusic()
  const [currentPath, setCurrentPath] = useState<string>('')

  // Build folder hierarchy from track.filePath
  const folderTree = useMemo(() => {
    // Collect all directory paths
    const foldersMap = new Map<string, { name: string; path: string; tracks: Track[]; subFolders: Set<string> }>()

    tracks.forEach((track) => {
      // e.g. "Music/Electronic/Overdrive.mp3" -> ["Music", "Electronic"]
      const parts = track.filePath.replace(/\\/g, '/').split('/')
      parts.pop() // remove file name

      let accumPath = ''
      for (let i = 0; i < parts.length; i++) {
        const seg = parts[i]
        const parentPath = accumPath
        accumPath = parentPath ? `${parentPath}/${seg}` : seg

        if (!foldersMap.has(accumPath)) {
          foldersMap.set(accumPath, {
            name: seg,
            path: accumPath,
            tracks: [],
            subFolders: new Set(),
          })
        }

        if (parentPath && foldersMap.has(parentPath)) {
          foldersMap.get(parentPath)!.subFolders.add(accumPath)
        }
      }

      // Add track to leaf folder (or root if none)
      const leafPath = accumPath || ''
      if (!foldersMap.has(leafPath)) {
        foldersMap.set(leafPath, {
          name: 'Root',
          path: '',
          tracks: [],
          subFolders: new Set(),
        })
      }
      foldersMap.get(leafPath)!.tracks.push(track)
    })

    return foldersMap
  }, [tracks])

  // Get folders at current level
  const currentFolder = folderTree.get(currentPath)

  // Top level folders if path is empty
  const subFolderList = useMemo(() => {
    if (!currentPath) {
      // Find roots (paths with no '/')
      const roots: { name: string; path: string; count: number }[] = []
      folderTree.forEach((val, key) => {
        if (!key.includes('/') && key !== '') {
          roots.push({
            name: val.name,
            path: val.path,
            count: val.tracks.length,
          })
        }
      })
      return roots
    } else {
      const entry = folderTree.get(currentPath)
      if (!entry) return []
      return Array.from(entry.subFolders).map(subPath => {
        const sub = folderTree.get(subPath)
        return {
          name: sub?.name || subPath.split('/').pop() || '',
          path: subPath,
          count: sub?.tracks.length || 0,
        }
      })
    }
  }, [currentPath, folderTree])

  const directTracks = currentFolder ? currentFolder.tracks : folderTree.get('')?.tracks || []

  const breadcrumbs = currentPath.split('/').filter(Boolean)

  const handlePlayFolder = () => {
    if (directTracks.length > 0) {
      playTrack(directTracks[0], directTracks)
    }
  }

  return (
    <div className="space-y-4 pb-28 select-none">
      {/* Header & Breadcrumb Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => setCurrentPath('')}
            className={`flex items-center gap-1 hover:text-fuchsia-500 ${!currentPath ? 'text-fuchsia-600 dark:text-fuchsia-400 font-bold' : ''}`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>All Folders</span>
          </button>

          {breadcrumbs.map((crumb, idx) => {
            const pathUpTo = breadcrumbs.slice(0, idx + 1).join('/')
            const isLast = idx === breadcrumbs.length - 1
            return (
              <React.Fragment key={pathUpTo}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => setCurrentPath(pathUpTo)}
                  className={`hover:text-fuchsia-500 truncate max-w-[120px] ${isLast ? 'text-fuchsia-600 dark:text-fuchsia-400 font-bold' : ''}`}
                >
                  {crumb}
                </button>
              </React.Fragment>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsImportModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
        >
          <FolderOpen className="w-3.5 h-3.5 text-fuchsia-500" />
          <span>Add Folder</span>
        </button>
      </div>

      {/* Action to Play All in Current Folder */}
      {directTracks.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/30 border border-fuchsia-500/20">
          <div>
            <span className="block text-xs font-bold text-slate-900 dark:text-white">
              {directTracks.length} Tracks in this folder
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {formatDuration(directTracks.reduce((acc, t) => acc + (t.duration || 0), 0))}
            </span>
          </div>
          <button
            type="button"
            onClick={handlePlayFolder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fuchsia-600 text-white font-bold text-xs shadow-md shadow-fuchsia-600/30 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Folder</span>
          </button>
        </div>
      )}

      {/* Subfolder Cards */}
      {subFolderList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {subFolderList.map((sf) => (
            <div
              key={sf.path}
              onClick={() => setCurrentPath(sf.path)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Folder className="w-5 h-5 fill-current" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-fuchsia-500 transition-colors">
                    {sf.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {sf.count} audio files
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          ))}
        </div>
      )}

      {/* Tracks in Current Folder */}
      {directTracks.length > 0 && (
        <div className="space-y-1 pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Songs in folder
          </h4>
          {directTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => playTrack(track, directTracks)}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  {track.coverArt ? (
                    <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Disc className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {track.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {track.artist} • {track.fileName}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {formatDuration(track.duration)}
              </span>
            </div>
          ))}
        </div>
      )}

      {subFolderList.length === 0 && directTracks.length === 0 && (
        <div className="py-20 text-center space-y-3">
          <Folder className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">Folder is empty</p>
        </div>
      )}
    </div>
  )
}
