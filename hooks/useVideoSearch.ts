import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'

interface Video {
  id: string
  title: string
  description: string | null
  duration_seconds: number
  points_reward: number
  thumbnail_url: string | null
}

async function searchVideos(query: string): Promise<Video[]> {
  const res = await fetch(`/api/videos/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Failed to search videos')
  const json = await res.json()
  return json.videos
}

export function useVideoSearch() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const debounce = useCallback((value: string) => {
    setQuery(value)
    const timer = setTimeout(() => setDebouncedQuery(value), 300)
    return () => clearTimeout(timer)
  }, [])

  const result = useQuery({
    queryKey: ['video-search', debouncedQuery],
    queryFn: () => searchVideos(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  })

  return { query, setQuery: debounce, ...result }
}
