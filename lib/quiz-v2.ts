import { createClient } from '@supabase/supabase-js'
import { calcQuizPoints } from './types/quiz-v2'
import type { QuizQuestionV2, QuizAttemptV2 } from './types/quiz-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getQuestionsForVideo(videoId: string): Promise<QuizQuestionV2[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('quiz_questions_v2')
    .select('*')
    .eq('video_id', videoId)
    .order('created_at')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function submitQuizAnswer(
  wallet: string,
  questionId: string,
  selectedIndex: number,
  timeTakenMs: number
): Promise<QuizAttemptV2> {
  const supabase = getSupabase()
  const { data: question, error: qErr } = await supabase
    .from('quiz_questions_v2')
    .select('*')
    .eq('id', questionId)
    .single()
  if (qErr || !question) throw new Error('Question not found')

  const isCorrect = selectedIndex === question.correct_index
  const points = calcQuizPoints(question.points, isCorrect, timeTakenMs)

  const { data, error } = await supabase
    .from('quiz_attempts_v2')
    .insert({
      wallet,
      video_id: question.video_id,
      question_id: questionId,
      selected_index: selectedIndex,
      is_correct: isCorrect,
      time_taken_ms: timeTakenMs,
      points_earned: points,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getVideoQuizScore(wallet: string, videoId: string): Promise<{
  total: number
  correct: number
  points: number
}> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('quiz_attempts_v2')
    .select('is_correct, points_earned')
    .eq('wallet', wallet)
    .eq('video_id', videoId)
  const rows = data ?? []
  return {
    total: rows.length,
    correct: rows.filter((r) => r.is_correct).length,
    points: rows.reduce((sum, r) => sum + r.points_earned, 0),
  }
}
