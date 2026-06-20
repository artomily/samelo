import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase', () => ({
  getServiceSupabase: () => ({
    from: (table: string) => ({
      select: () => ({
        ilike: () => ({
          eq: () => ({
            limit: () => ({
              data: table === 'videos'
                ? [{ id: 'v1', title: 'Celo Basics' }]
                : [{ wallet: '0xabc', display_name: 'Celo Fan' }],
              error: null,
            }),
          }),
          limit: () => ({
            data: [{ wallet: '0xabc', display_name: 'Celo Fan' }],
            error: null,
          }),
        }),
      }),
    }),
  }),
}))

describe('GET /api/v1/search', () => {
  it('returns 400 for short query', async () => {
    const { GET } = await import('@/app/api/v1/search/route')
    const req = new Request('http://localhost/api/v1/search?q=a')
    const res = await GET(req as any)
    expect(res.status).toBe(400)
  })

  it('returns videos and profiles for valid query', async () => {
    const { GET } = await import('@/app/api/v1/search/route')
    const req = new Request('http://localhost/api/v1/search?q=celo')
    const res = await GET(req as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('videos')
    expect(body).toHaveProperty('profiles')
  })
})
