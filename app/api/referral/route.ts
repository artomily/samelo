import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

/**
 * GET /api/referral?walletAddress=0x...
 * Returns the user's referral code, count of successful referrals, and total reward points earned.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const walletAddress = searchParams.get('walletAddress')

  if (!walletAddress || !isAddress(walletAddress)) {
    return NextResponse.json({ error: 'Valid walletAddress is required' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    const addr = walletAddress.toLowerCase()

    // Upsert profile to ensure referral code exists
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('referral_code, referred_by')
      .eq('wallet_address', addr)
      .maybeSingle()

    if (profileErr) throw profileErr

    if (!profile) {
      // Create profile with auto-generated referral code
      const { data: newProfile, error: createErr } = await supabase
        .from('profiles')
        .insert({ wallet_address: addr })
        .select('referral_code, referred_by')
        .single()

      if (createErr) throw createErr

      return NextResponse.json({
        referralCode: newProfile.referral_code,
        referredBy: newProfile.referred_by,
        referralCount: 0,
        totalRewardPoints: 0,
        referrals: [],
      })
    }

    // Get referral stats
    const { data: referrals, error: refErr } = await supabase
      .from('referrals')
      .select('referred_wallet, reward_points, created_at')
      .eq('referrer_wallet', addr)
      .order('created_at', { ascending: false })

    if (refErr) throw refErr

    const totalRewardPoints = (referrals ?? []).reduce((s, r) => s + (r.reward_points ?? 0), 0)

    return NextResponse.json({
      referralCode: profile.referral_code,
      referredBy: profile.referred_by,
      referralCount: (referrals ?? []).length,
      totalRewardPoints,
      referrals: referrals ?? [],
    })
  } catch (err) {
    console.error('[/api/referral GET]', err)
    return NextResponse.json({ error: 'Failed to fetch referral data' }, { status: 500 })
  }
}

/**
 * POST /api/referral
 * Body: { walletAddress, referralCode }
 * Applies a referral code to the user (one-time only).
 */
export async function POST(request: NextRequest) {
  try {
    const { walletAddress, referralCode } = await request.json() as {
      walletAddress?: string
      referralCode?: string
    }

    if (!walletAddress || !isAddress(walletAddress)) {
      return NextResponse.json({ error: 'Valid walletAddress is required' }, { status: 400 })
    }

    if (!referralCode || typeof referralCode !== 'string' || referralCode.trim().length === 0) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    const addr = walletAddress.toLowerCase()
    const code = referralCode.trim().toUpperCase()

    // Find referrer by code
    const { data: referrer, error: refErr } = await supabase
      .from('profiles')
      .select('wallet_address, referral_code')
      .eq('referral_code', code)
      .maybeSingle()

    if (refErr) throw refErr

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    // Cannot refer yourself
    if (referrer.wallet_address === addr) {
      return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 })
    }

    // Upsert the referred user's profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('referred_by, referral_code')
      .eq('wallet_address', addr)
      .maybeSingle()

    if (profileErr) throw profileErr

    if (!profile) {
      await supabase.from('profiles').insert({ wallet_address: addr })
    }

    // Check if already referred
    if (profile?.referred_by) {
      return NextResponse.json(
        { error: 'Already redeemed a referral code', alreadyReferred: true },
        { status: 409 },
      )
    }

    // Record referral (referrer earns 50, referred earns 25)
    const { error: insertErr } = await supabase
      .from('referrals')
      .insert({
        referrer_wallet: referrer.wallet_address,
        referred_wallet: addr,
        code_used: code,
        reward_points: 50,
      })

    if (insertErr) {
      if (insertErr.code === '23505') {
        return NextResponse.json(
          { error: 'Already redeemed a referral code', alreadyReferred: true },
          { status: 409 },
        )
      }
      throw insertErr
    }

    // Update referred_by on profile (trigger awards 25 bonus pts to referred user,
    // and 50 pts to referrer via existing award_referral_points trigger)
    await supabase
      .from('profiles')
      .update({ referred_by: referrer.wallet_address })
      .eq('wallet_address', addr)

    return NextResponse.json({
      success: true,
      rewardPoints: 25,
      referrerRewardPoints: 50,
      referrerWallet: referrer.wallet_address,
    })
  } catch (err) {
    console.error('[/api/referral POST]', err)
    return NextResponse.json({ error: 'Failed to redeem referral code' }, { status: 500 })
  }
}
