'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { REWARD_POOL_ABI } from '@/lib/rewardPool.abi'
import { toast } from '@/app/components/Toast'

export type ClaimStatus =
  | 'idle'
  | 'fetching'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'error'

export function useClaim(onSuccess?: () => void) {
  const { address } = useAccount()
  const poolAddress = process.env
    .NEXT_PUBLIC_REWARD_POOL_ADDRESS as `0x${string}` | undefined

  const { writeContractAsync, isPending: isSending } = useWriteContract()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [isFetching, setIsFetching] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash },
  })

  useEffect(() => {
    if (isSuccess) {
      onSuccess?.()
      toast('Claimed! cUSD is in your wallet', 'success')
    }
  }, [isSuccess, onSuccess])

  const claim = useCallback(async () => {
    if (!address) return

    if (!poolAddress || poolAddress === '0x') {
      toast('Reward pool not deployed yet — come back soon!', 'default')
      return
    }

    setClaimError(null)
    setIsFetching(true)

    try {
      const res = await fetch(`/api/rewards/claimable?walletAddress=${address}`)
      if (!res.ok) throw new Error('Could not fetch claimable amount')

      const data = await res.json() as {
        amountWei: string
        nonce: number
        signature: `0x${string}` | null
        devMode: boolean
      }

      if (data.devMode || !data.signature) {
        toast('Oracle not configured — deploy contract first', 'default')
        setIsFetching(false)
        return
      }

      if (BigInt(data.amountWei) === BigInt(0)) {
        toast('Nothing to claim yet — watch more videos!', 'default')
        setIsFetching(false)
        return
      }

      setIsFetching(false)

      const hash = await writeContractAsync({
        address: poolAddress,
        abi: REWARD_POOL_ABI,
        functionName: 'claim',
        args: [BigInt(data.amountWei), BigInt(data.nonce), data.signature],
      })

      setTxHash(hash)
    } catch (e) {
      setIsFetching(false)
      const msg = e instanceof Error ? e.message : 'Transaction failed'
      setClaimError(msg)
      toast(msg, 'error')
    }
  }, [address, poolAddress, writeContractAsync])

  const status: ClaimStatus = isFetching
    ? 'fetching'
    : isSending
      ? 'pending'
      : isConfirming
        ? 'confirming'
        : isSuccess
          ? 'success'
          : claimError
            ? 'error'
            : 'idle'

  return {
    claim,
    status,
    txHash,
    error: claimError,
    reset: () => {
      setTxHash(undefined)
      setClaimError(null)
    },
  }
}
