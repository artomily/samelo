import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase', () => ({
  getServiceSupabase: () => ({
    from: () => ({
      select: () => ({
        limit: () => ({ data: [{ wallet: '0x123' }], error: null }),
      }),
    }),
  }),
}))

describe('GET /api/v1/health', () => {
  it('returns ok status', async () => {
    const { GET } = await import('@/app/api/v1/health/route')
    const res = await GET()
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
  })

  it('includes timestamp', async () => {
    const { GET } = await import('@/app/api/v1/health/route')
    const res = await GET()
    const body = await res.json()
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}/)
  })

  it('includes dbLatencyMs as number', async () => {
    const { GET } = await import('@/app/api/v1/health/route')
    const res = await GET()
    const body = await res.json()
    expect(typeof body.dbLatencyMs).toBe('number')
  })
})
