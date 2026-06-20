import { describe, it, expect } from 'vitest'
import {
  formatTokenAmount,
  parseTokenAmount,
  getTokenSymbol,
  isStableToken,
  STABLE_TOKEN_ADDRESSES,
} from '@/lib/celo/tokens'

describe('celo token utilities', () => {
  it('formatTokenAmount converts bigint to string with precision', () => {
    expect(formatTokenAmount(1_000_000_000_000_000_000n)).toBe('1')
    expect(formatTokenAmount(1_500_000_000_000_000_000n, 18, 2)).toBe('1.5')
  })

  it('formatTokenAmount strips trailing zeros', () => {
    expect(formatTokenAmount(2_000_000_000_000_000_000n, 18, 4)).toBe('2')
  })

  it('parseTokenAmount converts string to bigint', () => {
    expect(parseTokenAmount('1')).toBe(1_000_000_000_000_000_000n)
    expect(parseTokenAmount('0.5')).toBe(500_000_000_000_000_000n)
  })

  it('getTokenSymbol returns symbol for known addresses', () => {
    expect(getTokenSymbol(STABLE_TOKEN_ADDRESSES.cUSD)).toBe('cUSD')
    expect(getTokenSymbol(STABLE_TOKEN_ADDRESSES.cEUR)).toBe('cEUR')
  })

  it('getTokenSymbol returns TOKEN for unknown addresses', () => {
    expect(getTokenSymbol('0x0000000000000000000000000000000000000000')).toBe('TOKEN')
  })

  it('isStableToken identifies stable coins', () => {
    expect(isStableToken(STABLE_TOKEN_ADDRESSES.cUSD)).toBe(true)
    expect(isStableToken(STABLE_TOKEN_ADDRESSES.cEUR)).toBe(true)
    expect(isStableToken('0x471EcE3750Da237f93B8E339c536989b8978a438')).toBe(false)
  })
})
