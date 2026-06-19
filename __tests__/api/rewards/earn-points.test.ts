import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/rewards/earn-points/route'
import * as supabaseModule from '@/lib/supabase'
import { createNextRequest } from '../../helpers/request'
import { VALID_WALLET, INVALID_WALLET } from '../../helpers/fixtures'

function makeChain(overrides: Record<string, unknown> = {}) {
  const result = { data: overrides.data ?? null, error: overrides.error ?? null, count: overrides.count ?? null }
  const thenable = {
    then: vi.fn().mockImplementation((resolve?: (v: unknown) => unknown) =>
      resolve ? Promise.resolve(resolve(result)) : Promise.resolve(result),
    ),
  }
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}
  const proxy = new Proxy(chain, {
    get(_, method: string) {
      if (method === 'then') return thenable.then
      if (!chain[method]) chain[method] = vi.fn().mockReturnValue(proxy)
      return chain[method]
    },
  })
  return { from: vi.fn().mockReturnValue(proxy), chain }
}

describe('POST /api/rewards/earn-points', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when walletAddress is missing', async () => {
    const req = createNextRequest('/api/rewards/earn-points', { method: 'POST', body: {} })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('walletAddress')
  })

  it('returns 400 for invalid wallet address format', async () => {
    const req = createNextRequest('/api/rewards/earn-points', {
      method: 'POST',
      body: { walletAddress: INVALID_WALLET },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid txHash format', async () => {
    const req = createNextRequest('/api/rewards/earn-points', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, txHash: 'not-a-valid-hash' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('txHash')
  })

  it('returns 429 when hourly rate limit is exceeded', async () => {
    // Count query returns 10 — at the limit
    const result = { data: null, error: null, count: 10 }
    const thenable = {
      then: vi.fn().mockImplementation((resolve?: (v: unknown) => unknown) =>
        resolve ? Promise.resolve(resolve(result)) : Promise.resolve(result),
      ),
    }
    const proxy = new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, {
      get(_, method: string) {
        if (method === 'then') return thenable.then
        return vi.fn().mockReturnValue(proxy)
      },
    })
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: vi.fn().mockReturnValue(proxy) } as any)

    const req = createNextRequest('/api/rewards/earn-points', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET },
    })
    const res = await POST(req)

    expect(res.status).toBe(429)
  })

  it('credits 10 points and returns total on success', async () => {
    let callCount = 0
    const from = vi.fn().mockImplementation(() => {
      callCount++
      const result = callCount === 1
        ? { data: null, error: null, count: 0 }  // rate limit check: 0 earns
        : { data: [{ points: 10 }], error: null } // final total query
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
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from } as any)

    const req = createNextRequest('/api/rewards/earn-points', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET },
    })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.points).toBe(10)
    expect(json.total).toBeDefined()
  })
})
