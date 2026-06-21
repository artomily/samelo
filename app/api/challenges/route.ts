import { NextRequest, NextResponse } from 'next/server'
import { getActiveChallenges, incrementChallengeProgress, claimChallengeReward } from '@/lib/user-challenges'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? undefined
  const challenges = await getActiveChallenges(wallet)
  return NextResponse.json({ challenges })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { action, challenge_id, by = 1 } = await req.json()
  if (!challenge_id) return NextResponse.json({ error: 'challenge_id required' }, { status: 400 })

  if (action === 'claim') {
    const rewardMelo = await claimChallengeReward(wallet, challenge_id)
    return NextResponse.json({ reward_melo: rewardMelo })
  }

  const progress = await incrementChallengeProgress(wallet, challenge_id, by)
  return NextResponse.json({ progress })
}
