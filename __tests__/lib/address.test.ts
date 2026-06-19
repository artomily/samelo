import { describe, it, expect } from 'vitest'
import { normalizeAddress, isValidAddress, truncateAddress, sameAddress } from '@/lib/address'

describe('normalizeAddress', () => {
  it('lowercases checksum addresses', () => {
    expect(normalizeAddress('0xABCDEF1234567890ABCDEF1234567890ABCDEF12'))
      .toBe('0xabcdef1234567890abcdef1234567890abcdef12')
  })
})

describe('isValidAddress', () => {
  it('returns true for valid 42-char hex address', () => {
    expect(isValidAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true)
  })

  it('returns false for too short address', () => {
    expect(isValidAddress('0x1234')).toBe(false)
  })

  it('returns false for non-hex characters', () => {
    expect(isValidAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBe(false)
  })

  it('returns false for missing 0x prefix', () => {
    expect(isValidAddress('1234567890abcdef1234567890abcdef12345678')).toBe(false)
  })
})

describe('truncateAddress', () => {
  it('truncates to 0x1234…abcd format with 4 chars default', () => {
    expect(truncateAddress('0x1234567890abcdef1234567890abcdef12345678'))
      .toBe('0x1234…5678')
  })

  it('truncates with custom char count', () => {
    expect(truncateAddress('0x1234567890abcdef1234567890abcdef12345678', 6))
      .toBe('0x123456…345678')
  })
})

describe('sameAddress', () => {
  it('returns true for same address with different casing', () => {
    expect(sameAddress('0xABCD', '0xabcd')).toBe(true)
  })

  it('returns false for different addresses', () => {
    expect(sameAddress('0xABCD', '0x1234')).toBe(false)
  })
})
