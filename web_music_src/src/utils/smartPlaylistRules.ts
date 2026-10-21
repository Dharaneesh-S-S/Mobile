import { Track, SmartRule, Playlist } from '../types/music'

export function evaluateSmartRule(track: Track, rule: SmartRule): boolean {
  switch (rule.field) {
    case 'genre': {
      const val = (rule.value as string).toLowerCase().trim()
      const trackGenre = (track.genre || '').toLowerCase()
      if (rule.operator === 'equals') return trackGenre === val
      if (rule.operator === 'contains') return trackGenre.includes(val)
      return false
    }
    case 'artist': {
      const val = (rule.value as string).toLowerCase().trim()
      const trackArtist = (track.artist || '').toLowerCase()
      if (rule.operator === 'equals') return trackArtist === val
      if (rule.operator === 'contains') return trackArtist.includes(val)
      return false
    }
    case 'year': {
      const targetYear = Number(rule.value)
      const trackYear = track.year || 0
      if (rule.operator === 'equals') return trackYear === targetYear
      if (rule.operator === 'greaterThan') return trackYear > targetYear
      if (rule.operator === 'lessThan') return trackYear > 0 && trackYear < targetYear
      if (rule.operator === 'between' && rule.secondValue !== undefined) {
        return trackYear >= targetYear && trackYear <= Number(rule.secondValue)
      }
      return false
    }
    case 'playCount': {
      const count = Number(rule.value)
      const trackCount = track.playCount || 0
      if (rule.operator === 'greaterThan') return trackCount > count
      if (rule.operator === 'lessThan') return trackCount < count
      if (rule.operator === 'equals') return trackCount === count
      return false
    }
    case 'durationSeconds': {
      const dur = Number(rule.value)
      const trackDur = track.duration || 0
      if (rule.operator === 'greaterThan') return trackDur > dur
      if (rule.operator === 'lessThan') return trackDur < dur
      if (rule.operator === 'between' && rule.secondValue !== undefined) {
        return trackDur >= dur && trackDur <= Number(rule.secondValue)
      }
      return false
    }
    case 'dateAddedDays': {
      const days = Number(rule.value)
      const addedDate = new Date(track.dateAdded).getTime()
      const cutoff = Date.now() - days * 86400000
      if (rule.operator === 'lessThan') return addedDate >= cutoff // added within last N days
      if (rule.operator === 'greaterThan') return addedDate < cutoff // older than N days
      return false
    }
    case 'isFavorite': {
      return track.isFavorite === Boolean(rule.value)
    }
    default:
      return true
  }
}

export function filterTracksBySmartRules(tracks: Track[], playlist: Playlist): Track[] {
  const rules = playlist.smartRules || []
  if (rules.length === 0) return tracks

  const mode = playlist.smartMatchMode || 'all'

  let filtered = tracks.filter((track) => {
    if (mode === 'all') {
      return rules.every((rule) => evaluateSmartRule(track, rule))
    } else {
      return rules.some((rule) => evaluateSmartRule(track, rule))
    }
  })

  // Sorting
  if (playlist.smartSortBy) {
    switch (playlist.smartSortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'artist':
        filtered.sort((a, b) => a.artist.localeCompare(b.artist))
        break
      case 'dateAdded':
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
      case 'playCount':
        filtered.sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
        break
      case 'random':
        filtered = [...filtered].sort(() => Math.random() - 0.5)
        break
    }
  }

  // Limit
  if (playlist.smartLimit && playlist.smartLimit > 0) {
    filtered = filtered.slice(0, playlist.smartLimit)
  }

  return filtered
}
