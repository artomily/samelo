import { NextRequest, NextResponse } from 'next/server'
import { upsertChapterProgress } from '@/lib/video-chapters'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { chapter_id, watch_pct, completed } = await req.json()
  if (!chapter_id) return NextResponse.json({ error: 'chapter_id required' }, { status: 400 })

  const progress = await upsertChapterProgress(
    wallet,
    chapter_id,
    Math.min(100, Math.max(0, watch_pct ?? 0)),
    !!completed
  )
  return NextResponse.json({ progress })
}
