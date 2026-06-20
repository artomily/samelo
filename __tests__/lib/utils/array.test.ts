import { describe, it, expect } from 'vitest'
import { groupBy, uniqueBy, sortBy, chunk, flatten, countBy, range } from '@/lib/utils/array'

describe('groupBy', () => {
  it('groups items by key', () => {
    const items = [{ type: 'a' }, { type: 'b' }, { type: 'a' }]
    const result = groupBy(items, i => i.type)
    expect(result.a).toHaveLength(2)
    expect(result.b).toHaveLength(1)
  })
})

describe('uniqueBy', () => {
  it('removes duplicates by key', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 1 }]
    expect(uniqueBy(items, i => i.id)).toHaveLength(2)
  })
})

describe('sortBy', () => {
  it('sorts asc by default', () => {
    const items = [{ n: 3 }, { n: 1 }, { n: 2 }]
    expect(sortBy(items, i => i.n).map(i => i.n)).toEqual([1, 2, 3])
  })

  it('sorts desc', () => {
    const items = [{ n: 1 }, { n: 3 }, { n: 2 }]
    expect(sortBy(items, i => i.n, 'desc').map(i => i.n)).toEqual([3, 2, 1])
  })
})

describe('chunk', () => {
  it('chunks array into groups', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })
})

describe('flatten', () => {
  it('flattens 2d array', () => {
    expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4])
  })
})

describe('countBy', () => {
  it('counts items by key', () => {
    const items = [{ type: 'a' }, { type: 'b' }, { type: 'a' }]
    expect(countBy(items, i => i.type)).toEqual({ a: 2, b: 1 })
  })
})

describe('range', () => {
  it('generates range', () => {
    expect(range(1, 4)).toEqual([1, 2, 3])
  })

  it('generates empty range', () => {
    expect(range(5, 5)).toEqual([])
  })
})
