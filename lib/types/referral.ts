export interface ReferralCode {
  id: string
  wallet: string
  code: string
  uses: number
  max_uses: number | null
  created_at: string
}

export interface Referral {
  id: string
  referrer_wallet: string
  referee_wallet: string
  code: string
  referrer_bonus: number
  referee_bonus: number
  paid_at: string | null
  created_at: string
}

export const REFERRER_BONUS_POINTS = 200
export const REFEREE_BONUS_POINTS = 100

export function generateReferralCode(wallet: string): string {
  const suffix = wallet.slice(2, 8).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `SMLO-${suffix}-${rand}`
}
