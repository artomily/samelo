import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateReferralCode } from '@/lib/referral-db'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const code = await getOrCreateReferralCode(wallet)
  return NextResponse.json({ code })
}
