'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { POINTS_ABI } from '@/lib/points.abi'
import { toast } from '@/app/components/Toast'

type EarnStatus = 'idle' | 'pending' | 'confirming' | 'syncing' | 'error'

const POINTS_ADDRESS = process.env.NEXT_PUBLIC_POINTS_ADDRESS as `0x${string}` | undefined

interface EarnPointsButtonProps {
  onEarned?: (newTotal: number) => void
}

export function EarnPointsButton({ onEarned }: EarnPointsButtonProps) {
  const { address } = useAccount()
  const [status, setStatus] = useState<EarnStatus>('idle')
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { writeContractAsync } = useWriteContract()

  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash },
  })

  // ── On-chain reads ──────────────────────────────────────────────────────────
  const { data: cooldownRemaining, refetch: refetchCooldown } = useReadContract({
    address: POINTS_ADDRESS,
    abi: POINTS_ABI,
    functionName: 'cooldownRemaining',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!POINTS_ADDRESS, refetchInterval: 15_000 },
  })

  const cooldownSec = cooldownRemaining ? Number(cooldownRemaining) : 0
  const isCoolingDown = cooldownSec > 0

  // After on-chain confirmation → sync Supabase
  useEffect(() => {
    if (!txConfirmed || !txHash || !address) return

    setStatus('syncing')
    fetch('/api/rewards/earn-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: address, txHash }),
    })
      .then((r) => r.json())
      .then((d: { points?: number; total?: number; error?: string }) => {
        if (d.error) throw new Error(d.error)
        toast(`+${d.points ?? 10} points earned!`, 'success')
        onEarned?.(d.total ?? 0)
        void refetchCooldown()
      })
      .catch((e: unknown) => {
        toast((e instanceof Error ? e.message : 'Points recorded on-chain, sync pending'), 'default')
        onEarned?.(0)
      })
      .finally(() => {
        setStatus('idle')
        setTxHash(undefined)
      })
  }, [txConfirmed, txHash, address, onEarned, refetchCooldown])

  const handleEarn = useCallback(async () => {
    if (!address || status !== 'idle') return

    if (!POINTS_ADDRESS) {
      setStatus('syncing')
      try {
        const res = await fetch('/api/rewards/earn-points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address }),
        })
        const d = await res.json() as { points?: number; total?: number; error?: string }
        if (!res.ok) throw new Error(d.error ?? 'Failed to earn points')
        toast(`+${d.points ?? 10} points earned!`, 'success')
        onEarned?.(d.total ?? 0)
      } catch (e) {
        toast(e instanceof Error ? e.message : 'Error', 'error')
      } finally {
        setStatus('idle')
      }
      return
    }

    setStatus('pending')
    try {
      const hash = await writeContractAsync({
        address: POINTS_ADDRESS,
        abi: POINTS_ABI,
        functionName: 'earn',
      })
      setTxHash(hash)
      setStatus('confirming')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Transaction rejected'
      toast(msg.includes('CooldownActive') ? 'Cooldown active — try again later' : msg, 'error')
      setStatus('idle')
    }
  }, [address, status, writeContractAsync, onEarned])

  if (!address) return null

  const busy = status !== 'idle'

  const label =
    status === 'pending'    ? 'Confirm in wallet…' :
    status === 'confirming' ? 'Confirming…' :
    status === 'syncing'    ? 'Saving points…' :
    isCoolingDown           ? `Wait ${formatCooldown(cooldownSec)}`
                            : 'Earn 10 Points'

  return (
    <div className="space-y-1.5">
      <button
        onClick={handleEarn}
        disabled={busy || isCoolingDown}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3.5 text-sm font-semibold text-bg transition-opacity disabled:opacity-60"
      >
        {busy ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />
            <span>{label}</span>
          </>
        ) : (
          <>
            <span>⚡</span>
            <span>{label}</span>
          </>
        )}
      </button>
      {isCoolingDown && (
        <p className="text-center text-[10px] text-muted/50">
          On-chain cooldown active. Off-chain points still earnable by watching videos.
        </p>
      )}
    </div>
  )
}

function formatCooldown(seconds: number): string {
  if (seconds <= 0) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}
