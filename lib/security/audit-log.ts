import type { SupabaseClient } from '@supabase/supabase-js'

export type AuditAction =
  | 'admin.ban_user'
  | 'admin.unban_user'
  | 'admin.adjust_points'
  | 'admin.delete_video'
  | 'admin.create_video'
  | 'api_key.created'
  | 'api_key.revoked'
  | 'webhook.created'
  | 'webhook.deactivated'
  | 'advertiser.campaign_created'
  | 'advertiser.campaign_paused'

export interface AuditEntry {
  action: AuditAction
  actorWallet: string
  targetId?: string
  metadata?: Record<string, unknown>
}

export async function writeAuditLog(
  supabase: SupabaseClient,
  entry: AuditEntry,
): Promise<void> {
  const { error } = await supabase.from('audit_log').insert({
    action: entry.action,
    actor_wallet: entry.actorWallet,
    target_id: entry.targetId,
    metadata: entry.metadata ?? {},
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error('[audit] failed to write audit log', error)
  }
}
