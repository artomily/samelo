'use client'
import type { Hex } from 'viem'
import { useTxStatus } from '@/hooks/useTxStatus'

interface TxStatusProps {
  hash: Hex | undefined
  onSuccess?: () => void
}

export function TxStatus({ hash, onSuccess }: TxStatusProps) {
  const { status, explorerUrl } = useTxStatus(hash)

  if (status === 'idle') return null

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-2 text-sm text-white/60">
        <span className="w-3 h-3 rounded-full border-2 border-[#c8f135] border-t-transparent animate-spin" />
        Confirming on Celo…
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-[#c8f135]">
        <span>✓</span>
        Transaction confirmed.{' '}
        {explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="underline">
            View on Celoscan
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="text-sm text-red-400">
      Transaction failed.{' '}
      {explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="underline">
          View on Celoscan
        </a>
      )}
    </div>
  )
}
