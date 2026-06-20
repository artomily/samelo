import { useQuery, useMutation } from '@tanstack/react-query'
import type { SignalType } from '@/lib/types/recommendations'

export function useRecommendations(wallet: string | undefined) {
  return useQuery<{ videoIds: string[] }>({
    queryKey: ['recommendations', wallet],
    queryFn: async () => {
      const res = await fetch('/api/recommendations', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load recommendations')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 300_000,
  })
}

export function useRecordSignal(wallet: string | undefined) {
  return useMutation({
    mutationFn: async ({ videoId, signalType }: { videoId: string; signalType: SignalType }) => {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify({ video_id: videoId, signal_type: signalType }),
      })
      if (!res.ok) throw new Error('Failed to record signal')
      return res.json()
    },
  })
}
