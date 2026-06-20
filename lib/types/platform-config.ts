export interface PlatformConfigEntry {
  key: string
  value: unknown
  description: string | null
  is_public: boolean
  updated_by: string | null
  updated_at: string
}

export interface FeatureFlags {
  tips: boolean
  live_events: boolean
  governance: boolean
  collections: boolean
}

export interface PlatformSettings {
  points_per_minute_watched: number
  max_daily_watch_points: number
  referral_bonus_points: number
  quiz_base_points: number
  checkin_base_points: number
  streak_multiplier_threshold: number
  platform_fee_pct: number
  min_payout_melo: number
  maintenance_mode: boolean
  feature_flags: FeatureFlags
}

export const DEFAULT_SETTINGS: PlatformSettings = {
  points_per_minute_watched: 10,
  max_daily_watch_points: 500,
  referral_bonus_points: 100,
  quiz_base_points: 50,
  checkin_base_points: 25,
  streak_multiplier_threshold: 7,
  platform_fee_pct: 20,
  min_payout_melo: 10,
  maintenance_mode: false,
  feature_flags: { tips: true, live_events: true, governance: true, collections: true },
}

export function isFeatureEnabled(flags: FeatureFlags, feature: keyof FeatureFlags): boolean {
  return flags[feature] ?? false
}
