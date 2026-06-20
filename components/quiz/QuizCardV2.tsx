'use client'

import { useState, useEffect, useRef } from 'react'
import { useSubmitAnswerV2 } from '@/hooks/useQuizV2'
import type { QuizQuestionV2 } from '@/lib/types/quiz-v2'

interface Props {
  question: QuizQuestionV2
  wallet: string
  onResult?: (correct: boolean, points: number) => void
}

export function QuizCardV2({ question, wallet, onResult }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(question.time_limit_seconds)
  const startTime = useRef(Date.now())
  const { mutate: submit } = useSubmitAnswerV2(wallet)

  useEffect(() => {
    if (selected !== null || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [selected, timeLeft])

  function handleSelect(index: number) {
    if (selected !== null || timeLeft <= 0) return
    setSelected(index)
    const timeTakenMs = Date.now() - startTime.current
    submit(
      { question_id: question.id, selected_index: index, time_taken_ms: timeTakenMs },
      {
        onSuccess: ({ attempt, feedback: fb }) => {
          setFeedback(fb)
          onResult?.(attempt.is_correct, attempt.points_earned)
        },
      }
    )
  }

  const expired = timeLeft <= 0 && selected === null

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium leading-snug">{question.question}</p>
        <span className={['text-xs font-mono px-2 py-0.5 rounded', timeLeft <= 5 ? 'text-red-400' : 'text-white/50'].join(' ')}>
          {timeLeft}s
        </span>
      </div>

      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const isChosen = selected === i
          const isCorrect = selected !== null && i === question.correct_index
          let border = 'border-white/10'
          if (isChosen && selected === question.correct_index) border = 'border-[#c8f135]'
          else if (isChosen) border = 'border-red-500'
          else if (isCorrect && selected !== null) border = 'border-[#c8f135]/50'

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null || expired}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors disabled:cursor-default ${border} ${selected === null && !expired ? 'hover:border-white/30' : ''}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {expired && <p className="text-xs text-red-400">Time's up!</p>}
      {feedback && <p className="text-xs text-white/60">{feedback}</p>}
    </div>
  )
}
