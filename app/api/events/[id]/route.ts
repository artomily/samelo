import { NextRequest, NextResponse } from 'next/server'
import { getLiveEvent, rsvpEvent, updateEventStatus, getEventRsvpCount } from '@/lib/live-events'
import { isAdmin } from '@/lib/admin-auth'
import type { EventStatus } from '@/lib/types/live-events'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const event = await getLiveEvent(params.id)
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const rsvp_count = await getEventRsvpCount(params.id)
  return NextResponse.json({ event, rsvp_count })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { action, status } = await req.json()

  if (action === 'rsvp') {
    const rsvp = await rsvpEvent(params.id, wallet)
    return NextResponse.json({ rsvp })
  }

  if (action === 'set_status') {
    if (!isAdmin(wallet)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    const validStatuses: EventStatus[] = ['scheduled', 'live', 'ended', 'cancelled']
    if (!validStatuses.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    await updateEventStatus(params.id, status)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
