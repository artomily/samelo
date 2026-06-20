import { createClient } from '@supabase/supabase-js'
import type { ReferralCode, Referral } from './types/referral'
import { generateReferralCode, REFERRER_BONUS_POINTS, REFEREE_BONUS_POINTS } from './types/referral'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getOrCreateReferralCode(wallet: string): Promise<ReferralCode> {
  const supabase = getSupabase()

  const { data: existing } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .maybeSingle()

  if (existing) return existing

  const code = generateReferralCode(wallet)
  const { data, error } = await supabase
    .from('referral_codes')
    .insert({ wallet: wallet.toLowerCase(), code })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function applyReferralCode(
  refereeWallet: string,
  code: string
): Promise<Referral> {
  const supabase = getSupabase()

  const { data: refCode, error: codeErr } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()

  if (codeErr || !refCode) throw new Error('Invalid referral code')
  if (refCode.wallet === refereeWallet.toLowerCase()) throw new Error('Cannot refer yourself')
  if (refCode.max_uses !== null && refCode.uses >= refCode.max_uses) {
    throw new Error('Referral code has reached max uses')
  }

  const { data: referral, error: refErr } = await supabase
    .from('referrals')
    .insert({
      referrer_wallet: refCode.wallet,
      referee_wallet: refereeWallet.toLowerCase(),
      code: code.toUpperCase(),
      referrer_bonus: REFERRER_BONUS_POINTS,
      referee_bonus: REFEREE_BONUS_POINTS,
    })
    .select()
    .single()

  if (refErr) {
    if (refErr.code === '23505') throw new Error('Already referred')
    throw refErr
  }

  await supabase
    .from('referral_codes')
    .update({ uses: refCode.uses + 1 })
    .eq('id', refCode.id)

  return referral
}

export async function getReferrals(referrerWallet: string): Promise<Referral[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_wallet', referrerWallet.toLowerCase())
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getReferralStats(wallet: string) {
  const referrals = await getReferrals(wallet)
  const totalEarned = referrals.reduce((sum, r) => sum + r.referrer_bonus, 0)
  return { count: referrals.length, totalEarned, referrals }
}
