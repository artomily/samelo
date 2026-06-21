import { NextRequest, NextResponse } from 'next/server'
import {
  getOrCreateReferralCode,
  getReferralCodeByCode,
  getWalletConversions,
  recordConversion,
} from '@/lib/referrals'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const code = req.nextUrl.searchParams.get('code')

  if (code) {
    const ref = await getReferralCodeByCode(code)
    if (!ref) return NextResponse.json({ error: 'Code not found or inactive' }, { status: 404 })
    return NextResponse.json({ referral: ref })
  }

  if (!wallet) return NextResponse.json({ error: 'Wallet or code required' }, { status: 400 })

  const [referral, conversions] = await Promise.all([
    getOrCreateReferralCode(wallet),
    getWalletConversions(wallet),
  ])
  return NextResponse.json({ referral, conversions })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { code } = await req.json()
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 })

  const ref = await getReferralCodeByCode(code)
  if (!ref) return NextResponse.json({ error: 'Invalid or inactive referral code' }, { status: 404 })

  if (ref.wallet === wallet) {
    return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 })
  }

  const conversion = await recordConversion(ref.id, wallet)
  if (!conversion) {
    return NextResponse.json({ error: 'Already referred or conversion failed' }, { status: 409 })
  }

  return NextResponse.json({ conversion, bonus_melo: ref.bonus_melo }, { status: 201 })
}
