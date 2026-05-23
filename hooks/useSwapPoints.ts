'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { SWAP_ABI } from '@/lib/swap.abi'
import { toast } from '@/app/components/Toast'

export type SwapStatus =
  | 'idle'
  | 'fetching'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'error'

export function useSwapPoints(onSuccess?: () => void) {
  const { address } = useAccount()
  const swapAddress = process.env.NEXT_PUBLIC_SWAP_ADDRESS as `0x${string}` | undefined

  const { writeContractAsync, isPending: isSending } = useWriteContract()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [isFetching, setIsFetching] = useState(false)
  const [swapError, setSwapError] = useState<string | null>(null)
  const [celoPreview, setCeloPreview] = useState<string | null>(null)

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash },
  })

  const successFiredRef = useRef(false)
  const lastAmountRef = useRef(0)

  useEffect(() => {
    if (isSuccess && !successFiredRef.current) {
      successFiredRef.current = true

      // Mark only the swapped amount as consumed
      if (address && txHash) {
        fetch('/api/rewards/confirm-claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address, txHash, amount: lastAmountRef.current }),
        }).catch(() => {})
      }

      onSuccess?.()
      toast('Swap complete! CELO is in your wallet', 'success')
    }
    if (!isSuccess && !txHash) {
      successFiredRef.current = false
    }
  }, [isSuccess, txHash, address, onSuccess])

  /**
   * Request an oracle signature for swapping `pointAmount` points to CELO,
   * then call swapPoints() on the SameloSwap contract.
   */
  const swapPoints = useCallback(
    async (pointAmount: number) => {
      if (!address) return

      if (!swapAddress) {
        toast('Swap contract not deployed yet — come back soon!', 'default')
        return
      }

      setSwapError(null)
      setIsFetching(true)
      lastAmountRef.current = pointAmount

      try {
        // Get oracle-signed swap authorization
        const res = await fetch('/api/rewards/swapauth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address, pointAmount }),
        })

        if (!res.ok) {
          const err = await res.json() as { error?: string }
          throw new Error(err.error ?? 'Could not get swap authorization')
        }

        const data = await res.json() as {
          pointAmount: number
          nonce: `0x${string}`
          signature: `0x${string}`
          celoPreview: string
        }

        setCeloPreview(data.celoPreview)
        setIsFetching(false)

        const hash = await writeContractAsync({
          address: swapAddress,
          abi: SWAP_ABI,
          functionName: 'swapPoints',
          args: [BigInt(data.pointAmount), data.nonce, data.signature],
        })

        setTxHash(hash)
      } catch (e) {
        setIsFetching(false)
        const msg = e instanceof Error ? e.message : 'Swap failed'
        setSwapError(msg)
        toast(msg, 'error')
      }
    },
    [address, swapAddress, writeContractAsync],
  )

  const status: SwapStatus = isFetching
    ? 'fetching'
    : isSending
      ? 'pending'
      : isConfirming
        ? 'confirming'
        : isSuccess
          ? 'success'
          : swapError
            ? 'error'
            : 'idle'

  return {
    swapPoints,
    status,
    txHash,
    celoPreview,
    error: swapError,
    reset: () => {
      setTxHash(undefined)
      setSwapError(null)
      setCeloPreview(null)
    },
  }
}
