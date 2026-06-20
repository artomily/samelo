'use client'
import { useReadContract, useWriteContract, useAccount, useChainId } from 'wagmi'
import { getContracts, MELO_TOKEN_ABI } from '@/lib/celo/contracts'

export function useTokenAllowance(spender: `0x${string}` | undefined) {
  const { address } = useAccount()
  const chainId = useChainId()
  const contracts = getContracts(chainId)

  const { data, isLoading, refetch } = useReadContract({
    address: contracts.meloToken,
    abi: MELO_TOKEN_ABI,
    functionName: 'allowance',
    args: address && spender ? [address, spender] : undefined,
    query: { enabled: !!address && !!spender && !!contracts.meloToken, staleTime: 10_000 },
  })

  return { allowance: data ?? 0n, isLoading, refetch }
}

export function useApproveToken() {
  const chainId = useChainId()
  const contracts = getContracts(chainId)
  const { writeContractAsync, isPending, error } = useWriteContract()

  async function approve(spender: `0x${string}`, amount: bigint) {
    if (!contracts.meloToken) throw new Error('No MELO token contract configured')
    return writeContractAsync({
      address: contracts.meloToken,
      abi: MELO_TOKEN_ABI,
      functionName: 'approve',
      args: [spender, amount],
    })
  }

  return { approve, isPending, error }
}
