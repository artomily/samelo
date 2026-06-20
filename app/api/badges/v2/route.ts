import { NextRequest, NextResponse } from 'next/server'
import { getAllBadgesV2, awardBadge } from '@/lib/user-badges-v2'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? undefined
  const badges = await getAllBadgesV2(wallet)
  const earnedCount = badges.filter((b) => b.award !== null).length
  return NextResponse.json({ badges, earnedCount })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { recipient_wallet, badge_type_id, reason, token_id } = await req.json()
  if (!recipient_wallet || !badge_type_id) {
    return NextResponse.json({ error: 'recipient_wallet and badge_type_id required' }, { status: 400 })
  }

  const award = await awardBadge(recipient_wallet, badge_type_id, {
    awardedBy: wallet,
    reason,
    tokenId: token_id,
  })
  return NextResponse.json({ award }, { status: 201 })
}
