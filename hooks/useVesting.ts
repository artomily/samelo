import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { VestingSchedule, VestingClaim } from '@/lib/types/vesting'

interface VestingResponse {
  schedules: (VestingSchedule & { claimable: number })[]
}

export function useVestingSchedules(wallet: string | undefined) {
  return useQuery<VestingResponse>({
    queryKey: ['vesting', wallet],
    queryFn: async () => {
      const res = await fetch(`/api/vesting/${wallet}`)
      if (!res.ok) throw new Error('Failed to load vesting schedules')
      return res.json()
    },
    enabled: !!wallet && /^0x[0-9a-fA-F]{40}$/.test(wallet),
    staleTime: 60_000,
  })
}

export function useClaimVested(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<VestingClaim, Error, { scheduleId: string }>({
    mutationFn: async ({ scheduleId }) => {
      const res = await fetch('/api/vesting/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify({ scheduleId }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Claim failed')
      }
      return (await res.json()).claim
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vesting', wallet] })
    },
  })
}
