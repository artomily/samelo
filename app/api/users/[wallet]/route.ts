import { NextRequest, NextResponse } from 'next/server'
import { getProfile, upsertProfile } from '@/lib/user-follows'

export async function GET(_req: NextRequest, { params }: { params: { wallet: string } }) {
  if (!/^0x[0-9a-fA-F]{40}$/.test(params.wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const profile = await getProfile(params.wallet)
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ profile })
}

export async function PATCH(req: NextRequest, { params }: { params: { wallet: string } }) {
  const authWallet = req.headers.get('x-wallet-address')
  if (!authWallet || authWallet.toLowerCase() !== params.wallet.toLowerCase()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { display_name, bio, avatar_url, twitter_handle } = await req.json()
  const profile = await upsertProfile(params.wallet, { display_name, bio, avatar_url, twitter_handle })
  return NextResponse.json({ profile })
}
