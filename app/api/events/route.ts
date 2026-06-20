import { NextRequest, NextResponse } from 'next/server'
import { getUpcomingEvents, createEvent } from '@/lib/live-events'
import { isAdmin } from '@/lib/admin-auth'

export async function GET() {
  const events = await getUpcomingEvents()
  return NextResponse.json({ events })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  if (!isAdmin(wallet)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { title, scheduled_at, description, stream_url, thumbnail_url, max_attendees, points_reward } = await req.json()
  if (!title || !scheduled_at) {
    return NextResponse.json({ error: 'title and scheduled_at required' }, { status: 400 })
  }

  const event = await createEvent(wallet, title, scheduled_at, {
    description,
    streamUrl: stream_url,
    thumbnailUrl: thumbnail_url,
    maxAttendees: max_attendees,
    pointsReward: points_reward,
  })
  return NextResponse.json({ event }, { status: 201 })
}
