import { describe, it, expect } from 'vitest'
import {
  CELO_GAS_CURRENCIES,
  DEFAULT_GAS_LIMIT,
  SWAP_GAS_LIMIT,
  STAKE_GAS_LIMIT,
  getGasCurrencyAddress,
  estimateGasCost,
} from '@/lib/celo/gas'

describe('celo gas utilities', () => {
  it('CELO gas currency is undefined (native)', () => {
    expect(CELO_GAS_CURRENCIES.CELO).toBeUndefined()
  })

  it('cUSD gas currency is a valid address', () => {
    expect(CELO_GAS_CURRENCIES.cUSD).toMatch(/^0x[0-9a-fA-F]{40}$/)
  })

  it('gas limits are reasonable bigints', () => {
    expect(DEFAULT_GAS_LIMIT).toBeGreaterThan(0n)
    expect(SWAP_GAS_LIMIT).toBeGreaterThan(DEFAULT_GAS_LIMIT)
    expect(STAKE_GAS_LIMIT).toBeGreaterThan(DEFAULT_GAS_LIMIT)
  })

  it('getGasCurrencyAddress returns undefined for CELO', () => {
    expect(getGasCurrencyAddress('CELO')).toBeUndefined()
  })

  it('getGasCurrencyAddress returns address for cUSD', () => {
    const addr = getGasCurrencyAddress('cUSD')
    expect(addr).toMatch(/^0x/)
  })

  it('estimateGasCost multiplies gasLimit * gasPrice', () => {
    expect(estimateGasCost(200_000n, 1_000_000_000n)).toBe(200_000_000_000_000n)
  })
})
