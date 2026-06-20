import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { SwapHistory } from '@/lib/types/swap'

export function useSwapHistory(wallet: string | undefined) {
  return useQuery<{ history: SwapHistory[] }>({
    queryKey: ['swap-history', wallet],
    queryFn: async () => {
      const res = await fetch('/api/swap/history', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load swap history')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 30_000,
  })
}

interface ConfirmSwapInput {
  quoteId?: string
  tokenIn: string
  tokenOut: string
  amountIn: number
  amountOut: number
  txHash: string
}

export function useConfirmSwap(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<SwapHistory, Error, ConfirmSwapInput>({
    mutationFn: async (body) => {
      const res = await fetch('/api/swap/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Confirm swap failed')
      }
      return (await res.json()).swap
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['swap-history', wallet] }),
  })
}
