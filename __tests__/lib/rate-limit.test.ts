import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, clearRateLimit } from '@/lib/rate-limit'

const KEY = 'test-wallet-0xabc'

beforeEach(() => {
  clearRateLimit(KEY)
})

describe('checkRateLimit', () => {
  it('allows first request', () => {
    const result = checkRateLimit(KEY, 5)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('allows up to maxRequests per window', () => {
    for (let i = 0; i < 5; i++) checkRateLimit(KEY, 5)
    const result = checkRateLimit(KEY, 5)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('returns resetAt timestamp in the future', () => {
    const result = checkRateLimit(KEY, 5)
    expect(result.resetAt).toBeGreaterThan(Date.now())
  })

  it('decrements remaining with each call', () => {
    const r1 = checkRateLimit(KEY, 5)
    const r2 = checkRateLimit(KEY, 5)
    expect(r2.remaining).toBe(r1.remaining - 1)
  })
})
