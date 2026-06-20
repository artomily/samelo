export interface QueryFilters {
  wallet?: string
  category?: string
  status?: string
  search?: string
  limit?: number
  offset?: number
  orderBy?: string
  orderDir?: 'asc' | 'desc'
}

export function applyFilters<T>(
  query: T,
  filters: QueryFilters,
  applyFn: (q: T, key: string, value: string | number) => T,
): T {
  let q = query

  if (filters.wallet) q = applyFn(q, 'wallet', filters.wallet)
  if (filters.category) q = applyFn(q, 'category', filters.category)
  if (filters.status) q = applyFn(q, 'status', filters.status)

  return q
}

export function buildSearchQuery(field: string, term: string): string {
  const escaped = term.replace(/[%_\\]/g, ch => `\\${ch}`)
  return `%${escaped}%`
}

export function paginate(limit = 20, page = 1): { limit: number; offset: number } {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(100, Math.max(1, limit))
  return { limit: safeLimit, offset: (safePage - 1) * safeLimit }
}
