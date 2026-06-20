import { createClient } from '@supabase/supabase-js'
import type { ProfileV2 } from './types/profile-v2'
import { sanitizeUrl } from './types/profile-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getProfile(wallet: string): Promise<ProfileV2 | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .maybeSingle()
  return data ?? null
}

export async function updateProfile(
  wallet: string,
  updates: Partial<Pick<ProfileV2, 'display_name' | 'bio' | 'twitter' | 'website' | 'country' | 'avatar_url'>>
): Promise<ProfileV2> {
  const supabase = getSupabase()

  const clean: typeof updates = { ...updates }
  if (clean.website) clean.website = sanitizeUrl(clean.website) || null!
  if (clean.display_name) clean.display_name = clean.display_name.slice(0, 50)
  if (clean.bio) clean.bio = clean.bio.slice(0, 280)
  if (clean.twitter) clean.twitter = clean.twitter.replace(/^@/, '').slice(0, 50)

  const { data, error } = await supabase
    .from('profiles')
    .update(clean)
    .eq('wallet', wallet.toLowerCase())
    .select()
    .single()
  if (error) throw error
  return data
}

export async function followWallet(
  followerWallet: string,
  followingWallet: string
): Promise<void> {
  if (followerWallet.toLowerCase() === followingWallet.toLowerCase()) {
    throw new Error('Cannot follow yourself')
  }

  const supabase = getSupabase()
  await supabase.from('follows').upsert({
    follower_wallet: followerWallet.toLowerCase(),
    following_wallet: followingWallet.toLowerCase(),
  })

  await supabase.rpc('increment_follower_counts', {
    p_follower: followerWallet.toLowerCase(),
    p_following: followingWallet.toLowerCase(),
  })
}

export async function unfollowWallet(
  followerWallet: string,
  followingWallet: string
): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('follows')
    .delete()
    .eq('follower_wallet', followerWallet.toLowerCase())
    .eq('following_wallet', followingWallet.toLowerCase())
}

export async function isFollowing(follower: string, following: string): Promise<boolean> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('follows')
    .select('follower_wallet')
    .eq('follower_wallet', follower.toLowerCase())
    .eq('following_wallet', following.toLowerCase())
    .maybeSingle()
  return !!data
}

export async function getFollowers(wallet: string): Promise<string[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('follows')
    .select('follower_wallet')
    .eq('following_wallet', wallet.toLowerCase())
  return (data ?? []).map((r) => r.follower_wallet)
}
