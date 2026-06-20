'use client'
import { useWaitForTransactionReceipt } from 'wagmi'
import type { Hex } from 'viem'
import { getCeloScanUrl } from '@/lib/celo/chains'
import { useChainId } from 'wagmi'

export type TxStatus = 'idle' | 'pending' | 'success' | 'error'

export function useTxStatus(hash: Hex | undefined) {
  const chainId = useChainId()
  const { data: receipt, isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  })

  let status: TxStatus = 'idle'
  if (hash && isLoading) status = 'pending'
  else if (isSuccess) status = 'success'
  else if (isError) status = 'error'

  const explorerUrl = hash ? getCeloScanUrl(hash, chainId) : undefined

  return { status, receipt, explorerUrl, isLoading, isSuccess, isError }
}
