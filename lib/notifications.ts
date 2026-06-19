import type { SupabaseClient } from '@supabase/supabase-js'
import type { NotificationType } from '@/lib/types/notification'

interface CreateNotificationArgs {
  supabase: SupabaseClient
  wallet: string
  type: NotificationType
  title: string
  message: string
  metadata?: Record<string, unknown>
}

export async function createNotification({
  supabase,
  wallet,
  type,
  title,
  message,
  metadata,
}: CreateNotificationArgs): Promise<void> {
  await supabase.from('notifications').insert({
    wallet_address: wallet.toLowerCase(),
    type,
    title,
    message,
    metadata: metadata ?? null,
  })
}

export async function markAllRead(supabase: SupabaseClient, wallet: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('wallet_address', wallet.toLowerCase())
    .eq('read', false)
}

export async function getUnreadCount(supabase: SupabaseClient, wallet: string): Promise<number> {
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('wallet_address', wallet.toLowerCase())
    .eq('read', false)
  return count ?? 0
}
