import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/videos/route'
import * as supabaseModule from '@/lib/supabase'
import { mockVideo } from '../helpers/fixtures'

function buildSupabaseChain(data: unknown, error: unknown = null) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}
  const thenable = {
    select: vi.fn().mockImplementation(() => chain),
    from: vi.fn().mockReturnValue(chain),
    eq: vi.fn().mockReturnValue(chain),
    order: vi.fn().mockReturnValue(chain),
    limit: vi.fn().mockReturnValue(chain),
    then: vi.fn().mockImplementation((resolve?: (v: unknown) => unknown) =>
      resolve ? Promise.resolve(resolve({ data, error })) : Promise.resolve({ data, error }),
    ),
    catch: vi.fn().mockResolvedValue(undefined),
    finally: vi.fn().mockResolvedValue(undefined),
  }
  Object.assign(chain, thenable)
  chain.select = vi.fn().mockReturnValue(chain)
  chain.from = vi.fn().mockReturnValue(chain)
  chain.eq = vi.fn().mockReturnValue(chain)
  chain.order = vi.fn().mockReturnValue(chain)
  chain.limit = vi.fn().mockReturnValue(chain)
  chain.then = thenable.then
  chain.catch = thenable.catch
  chain.finally = thenable.finally
  return chain
}

describe('GET /api/videos', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a list of active videos', async () => {
    const mockData = [
      { id: 'abc123', title: 'Video 1', thumbnail_url: 'https://example.com/thumb1.jpg', channel_title: 'Channel 1', duration_seconds: 120, reward_cents: 5, fetched_at: '2026-01-01T00:00:00Z' },
      { id: 'def456', title: 'Video 2', thumbnail_url: 'https://example.com/thumb2.jpg', channel_title: 'Channel 2', duration_seconds: 300, reward_cents: 10, fetched_at: '2026-01-02T00:00:00Z' },
    ]
    const chain = buildSupabaseChain(mockData)
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: chain.from,
    } as any)

    const res = await GET()
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.videos).toHaveLength(2)
    expect(json.videos[0]).toMatchObject({
      id: 'abc123',
      title: 'Video 1',
      sponsor: 'Channel 1',
      rewardPoints: 5,
    })
  })

  it('returns empty array when no videos exist', async () => {
    const chain = buildSupabaseChain([])
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: chain.from,
    } as any)

    const res = await GET()
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.videos).toEqual([])
  })

  it('returns 500 when supabase returns an error', async () => {
    const chain = buildSupabaseChain(null, { message: 'DB error', code: '500' })
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: chain.from,
    } as any)

    const res = await GET()
    expect(res.status).toBe(500)
  })

  it('filters inactive videos via supabase eq filter', async () => {
    const chain = buildSupabaseChain([])
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: chain.from,
    } as any)

    await GET()
    expect(chain.eq).toHaveBeenCalledWith('active', true)
  })

  it('maps video fields correctly', async () => {
    const chain = buildSupabaseChain([{
      ...mockVideo,
      fetched_at: '2026-01-01T00:00:00Z',
    }])
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: chain.from,
    } as any)

    const res = await GET()
    const json = await res.json()

    expect(json.videos[0].id).toBe(mockVideo.id)
    expect(json.videos[0].title).toBe(mockVideo.title)
    expect(json.videos[0].videoUrl).toContain(mockVideo.id)
    expect(json.videos[0].rewardPoints).toBe(mockVideo.reward_cents)
  })

  it('handles null thumbnail_url with fallback', async () => {
    const chain = buildSupabaseChain([{
      id: 'abc123',
      title: 'Video',
      thumbnail_url: null,
      channel_title: 'Channel',
      duration_seconds: 120,
      reward_cents: 5,
      fetched_at: '2026-01-01T00:00:00Z',
    }])
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: chain.from,
    } as any)

    const res = await GET()
    const json = await res.json()

    expect(json.videos[0].thumbnailUrl).toContain('ytimg.com')
  })

  it('limits results to 50 videos', async () => {
    const chain = buildSupabaseChain([])
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: chain.from,
    } as any)

    await GET()
    expect(chain.limit).toHaveBeenCalledWith(50)
  })

  it('uses default sponsor when channel_title is null', async () => {
    const chain = buildSupabaseChain([{
      id: 'abc123',
      title: 'V',
      thumbnail_url: 'https://example.com/thumb.jpg',
      channel_title: null,
      duration_seconds: 60,
      reward_cents: 3,
      fetched_at: '2026-01-01T00:00:00Z',
    }])
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({
      from: chain.from,
    } as any)

    const res = await GET()
    const json = await res.json()

    expect(json.videos[0].sponsor).toBe('YouTube')
  })

  it('includes durationSeconds in each video object', async () => {
    const chain = buildSupabaseChain([{
      id: 'abc123',
      title: 'Video',
      thumbnail_url: 'https://example.com/t.jpg',
      channel_title: 'Ch',
      duration_seconds: 240,
      reward_cents: 5,
      fetched_at: '2026-01-01T00:00:00Z',
    }])
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: chain.from } as any)

    const res = await GET()
    const json = await res.json()

    expect(json.videos[0].durationSeconds).toBe(240)
  })

  it('videoUrl uses youtube embed format with rel=0', async () => {
    const chain = buildSupabaseChain([{
      id: 'testVideoId',
      title: 'Video',
      thumbnail_url: null,
      channel_title: 'Ch',
      duration_seconds: 60,
      reward_cents: 5,
      fetched_at: '2026-01-01T00:00:00Z',
    }])
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: chain.from } as any)

    const res = await GET()
    const json = await res.json()

    expect(json.videos[0].videoUrl).toContain('youtube.com/embed/testVideoId')
    expect(json.videos[0].videoUrl).toContain('rel=0')
  })
})