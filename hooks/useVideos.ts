'use client'

import { useEffect, useState } from 'react'
import type { Video } from '@/lib/mock-videos'

interface UseVideosResult {
  videos: Video[]
  loading: boolean
}

export function useVideos(): UseVideosResult {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch('/api/videos')
      .then((r) => r.json())
      .then((d: { videos?: Video[] }) => {
        if (cancelled) return
        setVideos(d.videos ?? [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { videos, loading }
}
