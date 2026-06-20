import { formatUnits, parseUnits } from 'viem'

export const CELO_DECIMALS = 18

export const STABLE_TOKEN_ADDRESSES = {
  cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const,
  cEUR: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73' as const,
  cREAL: '0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787' as const,
} as const

export type StableToken = keyof typeof STABLE_TOKEN_ADDRESSES

export const TOKEN_SYMBOLS: Record<string, string> = {
  [STABLE_TOKEN_ADDRESSES.cUSD]: 'cUSD',
  [STABLE_TOKEN_ADDRESSES.cEUR]: 'cEUR',
  [STABLE_TOKEN_ADDRESSES.cREAL]: 'cREAL',
}

export function formatTokenAmount(raw: bigint, decimals = CELO_DECIMALS, precision = 4): string {
  const formatted = formatUnits(raw, decimals)
  const num = parseFloat(formatted)
  return num.toFixed(precision).replace(/\.?0+$/, '')
}

export function parseTokenAmount(amount: string, decimals = CELO_DECIMALS): bigint {
  return parseUnits(amount, decimals)
}

export function getTokenSymbol(address: string): string {
  return TOKEN_SYMBOLS[address.toLowerCase()] ?? TOKEN_SYMBOLS[address] ?? 'TOKEN'
}

export function isStableToken(address: string): boolean {
  const lower = address.toLowerCase()
  return Object.values(STABLE_TOKEN_ADDRESSES).some(a => a.toLowerCase() === lower)
}
