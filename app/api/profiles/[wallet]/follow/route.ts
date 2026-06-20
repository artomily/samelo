import { NextRequest, NextResponse } from 'next/server'
import { followWallet, unfollowWallet, isFollowing } from '@/lib/profiles-v2'

export async function GET(
  req: NextRequest,
  { params }: { params: { wallet: string } }
) {
  const follower = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(follower)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  const following = await isFollowing(follower, params.wallet)
  return NextResponse.json({ following })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { wallet: string } }
) {
  const follower = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(follower)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  try {
    await followWallet(follower, params.wallet)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Follow failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { wallet: string } }
) {
  const follower = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(follower)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  await unfollowWallet(follower, params.wallet)
  return NextResponse.json({ ok: true })
}
