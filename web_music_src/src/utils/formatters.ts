export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatDateAdded(isoString: string): string {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return isoString
  }
}

export function getTimeOfDayGreeting(): { greeting: string; subtitle: string; icon: string } {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good morning',
      subtitle: 'Start your day with uplifting melodies',
      icon: 'Sun',
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good afternoon',
      subtitle: 'Focus rhythms and energetic beats',
      icon: 'Zap',
    }
  } else if (hour >= 17 && hour < 22) {
    return {
      greeting: 'Good evening',
      subtitle: 'Unwind with smooth chillout soundscapes',
      icon: 'Moon',
    }
  } else {
    return {
      greeting: 'Late night vibes',
      subtitle: 'Ambient nocturnal frequencies',
      icon: 'Sparkles',
    }
  }
}
