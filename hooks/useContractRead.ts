'use client'
import { useReadContract, useAccount, useChainId } from 'wagmi'
import { getContracts, SAMELO_POINTS_ABI, MELO_TOKEN_ABI } from '@/lib/celo/contracts'

export function useOnChainPoints() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contracts = getContracts(chainId)

  const { data, isLoading, error } = useReadContract({
    address: contracts.sameloPoints,
    abi: SAMELO_POINTS_ABI,
    functionName: 'points',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!contracts.sameloPoints, staleTime: 30_000 },
  })

  return { points: data ?? 0n, isLoading, error }
}

export function useMeloBalance() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contracts = getContracts(chainId)

  const { data, isLoading, error } = useReadContract({
    address: contracts.meloToken,
    abi: MELO_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!contracts.meloToken, staleTime: 30_000 },
  })

  return { balance: data ?? 0n, isLoading, error }
}

export function useMeloTotalSupply() {
  const chainId = useChainId()
  const contracts = getContracts(chainId)

  const { data, isLoading } = useReadContract({
    address: contracts.meloToken,
    abi: MELO_TOKEN_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!contracts.meloToken, staleTime: 60_000 },
  })

  return { totalSupply: data ?? 0n, isLoading }
}
