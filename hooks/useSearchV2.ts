import { useQuery } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import type { SearchResultV2 } from '@/lib/types/search-v2'

interface SearchResponse {
  results: SearchResultV2[]
  total: number
  query: string
}

export function useSearchV2(wallet?: string) {
  const [query, setQuery] = useState('')

  const results = useQuery<SearchResponse>({
    queryKey: ['search-v2', query, wallet],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query })
      const res = await fetch(`/api/search/v2?${params}`, {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Search failed')
      return res.json()
    },
    enabled: query.length >= 2,
    staleTime: 30_000,
  })

  const search = useCallback((q: string) => {
    setQuery(q)
  }, [])

  return { query, search, ...results }
}
