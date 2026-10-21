import React from 'react'
import { X, Info, FileAudio, HardDrive, Calendar, PlayCircle, Clock } from 'lucide-react'
import { formatDuration, formatFileSize, formatDateAdded } from '../../utils/formatters'
import { Track } from '../../types/music'

export const TrackDetailsModal: React.FC<{
  track: Track | null
  isOpen: boolean
  onClose: () => void
}> = ({ track, isOpen, onClose }) => {
  if (!isOpen || !track) return null

  const items = [
    { label: 'Title', value: track.title },
    { label: 'Artist', value: track.artist },
    { label: 'Album', value: track.album },
    { label: 'Genre', value: track.genre || 'Unknown' },
    { label: 'Year', value: track.year || 'Unknown' },
    { label: 'Duration', value: formatDuration(track.duration) },
    { label: 'File Name', value: track.fileName },
    { label: 'File Path', value: track.filePath },
    { label: 'Format', value: (track.fileFormat || 'mp3').toUpperCase() },
    { label: 'Size', value: formatFileSize(track.fileSize) },
    { label: 'Bitrate', value: track.bitrate ? `${track.bitrate} kbps` : 'Variable / Lossless' },
    { label: 'Sample Rate', value: track.sampleRate ? `${track.sampleRate} Hz` : '44,100 Hz' },
    { label: 'Channels', value: track.channels === 1 ? 'Mono' : 'Stereo (2.0)' },
    { label: 'Date Added', value: formatDateAdded(track.dateAdded) },
    { label: 'Play Count', value: `${track.playCount || 0} times` },
    { label: 'Last Played', value: track.lastPlayed ? formatDateAdded(track.lastPlayed) : 'Never' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-md max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-base font-display">Track Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Grid */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start py-1.5 px-3 rounded-xl bg-slate-950/40 border border-slate-800/40"
            >
              <span className="text-slate-400 font-semibold shrink-0 w-24">
                {item.label}
              </span>
              <span className="text-slate-200 font-medium text-right break-all">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
