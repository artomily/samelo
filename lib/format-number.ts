/** Format large numbers with K/M suffix for compact display */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

/** Format as percentage string with N decimal places */
export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/** Format MELO amount with 3 decimals */
export function formatMeloAmount(raw: string | number): string {
  return typeof raw === 'number' ? raw.toFixed(3) : parseFloat(raw).toFixed(3)
}
