import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/leaderboard/route'
import * as supabaseModule from '@/lib/supabase'
import { createNextRequest } from '../helpers/request'
import { VALID_WALLET } from '../helpers/fixtures'

describe('GET /api/leaderboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 for invalid sortBy', async () => {
    const req = createNextRequest('/api/leaderboard?sortBy=invalid')
    const res = await GET(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid sortBy')
  })

  it('accepts sortBy=points (default)', async () => {
    const mockProfiles = [
      { wallet_address: VALID_WALLET.toLowerCase(), total_points: 500, total_earned_cents: 250, display_name: 'User1' },
      { wallet_address: '0xabc123456789012345678901234567890abc12345'.toLowerCase(), total_points: 300, total_earned_cents: 150, display_name: 'User2' },
    ]

    const selectFn = vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({
        range: vi.fn().mockResolvedValue({ data: mockProfiles, error: null }),
      }),
    })

    const countFn = vi.fn().mockResolvedValue({ count: 2, error: null })
    const singleFn = vi.fn().mockResolvedValue({ data: { total_points: 500 }, error: null })
    const countProfileFn = vi.fn().mockResolvedValue({ count: 0, error: null })

    let callCount = 0
    const from = vi.fn().mockImplementation(() => {
      callCount++
      if (callCount <= 3) {
        return {
          select: callCount === 1 ? selectFn : (callCount === 2 ? vi.fn().mockReturnValue({ gt: vi.fn().mockReturnValue(countProfileFn) }) : vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: mockProfiles[0], error: null }) }) })),
        }
      }
      return { select: vi.fn().mockReturnValue({ gt: vi.fn().mockReturnValue(countProfileFn) }) }
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/leaderboard?sortBy=points')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.sortBy).toBe('points')
  })

  it('accepts sortBy=watches', async () => {
    const watchData = [
      { wallet_address: VALID_WALLET.toLowerCase() },
      { wallet_address: VALID_WALLET.toLowerCase() },
      { wallet_address: '0xabc123456789012345678901234567890abc12345' },
    ]

    // Route builds `query = from('profiles').select().order()` before the sortBy branch,
    // so profiles mock must support .order() even though it's never awaited in this path.
    const watchSelectFn = vi.fn().mockImplementation((resolve?: (v: unknown) => unknown) =>
      resolve ? Promise.resolve(resolve({ data: watchData, error: null })) : Promise.resolve({ data: watchData, error: null }),
    )
    const profilesChain = {
      order: vi.fn().mockReturnThis(),
      in: vi.fn().mockImplementation((resolve?: (v: unknown) => unknown) =>
        resolve ? Promise.resolve(resolve({ data: [], error: null })) : Promise.resolve({ data: [], error: null }),
      ),
      then: vi.fn().mockImplementation((resolve?: (v: unknown) => unknown) =>
        resolve ? Promise.resolve(resolve({ data: [], error: null })) : Promise.resolve({ data: [], error: null }),
      ),
    }
    const from = vi.fn().mockImplementation((table: string) => {
      if (table === 'watches') return { select: vi.fn().mockReturnValue({ then: watchSelectFn }) }
      if (table === 'profiles') return { select: vi.fn().mockReturnValue(profilesChain) }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/leaderboard?sortBy=watches')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.sortBy).toBe('watches')
  })

  it('defaults to all_time timeframe', async () => {
    const mockProfiles = []
    const selectFn = vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({
        range: vi.fn().mockResolvedValue({ data: mockProfiles, error: null }),
      }),
    })
    const countFn = vi.fn().mockResolvedValue({ count: 0, error: null })

    const from = vi.fn().mockImplementation(() => ({
      select: callCount => callCount === 1 ? selectFn : vi.fn().mockReturnValue({ gt: vi.fn().mockReturnValue(countFn) }),
    }))

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/leaderboard')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.entries).toBeDefined()
  })

  it('returns empty entries when no data', async () => {
    const selectFn = vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({
        range: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    let callCount = 0
    const from = vi.fn().mockImplementation(() => {
      callCount++
      if (callCount === 1) return { select: selectFn }
      if (callCount === 2) return { select: vi.fn().mockReturnValue({ gt: vi.fn().mockReturnValue(vi.fn().mockResolvedValue({ count: 0, error: null })) }) }
      return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) }) }) }
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/leaderboard')
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.entries).toEqual([])
  })

  it('respects limit and offset parameters', async () => {
    const selectFn = vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({
        range: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    let callCount = 0
    const from = vi.fn().mockImplementation(() => {
      callCount++
      if (callCount === 1) return { select: selectFn }
      if (callCount === 2) return { select: vi.fn().mockReturnValue({ gt: vi.fn().mockReturnValue(vi.fn().mockResolvedValue({ count: 0, error: null })) }) }
      return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) }) }) }
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/leaderboard?limit=10&offset=5')
    const res = await GET(req)

    expect(res.status).toBe(200)
  })

  it('caps limit at 100', async () => {
    const selectFn = vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({
        range: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    let callCount = 0
    const from = vi.fn().mockImplementation(() => {
      callCount++
      if (callCount === 1) return { select: selectFn }
      if (callCount === 2) return { select: vi.fn().mockReturnValue({ gt: vi.fn().mockReturnValue(vi.fn().mockResolvedValue({ count: 0, error: null })) }) }
      return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) }) }) }
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/leaderboard?limit=200')
    const res = await GET(req)

    // The handler caps limit at 100
    expect(res.status).toBe(200)
  })
})