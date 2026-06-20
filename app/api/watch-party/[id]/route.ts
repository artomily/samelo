import { NextRequest, NextResponse } from 'next/server'
import { getWatchParty, joinParty, leaveParty, startParty, getParticipants } from '@/lib/watch-party'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const [party, participants] = await Promise.all([
    getWatchParty(id),
    getParticipants(id),
  ])
  if (!party) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ party, participants })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const { id } = await params
  const { action } = await req.json()

  if (action === 'join') { await joinParty(id, wallet); return NextResponse.json({ ok: true }) }
  if (action === 'leave') { await leaveParty(id, wallet); return NextResponse.json({ ok: true }) }
  if (action === 'start') { await startParty(id); return NextResponse.json({ ok: true }) }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
