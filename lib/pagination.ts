export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/** Calculate SQL LIMIT/OFFSET from page params */
export function toSqlPagination(params: PaginationParams): { limit: number; offset: number } {
  const page = Math.max(1, params.page)
  const pageSize = Math.min(100, Math.max(1, params.pageSize))
  return { limit: pageSize, offset: (page - 1) * pageSize }
}

/** Wrap a slice of items into a PaginatedResult */
export function toPaginatedResult<T>(
  items: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / params.pageSize)
  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrev: params.page > 1,
  }
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
