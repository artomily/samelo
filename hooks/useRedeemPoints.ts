'use client'
import { useWriteContract, useAccount, useChainId } from 'wagmi'
import { getContracts, SAMELO_POINTS_ABI } from '@/lib/celo/contracts'
import { requireCeloNetwork } from '@/lib/celo/wallet'
import { useQueryClient } from '@tanstack/react-query'
import { SWR_KEYS } from '@/lib/cache/swr-keys'

export function useRedeemPoints() {
  const { address } = useAccount()
  const chainId = useChainId()
  const qc = useQueryClient()
  const { writeContractAsync, data: hash, isPending, error, reset } = useWriteContract()

  async function redeem(pointsAmount: bigint) {
    if (!address) throw new Error('Wallet not connected')
    requireCeloNetwork(chainId)

    const contracts = getContracts(chainId)
    if (!contracts.sameloPoints) throw new Error('SameloPoints contract not configured')

    const txHash = await writeContractAsync({
      address: contracts.sameloPoints,
      abi: SAMELO_POINTS_ABI,
      functionName: 'redeem',
      args: [pointsAmount],
    })

    qc.invalidateQueries({ queryKey: SWR_KEYS.profile(address) })
    return txHash
  }

  return { redeem, hash, isPending, error, reset }
}
