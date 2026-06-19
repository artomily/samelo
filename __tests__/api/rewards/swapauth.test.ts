import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/rewards/swapauth/route'
import { createNextRequest } from '../../helpers/request'
import { VALID_WALLET, INVALID_WALLET } from '../../helpers/fixtures'

describe('POST /api/rewards/swapauth', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when walletAddress is missing', async () => {
    const req = createNextRequest('/api/rewards/swapauth', {
      method: 'POST',
      body: { pointAmount: 500 },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid wallet address', async () => {
    const req = createNextRequest('/api/rewards/swapauth', {
      method: 'POST',
      body: { walletAddress: INVALID_WALLET, pointAmount: 500 },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when pointAmount is not a positive integer', async () => {
    const req = createNextRequest('/api/rewards/swapauth', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, pointAmount: -10 },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('pointAmount')
  })

  it('returns 503 when oracle key is not configured', async () => {
    const original = process.env.REWARD_ORACLE_PRIVATE_KEY
    delete process.env.REWARD_ORACLE_PRIVATE_KEY

    const req = createNextRequest('/api/rewards/swapauth', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, pointAmount: 500 },
    })
    const res = await POST(req)

    process.env.REWARD_ORACLE_PRIVATE_KEY = original
    expect(res.status).toBe(503)
  })
})
