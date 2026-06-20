import { createClient } from '@supabase/supabase-js'
import type { Report, BannedWallet, ReportTargetType, ReportReason, ReportStatus } from './types/moderation'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createReport(
  reporterWallet: string,
  targetType: ReportTargetType,
  targetId: string,
  reason: ReportReason,
  description?: string
): Promise<Report> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reports')
    .insert({ reporter_wallet: reporterWallet, target_type: targetType, target_id: targetId, reason, description: description ?? null })
    .select()
    .single()
  if (error) {
    if (error.code === '23505') throw new Error('Already reported')
    throw error
  }
  return data
}

export async function getReports(status?: ReportStatus, limit = 50): Promise<Report[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function reviewReport(
  reportId: string,
  reviewerWallet: string,
  newStatus: ReportStatus
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('reports')
    .update({ status: newStatus, reviewed_by: reviewerWallet, reviewed_at: new Date().toISOString() })
    .eq('id', reportId)
  if (error) throw error
}

export async function isBanned(wallet: string): Promise<boolean> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('banned_wallets')
    .select('wallet, expires_at')
    .eq('wallet', wallet.toLowerCase())
    .maybeSingle()

  if (!data) return false
  if (data.expires_at && new Date(data.expires_at) < new Date()) return false
  return true
}

export async function banWallet(
  wallet: string,
  reason: string,
  bannedBy: string,
  expiresAt?: Date
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('banned_wallets')
    .upsert({
      wallet: wallet.toLowerCase(),
      reason,
      banned_by: bannedBy,
      expires_at: expiresAt?.toISOString() ?? null,
    })
  if (error) throw error
}

export async function unbanWallet(wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('banned_wallets').delete().eq('wallet', wallet.toLowerCase())
}
