import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ChallengeWithProgress } from '@/lib/types/user-challenges'

export function useUserChallenges(wallet?: string) {
  return useQuery({
    queryKey: ['challenges', wallet],
    queryFn: async () => {
      const res = await fetch('/api/challenges', {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to fetch challenges')
      return res.json() as Promise<{ challenges: ChallengeWithProgress[] }>
    },
  })
}

export function useClaimChallengeReward(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (challengeId: string) => {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ action: 'claim', challenge_id: challengeId }),
      })
      if (!res.ok) throw new Error('Claim failed')
      return res.json() as Promise<{ reward_melo: number }>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['challenges', wallet] }),
  })
}

export function useIncrementChallenge(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ challengeId, by = 1 }: { challengeId: string; by?: number }) => {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ challenge_id: challengeId, by }),
      })
      if (!res.ok) throw new Error('Failed to increment')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['challenges', wallet] }),
  })
}
