/** Generic sort comparator factory — sorts by a numeric key descending */
export function byNumericDesc<T>(key: keyof T) {
  return (a: T, b: T): number => (b[key] as number) - (a[key] as number)
}

/** Generic sort comparator factory — sorts by a string key ascending */
export function byStringAsc<T>(key: keyof T) {
  return (a: T, b: T): number =>
    String(a[key]).localeCompare(String(b[key]))
}

/** Stable sort that keeps equal-rank items in original order */
export function stableSortBy<T>(arr: T[], comparator: (a: T, b: T) => number): T[] {
  return arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => comparator(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item)
}
