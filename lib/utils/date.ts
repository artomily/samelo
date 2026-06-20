export function toDateString(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10)
}

export function daysBetween(a: Date | string, b: Date | string): number {
  const msPerDay = 86_400_000
  return Math.abs(Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay))
}

export function isToday(date: Date | string): boolean {
  return toDateString(date) === toDateString(new Date())
}

export function isYesterday(date: Date | string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return toDateString(date) === toDateString(yesterday)
}

export function addDays(date: Date | string, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function startOfDay(date: Date | string): Date {
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date: Date | string): Date {
  const d = new Date(date)
  d.setUTCHours(23, 59, 59, 999)
  return d
}

export function formatRelative(date: Date | string): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = now - then

  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`
  return new Date(date).toLocaleDateString()
}

export function getISOWeek(date: Date | string): string {
  const d = new Date(date)
  const year = d.getUTCFullYear()
  const dayOfYear = Math.ceil((d.getTime() - new Date(year, 0, 1).getTime()) / 86_400_000)
  const week = Math.ceil(dayOfYear / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}
