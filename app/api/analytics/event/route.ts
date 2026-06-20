import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { clampString, validateWalletAddress } from '@/lib/security/sanitize'

const ALLOWED_EVENTS = [
  'page_view', 'video_play', 'video_pause', 'video_complete',
  'video_seek', 'video_error', 'swap', 'stake', 'quiz_complete', 'search',
] as const

export async function POST(request: Request) {
  let body: {
    event: string
    wallet?: string
    sessionId?: string
    properties?: Record<string, unknown>
    url?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!ALLOWED_EVENTS.includes(body.event as typeof ALLOWED_EVENTS[number])) {
    return NextResponse.json({ error: 'Unknown event type' }, { status: 400 })
  }

  if (body.wallet && !validateWalletAddress(body.wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const userAgent = request.headers.get('user-agent') ?? undefined

  await supabase.from('analytics_events').insert({
    event: body.event,
    wallet: body.wallet ?? null,
    session_id: body.sessionId ? clampString(body.sessionId, 64) : null,
    properties: body.properties ?? {},
    url: body.url ? clampString(body.url, 500) : null,
    user_agent: userAgent ? clampString(userAgent, 500) : null,
  })

  return NextResponse.json({ ok: true })
}
