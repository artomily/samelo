'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { POINTS_ABI } from '@/lib/points.abi'

const POINTS_ADDRESS = process.env.NEXT_PUBLIC_POINTS_ADDRESS as `0x${string}` | undefined

export type SwapStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error'

export function useSwapToMelo() {
  const { address } = useAccount()
  const [status, setStatus] = useState<SwapStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { writeContractAsync } = useWriteContract()
  const { isSuccess, isError } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (isSuccess && status === 'confirming') setStatus('success')
    if (isError && status === 'confirming') {
      setStatus('error')
      setError('Transaction reverted on-chain')
    }
  }, [isSuccess, isError, status])

  const swap = useCallback(
    async (pointsAmount: number) => {
      if (!address || !POINTS_ADDRESS || pointsAmount <= 0) return
      setStatus('pending')
      setError(null)
      try {
        const hash = await writeContractAsync({
          address: POINTS_ADDRESS,
          abi: POINTS_ABI,
          functionName: 'redeem',
          args: [BigInt(pointsAmount)],
        })
        setTxHash(hash)
        setStatus('confirming')
      } catch (e) {
        setStatus('error')
        setError(e instanceof Error ? e.message : 'Transaction failed')
      }
    },
    [address, writeContractAsync],
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setTxHash(undefined)
  }, [])

  const isDeployed = Boolean(POINTS_ADDRESS)

  return { swap, status, error, txHash, reset, isDeployed }
}
