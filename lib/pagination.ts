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
}
