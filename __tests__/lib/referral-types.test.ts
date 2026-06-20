import { describe, it, expect } from 'vitest'
import { generateReferralCode, REFERRER_BONUS_POINTS, REFEREE_BONUS_POINTS } from '../../lib/types/referral'

describe('generateReferralCode', () => {
  it('starts with SMLO-', () => {
    const code = generateReferralCode('0x1234567890abcdef1234567890abcdef12345678')
    expect(code).toMatch(/^SMLO-/)
  })

  it('includes uppercase wallet prefix (chars 2–7)', () => {
    const code = generateReferralCode('0xabcdef1234567890abcdef1234567890abcdef12')
    expect(code).toContain('ABCDEF')
  })

  it('has three hyphen-separated segments', () => {
    const code = generateReferralCode('0x1234567890abcdef1234567890abcdef12345678')
    expect(code.split('-')).toHaveLength(3)
  })
})

describe('bonus point constants', () => {
  it('referrer earns 200 points', () => {
    expect(REFERRER_BONUS_POINTS).toBe(200)
  })

  it('referee earns 100 points', () => {
    expect(REFEREE_BONUS_POINTS).toBe(100)
  })

  it('referrer earns more than referee', () => {
    expect(REFERRER_BONUS_POINTS).toBeGreaterThan(REFEREE_BONUS_POINTS)
  })
})
