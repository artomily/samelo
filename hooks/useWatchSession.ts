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

  const safeDuration = durationSeconds > 0 ? durationSeconds : 300 // fallback 5 min if DB returns 0

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      setState((prev) => ({ ...prev, watchedSeconds: currentTime }))

      const ratio = currentTime / safeDuration
      if (!completedRef.current && ratio >= completionThreshold) {
        completedRef.current = true
        setState((prev) => ({ ...prev, completed: true }))
        onComplete?.(videoId)
      }
    },
    [videoId, safeDuration, completionThreshold, onComplete],
  )

  const progress = Math.min(state.watchedSeconds / safeDuration, 1)

  return { ...state, progress, handleTimeUpdate }
}
