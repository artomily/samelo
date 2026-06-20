import { describe, it, expect } from 'vitest'
import {
  generateSessionToken,
  sessionExpiresAt,
  isSessionExpired,
  SESSION_TTL_HOURS,
} from '@/lib/types/session'
import type { WalletSession } from '@/lib/types/session'

function makeSession(expiresAt: string): WalletSession {
  return {
    id: 'test',
    wallet: '0xabc',
    session_token: 'tok',
    ip_address: null,
    user_agent: null,
    last_seen_at: new Date().toISOString(),
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
  }
}

describe('generateSessionToken', () => {
  it('generates a 64-char hex string', () => {
    const token = generateSessionToken()
    expect(token).toMatch(/^[0-9a-f]{64}$/)
  })

  it('generates unique tokens', () => {
    const tokens = new Set(Array.from({ length: 50 }, () => generateSessionToken()))
    expect(tokens.size).toBe(50)
  })
})

describe('sessionExpiresAt', () => {
  it('returns a future date', () => {
    const exp = sessionExpiresAt()
    expect(new Date(exp).getTime()).toBeGreaterThan(Date.now())
  })

  it('reflects SESSION_TTL_HOURS', () => {
    const exp = sessionExpiresAt()
    const diffHours = (new Date(exp).getTime() - Date.now()) / 3600_000
    expect(diffHours).toBeCloseTo(SESSION_TTL_HOURS, 0)
  })
})

describe('isSessionExpired', () => {
  it('returns true for past expiry', () => {
    const past = new Date(Date.now() - 1000).toISOString()
    expect(isSessionExpired(makeSession(past))).toBe(true)
  })

  it('returns false for future expiry', () => {
    const future = new Date(Date.now() + 60_000).toISOString()
    expect(isSessionExpired(makeSession(future))).toBe(false)
  })
})
