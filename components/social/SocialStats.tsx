'use client'

import { useSocialStats } from '@/hooks/useFollow'

interface Props {
  wallet: string
  viewer?: string | null
}

export function SocialStats({ wallet, viewer }: Props) {
  const { data, isLoading } = useSocialStats(wallet, viewer)

  if (isLoading) {
    return <div className="flex gap-6 animate-pulse">{[1, 2].map(i => <div key={i} className="h-8 w-20 rounded bg-white/10" />)}</div>
  }

  return (
    <div className="flex gap-6">
      <div className="text-center">
        <p className="text-white font-bold text-lg">{data?.followerCount ?? 0}</p>
        <p className="text-white/40 text-xs">Followers</p>
      </div>
      <div className="text-center">
        <p className="text-white font-bold text-lg">{data?.followingCount ?? 0}</p>
        <p className="text-white/40 text-xs">Following</p>
      </div>
    </div>
  )
}
