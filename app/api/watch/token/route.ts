import { NextRequest, NextResponse } from 'next/server'
import { generateWatchToken } from '@/lib/watchToken'
import { isAddress } from 'viem'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const videoId = searchParams.get('videoId')
  const walletAddress = searchParams.get('walletAddress')

  if (!videoId || !walletAddress) {
    return NextResponse.json(
      { error: 'videoId and walletAddress are required' },
      { status: 400 },
    )
  }

  if (!isAddress(walletAddress)) {
    return NextResponse.json(
      { error: 'Invalid wallet address' },
      { status: 400 },
    )
  }

  const token = generateWatchToken(videoId, walletAddress)

  return NextResponse.json({ token }, { status: 200 })
}
