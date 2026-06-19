import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/earnings/history/route'
import * as supabaseModule from '@/lib/supabase'
import { createNextRequest } from '../../helpers/request'
import { VALID_WALLET, INVALID_WALLET } from '../../helpers/fixtures'

function makeFromWithResults(tables: Record<string, unknown[]>) {
  return vi.fn().mockImplementation((table: string) => {
    const data = tables[table] ?? []
    const result = { data, error: null }
    const proxy = new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, {
      get(_, method: string) {
        if (method === 'then') {
          return vi.fn().mockImplementation((resolve?: (v: unknown) => unknown) =>
            resolve ? Promise.resolve(resolve(result)) : Promise.resolve(result),
          )
        }
        return vi.fn().mockReturnValue(proxy)
      },
    })
    return proxy
  })
}

describe('GET /api/earnings/history', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when walletAddress is missing', async () => {
    const req = createNextRequest('/api/earnings/history')
    const res = await GET(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid wallet format', async () => {
    const req = createNextRequest(`/api/earnings/history?walletAddress=${INVALID_WALLET}`)
    const res = await GET(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid')
  })

  it('returns items, nextCursor, totalEarned, totalClaimed on success', async () => {
    const watchRows = [
      { id: 1, video_id: 'v1', points: 10, watched_at: '2026-01-01T12:00:00Z', claimed: false },
    ]
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: makeFromWithResults({ watches: watchRows, user_quiz_attempts: [] }),
    } as any)

    const req = createNextRequest(`/api/earnings/history?walletAddress=${VALID_WALLET}`)
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toHaveProperty('items')
    expect(json).toHaveProperty('nextCursor')
    expect(json).toHaveProperty('totalEarned')
    expect(json).toHaveProperty('totalClaimed')
  })

  it('returns empty items array when no watches exist', async () => {
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: makeFromWithResults({ watches: [], user_quiz_attempts: [] }),
    } as any)

    const req = createNextRequest(`/api/earnings/history?walletAddress=${VALID_WALLET}`)
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.items).toEqual([])
    expect(json.totalEarned).toBe(0)
  })
})
