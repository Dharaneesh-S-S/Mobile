import React, { useState, useRef } from 'react'
import {
  FolderOpen, Music, X, AlertCircle, CheckCircle2,
  HardDrive, Loader2, Sparkles, Filter, RefreshCw
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { db } from '../../db'
import { parseAudioFile } from '../../db/id3Parser'
import { useMusic } from '../../context/MusicContext'
import { Track } from '../../types/music'

const SUPPORTED_EXTS = ['.mp3', '.m4a', '.aac', '.flac', '.wav', '.ogg', '.opus']

export const FolderImportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { settings, playTrack } = useMusic()
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number; filename: string }>({
    current: 0,
    total: 0,
    filename: '',
  })
  const [resultSummary, setResultSummary] = useState<{
    added: number
    skipped: number
    shortFiltered: number
  } | null>(null)

  const cancelRef = useRef(false)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const filesInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  // Recursive directory reader for FileSystemDirectoryHandle (showDirectoryPicker)
  const readDirectoryEntries = async (
    dirHandle: FileSystemDirectoryHandle,
    path: string = ''
  ): Promise<{ file: File; relativePath: string }[]> => {
    const results: { file: File; relativePath: string }[] = []
    // @ts-ignore
    for await (const entry of dirHandle.values()) {
      if (cancelRef.current) break
      if (entry.kind === 'file') {
        const file = await entry.getFile()
        const lowerName = file.name.toLowerCase()
        if (SUPPORTED_EXTS.some(ext => lowerName.endsWith(ext))) {
          results.push({ file, relativePath: path ? `${path}/${file.name}` : file.name })
        }
      } else if (entry.kind === 'directory') {
        const subHandle = entry as FileSystemDirectoryHandle
        const subPath = path ? `${path}/${entry.name}` : entry.name
        const subFiles = await readDirectoryEntries(subHandle, subPath)
        results.push(...subFiles)
      }
    }
    return results
  }

  // Handle modern showDirectoryPicker API
  const handleSelectFolderModern = async () => {
    cancelRef.current = false
    setResultSummary(null)

    if ('showDirectoryPicker' in window) {
      try {
        // @ts-ignore
        const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker({
          id: 'aurabeat-music-folder',
          mode: 'read',
        })

        setIsImporting(true)
        setProgress({ current: 0, total: 1, filename: 'Scanning folder...' })

        const fileEntries = await readDirectoryEntries(dirHandle, dirHandle.name)
        if (fileEntries.length === 0) {
          setIsImporting(false)
          setResultSummary({ added: 0, skipped: 0, shortFiltered: 0 })
          return
        }

        await processAndStoreFiles(fileEntries)
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[AuraBeat] Directory picker error, falling back to input:', err)
          folderInputRef.current?.click()
        }
        setIsImporting(false)
      }
    } else {
      // Fallback
      folderInputRef.current?.click()
    }
  }

  // Handle standard input[webkitdirectory] or input[multiple]
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    cancelRef.current = false
    setResultSummary(null)
    setIsImporting(true)

    const entries: { file: File; relativePath: string }[] = []
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]
      const lower = f.name.toLowerCase()
      if (SUPPORTED_EXTS.some(ext => lower.endsWith(ext))) {
        entries.push({
          file: f,
          relativePath: f.webkitRelativePath || f.name,
        })
      }
    }

    await processAndStoreFiles(entries)
    e.target.value = ''
  }

  // Process files, extract ID3 metadata, check duplicates, save to Dexie
  const processAndStoreFiles = async (entries: { file: File; relativePath: string }[]) => {
    let addedCount = 0
    let skippedCount = 0
    let shortFilteredCount = 0

    const minSecs = settings.minTrackLengthSeconds || 0
    const existingTracks = await db.tracks.toArray()
    const existingSignatures = new Set(existingTracks.map(t => `${t.fileName}-${t.fileSize}`))

    const newTracks: Track[] = []

    for (let i = 0; i < entries.length; i++) {
      if (cancelRef.current) break

      const entry = entries[i]
      setProgress({
        current: i + 1,
        total: entries.length,
        filename: entry.file.name,
      })

      // Duplicate check
      const sig = `${entry.file.name}-${entry.file.size}`
      if (existingSignatures.has(sig)) {
        skippedCount++
        continue
      }

      try {
        const track = await parseAudioFile(entry.file, entry.relativePath)

        // Minimum track length filter
        if (minSecs > 0 && track.duration > 0 && track.duration < minSecs) {
          shortFilteredCount++
          continue
        }

        newTracks.push(track)
        existingSignatures.add(sig)
        addedCount++
      } catch (err) {
        console.warn(`[AuraBeat] Error parsing ${entry.file.name}:`, err)
      }
    }

    if (newTracks.length > 0) {
      await db.tracks.bulkPut(newTracks)

      // Celebrate
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d946ef', '#8b5cf6', '#3b82f6', '#10b981'],
        })
      } catch {}
    }

    setIsImporting(false)
    setResultSummary({
      added: addedCount,
      skipped: skippedCount,
      shortFiltered: shortFilteredCount,
    })
  }

  const handleCancel = () => {
    cancelRef.current = true
    setIsImporting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#051413]/95 border border-teal-500/25 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden relative text-[#F4FFFD]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-teal-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-[#19E6C8] border border-teal-400/30 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F4FFFD] font-display">
                Select Music Folder
              </h2>
              <p className="text-xs text-[#94B5B0]">
                Choose songs from your computer or phone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isImporting}
            className="p-1.5 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={folderInputRef}
          type="file"
          {...({ webkitdirectory: '', directory: '' } as any)}
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />
        <input
          ref={filesInputRef}
          type="file"
          multiple
          accept="audio/*,.mp3,.m4a,.aac,.flac,.wav,.ogg,.opus"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Content Area */}
        <div className="py-6 space-y-4">
          {!isImporting && !resultSummary ? (
            <div className="space-y-4">
              {/* Primary: Select Folder */}
              <button
                type="button"
                onClick={handleSelectFolderModern}
                className="w-full group p-5 rounded-2xl border-2 border-dashed border-teal-400/40 hover:border-[#19E6C8] bg-teal-500/10 hover:bg-teal-500/15 transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#19E6C8] text-[#04100F] flex items-center justify-center shadow-lg shadow-teal-500/40 group-hover:scale-105 transition-transform">
                  <FolderOpen className="w-7 h-7" />
                </div>
                <div>
                  <span className="block font-bold text-base text-[#F4FFFD]">
                    Select Music Folder
                  </span>
                  <span className="block text-xs text-[#94B5B0] mt-0.5">
                    Scans all subfolders for MP3, FLAC, M4A, WAV, AAC, OGG
                  </span>
                </div>
              </button>

              {/* Secondary: Individual Files */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => filesInputRef.current?.click()}
                  className="flex-1 py-3 px-4 rounded-xl border border-teal-500/25 hover:bg-teal-500/10 font-semibold text-xs text-[#F4FFFD] transition-colors flex items-center justify-center gap-2"
                >
                  <Music className="w-4 h-4 text-[#19E6C8]" />
                  Pick Individual Files
                </button>
              </div>

              {/* Info Note */}
              <div className="p-3.5 rounded-2xl bg-[#030d0c] border border-teal-500/20 text-xs text-[#94B5B0] space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-[#F4FFFD]">
                  <HardDrive className="w-4 h-4 text-[#19E6C8]" />
                  <span>100% Private & On-Device</span>
                </div>
                <p className="leading-relaxed">
                  Audio files are parsed locally inside your browser and stored in IndexedDB. Your songs are never uploaded to any remote server or cloud.
                </p>
                {settings.minTrackLengthSeconds > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-teal-400/80">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Ignoring clips shorter than {settings.minTrackLengthSeconds}s (adjustable in Settings)</span>
                  </div>
                )}
              </div>
            </div>
          ) : isImporting ? (
            /* Progress State */
            <div className="py-6 space-y-5 text-center">
              <div className="relative inline-flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#19E6C8] animate-spin" />
                <span className="absolute text-xs font-bold font-mono text-[#F4FFFD]">
                  {progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}%
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-[#F4FFFD] text-base">
                  Importing Library...
                </h3>
                <p className="text-xs text-[#94B5B0] font-mono truncate max-w-sm mx-auto px-4">
                  {progress.filename || 'Analyzing audio tags...'}
                </p>
                <p className="text-xs text-[#19E6C8] font-medium">
                  {progress.current} of {progress.total} tracks analyzed
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#030d0c] rounded-full h-2.5 overflow-hidden border border-teal-500/20">
                <div
                  className="bg-gradient-to-r from-teal-600 to-[#19E6C8] h-2.5 rounded-full transition-all duration-150"
                  style={{
                    width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-full text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                Cancel Import
              </button>
            </div>
          ) : (
            /* Result Summary State */
            <div className="py-4 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 text-[#19E6C8] border border-teal-400/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(25,230,200,0.3)]">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-bold text-[#F4FFFD] text-lg font-display">
                  Import Complete!
                </h3>
                <p className="text-xs text-[#94B5B0] mt-1">
                  Your music collection is ready to play.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="p-3 rounded-2xl bg-[#030d0c] border border-teal-500/20">
                  <span className="block text-xl font-bold text-[#19E6C8]">
                    {resultSummary?.added || 0}
                  </span>
                  <span className="text-[11px] text-[#94B5B0] font-medium">
                    Added
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#030d0c] border border-teal-500/20">
                  <span className="block text-xl font-bold text-[#94B5B0]">
                    {resultSummary?.skipped || 0}
                  </span>
                  <span className="text-[11px] text-[#94B5B0] font-medium">
                    Duplicates
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#030d0c] border border-teal-500/20">
                  <span className="block text-xl font-bold text-[#94B5B0]">
                    {resultSummary?.shortFiltered || 0}
                  </span>
                  <span className="text-[11px] text-[#94B5B0] font-medium">
                    Short Clips
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResultSummary(null)}
                  className="flex-1 py-2.5 rounded-full border border-teal-500/25 text-xs font-semibold text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10"
                >
                  Import More
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#04100F] text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.22)] transition-all active:scale-95"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
