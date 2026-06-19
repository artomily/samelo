import { useQuery } from '@tanstack/react-query'

interface SwapRecord {
  id: string
  pointsBurned: number
  meloReceived: string
  txHash: string | null
  createdAt: string
}

async function fetchSwapHistory(walletAddress: string): Promise<SwapRecord[]> {
  const res = await fetch(`/api/rewards/swap-history?walletAddress=${walletAddress}`)
  if (!res.ok) throw new Error('Failed to fetch swap history')
  const json = await res.json()
  return json.swaps
}

export function useSwapHistory(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['swap-history', walletAddress],
    queryFn: () => fetchSwapHistory(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 60_000,
  })
}
