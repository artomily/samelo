import { describe, it, expect } from 'vitest'

// Wallet truncation used in LiveSwapFeed and SwapperLeaderboard
function truncateWallet(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

describe('truncateWallet', () => {
  it('shows first 6 and last 4 chars', () => {
    const addr = '0x1234567890abcdef1234567890abcdef12345678'
    expect(truncateWallet(addr)).toBe('0x1234…5678')
  })

  it('handles minimal length address', () => {
    const addr = '0x1234ABCD'
    expect(truncateWallet(addr)).toBe('0x1234…ABCD')
  })

  it('always contains separator', () => {
    const addr = '0xdeadbeefcafebabe1234567890abcdef12345678'
    expect(truncateWallet(addr)).toContain('…')
  })
})
