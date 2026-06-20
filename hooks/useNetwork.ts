'use client'
import { useChainId, useSwitchChain } from 'wagmi'
import { isCeloNetwork, CELO_MAINNET, CELO_TESTNET } from '@/lib/celo/chains'

export function useCeloNetwork() {
  const chainId = useChainId()
  const { switchChain, isPending, error } = useSwitchChain()

  const isOnCelo = isCeloNetwork(chainId)
  const isMainnet = chainId === CELO_MAINNET.id
  const isTestnet = chainId === CELO_TESTNET.id

  function switchToMainnet() {
    switchChain({ chainId: CELO_MAINNET.id })
  }

  function switchToTestnet() {
    switchChain({ chainId: CELO_TESTNET.id })
  }

  return {
    chainId,
    isOnCelo,
    isMainnet,
    isTestnet,
    isPending,
    error,
    switchToMainnet,
    switchToTestnet,
  }
}
