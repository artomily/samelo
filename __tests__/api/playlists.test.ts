import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase', () => ({
  getServiceSupabase: () => ({
    from: () => ({
      select: () => ({
        order: () => ({ data: mockPlaylists, error: null }),
      }),
    }),
  }),
}))

const mockPlaylists = [
  { id: '1', slug: 'defi-basics', title: 'DeFi Basics', is_featured: false, sort_order: 0 },
  { id: '2', slug: 'celo-101', title: 'Celo 101', is_featured: true, sort_order: 1 },
]

describe('GET /api/playlists', () => {
  it('returns playlist list', async () => {
    const { GET } = await import('@/app/api/playlists/route')
    const req = new Request('http://localhost/api/playlists')
    const res = await GET(req as any)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.playlists).toHaveLength(2)
  })
})
