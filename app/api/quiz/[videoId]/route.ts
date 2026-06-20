import { NextResponse } from 'next/server'
import { getQuizzesForVideo } from '@/lib/quiz'
import { validateUuid } from '@/lib/security/sanitize'

export async function GET(
  _request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const quizzes = await getQuizzesForVideo(params.videoId)
    const sanitized = quizzes.map(q => ({
      ...q,
      correct_index: undefined,
    }))
    return NextResponse.json({ quizzes: sanitized })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }
}
