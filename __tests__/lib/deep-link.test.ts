import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock env
vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://samelo.app')

const { referralDeepLink, videoDeepLink, profileDeepLink, parseRefCode } = await import('@/lib/deep-link')

describe('referralDeepLink', () => {
  it('builds correct referral URL', () => {
    expect(referralDeepLink('ABC123')).toBe('https://samelo.app/?ref=ABC123')
  })

  it('encodes special characters', () => {
    expect(referralDeepLink('a b')).toContain('a%20b')
  })
})

describe('videoDeepLink', () => {
  it('builds video deep link', () => {
    expect(videoDeepLink('xyz789')).toBe('https://samelo.app/watch?v=xyz789')
  })
})

describe('profileDeepLink', () => {
  it('builds profile deep link', () => {
    expect(profileDeepLink('0xABC')).toBe('https://samelo.app/profile/0xABC')
  })
})

describe('parseRefCode', () => {
  it('extracts ref from URL', () => {
    expect(parseRefCode('https://samelo.app/?ref=CODE123')).toBe('CODE123')
  })

  it('returns null when no ref param', () => {
    expect(parseRefCode('https://samelo.app/')).toBeNull()
  })

  it('returns null for invalid URL', () => {
    expect(parseRefCode('not-a-url')).toBeNull()
  })
})
