import { describe, it, expect, vi, afterEach } from 'vitest'

// Extract timeAgo logic for testing
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

describe('timeAgo', () => {
  const NOW = new Date('2026-06-19T12:00:00Z').getTime()

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns "just now" for < 1 minute', () => {
    const iso = new Date(NOW - 30_000).toISOString()
    expect(timeAgo(iso)).toBe('just now')
  })

  it('returns minutes for < 1 hour', () => {
    const iso = new Date(NOW - 5 * 60_000).toISOString()
    expect(timeAgo(iso)).toBe('5m ago')
  })

  it('returns hours for < 24 hours', () => {
    const iso = new Date(NOW - 3 * 60 * 60_000).toISOString()
    expect(timeAgo(iso)).toBe('3h ago')
  })

  it('returns days for >= 24 hours', () => {
    const iso = new Date(NOW - 2 * 24 * 60 * 60_000).toISOString()
    expect(timeAgo(iso)).toBe('2d ago')
  })
})
