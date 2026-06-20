import { NextRequest, NextResponse } from 'next/server'
import { getLiveParties, createWatchParty } from '@/lib/watch-party'

export async function GET() {
  const parties = await getLiveParties()
  return NextResponse.json({ parties })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const { video_id, title, max_participants } = await req.json()
  if (!video_id || !title) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const party = await createWatchParty(wallet, video_id, title, max_participants ?? 50)
  return NextResponse.json({ party }, { status: 201 })
}
