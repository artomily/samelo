import { describe, it, expect } from 'vitest'
import { buildOracleMessage, type OracleSignaturePayload } from '@/lib/celo/oracle'

describe('oracle utilities', () => {
  const payload: OracleSignaturePayload = {
    user: '0x1234567890abcdef1234567890abcdef12345678',
    points: 1000n,
    nonce: 0n,
    contractAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    chainId: 42220,
  }

  it('buildOracleMessage returns a 32-byte hex hash', () => {
    const hash = buildOracleMessage(payload)
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/)
  })

  it('buildOracleMessage is deterministic', () => {
    const a = buildOracleMessage(payload)
    const b = buildOracleMessage(payload)
    expect(a).toBe(b)
  })

  it('different payloads produce different hashes', () => {
    const modified = { ...payload, points: 2000n }
    expect(buildOracleMessage(payload)).not.toBe(buildOracleMessage(modified))
  })

  it('different chainId produces different hash — prevents cross-chain replay', () => {
    const testnet = { ...payload, chainId: 44787 }
    expect(buildOracleMessage(payload)).not.toBe(buildOracleMessage(testnet))
  })

  it('different contract address produces different hash — prevents cross-contract replay', () => {
    const otherContract = { ...payload, contractAddress: '0x0000000000000000000000000000000000000001' as `0x${string}` }
    expect(buildOracleMessage(payload)).not.toBe(buildOracleMessage(otherContract))
  })
})
