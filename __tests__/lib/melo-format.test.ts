import { describe, it, expect } from 'vitest'
import { formatMelo } from '@/lib/melo-token'

describe('formatMelo edge cases', () => {
  it('formats zero correctly', () => {
    expect(formatMelo(0n)).toBe('0.000')
  })

  it('formats exactly 1 MELO', () => {
    const oneEther = 10n ** 18n
    expect(formatMelo(oneEther)).toBe('1.000')
  })

  it('shows correct 3 decimal truncation', () => {
    // 1.999 MELO = 1999 * 10^15
    const raw = 1999n * 10n ** 15n
    expect(formatMelo(raw)).toBe('1.999')
  })

  it('formats large values with comma separator', () => {
    const raw = 1_000_000n * 10n ** 18n
    expect(formatMelo(raw)).toBe('1,000,000.000')
  })

  it('formats small fraction (0.001 MELO)', () => {
    const raw = 10n ** 15n // 0.001 MELO
    expect(formatMelo(raw)).toBe('0.001')
  })
})
