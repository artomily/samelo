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
})
