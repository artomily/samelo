import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/watch/history/route'
import * as supabaseModule from '@/lib/supabase'
import { createNextRequest } from '../../helpers/request'
import { VALID_WALLET, INVALID_WALLET, VIDEO_ID } from '../../helpers/fixtures'

function createMockFrom(data: unknown) {
  const rows = data
  const selectFn = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      then: vi.fn().mockImplementation((resolve?: (v: unknown) => unknown) =>
        resolve ? Promise.resolve(resolve({ data: rows, error: null })) : Promise.resolve({ data: rows, error: null }),
      ),
      catch: vi.fn().mockResolvedValue(undefined),
      finally: vi.fn().mockResolvedValue(undefined),
    }),
  })
  return { from: vi.fn().mockReturnValue({ select: selectFn }) }
}

describe('GET /api/watch/history', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns watched video IDs for a valid wallet', async () => {
    const mockData = [
      { video_id: VIDEO_ID },
      { video_id: 'anotherVideo123' },
    ]
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue(
      createMockFrom(mockData) as any,
    )

    const req = createNextRequest(`/api/watch/history?walletAddress=${VALID_WALLET}`)
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.videoIds).toContain(VIDEO_ID)
    expect(json.videoIds).toContain('anotherVideo123')
  })

  it('returns empty array when no watches exist', async () => {
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue(
      createMockFrom([]) as any,
    )

    const req = createNextRequest(`/api/watch/history?walletAddress=${VALID_WALLET}`)
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.videoIds).toEqual([])
  })

  it('returns 400 when walletAddress is missing', async () => {
    const req = createNextRequest('/api/watch/history')
    const res = await GET(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid')
  })

  it('returns 400 for invalid wallet format', async () => {
    const req = createNextRequest(`/api/watch/history?walletAddress=${INVALID_WALLET}`)
    const res = await GET(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for empty walletAddress', async () => {
    const req = createNextRequest('/api/watch/history?walletAddress=')
    const res = await GET(req)

    expect(res.status).toBe(400)
  })
})