import { describe, it, expect, vi } from 'vitest'
import { withRetry, withRetryIf } from '@/lib/retry'

describe('withRetry', () => {
  it('returns result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const result = await withRetry(fn, 3, 0)
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on failure and succeeds', async () => {
    let call = 0
    const fn = vi.fn().mockImplementation(() => {
      call++
      if (call < 3) throw new Error('fail')
      return Promise.resolve('success')
    })
    const result = await withRetry(fn, 3, 0)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('throws after exhausting attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'))
    await expect(withRetry(fn, 3, 0)).rejects.toThrow('always fails')
    expect(fn).toHaveBeenCalledTimes(3)
  })
})

describe('withRetryIf', () => {
  it('stops retrying when shouldRetry returns false', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('permanent'))
    const shouldRetry = (e: unknown) => (e as Error).message !== 'permanent'
    await expect(withRetryIf(fn, shouldRetry, 3)).rejects.toThrow('permanent')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
