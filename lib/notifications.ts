import { createClient } from '@supabase/supabase-js'
import type { NotificationType, Notification, NotificationPreferences, DEFAULT_PREFERENCES } from './types/notification'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createNotification(
  wallet: string,
  type: NotificationType,
  title: string,
  body: string,
  metadata: Record<string, unknown> = {}
): Promise<Notification | null> {
  const supabase = getSupabase()

  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select(type)
    .eq('wallet', wallet)
    .maybeSingle()

  if (prefs && prefs[type] === false) return null

  const { data, error } = await supabase
    .from('notifications')
    .insert({ wallet, type, title, body, metadata })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getNotifications(
  wallet: string,
  limit = 20,
  unreadOnly = false
): Promise<Notification[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (unreadOnly) query = query.is('read_at', null)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function markAsRead(id: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('wallet', wallet)
  if (error) throw error
}

export async function markAllAsRead(wallet: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('wallet', wallet)
    .is('read_at', null)
  if (error) throw error
}

export async function getUnreadCount(wallet: string): Promise<number> {
  const supabase = getSupabase()
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('wallet', wallet)
    .is('read_at', null)
  if (error) throw error
  return count ?? 0
}

export async function getPreferences(wallet: string): Promise<NotificationPreferences | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('wallet', wallet)
    .maybeSingle()
  return data
}

export async function upsertPreferences(
  wallet: string,
  prefs: Partial<Omit<NotificationPreferences, 'wallet' | 'updated_at'>>
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('notification_preferences')
    .upsert({ wallet, ...prefs, updated_at: new Date().toISOString() })
  if (error) throw error
}
