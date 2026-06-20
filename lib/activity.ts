import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActivityEventType } from './types/social'

export async function createActivityEvent(
  supabase: SupabaseClient,
  wallet: string,
  eventType: ActivityEventType,
  metadata: Record<string, unknown> = {},
) {
  const { error } = await supabase
    .from('activity_events')
    .insert({ wallet, event_type: eventType, metadata })

  if (error) console.error('[activity] failed to create event', error)
}

export async function getFeedForWallet(supabase: SupabaseClient, wallet: string, limit = 20) {
  const { data: following } = await supabase
    .from('follows')
    .select('following_wallet')
    .eq('follower_wallet', wallet)

  const wallets = [wallet, ...(following ?? []).map(f => f.following_wallet)]

  const { data } = await supabase
    .from('activity_events')
    .select('id, wallet, event_type, metadata, created_at')
    .in('wallet', wallets)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}

export async function getReactionCount(supabase: SupabaseClient, eventId: string): Promise<number> {
  const { count } = await supabase
    .from('reactions')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
  return count ?? 0
}
