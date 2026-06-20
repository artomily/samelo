import { createClient } from '@supabase/supabase-js'
import type { NftBadgeDefinition, NftBadgeMint } from './types/nft-badge'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getAllBadgeDefinitions(): Promise<NftBadgeDefinition[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('nft_badge_definitions')
    .select('*')
    .order('rarity')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getWalletBadgeMints(wallet: string): Promise<NftBadgeMint[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('nft_badge_mints')
    .select('*')
    .eq('wallet', wallet)
    .order('minted_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function mintBadge(
  badgeId: string,
  wallet: string,
  tokenId?: string,
  txHash?: string
): Promise<NftBadgeMint> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('nft_badge_mints')
    .insert({
      badge_id: badgeId,
      wallet,
      token_id: tokenId ?? null,
      tx_hash: txHash ?? null,
    })
    .select()
    .single()
  if (error) {
    if (error.code === '23505') throw new Error('Badge already minted')
    throw new Error(error.message)
  }
  return data
}

export async function checkAndAwardBadges(
  wallet: string,
  stats: { points: number; streak: number; referrals: number; videosWatched: number; achievements: number }
): Promise<string[]> {
  const [defs, mints] = await Promise.all([
    getAllBadgeDefinitions(),
    getWalletBadgeMints(wallet),
  ])

  const mintedIds = new Set(mints.map((m) => m.badge_id))
  const newlyMinted: string[] = []

  for (const def of defs) {
    if (mintedIds.has(def.id)) continue
    const val = stats[def.criteria_type === 'videos_watched' ? 'videosWatched' : def.criteria_type as keyof typeof stats]
    if (val >= def.criteria_value) {
      await mintBadge(def.id, wallet).catch(() => {})
      newlyMinted.push(def.name)
    }
  }

  return newlyMinted
}
