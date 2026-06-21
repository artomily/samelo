import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { WatchStreak, WatchStreakCheckpoint } from '@/lib/types/watch-streaks'

export function useWatchStreak(wallet?: string) {
  return useQuery({
    queryKey: ['watch-streak', wallet],
    queryFn: async () => {
      const res = await fetch('/api/streaks', {
        headers: { 'x-wallet-address': wallet! },
      })
      if (!res.ok) throw new Error('Failed to fetch streak')
      return res.json() as Promise<{ streak: WatchStreak | null; checkpoints: WatchStreakCheckpoint[] }>
    },
    enabled: !!wallet,
  })
}

export function useStreakLeaderboard(limit = 20) {
  return useQuery({
    queryKey: ['streak-leaderboard', limit],
    queryFn: async () => {
      const res = await fetch(`/api/streaks?mode=leaderboard&limit=${limit}`)
      if (!res.ok) throw new Error('Failed to fetch leaderboard')
      return res.json() as Promise<{ leaderboard: WatchStreak[] }>
    },
    staleTime: 60_000,
  })
}

export function useRecordWatchDay(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (minutesWatched: number) => {
      const res = await fetch('/api/streaks', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ minutes_watched: minutesWatched }),
      })
      if (!res.ok) throw new Error('Failed to record watch day')
      return res.json() as Promise<{ streak: WatchStreak }>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watch-streak', wallet] })
      qc.invalidateQueries({ queryKey: ['streak-leaderboard'] })
    },
  })
}
