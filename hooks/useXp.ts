import { useQuery } from '@tanstack/react-query'

interface XpResponse {
  xp: number
  level: number
  levelTitle: string
  levelColor: string
  progressPct: number
  xpToNext: number
  history: Array<{
    id: string
    amount: number
    source: string
    description: string | null
    created_at: string
  }>
}

export function useXp(wallet: string | undefined) {
  return useQuery<XpResponse>({
    queryKey: ['xp', wallet],
    queryFn: async () => {
      const res = await fetch('/api/xp', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load XP')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}
