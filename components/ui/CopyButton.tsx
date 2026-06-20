'use client'

import { useState } from 'react'

interface Props {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
}

export function CopyButton({ text, label = 'Copy', copiedLabel = 'Copied!', className = '' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-sm transition-colors ${copied ? 'text-[#c8f135]' : 'text-white/50 hover:text-white'} ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  )
}
