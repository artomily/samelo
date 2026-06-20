import { describe, it, expect } from 'vitest'
import {
  CELO_MAINNET,
  CELO_TESTNET,
  CELO_TOKEN_ADDRESS,
  cUSD_ADDRESS,
  cEUR_ADDRESS,
  isCeloNetwork,
  getCeloScanUrl,
} from '@/lib/celo/chains'

describe('Celo chain configs', () => {
  it('CELO_MAINNET has correct id and RPC', () => {
    expect(CELO_MAINNET.id).toBe(42220)
    expect(CELO_MAINNET.rpcUrls.default.http[0]).toBe('https://forno.celo.org')
  })

  it('CELO_TESTNET has correct id', () => {
    expect(CELO_TESTNET.id).toBe(44787)
  })

  it('token addresses are checksummed hex strings', () => {
    expect(CELO_TOKEN_ADDRESS).toMatch(/^0x[0-9a-fA-F]{40}$/)
    expect(cUSD_ADDRESS).toMatch(/^0x[0-9a-fA-F]{40}$/)
    expect(cEUR_ADDRESS).toMatch(/^0x[0-9a-fA-F]{40}$/)
  })

  it('isCeloNetwork returns true for mainnet and testnet', () => {
    expect(isCeloNetwork(42220)).toBe(true)
    expect(isCeloNetwork(44787)).toBe(true)
    expect(isCeloNetwork(1)).toBe(false)
  })

  it('getCeloScanUrl builds mainnet URL', () => {
    const url = getCeloScanUrl('0xabc123')
    expect(url).toContain('celoscan.io/tx/0xabc123')
    expect(url).not.toContain('alfajores')
  })

  it('getCeloScanUrl builds testnet URL for chainId 44787', () => {
    const url = getCeloScanUrl('0xabc123', 44787)
    expect(url).toContain('alfajores.celoscan.io/tx/0xabc123')
  })
})
