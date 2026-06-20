import { NextRequest, NextResponse } from 'next/server'
import { queueReward, getWalletRewardQueue } from '@/lib/onchain-rewards-v2'
import type { OnchainRewardType } from '@/lib/types/onchain-rewards-v2'

const VALID_TYPES: OnchainRewardType[] = ['watch_milestone', 'streak_bonus', 'quiz_perfect', 'referral_bonus', 'level_up_bonus']

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  const rewards = await getWalletRewardQueue(wallet)
  return NextResponse.json({ rewards })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { reward_type, amount_melo, reference_id } = await req.json()
  if (!VALID_TYPES.includes(reward_type)) {
    return NextResponse.json({ error: 'Invalid reward_type' }, { status: 400 })
  }
  if (!amount_melo || amount_melo <= 0) {
    return NextResponse.json({ error: 'amount_melo must be positive' }, { status: 400 })
  }

  const reward = await queueReward(wallet, reward_type, amount_melo, reference_id)
  return NextResponse.json({ reward }, { status: 201 })
}
