import { MELO_ABI } from './melo.abi'

export const MELO_DECIMALS = 18
export const MELO_SYMBOL = '$MELO'

/** Points-to-MELO conversion: 1000 points = 1 MELO */
export const POINTS_PER_MELO = 1000

export function pointsToMelo(points: number): number {
  return points / POINTS_PER_MELO
}

export function meloToPoints(melo: number): number {
  return Math.floor(melo * POINTS_PER_MELO)
}

/** Format MELO balance for display: 1234567 → "1,234.567" */
export function formatMelo(raw: bigint): string {
  const divisor = BigInt(10 ** MELO_DECIMALS)
  const whole = raw / divisor
  const frac = raw % divisor
  const fracStr = frac.toString().padStart(MELO_DECIMALS, '0').slice(0, 3)
  return `${whole.toLocaleString()}.${fracStr}`
}

export { MELO_ABI }
