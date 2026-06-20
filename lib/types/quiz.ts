export type QuizDifficulty = 'easy' | 'medium' | 'hard'

export interface Quiz {
  id: string
  video_id: string
  question: string
  options: string[]
  correct_index: number
  explanation: string | null
  points_reward: number
  difficulty: QuizDifficulty
  created_at: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  wallet: string
  selected_index: number
  is_correct: boolean
  points_earned: number
  time_taken_ms: number | null
  created_at: string
}

export interface QuizResult {
  quiz: Quiz
  attempt: QuizAttempt
  isCorrect: boolean
  pointsEarned: number
}

export const DIFFICULTY_COLORS: Record<QuizDifficulty, string> = {
  easy: '#34d399',
  medium: '#fbcc5c',
  hard: '#f87171',
}

export const DIFFICULTY_MULTIPLIERS: Record<QuizDifficulty, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
}

export const TIME_BONUS_THRESHOLD_MS = 10_000
export const TIME_BONUS_POINTS = 5
