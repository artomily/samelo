'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export interface AnalyticsData {
  poolBalance: string       // CELO in reward pool (formatted, 18 dec)
  totalPaidOut: string      // lifetime CELO paid out
  videosToday: number       // distinct videos watched today
  totalWatchers: number     // distinct wallets ever
  userEarningsCents: number // current user's unclaimed cents
  leaderboard: { wallet: string; totalCents: number }[]
}

export function useAnalytics(refreshInterval = 30_000) {
  const { address } = useAccount()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchAnalytics = async () => {
      try {
        const params = address ? `?walletAddress=${address}` : ''
        const res = await fetch(`/api/analytics${params}`)
        if (!res.ok) throw new Error('Failed to fetch analytics')
        const json = await res.json() as AnalyticsData
        if (!cancelled) {
          setData(json)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, refreshInterval)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [address, refreshInterval])

  return { data, isLoading, error }
}
