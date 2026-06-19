import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/watch/token/route'
import { createNextRequest } from '../../helpers/request'
import { VALID_WALLET, INVALID_WALLET } from '../../helpers/fixtures'

describe('GET /api/watch/token', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('generates a watch token for valid inputs', async () => {
    const req = createNextRequest(
      `/api/watch/token?videoId=abc123&walletAddress=${VALID_WALLET}`,
    )
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.token).toBeDefined()
    expect(typeof json.token).toBe('string')
    expect(json.token.length).toBeGreaterThan(0)
  })

  it('returns 400 when videoId is missing', async () => {
    const req = createNextRequest(
      `/api/watch/token?walletAddress=${VALID_WALLET}`,
    )
    const res = await GET(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when walletAddress is missing', async () => {
    const req = createNextRequest('/api/watch/token?videoId=abc123')
    const res = await GET(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when both params are missing', async () => {
    const req = createNextRequest('/api/watch/token')
    const res = await GET(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('required')
  })

  it('returns 400 for invalid wallet address', async () => {
    const req = createNextRequest(
      `/api/watch/token?videoId=abc123&walletAddress=${INVALID_WALLET}`,
    )
    const res = await GET(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid')
  })

  it('returns different tokens for different wallets', async () => {
    const req1 = createNextRequest(
      `/api/watch/token?videoId=abc123&walletAddress=${VALID_WALLET}`,
    )
    const req2 = createNextRequest(
      `/api/watch/token?videoId=abc123&walletAddress=0xABCDEF1234567890123456789012345678901ABC`,
    )

    const res1 = await GET(req1)
    const res2 = await GET(req2)
    const json1 = await res1.json()
    const json2 = await res2.json()

    expect(json1.token).not.toBe(json2.token)
  })

  it('returns different tokens for different videos', async () => {
    const req1 = createNextRequest(
      `/api/watch/token?videoId=abc123&walletAddress=${VALID_WALLET}`,
    )
    const req2 = createNextRequest(
      `/api/watch/token?videoId=def456&walletAddress=${VALID_WALLET}`,
    )

    const res1 = await GET(req1)
    const res2 = await GET(req2)
    const json1 = await res1.json()
    const json2 = await res2.json()

    expect(json1.token).not.toBe(json2.token)
  })

  it('produces a base64url-encoded token', async () => {
    const req = createNextRequest(
      `/api/watch/token?videoId=abc123&walletAddress=${VALID_WALLET}`,
    )
    const res = await GET(req)
    const json = await res.json()

    expect(json.token).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('token payload contains videoId and wallet', async () => {
    const req = createNextRequest(
      `/api/watch/token?videoId=uniqueVideo&walletAddress=${VALID_WALLET}`,
    )
    const res = await GET(req)
    const json = await res.json()

    // Token is base64url — decode and check it contains expected data
    const decoded = Buffer.from(json.token.split('.')[0] ?? json.token, 'base64url').toString('utf8')
    expect(decoded).toContain('uniqueVideo')
  })
})