import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, clearRateLimit } from '@/lib/rate-limit'

describe('checkRateLimit', () => {
  const KEY = 'test-ip-1'

  beforeEach(() => {
    clearRateLimit(KEY)
  })

  it('allows first request', () => {
    const result = checkRateLimit(KEY, 5)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('blocks after max requests', () => {
    for (let i = 0; i < 5; i++) checkRateLimit(KEY, 5)
    const result = checkRateLimit(KEY, 5)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('different keys are independent', () => {
    clearRateLimit('key-a')
    clearRateLimit('key-b')
    for (let i = 0; i < 5; i++) checkRateLimit('key-a', 5)
    const result = checkRateLimit('key-b', 5)
    expect(result.allowed).toBe(true)
  })

  it('returns resetAt timestamp in future', () => {
    const result = checkRateLimit(KEY, 5)
    expect(result.resetAt).toBeGreaterThan(Date.now())
  })
})
