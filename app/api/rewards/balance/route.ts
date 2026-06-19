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

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_points, total_earned_cents')
    .eq('wallet_address', addr)
    .maybeSingle()

  const { data: unclaimed } = await supabase
    .from('watches')
    .select('points')
    .eq('wallet_address', addr)
    .eq('claimed', false)

  const unclaimedPoints = (unclaimed ?? []).reduce((s, r) => s + (r.points ?? 0), 0)

  return NextResponse.json({
    totalPoints: profile?.total_points ?? 0,
    totalEarnedCents: profile?.total_earned_cents ?? 0,
    unclaimedPoints,
  })
}
