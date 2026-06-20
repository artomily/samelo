export function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const k = key(item)
    acc[k] = acc[k] ?? []
    acc[k].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

export function uniqueBy<T>(items: T[], key: (item: T) => unknown): T[] {
  const seen = new Set()
  return items.filter(item => {
    const k = key(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

export function sortBy<T>(items: T[], key: (item: T) => number | string, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const va = key(a)
    const vb = key(b)
    const cmp = va < vb ? -1 : va > vb ? 1 : 0
    return order === 'asc' ? cmp : -cmp
  })
}

export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

export function last<T>(items: T[]): T | undefined {
  return items[items.length - 1]
}

export function flatten<T>(items: T[][]): T[] {
  return ([] as T[]).concat(...items)
}

export function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  return items.reduce((acc, item) => {
    const k = key(item)
    acc[k] = (acc[k] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)
}

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i)
}
