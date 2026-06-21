import { NextRequest, NextResponse } from 'next/server'
import { getRevenueSplit, upsertRevenueSplit, getVideoRevenue, getCreatorTotalRevenue } from '@/lib/revenue-sharing'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const videoId = req.nextUrl.searchParams.get('video_id')
  const mode = req.nextUrl.searchParams.get('mode') ?? 'total'

  if (videoId) {
    const [split, distributions] = await Promise.all([
      getRevenueSplit(videoId),
      getVideoRevenue(videoId),
    ])
    return NextResponse.json({ split, distributions })
  }

  if (mode === 'total') {
    const totalMelo = await getCreatorTotalRevenue(wallet)
    return NextResponse.json({ total_melo: totalMelo })
  }

  return NextResponse.json({ error: 'video_id or mode required' }, { status: 400 })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { action, video_id, gross_melo, source, creator_pct, collab_wallet, collab_pct } = await req.json()

  if (action === 'distribute') {
    if (!isAdmin(wallet)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    if (!video_id || !gross_melo || !source) {
      return NextResponse.json({ error: 'video_id, gross_melo, source required' }, { status: 400 })
    }
    const { distributeRevenue } = await import('@/lib/revenue-sharing')
    const distribution = await distributeRevenue(video_id, gross_melo, source)
    return NextResponse.json({ distribution })
  }

  if (!video_id) return NextResponse.json({ error: 'video_id required' }, { status: 400 })

  const split = await upsertRevenueSplit(video_id, wallet, { creatorPct: creator_pct, collabWallet: collab_wallet, collabPct: collab_pct })
  return NextResponse.json({ split })
}
