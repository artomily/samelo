export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1)
}

export function roundTo(value: number, places: number): number {
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}

export function percentOf(part: number, total: number): number {
  if (total === 0) return 0
  return clamp(part / total, 0, 1)
}

export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0)
}

export function average(values: number[]): number {
  if (values.length === 0) return 0
  return sum(values) / values.length
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function pointsToMelo(points: number, pointsPerMelo = 1000): number {
  return points / pointsPerMelo
}

export function meloToPoints(melo: number, pointsPerMelo = 1000): number {
  return Math.floor(melo * pointsPerMelo)
}
