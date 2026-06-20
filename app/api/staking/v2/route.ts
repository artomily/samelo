import { NextRequest, NextResponse } from 'next/server'
import { getActivePositions, createStakingPosition } from '@/lib/staking-v2'
import type { StakingTierV2 } from '@/lib/types/staking-v2'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const positions = await getActivePositions(wallet)
  return NextResponse.json({ positions })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { amountMelo, tier, txHash } = await req.json()
  if (!amountMelo || !tier) {
    return NextResponse.json({ error: 'amountMelo and tier required' }, { status: 400 })
  }

  try {
    const position = await createStakingPosition(wallet, amountMelo, tier as StakingTierV2, txHash)
    return NextResponse.json({ position }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Stake failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
