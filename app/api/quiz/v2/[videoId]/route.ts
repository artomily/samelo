import { NextRequest, NextResponse } from 'next/server'
import { getQuestionsForVideo, getVideoQuizScore } from '@/lib/quiz-v2'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params
  const wallet = req.headers.get('x-wallet-address')
  const [questions, score] = await Promise.all([
    getQuestionsForVideo(videoId),
    wallet && /^0x[0-9a-fA-F]{40}$/.test(wallet)
      ? getVideoQuizScore(wallet, videoId)
      : Promise.resolve(null),
  ])
  return NextResponse.json({ questions, score })
}
