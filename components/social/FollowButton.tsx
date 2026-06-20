'use client'

import { useSocialStats, useFollow } from '@/hooks/useFollow'

interface Props {
  wallet: string
  viewer: string | null
}

export function FollowButton({ wallet, viewer }: Props) {
  const { data } = useSocialStats(wallet, viewer)
  const { follow, unfollow } = useFollow(viewer)

  if (!viewer || viewer === wallet) return null

  const isFollowing = data?.isFollowing ?? false

  const handleClick = () => {
    if (isFollowing) {
      unfollow.mutate(wallet)
    } else {
      follow.mutate(wallet)
    }
  }

  const isPending = follow.isPending || unfollow.isPending

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
        isFollowing
          ? 'border border-white/20 text-white/60 hover:border-red-500/50 hover:text-red-400'
          : 'bg-[#c8f135] text-black hover:bg-[#d9ff4d]'
      }`}
    >
      {isPending ? '…' : isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
