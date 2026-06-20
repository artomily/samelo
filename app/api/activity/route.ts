import { NextRequest, NextResponse } from 'next/server'
import { getPublicFeed, getFollowingFeed, getWalletActivity } from '@/lib/activity-feed'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const mode = req.nextUrl.searchParams.get('mode') ?? 'public'
  const target = req.nextUrl.searchParams.get('wallet')

  if (mode === 'wallet' && target) {
    if (!/^0x[0-9a-fA-F]{40}$/.test(target)) {
      return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
    }
    const events = await getWalletActivity(target)
    return NextResponse.json({ events })
  }

  if (mode === 'following' && wallet) {
    const events = await getFollowingFeed(wallet)
    return NextResponse.json({ events })
  }

  const events = await getPublicFeed()
  return NextResponse.json({ events })
}
