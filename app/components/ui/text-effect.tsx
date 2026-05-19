'use client'

import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Preset = 'blur' | 'shake' | 'scale' | 'fade' | 'slide'

const presetMap: Record<Preset, Variants> = {
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 8 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
  },
  shake: {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
}

interface TextEffectProps {
  children: string
  per?: 'word' | 'char' | 'line'
  as?: ElementType
  preset?: Preset
  className?: string
  delay?: number
  trigger?: boolean
}

function splitText(text: string, per: 'word' | 'char' | 'line'): string[] {
  if (per === 'char') return text.split('')
  if (per === 'line') return text.split('\n')
  return text.split(/(\s+)/)
}

export function TextEffect({
  children,
  per = 'word',
  as: Tag = 'p',
  preset = 'blur',
  className,
  delay = 0,
  trigger = true,
}: TextEffectProps) {
  const segments = splitText(children, per)
  const variants = presetMap[preset]

  return (
    <Tag className={cn('inline', className)}>
      <AnimatePresence>
        {trigger &&
          segments.map((segment, i) => (
            <motion.span
              key={`${segment}-${i}`}
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={{
                duration: 0.45,
                ease: 'easeOut',
                delay: delay + i * 0.04,
              }}
              className="inline-block"
              style={{ whiteSpace: per === 'char' ? 'pre' : undefined }}
            >
              {segment}
            </motion.span>
          ))}
      </AnimatePresence>
    </Tag>
  )
}
