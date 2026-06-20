import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase', () => ({
  getServiceSupabase: () => ({
    from: () => ({
      insert: () => ({
        select: () => ({
          single: () => ({
            data: { id: 'adv-1', wallet: '0xabc', company_name: 'Acme Corp' },
            error: null,
          }),
        }),
      }),
    }),
  }),
}))

describe('POST /api/advertiser/register', () => {
  it('creates advertiser with wallet and company name', async () => {
    const { POST } = await import('@/app/api/advertiser/register/route')
    const req = new Request('http://localhost/api/advertiser/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-wallet-address': '0xabc' },
      body: JSON.stringify({ company_name: 'Acme Corp' }),
    })
    const res = await POST(req as any)
    expect(res.status).toBe(201)
  })

  it('returns 401 without wallet header', async () => {
    const { POST } = await import('@/app/api/advertiser/register/route')
    const req = new Request('http://localhost/api/advertiser/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_name: 'Acme Corp' }),
    })
    const res = await POST(req as any)
    expect(res.status).toBe(401)
  })
})
