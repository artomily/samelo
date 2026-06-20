import { NextRequest, NextResponse } from 'next/server'
import { likeComment, unlikeComment } from '@/lib/comments'

export async function POST(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  await likeComment(wallet, params.commentId)
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }
  await unlikeComment(wallet, params.commentId)
  return NextResponse.json({ ok: true })
}
