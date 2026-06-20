'use client'

import { useClaimVested } from '@/hooks/useVesting'

interface Props {
  scheduleId: string
  wallet: string
  claimable: number
  onSuccess?: () => void
}

export function ClaimButton({ scheduleId, wallet, claimable, onSuccess }: Props) {
  const { mutate, isPending, isSuccess, error } = useClaimVested(wallet)

  const disabled = isPending || claimable <= 0

  function handleClaim() {
    mutate({ scheduleId }, { onSuccess })
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleClaim}
        disabled={disabled}
        className="px-4 py-2 rounded text-sm font-medium transition-opacity disabled:opacity-40"
        style={{ background: '#c8f135', color: '#030303' }}
      >
        {isPending ? 'Claiming…' : `Claim ${claimable.toFixed(2)} MELO`}
      </button>
      {isSuccess && <p className="text-xs text-[#c8f135]">Claimed successfully</p>}
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  )
}
