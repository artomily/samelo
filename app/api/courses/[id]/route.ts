import { NextRequest, NextResponse } from 'next/server'
import { getCourseWithLessons, enrollInCourse, addCourseLesson } from '@/lib/creator-courses'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address') ?? undefined
  const course = await getCourseWithLessons(id, wallet)
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ course })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { action, paid_melo = 0, video_id, lesson_number, title, duration_seconds, is_preview } = await req.json()

  if (action === 'enroll') {
    const enrollment = await enrollInCourse(wallet, id, paid_melo)
    return NextResponse.json({ enrollment }, { status: 201 })
  }

  if (!video_id || !lesson_number || !title) {
    return NextResponse.json({ error: 'video_id, lesson_number, and title required' }, { status: 400 })
  }

  const lesson = await addCourseLesson(id, video_id, lesson_number, title, { durationSeconds: duration_seconds, isPreview: is_preview })
  return NextResponse.json({ lesson }, { status: 201 })
}
