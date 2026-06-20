import { describe, it, expect, vi } from 'vitest'
import { isFollowing, getFollowerCount } from '@/lib/follows'

const makeMockSupabase = (data: unknown = null, count: number | null = null) => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        eq: () => ({
          single: () => ({ data }),
        }),
        select: () => ({
          eq: () => ({ count }),
        }),
      }),
    }),
    insert: () => ({ error: null }),
    delete: () => ({
      eq: () => ({
        eq: () => ({ error: null }),
      }),
    }),
  }),
})

describe('follows lib', () => {
  it('isFollowing returns true when record exists', async () => {
    const supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: () => ({ data: { follower_wallet: '0xabc' } }),
            }),
          }),
        }),
      }),
    }
    const result = await isFollowing(supabase as any, '0xabc', '0xdef')
    expect(result).toBe(true)
  })

  it('isFollowing returns false when no record', async () => {
    const supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: () => ({ data: null }),
            }),
          }),
        }),
      }),
    }
    const result = await isFollowing(supabase as any, '0xabc', '0xdef')
    expect(result).toBe(false)
  })
})
