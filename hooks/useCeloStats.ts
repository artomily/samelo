'use client'
import { useQuery } from '@tanstack/react-query'
import { useMeloTotalSupply } from './useContractRead'
import { formatTokenAmount } from '@/lib/celo/tokens'

interface CeloNetworkStats {
  totalSupply: string
  circulatingSupply: string
  pointsRedeemed: number
  meloMinted: number
}

export function useCeloStats() {
  const { totalSupply } = useMeloTotalSupply()

  const { data: onchainData } = useQuery({
    queryKey: ['celo-stats'],
    queryFn: async () => {
      const res = await fetch('/api/v1/stats')
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
    staleTime: 60_000,
  })

  return {
    totalSupply: formatTokenAmount(totalSupply),
    pointsRedeemed: onchainData?.totalRedemptions ?? 0,
    meloMinted: onchainData?.totalMeloMinted ?? 0,
  }
}
