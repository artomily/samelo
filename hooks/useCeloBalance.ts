'use client'
import { useBalance, useAccount } from 'wagmi'
import { STABLE_TOKEN_ADDRESSES } from '@/lib/celo/tokens'

export function useCeloBalance() {
  const { address } = useAccount()
  const { data, isLoading, error } = useBalance({
    address,
    query: { enabled: !!address, staleTime: 15_000 },
  })
  return { balance: data?.value ?? 0n, formatted: data?.formatted ?? '0', isLoading, error }
}

export function useCusdBalance() {
  const { address } = useAccount()
  const { data, isLoading, error } = useBalance({
    address,
    token: STABLE_TOKEN_ADDRESSES.cUSD,
    query: { enabled: !!address, staleTime: 15_000 },
  })
  return { balance: data?.value ?? 0n, formatted: data?.formatted ?? '0', isLoading, error }
}

export function useCeurBalance() {
  const { address } = useAccount()
  const { data, isLoading, error } = useBalance({
    address,
    token: STABLE_TOKEN_ADDRESSES.cEUR,
    query: { enabled: !!address, staleTime: 15_000 },
  })
  return { balance: data?.value ?? 0n, formatted: data?.formatted ?? '0', isLoading, error }
}
