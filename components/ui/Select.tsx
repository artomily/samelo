'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'

interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  error?: string
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, Props>(({
  label,
  options,
  error,
  placeholder,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-white/60 text-sm">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`
          w-full bg-white/5 border rounded-lg px-3 py-2 text-white
          focus:outline-none transition-colors appearance-none
          ${error ? 'border-red-500/50' : 'border-white/10 focus:border-[#c8f135]/50'}
          ${className}
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'
