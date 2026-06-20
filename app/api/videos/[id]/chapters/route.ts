import { NextRequest, NextResponse } from 'next/server'
import { getVideoChapters, createChapter } from '@/lib/video-chapters'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const wallet = req.headers.get('x-wallet-address') ?? undefined
  const chapters = await getVideoChapters(params.id, wallet)
  return NextResponse.json({ chapters })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { title, start_time_seconds, end_time_seconds, description, points_reward, has_quiz, sort_order } = await req.json()
  if (!title || typeof start_time_seconds !== 'number') {
    return NextResponse.json({ error: 'title and start_time_seconds required' }, { status: 400 })
  }

  const chapter = await createChapter(params.id, title, start_time_seconds, {
    endTimeSeconds: end_time_seconds,
    description,
    pointsReward: points_reward,
    hasQuiz: has_quiz,
    sortOrder: sort_order,
  })
  return NextResponse.json({ chapter }, { status: 201 })
}
