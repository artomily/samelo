import { createClient } from '@supabase/supabase-js'
import type { LiveEvent, LiveEventRsvp, EventStatus } from './types/live-events'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getUpcomingEvents(): Promise<LiveEvent[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('live_events')
    .select('*')
    .in('status', ['scheduled', 'live'])
    .order('scheduled_at', { ascending: true })
    .limit(20)
  return data ?? []
}

export async function getLiveEvent(id: string): Promise<LiveEvent | null> {
  const supabase = getSupabase()
  const { data } = await supabase.from('live_events').select('*').eq('id', id).single()
  return data ?? null
}

export async function createEvent(
  hostWallet: string,
  title: string,
  scheduledAt: string,
  opts: { description?: string; streamUrl?: string; thumbnailUrl?: string; maxAttendees?: number; pointsReward?: number }
): Promise<LiveEvent> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('live_events')
    .insert({
      host_wallet: hostWallet,
      title,
      scheduled_at: scheduledAt,
      description: opts.description ?? null,
      stream_url: opts.streamUrl ?? null,
      thumbnail_url: opts.thumbnailUrl ?? null,
      max_attendees: opts.maxAttendees ?? null,
      points_reward: opts.pointsReward ?? 0,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateEventStatus(id: string, status: EventStatus): Promise<void> {
  const supabase = getSupabase()
  const update: Record<string, unknown> = { status }
  if (status === 'live') update.started_at = new Date().toISOString()
  if (status === 'ended') update.ended_at = new Date().toISOString()
  await supabase.from('live_events').update(update).eq('id', id)
}

export async function rsvpEvent(eventId: string, wallet: string): Promise<LiveEventRsvp> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('live_event_rsvps')
    .upsert({ event_id: eventId, wallet }, { onConflict: 'event_id,wallet' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getWalletRsvps(wallet: string): Promise<LiveEventRsvp[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('live_event_rsvps')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getEventRsvpCount(eventId: string): Promise<number> {
  const supabase = getSupabase()
  const { count } = await supabase
    .from('live_event_rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
  return count ?? 0
}
