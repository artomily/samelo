import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdmin } from '@/lib/admin-auth'
import { sanitizeText, clampString } from '@/lib/security/sanitize'
import type { QuizDifficulty } from '@/lib/types/quiz'

const DIFFICULTIES: QuizDifficulty[] = ['easy', 'medium', 'hard']

export async function GET(request: Request) {
  const adminWallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(adminWallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get('videoId')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let query = supabase.from('quizzes').select('*').order('created_at', { ascending: false })
  if (videoId) query = query.eq('video_id', videoId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ quizzes: data })
}

export async function POST(request: Request) {
  const adminWallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(adminWallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: {
    videoId: string; question: string; options: string[]
    correctIndex: number; explanation?: string; pointsReward?: number; difficulty?: QuizDifficulty
  }
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!body.question || !Array.isArray(body.options) || body.options.length !== 4) {
    return NextResponse.json({ error: 'question and 4 options required' }, { status: 400 })
  }
  if (body.correctIndex < 0 || body.correctIndex > 3) {
    return NextResponse.json({ error: 'correctIndex must be 0-3' }, { status: 400 })
  }

  const difficulty = body.difficulty ?? 'medium'
  if (!DIFFICULTIES.includes(difficulty)) {
    return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.from('quizzes').insert({
    video_id: body.videoId,
    question: sanitizeText(clampString(body.question, 500)),
    options: body.options.map(o => sanitizeText(clampString(o, 200))),
    correct_index: body.correctIndex,
    explanation: body.explanation ? sanitizeText(clampString(body.explanation, 500)) : null,
    points_reward: body.pointsReward ?? 25,
    difficulty,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ quiz: data }, { status: 201 })
}
