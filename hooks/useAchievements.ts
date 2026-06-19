import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { Achievement } from '@/lib/achievements'

async function fetchAchievements(wallet: string): Promise<{ achievements: Achievement[] }> {
  const res = await fetch(`/api/profile/achievements?wallet=${wallet}`)
  if (!res.ok) throw new Error('Failed to fetch achievements')
  return res.json()
}

export function useAchievements() {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['achievements', address],
    queryFn: () => fetchAchievements(address!),
    enabled: !!address,
    staleTime: 120_000,
  })
}
