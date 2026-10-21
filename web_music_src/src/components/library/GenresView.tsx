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
    'from-fuchsia-600 to-indigo-600',
    'from-blue-600 to-cyan-600',
    'from-amber-600 to-rose-600',
    'from-emerald-600 to-teal-600',
    'from-purple-600 to-pink-600',
    'from-rose-600 to-orange-600',
  ]

  return (
    <div className="space-y-4 pb-28 select-none">
      <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-900 dark:text-white">
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
              className={`p-5 rounded-3xl bg-gradient-to-tr ${grad} text-white shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer relative overflow-hidden group`}
            >
              <div className="relative z-10 space-y-2">
                <Radio className="w-5 h-5 opacity-80" />
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
