import { createClient } from '@supabase/supabase-js'
import type { Report, ReportStatus } from './types/moderation'
import type { ModerationActionType, ReportReasonV2 } from './types/moderation-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createReport(
  reporterWallet: string,
  targetType: string,
  targetId: string,
  reason: ReportReasonV2,
  details?: string
): Promise<Report> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reports')
    .insert({ reporter_wallet: reporterWallet, target_type: targetType, target_id: targetId, reason, details: details ?? null })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getPendingReports(): Promise<Report[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminWallet: string
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('reports')
    .update({ status, reviewed_by: adminWallet, reviewed_at: new Date().toISOString() })
    .eq('id', reportId)
  if (error) throw new Error(error.message)
}

export async function recordModerationAction(
  adminWallet: string,
  targetType: string,
  targetId: string,
  action: ModerationActionType,
  note?: string,
  reportId?: string
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('moderation_actions')
    .insert({
      admin_wallet: adminWallet,
      target_type: targetType,
      target_id: targetId,
      action,
      note: note ?? null,
      report_id: reportId ?? null,
    })
  if (error) throw new Error(error.message)
}
