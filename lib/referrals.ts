import { createClient } from '@supabase/supabase-js'
import type { ReferralCode, ReferralConversion } from './types/referrals'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function generateCode(wallet: string): string {
  const suffix = wallet.slice(-6).toUpperCase()
  const prefix = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `${prefix}${suffix}`
}

export async function getOrCreateReferralCode(wallet: string): Promise<ReferralCode> {
  const supabase = getSupabase()
  const { data: existing } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('wallet', wallet)
    .single()

  if (existing) return existing

  const code = generateCode(wallet)
  const { data, error } = await supabase
    .from('referral_codes')
    .insert({ wallet, code })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getReferralCodeByCode(code: string): Promise<ReferralCode | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()
  return data ?? null
}

export async function recordConversion(
  referralCodeId: string,
  referredWallet: string
): Promise<ReferralConversion | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('referral_conversions')
    .insert({ referral_code_id: referralCodeId, referred_wallet: referredWallet })
    .select()
    .single()
  if (error) return null

  await supabase.rpc('increment_referral_uses', { code_id: referralCodeId })
  return data
}

export async function getWalletConversions(wallet: string): Promise<ReferralConversion[]> {
  const supabase = getSupabase()
  const { data: code } = await supabase
    .from('referral_codes')
    .select('id')
    .eq('wallet', wallet)
    .single()

  if (!code) return []

  const { data } = await supabase
    .from('referral_conversions')
    .select('*')
    .eq('referral_code_id', code.id)
    .order('converted_at', { ascending: false })
  return data ?? []
}

export async function markBonusPaid(conversionId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('referral_conversions')
    .update({ bonus_paid: true })
    .eq('id', conversionId)
}
