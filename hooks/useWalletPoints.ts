'use client'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { SWR_KEYS } from '@/lib/cache/swr-keys'

interface PointsData {
  wallet: string
  points: number
  totalEarned: number
  totalRedeemed: number
}

export function useWalletPoints() {
  const { address } = useAccount()

  return useQuery<PointsData>({
    queryKey: SWR_KEYS.profile(address ?? ''),
    queryFn: async () => {
      if (!address) throw new Error('No wallet connected')
      const res = await fetch(`/api/v1/profiles/${address}`)
      if (!res.ok) throw new Error('Failed to fetch points')
      return res.json()
    },
    enabled: !!address,
    staleTime: 30_000,
  })
}
