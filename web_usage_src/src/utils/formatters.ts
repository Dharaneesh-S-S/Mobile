export function formatDuration(minutes: number): string {
  if (isNaN(minutes) || minutes <= 0) return '0m'
  const rounded = Math.round(minutes)
  const h = Math.floor(rounded / 60)
  const m = rounded % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m < 10 ? '0' : ''}${m}m`
}

export function formatTimeOfDay(hour: number, minute: number = 0, is24h: boolean = false): string {
  const safeHour = (hour + 24) % 24
  const minStr = minute < 10 ? `0${minute}` : `${minute}`

  if (is24h) {
    const hrStr = safeHour < 10 ? `0${safeHour}` : `${safeHour}`
    return `${hrStr}:${minStr}`
  }

  const period = safeHour >= 12 ? 'PM' : 'AM'
  const displayHour = safeHour % 12 === 0 ? 12 : safeHour % 12
  return `${displayHour}:${minStr} ${period}`
}

export function formatDateLabel(dateStr: string): string {
  const today = getTodayDateStr()
  const yesterday = getOffsetDateStr(-1)

  if (dateStr === today) return 'Today'
  if (dateStr === yesterday) return 'Yesterday'

  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function getTodayDateStr(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getOffsetDateStr(daysOffset: number, baseDateStr?: string): string {
  let base: Date
  if (baseDateStr) {
    const [y, m, d] = baseDateStr.split('-').map(Number)
    base = new Date(y, m - 1, d)
  } else {
    base = new Date()
  }
  base.setDate(base.getDate() + daysOffset)
  const year = base.getFullYear()
  const month = String(base.getMonth() + 1).padStart(2, '0')
  const day = String(base.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
