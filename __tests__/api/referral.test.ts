import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/referral/route'
import * as supabaseModule from '@/lib/supabase'
import { createNextRequest } from '../helpers/request'
import { VALID_WALLET, VALID_WALLET_2, REFERRAL_CODE, mockProfile, mockReferral } from '../helpers/fixtures'

function buildChain(responses: Record<string, unknown> = {}) {
  const calls: Record<string, unknown[][]> = {}
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}

  const thenResult = responses.then ?? { data: responses.data ?? null, error: responses.error ?? null }

  const proxy = new Proxy(chain, {
    get(_, method: string) {
      if (method === 'then') {
        return vi.fn().mockResolvedValue(thenResult)
      }
      if (method === 'catch') return vi.fn().mockResolvedValue(undefined)
      if (method === 'finally') return vi.fn().mockResolvedValue(undefined)
      if (!chain[method]) {
        chain[method] = vi.fn().mockReturnValue(proxy)
      }
      return chain[method]
    },
  })

  const from = vi.fn().mockReturnValue(proxy)
  return { from, chain, proxy }
}

describe('GET /api/referral', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns referral code and stats for valid wallet', async () => {
    const { from, chain } = buildChain({
      data: { ...mockProfile, referral_code: REFERRAL_CODE, referred_by: null },
      error: null,
    })

    chain.maybeSingle = vi.fn().mockResolvedValue({
      data: { ...mockProfile, referral_code: REFERRAL_CODE, referred_by: null },
      error: null,
    })

    const referralData = [{ ...mockReferral }]
    const referralSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            then: vi.fn().mockResolvedValue({ data: referralData, error: null }),
            catch: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      }),
    })

    const selectProfile = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({
          data: { ...mockProfile, referral_code: REFERRAL_CODE, referred_by: null },
          error: null,
        }),
      }),
    })

    const fromFn = vi.fn().mockImplementation((table: string) => {
      if (table === 'profiles') return { select: selectProfile }
      if (table === 'referrals') return { select: referralSelect }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: fromFn } as any)

    const req = createNextRequest(`/api/referral?walletAddress=${VALID_WALLET}`)
    const res = await GET(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.referralCode).toBe(REFERRAL_CODE)
    expect(json).toHaveProperty('referralCount')
    expect(json).toHaveProperty('totalRewardPoints')
  })

  it('returns 400 when walletAddress is missing', async () => {
    const req = createNextRequest('/api/referral')
    const res = await GET(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid wallet address', async () => {
    const req = createNextRequest('/api/referral?walletAddress=invalid')
    const res = await GET(req)

    expect(res.status).toBe(400)
  })

  it('creates profile for new user', async () => {
    const insertResult = {
      referral_code: 'AUTOGEN',
      referred_by: null,
    }

    const selectProfile = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    })

    const insertProfile = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: insertResult, error: null }),
      }),
    })

    const referralSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          then: vi.fn().mockResolvedValue({ data: [], error: null }),
          catch: vi.fn().mockResolvedValue(undefined),
        }),
      }),
    })

    const fromFn = vi.fn().mockImplementation((table: string) => {
      if (table === 'profiles') return { select: selectProfile, insert: insertProfile }
      if (table === 'referrals') return { select: referralSelect }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: fromFn } as any)

    const req = createNextRequest(`/api/referral?walletAddress=${VALID_WALLET}`)
    const res = await GET(req)

    expect(res.status).toBe(200)
  })
})

describe('POST /api/referral', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('redeems a valid referral code', async () => {
    const referrerProfile = { wallet_address: VALID_WALLET_2.toLowerCase(), referral_code: REFERRAL_CODE }

    const selectProfile = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: { referred_by: null }, error: null }),
      }),
    })

    const selectReferrer = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: referrerProfile, error: null }),
      }),
    })

    const insertReferral = vi.fn().mockReturnValue({
      then: vi.fn().mockResolvedValue({ error: null }),
      catch: vi.fn().mockResolvedValue(undefined),
    })

    const updateProfile = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        then: vi.fn().mockResolvedValue({ error: null }),
        catch: vi.fn().mockResolvedValue(undefined),
      }),
    })

    const fromFn = vi.fn().mockImplementation((table: string) => {
      if (table === 'profiles') return { select: selectProfile, update: updateProfile }
      if (table === 'referrals') return { select: selectReferrer, insert: insertReferral }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: fromFn } as any)

    const req = createNextRequest('/api/referral', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, referralCode: REFERRAL_CODE },
    })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.rewardPoints).toBe(25)
    expect(json.referrerRewardPoints).toBe(50)
  })

  it('returns 404 for invalid referral code', async () => {
    const selectReferrer = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    })

    const fromFn = vi.fn().mockImplementation(() => ({ select: selectReferrer }))

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: fromFn } as any)

    const req = createNextRequest('/api/referral', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, referralCode: 'INVALID' },
    })
    const res = await POST(req)

    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toContain('Invalid referral code')
  })

  it('rejects self-referral', async () => {
    const selectReferrer = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({
          data: { wallet_address: VALID_WALLET.toLowerCase(), referral_code: REFERRAL_CODE },
          error: null,
        }),
      }),
    })

    const fromFn = vi.fn().mockImplementation(() => ({ select: selectReferrer }))
    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: fromFn } as any)

    const req = createNextRequest('/api/referral', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, referralCode: REFERRAL_CODE },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('own referral')
  })

  it('rejects already-referred user', async () => {
    const referrerProfile = { wallet_address: VALID_WALLET_2.toLowerCase(), referral_code: REFERRAL_CODE }

    const selectReferrer = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: referrerProfile, error: null }),
      }),
    })

    const selectProfile = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({
          data: { referred_by: VALID_WALLET_2.toLowerCase() },
          error: null,
        }),
      }),
    })

    const fromFn = vi.fn().mockImplementation((table: string) => {
      if (table === 'profiles') return { select: selectProfile }
      if (table === 'referrals') return { select: selectReferrer }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: fromFn } as any)

    const req = createNextRequest('/api/referral', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, referralCode: REFERRAL_CODE },
    })
    const res = await POST(req)

    expect(res.status).toBe(409)
    const json = await res.json()
    expect(json.error).toContain('Already redeemed')
  })

  it('returns 400 for missing walletAddress', async () => {
    const req = createNextRequest('/api/referral', {
      method: 'POST',
      body: { referralCode: REFERRAL_CODE },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for missing referralCode', async () => {
    const req = createNextRequest('/api/referral', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('handles duplicate referral insert gracefully', async () => {
    const referrerProfile = { wallet_address: VALID_WALLET_2.toLowerCase(), referral_code: REFERRAL_CODE }

    const selectReferrer = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: referrerProfile, error: null }),
      }),
    })

    const selectProfile = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: { referred_by: null }, error: null }),
      }),
    })

    const insertReferral = vi.fn().mockReturnValue({
      then: vi.fn().mockResolvedValue({ error: { code: '23505', message: 'duplicate key' } }),
    })

    const fromFn = vi.fn().mockImplementation((table: string) => {
      if (table === 'profiles') return { select: selectProfile }
      if (table === 'referrals') return { select: selectReferrer, insert: insertReferral }
      return {}
    })

    vi.spyOn(supabaseModule, 'getServiceSupabase').mockReturnValue({ from: fromFn } as any)

    const req = createNextRequest('/api/referral', {
      method: 'POST',
      body: { walletAddress: VALID_WALLET, referralCode: REFERRAL_CODE },
    })
    const res = await POST(req)

    expect(res.status).toBe(409)
  })
})