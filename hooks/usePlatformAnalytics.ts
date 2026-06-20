import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import type { PlatformMetrics } from '@/lib/types/platform-analytics'

export function usePlatformMetrics(adminWallet: string | undefined, days = 30) {
  return useQuery<{ metrics: PlatformMetrics }>({
    queryKey: ['platform-metrics', adminWallet, days],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/platform?days=${days}`, {
        headers: { 'x-wallet-address': adminWallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load platform metrics')
      return res.json()
    },
    enabled: !!adminWallet,
    staleTime: 120_000,
  })
}

export function useTrackFeature(wallet: string | undefined) {
  return useCallback(
    async (feature: string, action: string, metadata?: Record<string, unknown>) => {
      if (!wallet) return
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet,
        },
        body: JSON.stringify({ type: 'feature', feature, action, metadata }),
      }).catch(() => {})
    },
    [wallet]
  )
}

export function useTrackPageView() {
  return useCallback(
    async (path: string, wallet?: string, referrer?: string, sessionId?: string) => {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(wallet ? { 'x-wallet-address': wallet } : {}),
        },
        body: JSON.stringify({ type: 'pageview', path, referrer, session_id: sessionId }),
      }).catch(() => {})
    },
    []
  )
}
