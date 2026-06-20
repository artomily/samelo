export type SubscriptionPeriod = 'monthly' | 'yearly'

export interface SubscriptionTier {
  id: string
  name: string
  display_name: string
  price_melo_monthly: number
  price_melo_yearly: number
  features: string[]
  max_watch_hours_per_day: number | null
  bonus_points_pct: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface UserSubscription {
  id: string
  wallet: string
  tier_id: string
  period: SubscriptionPeriod
  starts_at: string
  ends_at: string
  tx_hash: string | null
  is_active: boolean
  created_at: string
}

export interface UserSubscriptionWithTier extends UserSubscription {
  tier: SubscriptionTier
}

export function isSubscriptionActive(sub: UserSubscription): boolean {
  return sub.is_active && new Date(sub.ends_at) > new Date()
}

export function subscriptionPrice(tier: SubscriptionTier, period: SubscriptionPeriod): number {
  return period === 'yearly' ? tier.price_melo_yearly : tier.price_melo_monthly
}

export function yearlyDiscount(tier: SubscriptionTier): number {
  if (tier.price_melo_monthly === 0) return 0
  const annualAtMonthly = tier.price_melo_monthly * 12
  const discount = (annualAtMonthly - tier.price_melo_yearly) / annualAtMonthly
  return Math.round(discount * 100)
}
