export interface PageView {
  id: string
  wallet: string | null
  path: string
  referrer: string | null
  session_id: string | null
  created_at: string
}

export interface FeatureUsage {
  id: string
  wallet: string
  feature: string
  action: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface PlatformMetrics {
  totalPageViews: number
  uniqueWallets: number
  topPaths: { path: string; count: number }[]
  topFeatures: { feature: string; count: number }[]
}

export const TRACKED_FEATURES = [
  'watch', 'quiz', 'stake', 'swap', 'referral',
  'checkin', 'achievements', 'leaderboard', 'search',
] as const

export type TrackedFeature = typeof TRACKED_FEATURES[number]

export function buildSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
