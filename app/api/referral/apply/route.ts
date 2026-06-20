import { NextRequest, NextResponse } from 'next/server'
import { applyReferralCode } from '@/lib/referral-db'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { code } = await req.json()
  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'code required' }, { status: 400 })
  }

  try {
    const referral = await applyReferralCode(wallet, code)
    return NextResponse.json({ referral, bonusPoints: referral.referee_bonus }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to apply code'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
