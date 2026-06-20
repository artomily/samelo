'use client'

import { useState, useEffect } from 'react'

interface Props {
  targetDate: string | Date
  onExpired?: () => void
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
}

export function CountdownTimer({ targetDate, onExpired, className = '' }: Props) {
  const target = new Date(targetDate)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(target))

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getTimeLeft(target)
      setTimeLeft(next)
      if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
        onExpired?.()
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [target.getTime()])

  const pad = (n: number) => String(n).padStart(2, '0')

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return <span className={`text-[#c8f135] font-mono ${className}`}>Unlocked</span>
  }

  return (
    <span className={`font-mono text-white/70 ${className}`}>
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
    </span>
  )
}
