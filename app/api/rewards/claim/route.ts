import { NextRequest, NextResponse } from 'next/server'
import { createClaimRequest, getWalletClaims, getTotalClaimable } from '@/lib/reward-claims'
import type { ClaimSource } from '@/lib/types/reward-claim'

const VALID_SOURCES: ClaimSource[] = ['leaderboard', 'referral', 'staking', 'mission', 'bonus']

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const [claims, totalClaimable] = await Promise.all([getWalletClaims(wallet), getTotalClaimable(wallet)])
  return NextResponse.json({ claims, totalClaimable })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { source, amount_melo, reference_id } = await req.json()
  if (!VALID_SOURCES.includes(source)) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
  }
  if (!amount_melo || typeof amount_melo !== 'number' || amount_melo <= 0) {
    return NextResponse.json({ error: 'amount_melo must be positive' }, { status: 400 })
  }

  const claim = await createClaimRequest(wallet, source, amount_melo, reference_id)
  return NextResponse.json({ claim }, { status: 201 })
}
