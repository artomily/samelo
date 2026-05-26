import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const videoId = searchParams.get('videoId')

  if (!videoId || typeof videoId !== 'string') {
    return NextResponse.json({ error: 'videoId is required' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()

    const { data: quiz, error } = await supabase
      .from('video_quizzes')
      .select('summary, questions, generated_at')
      .eq('video_id', videoId)
      .maybeSingle()

    if (error) throw error
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    const questions = typeof quiz.questions === 'string'
      ? JSON.parse(quiz.questions)
      : quiz.questions

    // Strip correct index — client shouldn't receive answers
    const safeQuestions = (questions as Array<Record<string, unknown>>).map((q) => ({
      q: q.q,
      options: q.options,
    }))

    return NextResponse.json({
      videoId,
      summary: quiz.summary,
      questions: safeQuestions,
    })
  } catch (err) {
    console.error('[/api/quiz]', err)
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 })
  }
}
