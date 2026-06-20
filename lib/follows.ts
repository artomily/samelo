import type { SupabaseClient } from '@supabase/supabase-js'

export async function followWallet(supabase: SupabaseClient, follower: string, target: string) {
  if (follower === target) throw new Error('Cannot follow yourself')
  const { error } = await supabase
    .from('follows')
    .insert({ follower_wallet: follower, following_wallet: target })
  if (error) throw error
}

export async function unfollowWallet(supabase: SupabaseClient, follower: string, target: string) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_wallet', follower)
    .eq('following_wallet', target)
  if (error) throw error
}

export async function isFollowing(supabase: SupabaseClient, follower: string, target: string): Promise<boolean> {
  const { data } = await supabase
    .from('follows')
    .select('follower_wallet')
    .eq('follower_wallet', follower)
    .eq('following_wallet', target)
    .single()
  return !!data
}

export async function getFollowerCount(supabase: SupabaseClient, wallet: string): Promise<number> {
  const { count } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_wallet', wallet)
  return count ?? 0
}

export async function getFollowingCount(supabase: SupabaseClient, wallet: string): Promise<number> {
  const { count } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_wallet', wallet)
  return count ?? 0
}
