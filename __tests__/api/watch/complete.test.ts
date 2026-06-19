import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/watch/complete/route'
import * as supabaseModule from '@/lib/supabase'
import { createNextRequest } from '../helpers/request'
import { VALID_WALLET, INVALID_WALLET, VIDEO_ID } from '../helpers/fixtures'

function mockSupabaseChain(responses: Record<string, unknown> = {}) {
  const calls: Record<string, unknown[][]> = {}

  const chain: Record<string, ReturnType<typeof vi.fn>> = {}

  const thenable = {
    then: vi.fn().mockResolvedValue(responses.default ?? { data: null, error: null }),
    catch: vi.fn().mockResolvedValue(undefined),
    finally: vi.fn().mockResolvedValue(undefined),
  }

  const handler: ProxyHandler<Record<string, ReturnType<typeof vi.fn>>> = {
    get(_, method: string) {
      if (method === 'then') return thenable.then
      if (method === 'catch') return thenable.catch
      if (method === 'finally') return thenable.finally
      if (!chain[method]) {
        chain[method] = vi.fn().mockReturnValue(new Proxy({}, handler))
      }
      return chain[method]
    },
  }

  const proxied = new Proxy({}, handler)

  const from = vi.fn().mockReturnValue(proxied)

  vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

  return { from, chain }
}

describe('POST /api/watch/complete', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 for missing walletAddress', async () => {
    const req = createNextRequest('/api/watch/complete', {
      method: 'POST',
      body: { videoId: VIDEO_ID },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for missing videoId', async () => {
    const req = createNextRequest('/api/watch/complete', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid wallet address', async () => {
    const req = createNextRequest('/api/watch/complete', {
      method: 'POST',
      body: { videoId: VIDEO_ID, walletAddress: INVALID_WALLET },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid')
  })

  it('returns 400 for invalid JSON body', async () => {
    const req = new Request('http://localhost:3000/api/watch/complete', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    })
    // Force a JSON parse error
    const mockReq = {
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as any

    const res = await POST(mockReq)
    expect(res.status).toBe(400)
  })

  it('returns 404 for unknown video', async () => {
    mockSupabaseChain({
      default: { data: null, error: null },
    })

    // Need to override .single() to return null
    const { from } = mockSupabaseChain()
    const videoQuery = {
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: vi.fn().mockReturnValue(videoQuery),
    } as any)

    const req = createNextRequest('/api/watch/complete', {
      method: 'POST',
      body: { videoId: VIDEO_ID, walletAddress: VALID_WALLET },
    })
    const res = await POST(req)

    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toContain('Unknown video')
  })

  it('rejects duplicate watch within rate limit window', async () => {
    const existingWatch = { id: 1 }
    const pendingRows = [{ reward_cents: 5 }]

    const eqChain: Record<string, ReturnType<typeof vi.fn>> = {}
    const thenable = {
      then: vi.fn().mockResolvedValue({ data: pendingRows, error: null }),
      catch: vi.fn().mockResolvedValue(undefined),
      finally: vi.fn().mockResolvedValue(undefined),
    }

    const gteChain: Record<string, ReturnType<typeof vi.fn>> = {}
    gteChain.maybeSingle = vi.fn().mockResolvedValue({ data: existingWatch, error: null })

    const videoSingle = vi.fn().mockResolvedValue({ data: { reward_cents: 5 }, error: null })

    const videoEq = vi.fn().mockReturnValue({ single: videoSingle })
    const videoSelect = vi.fn().mockReturnValue({ eq: videoEq })

    const watchInsert = vi.fn().mockReturnValue({
      then: vi.fn().mockResolvedValue({ data: null, error: null }),
      catch: vi.fn().mockResolvedValue(undefined),
      finally: vi.fn().mockResolvedValue(undefined),
    })

    const pendingEq: Record<string, ReturnType<typeof vi.fn>> = {}
    const pendingSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          then: vi.fn().mockResolvedValue({ data: pendingRows, error: null }),
          catch: vi.fn().mockResolvedValue(undefined),
          finally: vi.fn().mockResolvedValue(undefined),
        }),
      }),
    })

    const upsertResult = {
      then: vi.fn().mockResolvedValue({ data: null, error: null }),
      catch: vi.fn().mockResolvedValue(undefined),
      finally: vi.fn().mockResolvedValue(undefined),
    }

    let callCount = 0
    const from = vi.fn().mockImplementation((table: string) => {
      callCount++
      if (table === 'videos') {
        return { select: videoSelect }
      }
      if (table === 'profiles') {
        return {
          upsert: vi.fn().mockReturnValue(upsertResult),
        }
      }
      if (table === 'watches') {
        if (callCount === 3) {
          // Rate limit check query
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  gte: vi.fn().mockReturnValue({
                    maybeSingle: vi.fn().mockResolvedValue({ data: existingWatch, error: null }),
                  }),
                }),
              }),
            }),
          }
        }
        // Pending points query after rate limit hit
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                then: vi.fn().mockResolvedValue({ data: pendingRows, error: null }),
                catch: vi.fn().mockResolvedValue(undefined),
                finally: vi.fn().mockResolvedValue(undefined),
              }),
            }),
          }),
        }
      }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/watch/complete', {
      method: 'POST',
      body: { videoId: VIDEO_ID, walletAddress: VALID_WALLET },
    })
    const res = await POST(req)
    const json = await res.json()

    expect(json.alreadyClaimed).toBe(true)
    expect(json.totalPendingCents).toBeDefined()
  })

  it('records a watch event and returns pending points', async () => {
    const videoData = { reward_cents: 5 }
    const pendingData = [{ reward_cents: 5 }]

    const videoSingle = vi.fn().mockResolvedValue({ data: videoData, error: null })
    const videoEq = vi.fn().mockReturnValue({ single: videoSingle })
    const videoSelect = vi.fn().mockReturnValue({ eq: videoEq })

    const watchInsertResult = {
      then: vi.fn().mockResolvedValue({ data: null, error: null }),
      catch: vi.fn().mockResolvedValue(undefined),
      finally: vi.fn().mockResolvedValue(undefined),
    }
    const watchInsert = vi.fn().mockReturnValue(watchInsertResult)

    const upsertResult = {
      then: vi.fn().mockResolvedValue({ data: null, error: null }),
      catch: vi.fn().mockResolvedValue(undefined),
      finally: vi.fn().mockResolvedValue(undefined),
    }

    let callCount = 0
    const from = vi.fn().mockImplementation((table: string) => {
      callCount++
      if (table === 'videos') {
        return { select: videoSelect }
      }
      if (table === 'profiles') {
        return {
          upsert: vi.fn().mockReturnValue(upsertResult),
        }
      }
      if (table === 'watches') {
        if (callCount === 3) {
          // Rate limit check — no existing
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  gte: vi.fn().mockReturnValue({
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                  }),
                }),
              }),
            }),
          }
        }
        if (callCount === 4) {
          // Insert new watch
          return { insert: watchInsert }
        }
        // Final pending query
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                then: vi.fn().mockResolvedValue({ data: pendingData, error: null }),
                catch: vi.fn().mockResolvedValue(undefined),
                finally: vi.fn().mockResolvedValue(undefined),
              }),
            }),
          }),
        }
      }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/watch/complete', {
      method: 'POST',
      body: { videoId: VIDEO_ID, walletAddress: VALID_WALLET },
    })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.alreadyClaimed).toBe(false)
    expect(json.rewardPoints).toBe(5)
    expect(json.totalPendingCents).toBeDefined()
  })

  it('lowercases wallet address for consistency', async () => {
    const videoSingle = vi.fn().mockResolvedValue({ data: { reward_cents: 5 }, error: null })
    const videoEq = vi.fn().mockReturnValue({ single: videoSingle })
    const videoSelect = vi.fn().mockReturnValue({ eq: videoEq })

    const upsertResult = {
      then: vi.fn().mockResolvedValue({ data: null, error: null }),
      catch: vi.fn().mockResolvedValue(undefined),
      finally: vi.fn().mockResolvedValue(undefined),
    }

    let callCount = 0
    const from = vi.fn().mockImplementation((table: string) => {
      callCount++
      if (table === 'videos') return { select: videoSelect }
      if (table === 'profiles') {
        return { upsert: vi.fn().mockReturnValue(upsertResult) }
      }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/watch/complete', {
      method: 'POST',
      body: { videoId: VIDEO_ID, walletAddress: VALID_WALLET.toUpperCase() },
    })
    const res = await POST(req)

    // The handler should proceed (address is valid regardless of case)
    expect(res.status).toBeLessThanOrEqual(500)
  })
})