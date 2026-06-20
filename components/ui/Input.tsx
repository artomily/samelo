'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-white/60 text-sm">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          w-full bg-white/5 border rounded-lg px-3 py-2 text-white
          placeholder:text-white/30 focus:outline-none transition-colors
          ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#c8f135]/50'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {hint && !error && <p className="text-white/40 text-xs">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'
