import { NextRequest, NextResponse } from 'next/server'
import { createTip, getSentTips, getReceivedTips, getTotalReceived } from '@/lib/tips'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const mode = req.nextUrl.searchParams.get('mode') ?? 'received'
  if (mode === 'sent') {
    const tips = await getSentTips(wallet)
    return NextResponse.json({ tips })
  }

  const [tips, totalReceived] = await Promise.all([getReceivedTips(wallet), getTotalReceived(wallet)])
  return NextResponse.json({ tips, totalReceived })
}

export async function POST(req: NextRequest) {
  const senderWallet = req.headers.get('x-wallet-address')
  if (!senderWallet || !/^0x[0-9a-fA-F]{40}$/.test(senderWallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { recipient_wallet, amount_melo, message, video_id, tx_hash } = await req.json()
  if (!recipient_wallet || !/^0x[0-9a-fA-F]{40}$/.test(recipient_wallet)) {
    return NextResponse.json({ error: 'Invalid recipient_wallet' }, { status: 400 })
  }
  if (!amount_melo || typeof amount_melo !== 'number' || amount_melo <= 0) {
    return NextResponse.json({ error: 'amount_melo must be a positive number' }, { status: 400 })
  }
  if (senderWallet.toLowerCase() === recipient_wallet.toLowerCase()) {
    return NextResponse.json({ error: 'Cannot tip yourself' }, { status: 400 })
  }

  const tip = await createTip(senderWallet, recipient_wallet, amount_melo, { message, videoId: video_id, txHash: tx_hash })
  return NextResponse.json({ tip }, { status: 201 })
}
