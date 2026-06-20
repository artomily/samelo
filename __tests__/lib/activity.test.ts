import { describe, it, expect, vi } from 'vitest'
import { createActivityEvent, getReactionCount } from '@/lib/activity'

describe('activity lib', () => {
  it('createActivityEvent inserts with correct fields', async () => {
    const insert = vi.fn(() => ({ error: null }))
    const supabase = { from: () => ({ insert }) } as any
    await createActivityEvent(supabase, '0xabc', 'watch', { title: 'Intro to Celo' })
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ wallet: '0xabc', event_type: 'watch' }),
    )
  })

  it('createActivityEvent uses empty metadata by default', async () => {
    const insert = vi.fn(() => ({ error: null }))
    const supabase = { from: () => ({ insert }) } as any
    await createActivityEvent(supabase, '0xabc', 'stake')
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: {} }),
    )
  })

  it('getReactionCount returns count from db', async () => {
    const supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({ count: 7 }),
        }),
      }),
    } as any
    const count = await getReactionCount(supabase, 'event-id-1')
    expect(count).toBe(7)
  })
})
