import { createClient } from '@supabase/supabase-js'
import type { WatchParty, WatchPartyParticipant } from './types/watch-party'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createWatchParty(
  hostWallet: string,
  videoId: string,
  title: string,
  maxParticipants = 50
): Promise<WatchParty> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('watch_parties')
    .insert({ host_wallet: hostWallet, video_id: videoId, title, max_participants: maxParticipants })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getWatchParty(id: string): Promise<WatchParty | null> {
  const supabase = getSupabase()
  const { data } = await supabase.from('watch_parties').select('*').eq('id', id).single()
  return data ?? null
}

export async function getLiveParties(): Promise<WatchParty[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('watch_parties')
    .select('*')
    .in('status', ['lobby', 'live'])
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function joinParty(partyId: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('watch_party_participants').upsert({
    party_id: partyId,
    wallet,
    left_at: null,
  })
}

export async function leaveParty(partyId: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('watch_party_participants')
    .update({ left_at: new Date().toISOString() })
    .eq('party_id', partyId)
    .eq('wallet', wallet)
}

export async function startParty(id: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('watch_parties')
    .update({ status: 'live', started_at: new Date().toISOString() })
    .eq('id', id)
}

export async function getParticipants(partyId: string): Promise<WatchPartyParticipant[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('watch_party_participants')
    .select('*')
    .eq('party_id', partyId)
    .is('left_at', null)
  return data ?? []
}
