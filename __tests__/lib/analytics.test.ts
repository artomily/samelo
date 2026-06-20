import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSession = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((k: string) => store[k] ?? null),
    setItem: vi.fn((k: string, v: string) => { store[k] = v }),
    removeItem: vi.fn((k: string) => { delete store[k] }),
    clear: () => { store = {} },
  }
})()

Object.defineProperty(globalThis, 'sessionStorage', { value: mockSession })
Object.defineProperty(globalThis, 'crypto', {
  value: { getRandomValues: (arr: Uint8Array) => { arr.fill(42); return arr } }
})

import { getOrCreateSessionId, clearSession } from '@/lib/analytics/session'

describe('analytics session', () => {
  beforeEach(() => mockSession.clear())

  it('generates a session ID on first call', () => {
    const id = getOrCreateSessionId()
    expect(id).toHaveLength(32)
    expect(id).toMatch(/^[0-9a-f]+$/)
  })

  it('returns same session ID on subsequent calls', () => {
    const a = getOrCreateSessionId()
    const b = getOrCreateSessionId()
    expect(a).toBe(b)
  })

  it('clears session ID', () => {
    getOrCreateSessionId()
    clearSession()
    expect(mockSession.getItem('samelo_session_id')).toBeNull()
  })
})
