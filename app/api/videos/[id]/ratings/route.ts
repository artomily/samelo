import { NextRequest, NextResponse } from 'next/server'
import { getRatingStats, getWalletRating, submitRating, getVideoReviews } from '@/lib/video-ratings'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const wallet = req.headers.get('x-wallet-address') ?? undefined
  const mode = req.nextUrl.searchParams.get('mode') ?? 'stats'

  if (mode === 'reviews') {
    const reviews = await getVideoReviews(params.id)
    return NextResponse.json({ reviews })
  }

  const [stats, walletRating] = await Promise.all([
    getRatingStats(params.id),
    wallet ? getWalletRating(params.id, wallet) : null,
  ])
  return NextResponse.json({ stats, walletRating })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { rating, review, watch_pct } = await req.json()
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'rating must be 1-5' }, { status: 400 })
  }

  const submitted = await submitRating(wallet, params.id, rating, review, watch_pct)
  return NextResponse.json({ rating: submitted })
}
