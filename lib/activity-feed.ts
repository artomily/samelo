import { createClient } from '@supabase/supabase-js'
import type { ActivityEvent, ActivityEventType } from './types/activity-feed'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getWalletActivity(wallet: string, limit = 20): Promise<ActivityEvent[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('activity_events')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getPublicFeed(limit = 50): Promise<ActivityEvent[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('activity_events')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getFollowingFeed(followerWallet: string, limit = 50): Promise<ActivityEvent[]> {
  const supabase = getSupabase()
  const { data: follows } = await supabase
    .from('user_follows')
    .select('following_wallet')
    .eq('follower_wallet', followerWallet)

  if (!follows || follows.length === 0) return []

  const followingWallets = follows.map((f: { following_wallet: string }) => f.following_wallet)
  const { data } = await supabase
    .from('activity_events')
    .select('*')
    .in('wallet', followingWallets)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function recordActivity(
  wallet: string,
  eventType: ActivityEventType,
  payload: Record<string, unknown> = {},
  pointsDelta = 0,
  isPublic = true
): Promise<ActivityEvent> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('activity_events')
    .insert({ wallet, event_type: eventType, payload, points_delta: pointsDelta, is_public: isPublic })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}
