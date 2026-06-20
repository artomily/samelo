import { createClient } from '@supabase/supabase-js'
import type { Quiz, QuizAttempt, QuizResult } from './types/quiz'
import { DIFFICULTY_MULTIPLIERS, TIME_BONUS_THRESHOLD_MS, TIME_BONUS_POINTS } from './types/quiz'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getQuizzesForVideo(videoId: string): Promise<Quiz[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('video_id', videoId)
    .order('created_at')
  if (error) throw error
  return data ?? []
}

export async function getQuiz(id: string): Promise<Quiz | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function submitAnswer(
  quizId: string,
  wallet: string,
  selectedIndex: number,
  timeTakenMs?: number
): Promise<QuizResult> {
  const supabase = getSupabase()

  const quiz = await getQuiz(quizId)
  if (!quiz) throw new Error('Quiz not found')

  const isCorrect = selectedIndex === quiz.correct_index
  const multiplier = DIFFICULTY_MULTIPLIERS[quiz.difficulty]
  let pointsEarned = 0

  if (isCorrect) {
    pointsEarned = Math.round(quiz.points_reward * multiplier)
    if (timeTakenMs !== undefined && timeTakenMs < TIME_BONUS_THRESHOLD_MS) {
      pointsEarned += TIME_BONUS_POINTS
    }
  }

  const { data: attempt, error } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id: quizId,
      wallet,
      selected_index: selectedIndex,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      time_taken_ms: timeTakenMs ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return { quiz, attempt, isCorrect, pointsEarned }
}

export async function getUserQuizAttempts(wallet: string, limit = 20): Promise<QuizAttempt[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function hasAttemptedQuiz(quizId: string, wallet: string): Promise<boolean> {
  const supabase = getSupabase()
  const { count } = await supabase
    .from('quiz_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('quiz_id', quizId)
    .eq('wallet', wallet)
  return (count ?? 0) > 0
}
