import { describe, it, expect } from 'vitest'
import { maskApiKey, isExpired, isActive } from '@/lib/types/api-key'
import type { ApiKey } from '@/lib/types/api-key'

function makeKey(overrides: Partial<ApiKey> = {}): ApiKey {
  return {
    id: 'test-id',
    wallet: '0xabc',
    name: 'Test Key',
    key_prefix: 'smlo_',
    last_used_at: null,
    expires_at: null,
    created_at: new Date().toISOString(),
    revoked_at: null,
    ...overrides,
  }
}

describe('maskApiKey', () => {
  it('shows first 9, 8 dots, last 4 for a long key', () => {
    const key = 'smlo_abc123XYZ456'
    const masked = maskApiKey(key)
    expect(masked.startsWith('smlo_abc1')).toBe(true)
    expect(masked.endsWith('Z456')).toBe(true)
    expect(masked).toContain('••••••••')
  })

  it('handles short keys gracefully', () => {
    const masked = maskApiKey('smlo_')
    expect(masked.length).toBeGreaterThan(0)
  })
})

describe('isExpired', () => {
  it('returns false when no expiry', () => {
    expect(isExpired(makeKey())).toBe(false)
  })

  it('returns true when expiry is in the past', () => {
    const past = new Date(Date.now() - 1000).toISOString()
    expect(isExpired(makeKey({ expires_at: past }))).toBe(true)
  })

  it('returns false when expiry is in the future', () => {
    const future = new Date(Date.now() + 60_000).toISOString()
    expect(isExpired(makeKey({ expires_at: future }))).toBe(false)
  })
})

describe('isActive', () => {
  it('returns true for non-revoked, non-expired key', () => {
    expect(isActive(makeKey())).toBe(true)
  })

  it('returns false when revoked', () => {
    expect(isActive(makeKey({ revoked_at: new Date().toISOString() }))).toBe(false)
  })

  it('returns false when expired', () => {
    const past = new Date(Date.now() - 1000).toISOString()
    expect(isActive(makeKey({ expires_at: past }))).toBe(false)
  })

  it('returns false when revoked AND expired', () => {
    const past = new Date(Date.now() - 1000).toISOString()
    expect(isActive(makeKey({ revoked_at: past, expires_at: past }))).toBe(false)
  })
})
