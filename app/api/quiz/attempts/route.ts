import { NextResponse } from 'next/server'
import { getUserQuizAttempts } from '@/lib/quiz'
import { validateWalletAddress } from '@/lib/security/sanitize'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')
  const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 50)

  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  try {
    const attempts = await getUserQuizAttempts(wallet, limit)
    const correct = attempts.filter(a => a.is_correct).length
    const totalPoints = attempts.reduce((sum, a) => sum + a.points_earned, 0)

    return NextResponse.json({
      attempts,
      stats: {
        total: attempts.length,
        correct,
        accuracy: attempts.length > 0 ? correct / attempts.length : 0,
        totalPoints,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 })
  }
}
