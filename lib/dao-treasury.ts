import { createClient } from '@supabase/supabase-js'
import type { TreasuryTransaction, TreasurySnapshot, TxType, TxCategory } from './types/dao-treasury'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getRecentTransactions(limit = 50): Promise<TreasuryTransaction[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('treasury_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function recordTransaction(
  txType: TxType,
  category: TxCategory,
  amountMelo: number,
  opts: {
    amountUsd?: number
    description?: string
    txHash?: string
    fromAddress?: string
    toAddress?: string
    blockNumber?: number
    epoch?: string
  } = {}
): Promise<TreasuryTransaction> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('treasury_transactions')
    .insert({
      tx_type: txType,
      category,
      amount_melo: amountMelo,
      amount_usd: opts.amountUsd ?? null,
      description: opts.description ?? null,
      tx_hash: opts.txHash ?? null,
      from_address: opts.fromAddress ?? null,
      to_address: opts.toAddress ?? null,
      block_number: opts.blockNumber ?? null,
      epoch: opts.epoch ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getLatestSnapshot(): Promise<TreasurySnapshot | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('treasury_snapshots')
    .select('*')
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()
  return data ?? null
}

export async function upsertSnapshot(
  balanceMelo: number,
  balanceCusd: number,
  totalInflowMelo: number,
  totalOutflowMelo: number
): Promise<TreasurySnapshot> {
  const supabase = getSupabase()
  const snapshotDate = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('treasury_snapshots')
    .upsert({
      balance_melo: balanceMelo,
      balance_cusd: balanceCusd,
      total_inflow_melo: totalInflowMelo,
      total_outflow_melo: totalOutflowMelo,
      snapshot_date: snapshotDate,
    }, { onConflict: 'snapshot_date' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}
