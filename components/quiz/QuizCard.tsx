'use client'
import { useState, useRef } from 'react'
import type { Quiz } from '@/lib/types/quiz'
import { DIFFICULTY_COLORS } from '@/lib/types/quiz'
import { QuizOption } from './QuizOption'
import { useSubmitQuizAnswer } from '@/hooks/useQuiz'

interface QuizCardProps {
  quiz: Omit<Quiz, 'correct_index'>
  onResult?: (isCorrect: boolean, points: number) => void
}

export function QuizCard({ quiz, onResult }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [result, setResult] = useState<{ correctIndex: number; explanation: string | null } | null>(null)
  const startTime = useRef(Date.now())
  const { mutate: submit, isPending } = useSubmitQuizAnswer()

  function handleSelect(index: number) {
    if (selected !== null || isPending) return
    setSelected(index)
    const timeTakenMs = Date.now() - startTime.current

    submit(
      { quizId: quiz.id, selectedIndex: index, timeTakenMs },
      {
        onSuccess: (data) => {
          setResult({ correctIndex: data.correctIndex, explanation: data.explanation })
          onResult?.(data.isCorrect, data.pointsEarned)
        },
      }
    )
  }

  function getOptionState(index: number): 'idle' | 'selected' | 'correct' | 'wrong' | 'reveal-correct' {
    if (!result) return selected === index ? 'selected' : 'idle'
    if (index === result.correctIndex) return selected === index ? 'correct' : 'reveal-correct'
    if (index === selected) return 'wrong'
    return 'idle'
  }

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-mono"
          style={{ color: DIFFICULTY_COLORS[quiz.difficulty], backgroundColor: `${DIFFICULTY_COLORS[quiz.difficulty]}20` }}
        >
          {quiz.difficulty}
        </span>
        <span className="text-xs text-white/30">+{quiz.points_reward} pts</span>
      </div>

      <p className="text-sm font-medium text-white mb-4">{quiz.question}</p>

      <div className="space-y-2">
        {quiz.options.map((option, i) => (
          <QuizOption
            key={i}
            index={i}
            label={option}
            state={getOptionState(i)}
            onClick={() => handleSelect(i)}
            disabled={isPending}
          />
        ))}
      </div>

      {result?.explanation && (
        <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-white/60 leading-relaxed">
          {result.explanation}
        </div>
      )}
    </div>
  )
}
