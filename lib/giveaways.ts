import { createClient } from '@supabase/supabase-js'
import type { Giveaway, GiveawayEntry } from './types/giveaways'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getActiveGiveaways(): Promise<Giveaway[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('giveaways')
    .select('*')
    .eq('status', 'active')
    .gt('ends_at', new Date().toISOString())
    .order('ends_at')
  return data ?? []
}

export async function getGiveaway(id: string): Promise<Giveaway | null> {
  const supabase = getSupabase()
  const { data } = await supabase.from('giveaways').select('*').eq('id', id).single()
  return data ?? null
}

export async function createGiveaway(
  creatorWallet: string,
  title: string,
  endsAt: string,
  opts: { description?: string; prizeMelo?: number; prizeDescription?: string; maxEntries?: number } = {}
): Promise<Giveaway> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('giveaways')
    .insert({
      creator_wallet: creatorWallet,
      title,
      ends_at: endsAt,
      description: opts.description ?? null,
      prize_melo: opts.prizeMelo ?? 0,
      prize_description: opts.prizeDescription ?? null,
      max_entries: opts.maxEntries ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function enterGiveaway(giveawayId: string, wallet: string): Promise<GiveawayEntry> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('giveaway_entries')
    .upsert({ giveaway_id: giveawayId, wallet, entry_count: 1 }, { onConflict: 'giveaway_id,wallet' })
    .select()
    .single()
  if (error) throw new Error(error.message)

  await supabase.rpc('increment_giveaway_entries', { giveaway_id: giveawayId })
  return data
}

export async function drawWinner(giveawayId: string): Promise<string | null> {
  const supabase = getSupabase()
  const { data: entries } = await supabase
    .from('giveaway_entries')
    .select('wallet, entry_count')
    .eq('giveaway_id', giveawayId)

  if (!entries?.length) return null

  const pool: string[] = []
  for (const e of entries) {
    for (let i = 0; i < e.entry_count; i++) pool.push(e.wallet)
  }

  const winner = pool[Math.floor(Math.random() * pool.length)]

  await supabase
    .from('giveaways')
    .update({ status: 'drawn', winner_wallet: winner, drawn_at: new Date().toISOString() })
    .eq('id', giveawayId)

  return winner
}

export async function getWalletEntry(giveawayId: string, wallet: string): Promise<GiveawayEntry | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('giveaway_entries')
    .select('*')
    .eq('giveaway_id', giveawayId)
    .eq('wallet', wallet)
    .single()
  return data ?? null
}
