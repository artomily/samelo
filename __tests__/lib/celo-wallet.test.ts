import { describe, it, expect } from 'vitest'
import {
  shortenAddress,
  isValidCeloAddress,
  getExplorerLink,
  checksumAddress,
} from '@/lib/celo/wallet'

describe('wallet utilities', () => {
  const addr = '0x1234567890abcdef1234567890abcdef12345678' as `0x${string}`

  it('shortenAddress returns truncated form', () => {
    const short = shortenAddress(addr)
    expect(short).toContain('0x1234')
    expect(short).toContain('5678')
    expect(short.length).toBeLessThan(addr.length)
  })

  it('shortenAddress respects custom chars param', () => {
    const short = shortenAddress(addr, 6)
    expect(short).toContain('0x123456')
    expect(short).toContain('345678')
  })

  it('isValidCeloAddress accepts valid 40-char hex addresses', () => {
    expect(isValidCeloAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true)
    expect(isValidCeloAddress('0x000000000000000000000000000000000000dead')).toBe(true)
  })

  it('isValidCeloAddress rejects invalid addresses', () => {
    expect(isValidCeloAddress('not-an-address')).toBe(false)
    expect(isValidCeloAddress('0x1234')).toBe(false)
    expect(isValidCeloAddress('')).toBe(false)
  })

  it('getExplorerLink builds mainnet link by default', () => {
    const link = getExplorerLink(addr, 42220)
    expect(link).toContain('celoscan.io/address/')
    expect(link).not.toContain('alfajores')
  })

  it('getExplorerLink builds testnet link for 44787', () => {
    const link = getExplorerLink(addr, 44787)
    expect(link).toContain('alfajores.celoscan.io/address/')
  })

  it('checksumAddress lowercases address', () => {
    expect(checksumAddress('0xABCD')).toBe('0xabcd')
  })
})
