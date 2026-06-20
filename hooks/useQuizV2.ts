import { useQuery, useMutation } from '@tanstack/react-query'
import type { QuizQuestionV2, QuizAttemptV2 } from '@/lib/types/quiz-v2'

interface QuizResponse {
  questions: QuizQuestionV2[]
  score: { total: number; correct: number; points: number } | null
}

export function useQuizQuestionsV2(videoId: string, wallet?: string) {
  return useQuery<QuizResponse>({
    queryKey: ['quiz-v2', videoId, wallet],
    queryFn: async () => {
      const res = await fetch(`/api/quiz/v2/${videoId}`, {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to load quiz')
      return res.json()
    },
    enabled: !!videoId,
    staleTime: 300_000,
  })
}

interface AnswerInput {
  question_id: string
  selected_index: number
  time_taken_ms: number
}

interface AnswerResponse {
  attempt: QuizAttemptV2
  feedback: string
}

export function useSubmitAnswerV2(wallet: string | undefined) {
  return useMutation<AnswerResponse, Error, AnswerInput>({
    mutationFn: async (body) => {
      const res = await fetch('/api/quiz/v2/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to submit answer')
      return res.json()
    },
  })
}
