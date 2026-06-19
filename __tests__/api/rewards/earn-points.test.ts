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
})
