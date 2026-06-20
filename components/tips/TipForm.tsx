'use client'

import { useState } from 'react'
import { useSendTip } from '@/hooks/useTips'
import { TIP_PRESETS_MELO, formatMelo } from '@/lib/types/tips'

interface Props {
  senderWallet: string
  recipientWallet: string
  videoId?: string
  onSuccess?: () => void
}

export function TipForm({ senderWallet, recipientWallet, videoId, onSuccess }: Props) {
  const [amount, setAmount] = useState<number>(5)
  const [message, setMessage] = useState('')
  const sendTip = useSendTip(senderWallet)

  const handleSend = () => {
    sendTip.mutate(
      { recipient_wallet: recipientWallet, amount_melo: amount, message: message || undefined, video_id: videoId },
      { onSuccess: () => { setMessage(''); onSuccess?.() } }
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#555] uppercase tracking-widest">Tip Amount</p>
      <div className="flex gap-2 flex-wrap">
        {TIP_PRESETS_MELO.map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset)}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              amount === preset
                ? 'bg-[#c8f135] text-[#030303]'
                : 'border border-[#333] text-[#888] hover:border-[#c8f135]/50'
            }`}
          >
            {preset} MELO
          </button>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add a message (optional)"
        maxLength={200}
        className="w-full bg-[#111] border border-[#222] rounded px-3 py-2 text-sm text-white placeholder-[#555] focus:border-[#c8f135]/50 focus:outline-none"
      />
      <button
        onClick={handleSend}
        disabled={sendTip.isPending}
        className="w-full py-2.5 text-sm font-bold text-[#030303] bg-[#c8f135] rounded hover:bg-[#d4f54d] disabled:opacity-50 transition-colors"
      >
        {sendTip.isPending ? 'Sending…' : `Send ${formatMelo(amount)}`}
      </button>
      {sendTip.isError && <p className="text-xs text-red-400">Failed to send tip</p>}
      {sendTip.isSuccess && <p className="text-xs text-[#c8f135]">Tip sent!</p>}
    </div>
  )
}
