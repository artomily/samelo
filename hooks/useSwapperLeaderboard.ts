import { useQuery } from '@tanstack/react-query'

interface SwapLeader {
  rank: number
  wallet: string
  walletFull: string
  totalPointsBurned: number
  totalMelo: string
  swapCount: number
}

async function fetchSwapLeaders(): Promise<SwapLeader[]> {
  const res = await fetch('/api/onchain/leaderboard-swappers')
  if (!res.ok) throw new Error('Failed to fetch swapper leaderboard')
  const json = await res.json()
  return json.leaders
}

export function useSwapperLeaderboard() {
  return useQuery({
    queryKey: ['swapper-leaderboard'],
    queryFn: fetchSwapLeaders,
    staleTime: 120_000,
  })
}
