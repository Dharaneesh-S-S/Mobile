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
      <div className="w-full max-w-md bg-[#051413]/95 border border-teal-500/25 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col text-[#F4FFFD] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-teal-500/15">
          <h3 className="font-extrabold text-base font-display text-[#F4FFFD]">Edit Track Tags</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cover Art Preview & Replace */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#061816] border border-teal-500/20 shrink-0 shadow-md group">
            {coverArt ? (
              <img src={coverArt} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-teal-500/50">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
              <ImageIcon className="w-6 h-6 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <div>
            <span className="block text-xs font-bold text-[#F4FFFD]">Cover Artwork</span>
            <span className="block text-[11px] text-[#94B5B0]">Click art to replace image</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-2.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-[#94B5B0] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#030d0c] border border-teal-500/20 rounded-xl px-3 py-1.5 text-[#F4FFFD] focus:outline-none focus:border-[#19E6C8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#94B5B0] mb-1">Artist</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full bg-[#030d0c] border border-teal-500/20 rounded-xl px-3 py-1.5 text-[#F4FFFD] focus:outline-none focus:border-[#19E6C8]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#94B5B0] mb-1">Album</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full bg-[#030d0c] border border-teal-500/20 rounded-xl px-3 py-1.5 text-[#F4FFFD] focus:outline-none focus:border-[#19E6C8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#94B5B0] mb-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-[#030d0c] border border-teal-500/20 rounded-xl px-3 py-1.5 text-[#F4FFFD] focus:outline-none focus:border-[#19E6C8]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#94B5B0] mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#030d0c] border border-teal-500/20 rounded-xl px-3 py-1.5 text-[#F4FFFD] focus:outline-none focus:border-[#19E6C8]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#94B5B0] mb-1">Track #</label>
              <input
                type="number"
                value={trackNo}
                onChange={(e) => setTrackNo(e.target.value)}
                className="w-full bg-[#030d0c] border border-teal-500/20 rounded-xl px-3 py-1.5 text-[#F4FFFD] focus:outline-none focus:border-[#19E6C8]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end gap-2 border-t border-teal-500/15">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#94B5B0] hover:text-[#F4FFFD]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-[#04100F] text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.22)] transition-all active:scale-95"
          >
            Save Tags
          </button>
        </div>
      </div>
    </div>
  )
}
