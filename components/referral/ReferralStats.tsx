'use client'

import { useQuery } from '@tanstack/react-query'

interface Props {
  wallet: string
}

interface Stats {
  count: number
  totalEarned: number
}

export function ReferralStats({ wallet }: Props) {
  const { data, isLoading } = useQuery<Stats>({
    queryKey: ['referral-stats-comp', wallet],
    queryFn: async () => {
      const res = await fetch('/api/referral/stats', {
        headers: { 'x-wallet-address': wallet },
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })

  if (isLoading) return <div className="h-16 rounded-xl bg-white/5 animate-pulse" />

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
        <p className="text-2xl font-bold" style={{ color: '#c8f135' }}>{data?.count ?? 0}</p>
        <p className="text-xs text-white/40 mt-1">Friends referred</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
        <p className="text-2xl font-bold" style={{ color: '#c8f135' }}>{data?.totalEarned ?? 0}</p>
        <p className="text-xs text-white/40 mt-1">Points earned</p>
      </div>
    </div>
  )
}
