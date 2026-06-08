import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

const BASE_QUIZ_REWARD = 50
const PERFECT_SCORE_BONUS = 25

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { walletAddress, videoId, answers } = body as Record<string, unknown>

  if (typeof walletAddress !== 'string' || typeof videoId !== 'string') {
    return NextResponse.json(
      { error: 'walletAddress and videoId are required strings' },
      { status: 400 },
    )
  }

  if (!isAddress(walletAddress)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  if (!Array.isArray(answers) || answers.some((a) => typeof a !== 'number')) {
    return NextResponse.json(
      { error: 'answers must be an array of numbers' },
      { status: 400 },
    )
  }

  try {
    const supabase = getServiceSupabase()

    // ── Fetch quiz with correct answers ──────────────────────────
    const { data: quiz, error: quizErr } = await supabase
      .from('video_quizzes')
      .select('questions')
      .eq('video_id', videoId)
      .maybeSingle()

    if (quizErr) throw quizErr
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    const questions = (typeof quiz.questions === 'string'
      ? JSON.parse(quiz.questions)
      : quiz.questions) as Array<{ q: string; options: string[]; correct: number }>

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Quiz has no questions' }, { status: 400 })
    }

    // ── Check duplicate attempt ──────────────────────────────────
    const { data: existing } = await supabase
      .from('user_quiz_attempts')
      .select('id')
      .eq('wallet_address', walletAddress)
      .eq('video_id', videoId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Quiz already attempted for this video' },
        { status: 409 },
      )
    }

    // ── Check watch history ──────────────────────────────────────
    const { data: watch } = await supabase
      .from('watches')
      .select('id')
      .eq('wallet_address', walletAddress)
      .eq('video_id', videoId)
      .maybeSingle()

    if (!watch) {
      return NextResponse.json(
        { error: 'Watch the video first before taking the quiz' },
        { status: 403 },
      )
    }

    // ── Score ────────────────────────────────────────────────────
    let correctCount = 0
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correct) correctCount++
    }

    const basePoints = Math.floor((correctCount / questions.length) * BASE_QUIZ_REWARD)
    const perfectBonus = correctCount === questions.length ? PERFECT_SCORE_BONUS : 0
    const pointsEarned = basePoints + perfectBonus

    // ── Insert attempt ───────────────────────────────────────────
    const { error: insertErr } = await supabase
      .from('user_quiz_attempts')
      .insert({
        wallet_address: walletAddress,
        video_id: videoId,
        score: correctCount,
        points_earned: pointsEarned,
      })

    if (insertErr) {
      if (insertErr.code === '23505') {
        return NextResponse.json(
          { error: 'Quiz already attempted for this video' },
          { status: 409 },
        )
      }
      throw insertErr
    }

    return NextResponse.json({
      score: correctCount,
      total: questions.length,
      pointsEarned,
      perfectBonus,
    })
  } catch (err) {
    console.error('[/api/quiz/submit]', err)
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 })
  }
}
