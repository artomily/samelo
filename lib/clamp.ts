/** Clamp a number within [min, max] bounds */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** Linear interpolation between a and b by t (0..1) */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1)
}

/** Map a value from one range to another */
export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const ratio = (value - inMin) / (inMax - inMin)
  return lerp(outMin, outMax, ratio)
}
