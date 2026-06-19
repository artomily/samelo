import { useReadContract } from 'wagmi'
import { MELO_ABI, formatMelo, MELO_SYMBOL } from '@/lib/melo-token'

const MELO_ADDRESS = process.env.NEXT_PUBLIC_MELO_ADDRESS as `0x${string}` | undefined

export function useMeloBalance(walletAddress: `0x${string}` | undefined) {
  const { data: rawBalance, isLoading, error, refetch } = useReadContract({
    address: MELO_ADDRESS,
    abi: MELO_ABI,
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: !!walletAddress && !!MELO_ADDRESS,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  })

  const balance = rawBalance as bigint | undefined
  const formatted = balance !== undefined ? formatMelo(balance) : '0.000'

  return {
    raw: balance,
    formatted,
    symbol: MELO_SYMBOL,
    isLoading,
    error,
    refetch,
  }
}
