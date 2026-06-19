import { useEffect } from 'react'

const REFERRAL_KEY = 'samelo_referral_code'

export function captureReferralFromUrl(): void {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const code = params.get('ref')
  if (code) {
    sessionStorage.setItem(REFERRAL_KEY, code)
  }
}

export function getCapturedReferralCode(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(REFERRAL_KEY)
}

export function clearCapturedReferralCode(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(REFERRAL_KEY)
}

export function useAutoRedeemReferral(
  walletAddress: string | undefined,
  redeemFn: (code: string) => Promise<{ success: boolean }>,
): void {
  useEffect(() => {
    if (!walletAddress) return
    const code = getCapturedReferralCode()
    if (!code) return

    redeemFn(code).then(({ success }) => {
      if (success) clearCapturedReferralCode()
    })
  }, [walletAddress, redeemFn])
}
