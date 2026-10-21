export function formatNoteDate(isoString: string): string {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function formatReminderDateTime(isoString: string): string {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  const isTomorrow =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toDateString() ===
    date.toDateString()

  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  if (isToday) return `Today, ${timeStr}`
  if (isTomorrow) return `Tomorrow, ${timeStr}`
  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`
}

export const formatReminderDate = formatReminderDateTime

export function isReminderPast(isoString: string): boolean {
  if (!isoString) return false
  return new Date(isoString).getTime() < Date.now()
}

export const isPastDue = isReminderPast
