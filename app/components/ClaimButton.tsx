'use client'

import Link from 'next/link'
import { useClaim, type ClaimStatus } from '@/hooks/useClaim'
import { useCUSDBalance } from '@/hooks/useCUSDBalance'
import { useAccount } from 'wagmi'
import { cn } from '@/lib/utils'

const CELO_EXPLORER = 'https://celoscan.io/tx/'

/**
 * Button status labels for different claim states
 * Guides user through the claiming process
 */
function buttonLabel(status: ClaimStatus): string {
  switch (status) {
    case 'fetching':
      return 'Checking…'
    case 'pending':
      return 'Confirm in wallet…'
    case 'confirming':
      return 'Confirming…'
    case 'success':
      return 'Claimed!'
    case 'error':
      return 'Retry Claim'
    default:
      return 'Claim cUSD'
  }
}

interface ClaimButtonProps {
  pendingCents: number
  onClaimed?: () => void
}

/**
 * ClaimButton - Manages the reward claiming workflow
 * Handles wallet confirmation, transaction tracking, and error recovery
 * Integrates with Celo blockchain and displays transaction on explorer
 */
export function ClaimButton({ pendingCents, onClaimed }: ClaimButtonProps) {
  const { address } = useAccount()
  const { refetch: refetchBalance } = useCUSDBalance(address)

  const { claim, status, txHash, reset } = useClaim(() => {
    refetchBalance()
    onClaimed?.()
    // Delay reset so "Claimed!" badge is visible for 2s
    setTimeout(reset, 2000)
  })

  const isBusy =
    status === 'fetching' || status === 'pending' || status === 'confirming'
  const hasEarnings = pendingCents > 0
  const dollars = (pendingCents / 100).toFixed(2)

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={status === 'error' ? () => { reset(); claim() } : claim}
        disabled={isBusy || !hasEarnings || status === 'success'}
        className={cn(
          'relative flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full font-display text-[13px] font-bold uppercase tracking-wider transition-all',
          'disabled:cursor-not-allowed',
          status === 'success' && 'border border-[rgba(200,241,53,0.3)] bg-[rgba(200,241,53,0.08)] text-accent',
          status === 'error' && 'border border-red-500/30 bg-red-500/10 text-red-400',
          !isBusy && status !== 'success' && status !== 'error' && hasEarnings && 'btn-neon',
          (!hasEarnings || isBusy) && status !== 'success' && status !== 'error' && 'border border-[rgba(200,241,53,0.08)] bg-[rgba(200,241,53,0.03)] text-muted/50',
        )}
        style={(!isBusy && status !== 'success' && status !== 'error' && hasEarnings) ? {
          boxShadow: '0 0 24px rgba(200,241,53,0.25)',
        } : {}}
      >
        {isBusy && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {buttonLabel(status)}
        {hasEarnings && status === 'idle' && (
          <span className="ml-1 rounded-full border border-[rgba(0,0,0,0.3)] bg-black/30 px-2 py-0.5 text-[10px]">
            ${dollars}
          </span>
        )}
      </button>

      {txHash && (
        <Link
          href={`${CELO_EXPLORER}${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-[10px] uppercase tracking-widest text-muted underline underline-offset-2 hover:text-accent"
        >
          View on Celoscan ↗
        </Link>
      )}
    </div>
  )
}
