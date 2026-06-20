export type SearchResultType = 'video' | 'playlist' | 'profile'

export interface SearchResult {
  type: SearchResultType
  id: string
  title: string
  subtitle?: string
  thumbnailUrl?: string
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}

export const SEARCH_ICONS: Record<SearchResultType, string> = {
  video: '▶',
  playlist: '📋',
  profile: '👤',
}

export const SEARCH_LABELS: Record<SearchResultType, string> = {
  video: 'Video',
  playlist: 'Playlist',
  profile: 'Profile',
}

export const MIN_QUERY_LENGTH = 2
export const MAX_QUERY_LENGTH = 100
export const DEBOUNCE_MS = 300
