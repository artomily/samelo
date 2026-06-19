import { useState, useCallback } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useMeloBalance } from './useMeloBalance'

interface SwapResult {
  txHash: string
  pointsSwapped: number
  meloReceived: string
}

async function fetchSwapAuth(walletAddress: string, pointAmount: number): Promise<{ signature: string; nonce: string }> {
  const res = await fetch('/api/rewards/swapauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, pointAmount }),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.error ?? 'Failed to get swap authorization')
  }
  return res.json()
}

export function useSwapPointsForMelo() {
  const { address } = useAccount()
  const { refetch: refetchBalance } = useMeloBalance(address)
  const [isSwapping, setIsSwapping] = useState(false)
  const [lastResult, setLastResult] = useState<SwapResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const swap = useCallback(async (pointAmount: number): Promise<SwapResult> => {
    if (!address) throw new Error('Wallet not connected')

    setIsSwapping(true)
    setError(null)

    try {
      // Get oracle authorization
      const { signature, nonce } = await fetchSwapAuth(address, pointAmount)

      // Call swap contract (placeholder — integrate with actual contract call)
      const res = await fetch('/api/rewards/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, pointAmount, signature, nonce }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Swap failed')
      }

      const result: SwapResult = await res.json()
      setLastResult(result)
      await refetchBalance()
      return result
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Swap failed'
      setError(msg)
      throw e
    } finally {
      setIsSwapping(false)
    }
  }, [address, refetchBalance])

  return { swap, isSwapping, lastResult, error }
}
