import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Tip } from '@/lib/types/tips'

interface TipsResponse {
  tips: Tip[]
  totalReceived?: number
}

export function useReceivedTips(wallet: string | undefined) {
  return useQuery<TipsResponse>({
    queryKey: ['tips', 'received', wallet],
    queryFn: async () => {
      const res = await fetch('/api/tips', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load tips')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useSentTips(wallet: string | undefined) {
  return useQuery<TipsResponse>({
    queryKey: ['tips', 'sent', wallet],
    queryFn: async () => {
      const res = await fetch('/api/tips?mode=sent', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load tips')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useSendTip(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      recipient_wallet: string
      amount_melo: number
      message?: string
      video_id?: string
      tx_hash?: string
    }) => {
      const res = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to send tip')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tips'] })
    },
  })
}
