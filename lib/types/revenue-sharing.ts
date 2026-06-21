export type RevenueSource = 'ad' | 'tip' | 'subscription' | 'course' | 'nft'

export interface RevenueSplit {
  id: string
  video_id: string
  creator_wallet: string
  creator_pct: number
  platform_pct: number
  collab_wallet: string | null
  collab_pct: number
  created_at: string
  updated_at: string
}

export interface RevenueDistribution {
  id: string
  video_id: string
  gross_melo: number
  creator_melo: number
  platform_melo: number
  collab_melo: number
  source: RevenueSource
  distributed_at: string
}

export const SOURCE_LABELS: Record<RevenueSource, string> = {
  ad: 'Ad Revenue',
  tip: 'Tips',
  subscription: 'Subscriptions',
  course: 'Courses',
  nft: 'NFT Sales',
}

export const DEFAULT_SPLIT: Pick<RevenueSplit, 'creator_pct' | 'platform_pct' | 'collab_pct'> = {
  creator_pct: 80,
  platform_pct: 20,
  collab_pct: 0,
}

export function splitRevenue(grossMelo: number, split: Pick<RevenueSplit, 'creator_pct' | 'platform_pct' | 'collab_pct'>) {
  const creator = Math.floor(grossMelo * split.creator_pct / 100)
  const collab = Math.floor(grossMelo * split.collab_pct / 100)
  const platform = grossMelo - creator - collab
  return { creator, platform, collab }
}

export function hasCollab(split: RevenueSplit): boolean {
  return split.collab_wallet !== null && split.collab_pct > 0
}
