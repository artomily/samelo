'use client'

import { useAccount } from 'wagmi'
import { useIsFollowing, useFollowToggle } from '@/hooks/useFollowV2'

interface Props {
  targetWallet: string
}

export function FollowButton({ targetWallet }: Props) {
  const { address } = useAccount()
  const { data, isLoading } = useIsFollowing(address, targetWallet)
  const { mutate, isPending } = useFollowToggle(address, targetWallet)

  if (!address || address.toLowerCase() === targetWallet.toLowerCase()) return null
  if (isLoading) return <div className="h-8 w-20 rounded-lg bg-white/10 animate-pulse" />

  const following = data?.following ?? false

  return (
    <button
      onClick={() => mutate(following)}
      disabled={isPending}
      className={[
        'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40',
        following
          ? 'border border-white/20 text-white/70 hover:border-red-400 hover:text-red-400'
          : 'text-[#030303]',
      ].join(' ')}
      style={!following ? { background: '#c8f135' } : {}}
    >
      {isPending ? '…' : following ? 'Following' : 'Follow'}
    </button>
  )
}
