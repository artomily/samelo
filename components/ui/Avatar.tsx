interface Props {
  src?: string | null
  address?: string
  size?: number
  className?: string
}

function makeGradient(address: string): string {
  const hash = address.slice(2, 8)
  const hue1 = parseInt(hash.slice(0, 3), 16) % 360
  const hue2 = (hue1 + 120) % 360
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 50%))`
}

export function Avatar({ src, address = '', size = 40, className = '' }: Props) {
  const initials = address.slice(2, 4).toUpperCase() || '??'

  if (src) {
    return (
      <img
        src={src}
        alt="Avatar"
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: makeGradient(address || '0x000000'), fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}
