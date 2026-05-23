'use client'

import { useEffect, useState } from 'react'
import { MOCK_VIDEOS, type Video } from '@/lib/mock-videos'

interface UseVideosResult {
  videos: Video[]
  loading: boolean
  source: 'supabase' | 'mock' | null
}

export function useVideos(): UseVideosResult {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'supabase' | 'mock' | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/api/videos')
      .then((r) => r.json())
      .then((d: { videos?: Video[]; source?: 'supabase' | 'mock' }) => {
        if (cancelled) return
        if (d.videos && d.videos.length > 0) {
          setVideos(d.videos)
          setSource(d.source ?? 'supabase')
        }
      })
      .catch(() => {
        // keep mock videos on error
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { videos, loading, source }
}
