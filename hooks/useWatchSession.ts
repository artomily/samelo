'use client'

import { useCallback, useRef, useState } from 'react'

interface WatchSessionState {
  videoId: string | null
  watchedSeconds: number
  completed: boolean
  submitting: boolean
}

interface UseWatchSessionOptions {
  durationSeconds: number
  completionThreshold?: number // 0–1, default 0.8
  onComplete?: (videoId: string) => void
}

export function useWatchSession(
  videoId: string,
  { durationSeconds, completionThreshold = 0.8, onComplete }: UseWatchSessionOptions,
) {
  const [state, setState] = useState<WatchSessionState>({
    videoId,
    watchedSeconds: 0,
    completed: false,
    submitting: false,
  })
  const completedRef = useRef(false)

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      setState((prev) => ({ ...prev, watchedSeconds: currentTime }))

      const ratio = currentTime / durationSeconds
      if (!completedRef.current && ratio >= completionThreshold) {
        completedRef.current = true
        setState((prev) => ({ ...prev, completed: true }))
        onComplete?.(videoId)
      }
    },
    [videoId, durationSeconds, completionThreshold, onComplete],
  )

  const progress = Math.min(state.watchedSeconds / durationSeconds, 1)

  return { ...state, progress, handleTimeUpdate }
}
