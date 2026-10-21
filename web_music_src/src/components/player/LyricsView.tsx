import React, { useState, useEffect, useRef } from 'react'
import { Edit3, Upload, Check, X, FileText } from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { parseLrcLyrics } from '../../db/id3Parser'
import { LyricLine } from '../../types/music'

export const LyricsView: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { currentTrack, currentTime, seek, updateTrackTags } = useMusic()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const activeLineRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const syncedLyrics: LyricLine[] = currentTrack?.syncedLyrics || []
  const plainLyrics: string = currentTrack?.lyrics || ''

  // Auto-scroll active line into center
  useEffect(() => {
    if (activeLineRef.current && !isEditing) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentTime, isEditing])

  if (!isOpen || !currentTrack) return null

  // Find index of currently playing lyric line
  let activeIndex = -1
  if (syncedLyrics.length > 0) {
    for (let i = 0; i < syncedLyrics.length; i++) {
      if (currentTime >= syncedLyrics[i].time) {
        activeIndex = i
      } else {
        break
      }
    }
  }

  const handleStartEdit = () => {
    setEditText(plainLyrics)
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    const parsed = parseLrcLyrics(editText)
    await updateTrackTags(currentTrack.id, {
      lyrics: editText,
      syncedLyrics: parsed.length > 0 ? parsed : undefined,
    })
    setIsEditing(false)
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setEditText(text)
    }
    reader.readAsText(file)
  }

  return (
    <div className="w-full h-80 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl p-5 flex flex-col justify-between overflow-hidden shadow-2xl text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-fuchsia-400" />
          <h3 className="font-bold text-sm text-white font-display">
            Lyrics {syncedLyrics.length > 0 && <span className="text-[10px] text-fuchsia-400 uppercase font-mono ml-1 px-1.5 py-0.5 rounded-full bg-fuchsia-950/60 border border-fuchsia-800/40">Synced</span>}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Edit or Paste Lyrics"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                title="Import .lrc file"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="p-1.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-colors"
                title="Save Lyrics"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".lrc,.txt"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto py-4 lyrics-scroll-container">
        {!isEditing ? (
          syncedLyrics.length > 0 ? (
            /* Synced Lyrics List */
            <div className="space-y-4 text-center px-4">
              {syncedLyrics.map((line, idx) => {
                const isActive = idx === activeIndex
                const isPast = idx < activeIndex
                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => seek(line.time)}
                    className={`cursor-pointer transition-all duration-300 py-1 ${
                      isActive
                        ? 'text-lg font-extrabold text-white scale-105 drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]'
                        : isPast
                        ? 'text-sm font-medium text-slate-500 hover:text-slate-300'
                        : 'text-sm font-medium text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {line.text}
                  </div>
                )
              })}
            </div>
          ) : plainLyrics ? (
            /* Plain Text Lyrics */
            <div className="text-center text-sm font-medium leading-relaxed text-slate-300 whitespace-pre-wrap px-4">
              {plainLyrics}
            </div>
          ) : (
            /* No Lyrics Found */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
              <p className="text-xs">No lyrics found for this track.</p>
              <button
                type="button"
                onClick={handleStartEdit}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
              >
                Add / Paste Lyrics (.lrc)
              </button>
            </div>
          )
        ) : (
          /* Editor Textarea */
          <div className="h-full flex flex-col">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Paste synced .lrc lyrics here (e.g. [00:12.50] Hello World) or plain text..."
              className="flex-1 w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500 font-mono resize-none leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  )
}
