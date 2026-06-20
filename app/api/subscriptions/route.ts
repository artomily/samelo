import { NextRequest, NextResponse } from 'next/server'
import { getAllTiers, getActiveSubscription, createSubscription } from '@/lib/subscriptions'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const tiers = await getAllTiers()

  if (wallet && /^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    const active = await getActiveSubscription(wallet)
    return NextResponse.json({ tiers, active })
  }

  return NextResponse.json({ tiers, active: null })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { tier_id, period, tx_hash } = await req.json()
  if (!tier_id || !['monthly', 'yearly'].includes(period)) {
    return NextResponse.json({ error: 'tier_id and valid period required' }, { status: 400 })
  }

  const subscription = await createSubscription(wallet, tier_id, period, tx_hash)
  return NextResponse.json({ subscription }, { status: 201 })
}
