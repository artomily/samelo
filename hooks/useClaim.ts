'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TREASURY_ABI } from '@/lib/treasury.abi'
import { toast } from '@/app/components/Toast'

export type ClaimStatus =
  | 'idle'
  | 'fetching'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'error'

const isTestnet = process.env.NEXT_PUBLIC_CHAIN_ENV === 'testnet'

export function useClaim(onSuccess?: () => void) {
  const { address } = useAccount()

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
      toast('Claimed! CELO is in your wallet', 'success')
    }
  }, [isSuccess, onSuccess])

  const claim = useCallback(async () => {
    if (!address) return

    setClaimError(null)
    setIsFetching(true)

    try {
      if (isTestnet) {
        // ── Testnet path: server calls releaseReward on TreasurySimple ─────
        const res = await fetch('/api/rewards/release', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address }),
        })
        const data = await res.json() as { txHash?: string; amountWei?: string; error?: string; message?: string }

        if (!res.ok) {
          throw new Error(data.error ?? 'Release failed')
        }
        if (data.message === 'Nothing to claim') {
          toast('Nothing to claim yet — watch more videos!', 'default')
          setIsFetching(false)
          return
        }

        setIsFetching(false)
        setTxHash(data.txHash as `0x${string}` | undefined)
        toast('Claimed! CELO is in your wallet', 'success')
        onSuccess?.()
        return
      }

      // ── Mainnet path: user calls executeRewardAction on SameloTreasury ──
      const treasuryAddress = process.env
        .NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}` | undefined

      if (!treasuryAddress) {
        toast('Treasury not deployed yet — come back soon!', 'default')
        setIsFetching(false)
        return
      }

      const res = await fetch(`/api/rewards/claimable?walletAddress=${address}`)
      if (!res.ok) throw new Error('Could not fetch claimable amount')

      const data = await res.json() as {
        amountWei: string
        amountCents: number
        nonce: `0x${string}` | null
        signature: `0x${string}` | null
        devMode: boolean
      }

      if (data.devMode || !data.signature || !data.nonce) {
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
        address: treasuryAddress,
        abi: TREASURY_ABI,
        functionName: 'executeRewardAction',
        args: [address, BigInt(data.amountWei), 0, data.nonce, data.signature],
      })

      setTxHash(hash)
    } catch (e) {
      setIsFetching(false)
      const msg = e instanceof Error ? e.message : 'Transaction failed'
      setClaimError(msg)
      toast(msg, 'error')
    }
  }, [address, writeContractAsync, onSuccess])

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

