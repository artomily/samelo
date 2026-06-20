import { describe, it, expect, vi, beforeEach } from 'vitest'
import { canNativeShare } from '@/lib/share'

describe('canNativeShare', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { share: undefined })
  })

  it('returns false when navigator.share unavailable', () => {
    expect(canNativeShare()).toBe(false)
  })

  it('returns true when navigator.share is present', () => {
    vi.stubGlobal('navigator', { share: vi.fn() })
    expect(canNativeShare()).toBe(true)
  })
})
