export interface SearchFilters {
  type?: 'video' | 'playlist' | 'profile'
  minViews?: number
  tags?: string[]
}

export interface SearchResultV2 {
  id: string
  type: 'video' | 'playlist' | 'profile'
  title: string
  subtitle: string | null
  thumbnail_url: string | null
  relevance: number
}

export function highlightQuery(text: string, query: string): string {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '[$1]')
}

export function parseSearchQuery(raw: string): { terms: string[]; tags: string[] } {
  const tags: string[] = []
  const terms: string[] = []
  for (const part of raw.trim().split(/\s+/)) {
    if (part.startsWith('#') && part.length > 1) {
      tags.push(part.slice(1).toLowerCase())
    } else if (part) {
      terms.push(part)
    }
  }
  return { terms, tags }
}

export function buildFtsQuery(terms: string[]): string {
  return terms.map((t) => `${t}:*`).join(' & ')
}
