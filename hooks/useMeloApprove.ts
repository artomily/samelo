import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { MELO_ABI } from '@/lib/melo-token'

const MELO_ADDRESS = process.env.NEXT_PUBLIC_MELO_ADDRESS as `0x${string}` | undefined

export function useMeloApprove() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  function approve(spender: `0x${string}`, amount: bigint) {
    if (!MELO_ADDRESS) throw new Error('MELO contract address not configured')
    writeContract({
      address: MELO_ADDRESS,
      abi: MELO_ABI,
      functionName: 'approve',
      args: [spender, amount],
    })
  }

  return {
    approve,
    txHash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}
