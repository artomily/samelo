import { describe, it, expect } from 'vitest'
import { buildReferralLink, buildVideoReferralLink, parseReferralFromUrl } from '@/lib/referral'

describe('buildReferralLink', () => {
  it('builds link with encoded code', () => {
    const url = buildReferralLink('ABC123', 'https://samelo.app')
    expect(url).toBe('https://samelo.app?ref=ABC123')
  })

  it('encodes special characters in the code', () => {
    const url = buildReferralLink('A B+C', 'https://samelo.app')
    expect(url).toBe('https://samelo.app?ref=A%20B%2BC')
  })
})

describe('buildVideoReferralLink', () => {
  it('includes both ref and video params', () => {
    const url = buildVideoReferralLink('REF42', 'vid-xyz', 'https://samelo.app')
    expect(url).toBe('https://samelo.app?ref=REF42&v=vid-xyz')
  })
})

describe('parseReferralFromUrl', () => {
  it('extracts ref code from params', () => {
    const params = new URLSearchParams('ref=MYCODE')
    const result = parseReferralFromUrl(params)
    expect(result.code).toBe('MYCODE')
    expect(result.videoId).toBeNull()
  })

  it('extracts both ref and video id', () => {
    const params = new URLSearchParams('ref=XYZ&v=vid-1')
    const result = parseReferralFromUrl(params)
    expect(result.code).toBe('XYZ')
    expect(result.videoId).toBe('vid-1')
  })

  it('returns null for missing params', () => {
    const params = new URLSearchParams('')
    const result = parseReferralFromUrl(params)
    expect(result.code).toBeNull()
    expect(result.videoId).toBeNull()
  })
})
