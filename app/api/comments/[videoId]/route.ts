import { NextRequest, NextResponse } from 'next/server'
import { getComments, createComment } from '@/lib/comments'

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const wallet = req.headers.get('x-wallet-address') ?? undefined
  const comments = await getComments(params.videoId, wallet)
  return NextResponse.json({ comments })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { body, parentId } = await req.json()
  if (!body || typeof body !== 'string' || body.trim().length < 1) {
    return NextResponse.json({ error: 'Body required' }, { status: 400 })
  }

  const comment = await createComment(wallet, params.videoId, body, parentId)
  return NextResponse.json({ comment }, { status: 201 })
}
