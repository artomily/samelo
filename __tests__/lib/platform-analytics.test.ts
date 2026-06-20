import { describe, it, expect } from 'vitest'
import { buildSessionId, TRACKED_FEATURES } from '@/lib/types/platform-analytics'

describe('TRACKED_FEATURES', () => {
  it('contains core features', () => {
    expect(TRACKED_FEATURES).toContain('watch')
    expect(TRACKED_FEATURES).toContain('quiz')
    expect(TRACKED_FEATURES).toContain('stake')
    expect(TRACKED_FEATURES).toContain('swap')
  })

  it('has at least 9 features', () => {
    expect(TRACKED_FEATURES.length).toBeGreaterThanOrEqual(9)
  })
})

describe('buildSessionId', () => {
  it('starts with sess_', () => {
    expect(buildSessionId()).toMatch(/^sess_/)
  })

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => buildSessionId()))
    expect(ids.size).toBe(100)
  })

  it('has predictable structure', () => {
    const id = buildSessionId()
    const parts = id.split('_')
    expect(parts.length).toBe(3)
    expect(Number(parts[1])).toBeGreaterThan(0)
  })
})
