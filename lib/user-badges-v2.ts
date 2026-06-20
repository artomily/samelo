import { createClient } from '@supabase/supabase-js'
import type { BadgeType, UserBadgeAward, BadgeWithAward } from './types/user-badges-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getAllBadgesV2(wallet?: string): Promise<BadgeWithAward[]> {
  const supabase = getSupabase()
  const { data: badges } = await supabase
    .from('badge_types')
    .select('*')
    .eq('is_active', true)
    .order('rarity', { ascending: false })

  if (!badges) return []
  if (!wallet) return badges.map((b) => ({ ...b, award: null }))

  const { data: awards } = await supabase
    .from('user_badge_awards')
    .select('*')
    .eq('wallet', wallet)
    .in('badge_type_id', badges.map((b: BadgeType) => b.id))

  const awardMap = new Map<string, UserBadgeAward>()
  for (const a of awards ?? []) awardMap.set(a.badge_type_id, a)

  return badges.map((b: BadgeType) => ({ ...b, award: awardMap.get(b.id) ?? null }))
}

export async function awardBadge(
  wallet: string,
  badgeTypeId: string,
  opts: { awardedBy?: string; reason?: string; tokenId?: string } = {}
): Promise<UserBadgeAward> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('user_badge_awards')
    .upsert(
      {
        wallet,
        badge_type_id: badgeTypeId,
        awarded_by: opts.awardedBy ?? null,
        award_reason: opts.reason ?? null,
        token_id: opts.tokenId ?? null,
      },
      { onConflict: 'wallet,badge_type_id' }
    )
    .select()
    .single()
  if (error) throw new Error(error.message)

  await supabase.rpc('increment_badge_issued', { badge_id: badgeTypeId })
  return data
}

export async function getWalletBadges(wallet: string): Promise<UserBadgeAward[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('user_badge_awards')
    .select('*')
    .eq('wallet', wallet)
    .order('awarded_at', { ascending: false })
  return data ?? []
}
