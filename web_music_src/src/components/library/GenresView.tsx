import React, { useMemo } from 'react'
import { Radio, Play } from 'lucide-react'
import { useMusic } from '../../context/MusicContext'
import { formatDuration } from '../../utils/formatters'
import { Track } from '../../types/music'

export const GenresView: React.FC<{
  tracks: Track[]
}> = ({ tracks }) => {
  const { playTrack } = useMusic()

  const genres = useMemo(() => {
    const map = new Map<string, Track[]>()
    tracks.forEach((track) => {
      const g = track.genre || 'Unknown'
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(track)
    })

    return Array.from(map.entries())
      .map(([name, items]) => ({ name, tracks: items }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [tracks])

  const genreGradients = [
    'from-[#051211] to-[#0b2926] border border-teal-500/25',
    'from-[#051211] to-[#08221f] border border-cyan-500/25',
    'from-[#051211] to-[#041c19] border border-emerald-500/25',
    'from-[#061816] to-[#0e3834] border border-teal-400/30',
  ]

  return (
    <div className="space-y-4 pb-28 select-none">
      <div className="pb-3 border-b border-teal-500/15">
        <span className="text-xs font-bold text-white">
          {genres.length} Genres
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {genres.map((genre, idx) => {
          const grad = genreGradients[idx % genreGradients.length]
          return (
            <div
              key={genre.name}
              onClick={() => playTrack(genre.tracks[0], genre.tracks)}
              className={`p-5 rounded-3xl bg-gradient-to-tr ${grad} text-white shadow-lg shadow-black/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer relative overflow-hidden group`}
            >
              <div className="relative z-10 space-y-2">
                <Radio className="w-5 h-5 text-[#19E6C8]" />
                <div>
                  <h4 className="font-extrabold text-base font-display truncate">
                    {genre.name}
                  </h4>
                  <p className="text-[11px] font-medium opacity-80">
                    {genre.tracks.length} songs • {formatDuration(genre.tracks.reduce((acc, t) => acc + (t.duration || 0), 0))}
                  </p>
                </div>
              </div>

              <div className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
