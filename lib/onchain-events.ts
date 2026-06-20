import { createClient } from '@supabase/supabase-js'
import type { OnchainEvent, EventIngestionPayload } from './types/onchain-event'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function ingestEvent(payload: EventIngestionPayload): Promise<OnchainEvent> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('onchain_events')
    .upsert({
      tx_hash: payload.txHash.toLowerCase(),
      block_number: payload.blockNumber,
      chain_id: payload.chainId,
      contract_address: payload.contractAddress.toLowerCase(),
      event_name: payload.eventName,
      wallet: payload.wallet?.toLowerCase() ?? null,
      data: payload.data ?? {},
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getWalletEvents(
  wallet: string,
  eventName?: string,
  limit = 20
): Promise<OnchainEvent[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('onchain_events')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .order('block_number', { ascending: false })
    .limit(limit)

  if (eventName) query = query.eq('event_name', eventName)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getUnprocessedEvents(limit = 100): Promise<OnchainEvent[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('onchain_events')
    .select('*')
    .is('processed_at', null)
    .order('created_at')
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function markEventProcessed(id: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('onchain_events')
    .update({ processed_at: new Date().toISOString() })
    .eq('id', id)
}

export async function getLatestBlock(chainId: number): Promise<number> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('onchain_events')
    .select('block_number')
    .eq('chain_id', chainId)
    .order('block_number', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data?.block_number ?? 0
}
