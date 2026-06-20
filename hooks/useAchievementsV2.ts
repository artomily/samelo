import { useQuery } from '@tanstack/react-query'
import type { UserAchievement } from '@/lib/types/achievement'

interface AchievementsResponse {
  achievements: UserAchievement[]
  unlockedCount: number
}

export function useUserAchievements(wallet: string | undefined) {
  return useQuery<AchievementsResponse>({
    queryKey: ['achievements-v2', wallet],
    queryFn: async () => {
      const res = await fetch('/api/achievements', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load achievements')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useAchievementsSummary(wallet: string | undefined) {
  const { data, isLoading } = useUserAchievements(wallet)
  const unlocked = data?.achievements.filter((a) => a.unlocked_at !== null) ?? []
  const inProgress = data?.achievements.filter((a) => a.unlocked_at === null && a.progress > 0) ?? []
  return { unlocked, inProgress, total: data?.unlockedCount ?? 0, isLoading }
}
