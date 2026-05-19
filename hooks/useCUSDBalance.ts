'use client'

import { useReadContract } from 'wagmi'
import { erc20Abi, formatUnits } from 'viem'
import { CUSD_ADDRESS, CUSD_DECIMALS } from '@/lib/tokens'

export function useCUSDBalance(address?: `0x${string}`) {
  const { data, isLoading, refetch } = useReadContract({
    address: CUSD_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15_000,
    },
  })

  const raw = data as bigint | undefined
  const formatted =
    raw !== undefined ? Number(formatUnits(raw, CUSD_DECIMALS)) : undefined

  return {
    raw,
    formatted,
    display: formatted !== undefined ? formatted.toFixed(2) : '—',
    isLoading,
    refetch,
  }
}
