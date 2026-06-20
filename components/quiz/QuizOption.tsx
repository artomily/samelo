'use client'

interface QuizOptionProps {
  index: number
  label: string
  state: 'idle' | 'selected' | 'correct' | 'wrong' | 'reveal-correct'
  onClick: () => void
  disabled?: boolean
}

const STATE_STYLES: Record<QuizOptionProps['state'], string> = {
  idle: 'bg-white/5 border-white/10 text-white/80 hover:bg-white/8 hover:border-white/20',
  selected: 'bg-[#c8f135]/10 border-[#c8f135]/40 text-[#c8f135]',
  correct: 'bg-[#34d399]/15 border-[#34d399] text-[#34d399]',
  wrong: 'bg-red-500/15 border-red-500 text-red-400',
  'reveal-correct': 'bg-[#34d399]/10 border-[#34d399]/40 text-[#34d399]/70',
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export function QuizOption({ index, label, state, onClick, disabled }: QuizOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || state !== 'idle'}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${STATE_STYLES[state]}`}
    >
      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono flex-shrink-0">
        {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : OPTION_LETTERS[index]}
      </span>
      <span className="text-sm">{label}</span>
    </button>
  )
}
