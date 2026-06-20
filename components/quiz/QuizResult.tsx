'use client'

interface QuizResultProps {
  isCorrect: boolean
  pointsEarned: number
  onNext?: () => void
}

export function QuizResult({ isCorrect, pointsEarned, onNext }: QuizResultProps) {
  return (
    <div className={`rounded-xl p-4 text-center ${isCorrect ? 'bg-[#c8f135]/10 border border-[#c8f135]/30' : 'bg-red-500/10 border border-red-500/30'}`}>
      <p className="text-3xl mb-2">{isCorrect ? '🎉' : '😅'}</p>
      <p className={`font-semibold text-sm ${isCorrect ? 'text-[#c8f135]' : 'text-red-400'}`}>
        {isCorrect ? 'Correct!' : 'Not quite'}
      </p>
      {isCorrect && pointsEarned > 0 && (
        <p className="text-xs text-white/60 mt-1">+{pointsEarned} points earned</p>
      )}
      {onNext && (
        <button
          onClick={onNext}
          className="mt-3 px-4 py-1.5 text-xs bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors"
        >
          Next question →
        </button>
      )}
    </div>
  )
}
