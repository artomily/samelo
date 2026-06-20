'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { Quiz } from '@/lib/types/quiz'

interface SubmitResult {
  isCorrect: boolean
  pointsEarned: number
  correctIndex: number
  explanation: string | null
}

export function useQuizzes(videoId: string | undefined) {
  return useQuery<{ quizzes: Omit<Quiz, 'correct_index'>[] }>({
    queryKey: ['quizzes', videoId],
    queryFn: async () => {
      const res = await fetch(`/api/quiz/${videoId}`)
      if (!res.ok) throw new Error('Failed to fetch quizzes')
      return res.json()
    },
    enabled: !!videoId,
    staleTime: 300_000,
  })
}

export function useSubmitQuizAnswer() {
  const { address } = useAccount()
  const qc = useQueryClient()

  return useMutation<SubmitResult, Error, { quizId: string; selectedIndex: number; timeTakenMs?: number }>({
    mutationFn: async ({ quizId, selectedIndex, timeTakenMs }) => {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address ?? '',
        },
        body: JSON.stringify({ quizId, selectedIndex, timeTakenMs }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['daily-reward'] })
      qc.invalidateQueries({ queryKey: ['weekly-reward'] })
    },
  })
}

export function useQuizAttempts() {
  const { address } = useAccount()

  return useQuery({
    queryKey: ['quiz-attempts', address],
    queryFn: async () => {
      const res = await fetch(`/api/quiz/attempts?wallet=${address}`)
      if (!res.ok) throw new Error('Failed to fetch attempts')
      return res.json()
    },
    enabled: !!address,
    staleTime: 30_000,
  })
}
