'use client'
import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { SearchResponse } from '@/lib/types/search'
import { DEBOUNCE_MS, MIN_QUERY_LENGTH } from '@/lib/types/search'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query])

  const enabled = debouncedQuery.length >= MIN_QUERY_LENGTH

  const { data, isLoading, isFetching } = useQuery<SearchResponse>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      if (!res.ok) throw new Error('Search failed')
      return res.json()
    },
    enabled,
    staleTime: 30_000,
  })

  const clear = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
  }, [])

  return {
    query,
    setQuery,
    clear,
    results: data?.results ?? [],
    total: data?.total ?? 0,
    isLoading: isLoading && isFetching,
    hasQuery: enabled,
  }
}
