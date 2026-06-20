import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { DailyCheckin } from '@/lib/types/checkin'

interface CheckinResponse extends DailyCheckin {
  alreadyCheckedIn: boolean
}

export function useCheckinHistory(wallet: string | undefined) {
  return useQuery<{ history: DailyCheckin[] }>({
    queryKey: ['checkin-history', wallet],
    queryFn: async () => {
      const res = await fetch('/api/checkin', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load check-in history')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useDoCheckin(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<CheckinResponse, Error>({
    mutationFn: async () => {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Check-in failed')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checkin-history', wallet] })
    },
  })
}
