import { createClient } from '@supabase/supabase-js'
import type { Tip, TipStatus } from './types/tips'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createTip(
  senderWallet: string,
  recipientWallet: string,
  amountMelo: number,
  opts: { message?: string; videoId?: string; txHash?: string } = {}
): Promise<Tip> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('tips')
    .insert({
      sender_wallet: senderWallet,
      recipient_wallet: recipientWallet,
      amount_melo: amountMelo,
      message: opts.message ?? null,
      video_id: opts.videoId ?? null,
      tx_hash: opts.txHash ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function confirmTip(tipId: string, txHash: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('tips')
    .update({ status: 'confirmed', tx_hash: txHash, confirmed_at: new Date().toISOString() })
    .eq('id', tipId)
}

export async function updateTipStatus(tipId: string, status: TipStatus): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('tips').update({ status }).eq('id', tipId)
}

export async function getSentTips(wallet: string): Promise<Tip[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('tips')
    .select('*')
    .eq('sender_wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getReceivedTips(wallet: string): Promise<Tip[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('tips')
    .select('*')
    .eq('recipient_wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getTotalReceived(wallet: string): Promise<number> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('tips')
    .select('amount_melo')
    .eq('recipient_wallet', wallet)
    .eq('status', 'confirmed')
  if (!data) return 0
  return data.reduce((sum: number, t: { amount_melo: number }) => sum + t.amount_melo, 0)
}
