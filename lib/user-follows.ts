import { createClient } from '@supabase/supabase-js'
import type { UserFollow, UserProfile, UserProfileWithCounts } from './types/user-follows'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getProfile(wallet: string): Promise<UserProfileWithCounts | null> {
  const supabase = getSupabase()
  const { data: profile } = await supabase.from('user_profiles').select('*').eq('wallet', wallet).single()
  if (!profile) return null

  const [{ count: followerCount }, { count: followingCount }] = await Promise.all([
    supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('following_wallet', wallet),
    supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('follower_wallet', wallet),
  ])

  return { ...profile, follower_count: followerCount ?? 0, following_count: followingCount ?? 0 }
}

export async function upsertProfile(
  wallet: string,
  updates: Partial<Pick<UserProfile, 'display_name' | 'bio' | 'avatar_url' | 'twitter_handle'>>
): Promise<UserProfile> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({ wallet, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'wallet' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function followUser(followerWallet: string, followingWallet: string): Promise<UserFollow> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('user_follows')
    .upsert({ follower_wallet: followerWallet, following_wallet: followingWallet }, { onConflict: 'follower_wallet,following_wallet' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function unfollowUser(followerWallet: string, followingWallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('user_follows')
    .delete()
    .eq('follower_wallet', followerWallet)
    .eq('following_wallet', followingWallet)
}

export async function isFollowing(followerWallet: string, followingWallet: string): Promise<boolean> {
  const supabase = getSupabase()
  const { count } = await supabase
    .from('user_follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_wallet', followerWallet)
    .eq('following_wallet', followingWallet)
  return (count ?? 0) > 0
}

export async function getFollowers(wallet: string): Promise<UserFollow[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('user_follows')
    .select('*')
    .eq('following_wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getFollowing(wallet: string): Promise<UserFollow[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('user_follows')
    .select('*')
    .eq('follower_wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}
