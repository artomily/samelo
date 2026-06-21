export interface ReferralCode {
  id: string
  wallet: string
  code: string
  bonus_melo: number
  is_active: boolean
  max_uses: number | null
  total_uses: number
  created_at: string
}

export interface ReferralConversion {
  id: string
  referral_code_id: string
  referred_wallet: string
  bonus_paid: boolean
  converted_at: string
}

export interface ReferralWithConversions extends ReferralCode {
  conversions: ReferralConversion[]
}

export function buildReferralUrl(code: string, baseUrl = ''): string {
  return `${baseUrl}/join?ref=${code}`
}

export function isCapacityFull(code: ReferralCode): boolean {
  if (code.max_uses === null) return false
  return code.total_uses >= code.max_uses
}

export function remainingCapacity(code: ReferralCode): number | null {
  if (code.max_uses === null) return null
  return Math.max(0, code.max_uses - code.total_uses)
}

export function conversionRate(code: ReferralCode, conversions: ReferralConversion[]): number {
  if (code.total_uses === 0) return 0
  const paid = conversions.filter((c) => c.bonus_paid).length
  return Math.round((paid / code.total_uses) * 1000) / 10
}
