import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('walletAddress')

  if (!wallet || !isAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 })
  }

  const supabase = getServiceSupabase()
  const addr = wallet.toLowerCase()

  const { data: referrals, error } = await supabase
    .from('referrals')
    .select('referred_wallet, reward_points, created_at')
    .eq('referrer_wallet', addr)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const totalReferrals = referrals?.length ?? 0
  const totalRewardPoints = (referrals ?? []).reduce((s, r) => s + (r.reward_points ?? 0), 0)

  return NextResponse.json({
    totalReferrals,
    totalRewardPoints,
    referrals: (referrals ?? []).map((r) => ({
      referred_wallet: r.referred_wallet,
      reward_points: r.reward_points,
      created_at: r.created_at,
    })),
  })
}
