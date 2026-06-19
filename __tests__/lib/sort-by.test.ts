import { describe, it, expect } from 'vitest'
import { byNumericDesc, byStringAsc, stableSortBy } from '@/lib/sort-by'

interface Item {
  name: string
  score: number
}

describe('byNumericDesc', () => {
  it('sorts items descending by score', () => {
    const items: Item[] = [{ name: 'a', score: 5 }, { name: 'b', score: 10 }, { name: 'c', score: 1 }]
    const sorted = [...items].sort(byNumericDesc<Item>('score'))
    expect(sorted.map(i => i.score)).toEqual([10, 5, 1])
  })
})

describe('byStringAsc', () => {
  it('sorts items ascending by name', () => {
    const items: Item[] = [{ name: 'charlie', score: 0 }, { name: 'alice', score: 0 }, { name: 'bob', score: 0 }]
    const sorted = [...items].sort(byStringAsc<Item>('name'))
    expect(sorted.map(i => i.name)).toEqual(['alice', 'bob', 'charlie'])
  })
})

describe('stableSortBy', () => {
  it('preserves original order for equal items', () => {
    const items = [{ id: 1, score: 10 }, { id: 2, score: 10 }, { id: 3, score: 10 }]
    const sorted = stableSortBy(items, byNumericDesc<typeof items[0]>('score'))
    expect(sorted.map(i => i.id)).toEqual([1, 2, 3])
  })

  it('correctly sorts mixed scores', () => {
    const items = [{ id: 1, score: 1 }, { id: 2, score: 3 }, { id: 3, score: 2 }]
    const sorted = stableSortBy(items, byNumericDesc<typeof items[0]>('score'))
    expect(sorted.map(i => i.id)).toEqual([2, 3, 1])
  })
})
