'use client'
import { useState } from 'react'
import { useQuizzes } from '@/hooks/useQuiz'
import { QuizCard } from './QuizCard'
import { Skeleton } from '@/components/ui/Skeleton'

interface QuizSectionProps {
  videoId: string
}

export function QuizSection({ videoId }: QuizSectionProps) {
  const { data, isLoading } = useQuizzes(videoId)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState({ correct: 0, points: 0 })

  if (isLoading) return <Skeleton className="h-48 w-full rounded-xl" />

  const quizzes = data?.quizzes ?? []
  if (quizzes.length === 0) return null

  const quiz = quizzes[current]
  const isDone = current >= quizzes.length

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/70">Quiz</h3>
        <span className="text-xs text-white/30">{Math.min(current + 1, quizzes.length)}/{quizzes.length}</span>
      </div>

      {isDone ? (
        <div className="bg-white/5 rounded-xl p-6 text-center">
          <p className="text-3xl mb-2">🏆</p>
          <p className="text-sm font-semibold text-[#c8f135]">Quiz Complete!</p>
          <p className="text-xs text-white/50 mt-1">
            {score.correct}/{quizzes.length} correct · +{score.points} pts
          </p>
        </div>
      ) : (
        <QuizCard
          quiz={quiz}
          onResult={(isCorrect, points) => {
            setScore(s => ({
              correct: s.correct + (isCorrect ? 1 : 0),
              points: s.points + points,
            }))
            setTimeout(() => setCurrent(c => c + 1), 1500)
          }}
        />
      )}
    </div>
  )
}
