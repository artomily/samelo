/** Returns a UTC ISO string for N days ago from the given base date */
export function daysAgo(n: number, base: Date = new Date()): string {
  const d = new Date(base)
  d.setUTCDate(d.getUTCDate() - n)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

/** Returns an array of date strings (YYYY-MM-DD) for the last N days */
export function lastNDays(n: number, base: Date = new Date()): string[] {
  const dates: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setUTCDate(d.getUTCDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

/** Format a date string to a short label like "Jun 19" */
export function shortDateLabel(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}
