import { createClient } from '@supabase/supabase-js'
import type { SubscriptionTier, UserSubscription, UserSubscriptionWithTier, SubscriptionPeriod } from './types/subscription'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getAllTiers(): Promise<SubscriptionTier[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return data ?? []
}

export async function getActiveSubscription(wallet: string): Promise<UserSubscriptionWithTier | null> {
  const supabase = getSupabase()
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('user_subscriptions')
    .select('*, tier:subscription_tiers(*)')
    .eq('wallet', wallet)
    .eq('is_active', true)
    .gte('ends_at', now)
    .order('ends_at', { ascending: false })
    .limit(1)
    .single()
  return data ?? null
}

export async function createSubscription(
  wallet: string,
  tierId: string,
  period: SubscriptionPeriod,
  txHash?: string
): Promise<UserSubscription> {
  const supabase = getSupabase()
  const now = new Date()
  const endsAt = new Date(now)
  if (period === 'monthly') {
    endsAt.setMonth(endsAt.getMonth() + 1)
  } else {
    endsAt.setFullYear(endsAt.getFullYear() + 1)
  }

  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({
      wallet,
      tier_id: tierId,
      period,
      ends_at: endsAt.toISOString(),
      tx_hash: txHash ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function cancelSubscription(subscriptionId: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('user_subscriptions')
    .update({ is_active: false })
    .eq('id', subscriptionId)
    .eq('wallet', wallet)
}
