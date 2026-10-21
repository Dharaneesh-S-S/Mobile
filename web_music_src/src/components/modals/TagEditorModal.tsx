import React, { useState } from 'react'
import { X, Image as ImageIcon, Save, Check } from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { Track } from '../../types/music'

export const TagEditorModal: React.FC<{
  track: Track | null
  isOpen: boolean
  onClose: () => void
}> = ({ track, isOpen, onClose }) => {
  const { updateTrackTags } = useMusic()

  const [title, setTitle] = useState(track?.title || '')
  const [artist, setArtist] = useState(track?.artist || '')
  const [album, setAlbum] = useState(track?.album || '')
  const [albumArtist, setAlbumArtist] = useState(track?.albumArtist || '')
  const [genre, setGenre] = useState(track?.genre || '')
  const [year, setYear] = useState<string>(track?.year ? String(track?.year) : '')
  const [trackNo, setTrackNo] = useState<string>(track?.trackNo ? String(track?.trackNo) : '')
  const [coverArt, setCoverArt] = useState<string | undefined>(track?.coverArt)

  if (!isOpen || !track) return null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setCoverArt(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    await updateTrackTags(track.id, {
      title: title.trim() || 'Untitled Track',
      artist: artist.trim() || 'Unknown Artist',
      album: album.trim() || 'Unknown Album',
      albumArtist: albumArtist.trim() || undefined,
      genre: genre.trim() || 'Music',
      year: year ? parseInt(year, 10) : undefined,
      trackNo: trackNo ? parseInt(trackNo, 10) : undefined,
      coverArt,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-white space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="font-extrabold text-base font-display">Edit Track Tags</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cover Art Preview & Replace */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 shrink-0 shadow-md group">
            {coverArt ? (
              <img src={coverArt} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
              <ImageIcon className="w-6 h-6 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-200">Cover Artwork</span>
            <span className="block text-[11px] text-slate-400">Click art to replace image</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-2.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Artist</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Album</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Track #</label>
              <input
                type="number"
                value={trackNo}
                onChange={(e) => setTrackNo(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold shadow-md shadow-fuchsia-600/30"
          >
            Save Tags
          </button>
        </div>
      </div>
    </div>
  )
}
