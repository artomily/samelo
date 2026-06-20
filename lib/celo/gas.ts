import type { Hex } from 'viem'

export const CELO_GAS_CURRENCIES = {
  CELO: undefined,
  cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as Hex,
  cEUR: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73' as Hex,
} as const

export type GasCurrency = keyof typeof CELO_GAS_CURRENCIES

export const DEFAULT_GAS_LIMIT = 200_000n
export const SWAP_GAS_LIMIT = 300_000n
export const STAKE_GAS_LIMIT = 250_000n

export function getGasCurrencyAddress(currency: GasCurrency): Hex | undefined {
  return CELO_GAS_CURRENCIES[currency]
}

export function estimateGasCost(gasLimit: bigint, gasPrice: bigint): bigint {
  return gasLimit * gasPrice
}
