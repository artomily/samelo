export interface QuizQuestionV2 {
  id: string
  video_id: string
  question: string
  options: string[]
  correct_index: number
  explanation: string | null
  points: number
  time_limit_seconds: number
  created_at: string
}

export interface QuizAttemptV2 {
  id: string
  wallet: string
  video_id: string
  question_id: string
  selected_index: number
  is_correct: boolean
  time_taken_ms: number | null
  points_earned: number
  created_at: string
}

export interface QuizResult {
  question: QuizQuestionV2
  attempt: QuizAttemptV2
}

export const SPEED_BONUS_THRESHOLD_MS = 5000
export const SPEED_BONUS_MULTIPLIER = 1.5

export function calcQuizPoints(
  basePoints: number,
  isCorrect: boolean,
  timeTakenMs: number | null
): number {
  if (!isCorrect) return 0
  const speedBonus = timeTakenMs !== null && timeTakenMs < SPEED_BONUS_THRESHOLD_MS
    ? SPEED_BONUS_MULTIPLIER
    : 1
  return Math.floor(basePoints * speedBonus)
}

export function getQuizFeedback(isCorrect: boolean, explanation: string | null): string {
  if (isCorrect) return explanation ? `Correct! ${explanation}` : 'Correct!'
  return explanation ? `Wrong. ${explanation}` : 'Wrong answer.'
}
