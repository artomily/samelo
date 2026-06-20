import { NextRequest, NextResponse } from 'next/server'
import { getWalletRewards } from '@/lib/leaderboard-rewards'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const rewards = await getWalletRewards(wallet)
  const totalUnclaimed = rewards
    .filter((r) => r.claimed_at === null)
    .reduce((sum, r) => sum + r.melo_amount, 0)
  return NextResponse.json({ rewards, totalUnclaimed })
}
