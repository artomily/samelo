import type { Hex } from 'viem'
import { isCeloNetwork } from './chains'

export const MINIPAY_USER_AGENT_FRAGMENT = 'MiniPay'

export function isMiniPay(): boolean {
  if (typeof window === 'undefined') return false
  return navigator.userAgent.includes(MINIPAY_USER_AGENT_FRAGMENT)
}

export function shortenAddress(address: Hex, chars = 4): string {
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

export function checksumAddress(address: string): Hex {
  return address.toLowerCase() as Hex
}

export function isValidCeloAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

export function getExplorerLink(address: string, chainId: number): string {
  const base = chainId === 44787 ? 'https://alfajores.celoscan.io' : 'https://celoscan.io'
  return `${base}/address/${address}`
}

export function requireCeloNetwork(chainId: number | undefined): void {
  if (!chainId || !isCeloNetwork(chainId)) {
    throw new Error(`Must be on Celo network. Got chainId: ${chainId}`)
  }
}
