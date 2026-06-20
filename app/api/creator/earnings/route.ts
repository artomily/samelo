import { NextRequest, NextResponse } from 'next/server'
import { getCreatorEarnings, requestPayout, getPayoutRequests } from '@/lib/creator-monetization'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const mode = req.nextUrl.searchParams.get('mode') ?? 'earnings'
  if (mode === 'payouts') {
    const payouts = await getPayoutRequests(wallet)
    return NextResponse.json({ payouts })
  }

  const result = await getCreatorEarnings(wallet)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { amount_melo } = await req.json()
  if (!amount_melo || amount_melo <= 0) {
    return NextResponse.json({ error: 'amount_melo must be positive' }, { status: 400 })
  }

  const payout = await requestPayout(wallet, amount_melo)
  return NextResponse.json({ payout }, { status: 201 })
}
