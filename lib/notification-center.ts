import { createClient } from '@supabase/supabase-js'
import type { NotificationCenterItem, NotificationType } from './types/notifications'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getNotificationCenter(wallet: string, limit = 50): Promise<NotificationCenterItem[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('notification_center')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getNotificationUnreadCount(wallet: string): Promise<number> {
  const supabase = getSupabase()
  const { count } = await supabase
    .from('notification_center')
    .select('*', { count: 'exact', head: true })
    .eq('wallet', wallet)
    .eq('is_read', false)
  return count ?? 0
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('notification_center').update({ is_read: true }).eq('id', id)
}

export async function markAllNotificationsRead(wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('notification_center')
    .update({ is_read: true })
    .eq('wallet', wallet)
    .eq('is_read', false)
}

export async function pushNotification(
  wallet: string,
  type: NotificationType,
  title: string,
  body: string,
  opts: { actionUrl?: string; imageUrl?: string } = {}
): Promise<NotificationCenterItem> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('notification_center')
    .insert({
      wallet,
      type,
      title,
      body,
      action_url: opts.actionUrl ?? null,
      image_url: opts.imageUrl ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteNotificationItem(id: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('notification_center').delete().eq('id', id)
}
