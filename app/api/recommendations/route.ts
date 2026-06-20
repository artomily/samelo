import { NextRequest, NextResponse } from 'next/server'
import { getRecommendations, recordSignal } from '@/lib/recommendations'
import type { SignalType } from '@/lib/types/recommendations'

const VALID_SIGNALS: SignalType[] = ['watch', 'complete', 'like', 'share', 'quiz_pass', 'replay']

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const videoIds = await getRecommendations(wallet)
  return NextResponse.json({ videoIds })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { video_id, signal_type } = await req.json()
  if (!video_id || !VALID_SIGNALS.includes(signal_type)) {
    return NextResponse.json({ error: 'video_id and valid signal_type required' }, { status: 400 })
  }

  await recordSignal(wallet, video_id, signal_type)
  return NextResponse.json({ ok: true })
}
