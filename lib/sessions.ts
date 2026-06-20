import { createClient } from '@supabase/supabase-js'
import { generateSessionToken, sessionExpiresAt, isSessionExpired } from './types/session'
import type { WalletSession } from './types/session'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createSession(
  wallet: string,
  ipAddress?: string,
  userAgent?: string
): Promise<WalletSession> {
  const supabase = getSupabase()
  const token = generateSessionToken()
  const { data, error } = await supabase
    .from('wallet_sessions')
    .insert({
      wallet,
      session_token: token,
      ip_address: ipAddress ?? null,
      user_agent: userAgent ?? null,
      expires_at: sessionExpiresAt(),
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getSession(token: string): Promise<WalletSession | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('wallet_sessions')
    .select('*')
    .eq('session_token', token)
    .single()
  if (!data || isSessionExpired(data)) return null
  return data
}

export async function refreshSession(token: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('wallet_sessions')
    .update({ last_seen_at: new Date().toISOString(), expires_at: sessionExpiresAt() })
    .eq('session_token', token)
}

export async function revokeSession(token: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('wallet_sessions').delete().eq('session_token', token)
}

export async function revokeAllSessions(wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('wallet_sessions').delete().eq('wallet', wallet)
}

export async function getActiveSessions(wallet: string): Promise<WalletSession[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('wallet_sessions')
    .select('*')
    .eq('wallet', wallet)
    .gt('expires_at', new Date().toISOString())
    .order('last_seen_at', { ascending: false })
  return data ?? []
}
