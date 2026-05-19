'use client'

import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { REWARD_POOL_ABI } from '@/lib/rewardPool.abi'
import { CUSD_DECIMALS } from '@/lib/tokens'

const REWARD_POOL_ADDRESS = (process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS ?? '0x') as `0x${string}`

export function RewardPoolBalance() {
  const { isConnected } = useAccount()

  const { data: balance, isLoading } = useReadContract({
    address: REWARD_POOL_ADDRESS,
    abi: REWARD_POOL_ABI,
    functionName: 'poolBalance',
    query: {
      enabled: isConnected && REWARD_POOL_ADDRESS !== '0x',
      refetchInterval: 30_000,
    },
  })

  if (REWARD_POOL_ADDRESS === '0x') return null

  const formatted =
    balance !== undefined
      ? (Number(balance) / 10 ** CUSD_DECIMALS).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-accent" />
      <span className="text-xs text-muted">Reward pool</span>
      {isLoading || formatted === null ? (
        <span className="ml-auto h-4 w-20 animate-pulse rounded bg-border" />
      ) : (
        <span className="ml-auto text-sm font-bold text-accent">${formatted} cUSD</span>
      )}
    </div>
  )
}
