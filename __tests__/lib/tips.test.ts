import { describe, it, expect } from 'vitest'
import { formatMelo, tipStatusLabel, isConfirmed, TIP_PRESETS_MELO } from '@/lib/types/tips'
import type { Tip } from '@/lib/types/tips'

const makeTip = (overrides: Partial<Tip> = {}): Tip => ({
  id: 't1',
  sender_wallet: '0x1111111111111111111111111111111111111111',
  recipient_wallet: '0x2222222222222222222222222222222222222222',
  amount_melo: 5,
  message: null,
  video_id: null,
  tx_hash: null,
  status: 'pending',
  created_at: '2026-06-21T00:00:00Z',
  confirmed_at: null,
  ...overrides,
})

describe('formatMelo', () => {
  it('formats large amounts with 2dp', () => {
    expect(formatMelo(10)).toBe('10.00 MELO')
  })

  it('formats sub-1 amounts with 4dp', () => {
    expect(formatMelo(0.5)).toBe('0.5000 MELO')
  })

  it('formats very small amounts with 6dp', () => {
    expect(formatMelo(0.000001)).toBe('0.000001 MELO')
  })
})

describe('tipStatusLabel', () => {
  it('returns correct labels', () => {
    expect(tipStatusLabel('pending')).toBe('Pending')
    expect(tipStatusLabel('confirmed')).toBe('Confirmed')
    expect(tipStatusLabel('failed')).toBe('Failed')
  })
})

describe('isConfirmed', () => {
  it('returns true for confirmed tip', () => {
    expect(isConfirmed(makeTip({ status: 'confirmed' }))).toBe(true)
  })

  it('returns false for pending tip', () => {
    expect(isConfirmed(makeTip())).toBe(false)
  })
})

describe('TIP_PRESETS_MELO', () => {
  it('has 5 presets', () => {
    expect(TIP_PRESETS_MELO.length).toBe(5)
  })

  it('all presets are positive', () => {
    expect(TIP_PRESETS_MELO.every((p) => p > 0)).toBe(true)
  })
})
