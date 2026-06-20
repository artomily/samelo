import { describe, it, expect } from 'vitest'
import { formatSocialHandle, sanitizeUrl, getAvatarInitials } from '../../lib/types/profile-v2'

describe('formatSocialHandle', () => {
  it('adds @ prefix if missing', () => {
    expect(formatSocialHandle('samelo_app')).toBe('@samelo_app')
  })

  it('does not double-prefix if @ already present', () => {
    expect(formatSocialHandle('@samelo_app')).toBe('@samelo_app')
  })
})

describe('sanitizeUrl', () => {
  it('accepts valid https urls', () => {
    expect(sanitizeUrl('https://samelo.app')).toBe('https://samelo.app/')
  })

  it('prepends https to bare domains', () => {
    expect(sanitizeUrl('samelo.app')).toBe('https://samelo.app/')
  })

  it('rejects javascript: protocol', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('')
  })

  it('rejects malformed urls', () => {
    expect(sanitizeUrl('not a url at all!!!')).toBe('')
  })
})

describe('getAvatarInitials', () => {
  it('returns first 2 chars of display name uppercased', () => {
    expect(getAvatarInitials('Alice', '0xabc')).toBe('AL')
  })

  it('falls back to wallet chars 2-3 when name is null', () => {
    expect(getAvatarInitials(null, '0xabcdef')).toBe('AB')
  })
})
