'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAccount } from 'wagmi'
import { trackPageView } from '@/lib/analytics/track'
import { getOrCreateSessionId } from '@/lib/analytics/session'

export function usePageTracking() {
  const pathname = usePathname()
  const { address } = useAccount()

  useEffect(() => {
    const sessionId = getOrCreateSessionId()
    trackPageView(pathname, {
      wallet: address,
      sessionId,
      referrer: document.referrer || undefined,
    })
  }, [pathname, address])
}
