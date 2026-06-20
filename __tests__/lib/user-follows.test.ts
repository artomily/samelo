import { describe, it, expect } from 'vitest'
import { displayName, shortenWallet, twitterUrl } from '@/lib/types/user-follows'
import type { UserProfile } from '@/lib/types/user-follows'

const baseProfile: UserProfile = {
  wallet: '0xABCDEF1234567890ABCDef1234567890ABCDEF12',
  display_name: null,
  bio: null,
  avatar_url: null,
  twitter_handle: null,
  is_creator: false,
  created_at: '2026-06-21T00:00:00Z',
  updated_at: '2026-06-21T00:00:00Z',
}

describe('displayName', () => {
  it('returns display_name when set', () => {
    expect(displayName({ ...baseProfile, display_name: 'Alice' })).toBe('Alice')
  })

  it('returns shortened wallet when no display_name', () => {
    const result = displayName(baseProfile)
    expect(result).toContain('0xABCD')
    expect(result).toContain('EF12')
  })
})

describe('shortenWallet', () => {
  it('returns 6 chars prefix + ellipsis + 4 chars suffix', () => {
    const result = shortenWallet('0xABCDEF1234567890ABCDef1234567890ABCDEF12')
    expect(result.startsWith('0xABCD')).toBe(true)
    expect(result.endsWith('EF12')).toBe(true)
  })
})

describe('twitterUrl', () => {
  it('handles handle without @', () => {
    expect(twitterUrl('alice')).toBe('https://twitter.com/alice')
  })

  it('strips leading @ from handle', () => {
    expect(twitterUrl('@bob')).toBe('https://twitter.com/bob')
  })
})
