'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

type PresetType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'blur'
  | 'blur-slide'
  | 'zoom'
  | 'flip'
  | 'bounce'
  | 'rotate'
  | 'swing'

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  fade: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
    item: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } },
  },
  slide: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    },
  },
  scale: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
    item: {
      hidden: { opacity: 0, scale: 0.85 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
    },
  },
  blur: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: 'easeOut' } },
    },
  },
  'blur-slide': {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } },
    item: {
      hidden: { opacity: 0, filter: 'blur(8px)', y: 16 },
      visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: { duration: 0.55, ease: 'easeOut' },
      },
    },
  },
  zoom: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
    item: {
      hidden: { opacity: 0, scale: 0.7 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
    },
  },
  flip: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
    item: {
      hidden: { opacity: 0, rotateX: -45 },
      visible: {
        opacity: 1,
        rotateX: 0,
        transition: { duration: 0.55, ease: 'easeOut' },
      },
    },
  },
  bounce: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
    item: {
      hidden: { opacity: 0, y: -20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 400, damping: 20 },
      },
    },
  },
  rotate: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
    item: {
      hidden: { opacity: 0, rotate: -10 },
      visible: { opacity: 1, rotate: 0, transition: { duration: 0.45, ease: 'easeOut' } },
    },
  },
  swing: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
    item: {
      hidden: { opacity: 0, rotate: -6, transformOrigin: 'top' },
      visible: {
        opacity: 1,
        rotate: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
      },
    },
  },
}

interface AnimatedGroupProps {
  children: ReactNode
  className?: string
  variants?: { container: Variants; item: Variants }
  preset?: PresetType
}

export function AnimatedGroup({
  children,
  className,
  variants,
  preset = 'fade',
}: AnimatedGroupProps) {
  const selectedVariants = variants ?? presetVariants[preset]
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={selectedVariants.container}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={selectedVariants.item}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={selectedVariants.item}>{children}</motion.div>}
    </motion.div>
  )
}
