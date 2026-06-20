import { describe, it, expect } from 'vitest'
import { starLabel, renderStars, ratingColor } from '@/lib/types/video-ratings'

describe('starLabel', () => {
  it('returns correct labels for each rating', () => {
    expect(starLabel(1)).toBe('Poor')
    expect(starLabel(2)).toBe('Fair')
    expect(starLabel(3)).toBe('Good')
    expect(starLabel(4)).toBe('Great')
    expect(starLabel(5)).toBe('Excellent')
  })

  it('returns Unknown for out-of-range', () => {
    expect(starLabel(0)).toBe('Unknown')
    expect(starLabel(6)).toBe('Unknown')
  })
})

describe('renderStars', () => {
  it('renders 5 stars filled for rating 5', () => {
    expect(renderStars(5)).toBe('★★★★★')
  })

  it('renders mix of filled and empty', () => {
    const result = renderStars(3)
    expect(result.split('★').length - 1).toBe(3)
    expect(result.split('☆').length - 1).toBe(2)
  })

  it('renders 5 empty stars for rating 0', () => {
    expect(renderStars(0)).toBe('☆☆☆☆☆')
  })
})

describe('ratingColor', () => {
  it('returns lime for high ratings', () => {
    expect(ratingColor(4)).toBe('#c8f135')
    expect(ratingColor(5)).toBe('#c8f135')
  })

  it('returns yellow for mid ratings', () => {
    expect(ratingColor(3)).toBe('#f1c135')
  })

  it('returns red for low ratings', () => {
    expect(ratingColor(1)).toBe('#f13535')
    expect(ratingColor(2)).toBe('#f13535')
  })
})
