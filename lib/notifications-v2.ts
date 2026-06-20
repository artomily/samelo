import { createClient } from '@supabase/supabase-js'
import type { NotificationV2, NotificationTypeV2 } from './types/notification-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getNotifications(wallet: string, limit = 50): Promise<NotificationV2[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('notifications_v2')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getUnreadCount(wallet: string): Promise<number> {
  const supabase = getSupabase()
  const { count, error } = await supabase
    .from('notifications_v2')
    .select('id', { count: 'exact', head: true })
    .eq('wallet', wallet)
    .is('read_at', null)
  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function markAllRead(wallet: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('notifications_v2')
    .update({ read_at: new Date().toISOString() })
    .eq('wallet', wallet)
    .is('read_at', null)
  if (error) throw new Error(error.message)
}

export async function markRead(id: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('notifications_v2')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function createNotification(
  wallet: string,
  type: NotificationTypeV2,
  title: string,
  body: string,
  action_url?: string
): Promise<NotificationV2> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('notifications_v2')
    .insert({ wallet, type, title, body, action_url: action_url ?? null })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}
