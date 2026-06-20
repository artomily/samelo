import { NextRequest, NextResponse } from 'next/server'
import { submitQuizAnswer } from '@/lib/quiz-v2'
import { getQuizFeedback } from '@/lib/types/quiz-v2'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const { question_id, selected_index, time_taken_ms } = await req.json()
  if (question_id === undefined || selected_index === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: question } = await supabase
    .from('quiz_questions_v2')
    .select('explanation, correct_index')
    .eq('id', question_id)
    .single()

  const attempt = await submitQuizAnswer(wallet, question_id, selected_index, time_taken_ms ?? 0)
  const feedback = getQuizFeedback(attempt.is_correct, question?.explanation ?? null)

  return NextResponse.json({ attempt, feedback })
}
