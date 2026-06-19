import { useReadContract } from 'wagmi'
import { MELO_ABI } from '@/lib/melo-token'

const MELO_ADDRESS = process.env.NEXT_PUBLIC_MELO_ADDRESS as `0x${string}` | undefined

export function useMeloAllowance(
  owner: `0x${string}` | undefined,
  spender: `0x${string}` | undefined,
) {
  const { data: allowance, isLoading, refetch } = useReadContract({
    address: MELO_ADDRESS,
    abi: MELO_ABI,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: !!owner && !!spender && !!MELO_ADDRESS,
      staleTime: 15_000,
    },
  })

  return {
    allowance: allowance as bigint | undefined,
    isLoading,
    refetch,
  }
}
