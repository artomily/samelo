import { NextRequest, NextResponse } from 'next/server'
import { followUser, unfollowUser, isFollowing } from '@/lib/user-follows'

export async function GET(req: NextRequest, { params }: { params: { wallet: string } }) {
  const authWallet = req.headers.get('x-wallet-address')
  if (!authWallet) return NextResponse.json({ following: false })
  const following = await isFollowing(authWallet, params.wallet)
  return NextResponse.json({ following })
}

export async function POST(req: NextRequest, { params }: { params: { wallet: string } }) {
  const authWallet = req.headers.get('x-wallet-address')
  if (!authWallet || !/^0x[0-9a-fA-F]{40}$/.test(authWallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  if (authWallet.toLowerCase() === params.wallet.toLowerCase()) {
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
  }

  const { action } = await req.json()
  if (action === 'follow') {
    const follow = await followUser(authWallet, params.wallet)
    return NextResponse.json({ follow })
  }
  if (action === 'unfollow') {
    await unfollowUser(authWallet, params.wallet)
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
