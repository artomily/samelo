import type { TreasuryMetrics } from '@/lib/types/onchain'

/** Calculate the burn rate: % of issued points that have been swapped to $MELO */
export function calcBurnRate(metrics: Pick<TreasuryMetrics, 'totalPointsBurned' | 'totalPointsDistributed'>): number {
  if (metrics.totalPointsDistributed === 0) return 0
  return (metrics.totalPointsBurned / metrics.totalPointsDistributed) * 100
}

/** Calculate conversion efficiency: average $MELO earned per 100 points issued */
export function calcConversionEfficiency(metrics: Pick<TreasuryMetrics, 'totalMeloMinted' | 'totalPointsDistributed'>): number {
  if (metrics.totalPointsDistributed === 0) return 0
  return (metrics.totalMeloMinted / metrics.totalPointsDistributed) * 100
}

/** Calculate average points issued per watch event */
export function calcAvgPointsPerWatch(metrics: Pick<TreasuryMetrics, 'totalPointsDistributed' | 'totalWatches'>): number {
  if (metrics.totalWatches === 0) return 0
  return metrics.totalPointsDistributed / metrics.totalWatches
}
