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
          'relative flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full text-sm font-bold transition-all',
          'disabled:cursor-not-allowed',
          status === 'success' && 'bg-accent/20 text-accent',
          status === 'error' && 'bg-danger/20 text-danger',
          !isBusy && status !== 'success' && status !== 'error' && hasEarnings && 'bg-accent text-bg hover:bg-accent-hover active:scale-95',
          (!hasEarnings || isBusy) && status !== 'success' && status !== 'error' && 'bg-card text-muted',
        )}
      >
        {isBusy && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {buttonLabel(status)}
        {hasEarnings && status === 'idle' && (
          <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-xs">
            ${dollars}
          </span>
        )}
      </button>

      {txHash && (
        <Link
          href={`${CELO_EXPLORER}${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted underline underline-offset-2 hover:text-primary"
        >
          View on Celoscan ↗
        </Link>
      )}
    </div>
  )
}
