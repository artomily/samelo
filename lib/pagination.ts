export interface CursorPage<T> {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
}

export function paginateWithCursor<T extends { watched_at?: string; created_at?: string }>(
  rows: T[],
  pageSize: number,
  cursorField: keyof T = 'watched_at' as keyof T,
): CursorPage<T> {
  const hasMore = rows.length > pageSize
  const items = hasMore ? rows.slice(0, pageSize) : rows
  const last = items[items.length - 1]
  const nextCursor = hasMore && last ? String(last[cursorField]) : null

  return { items, nextCursor, hasMore }
}

export function parsePaginationParams(searchParams: URLSearchParams, maxLimit = 100): {
  limit: number
  cursor: string | null
} {
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), maxLimit)
  const cursor = searchParams.get('cursor')
  return { limit, cursor }
}
