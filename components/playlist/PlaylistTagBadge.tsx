'use client'

interface Props {
  tag: string
  onClick?: (tag: string) => void
  active?: boolean
}

export function PlaylistTagBadge({ tag, onClick, active }: Props) {
  return (
    <button
      onClick={() => onClick?.(tag)}
      className={[
        'px-2 py-0.5 rounded-full text-xs transition-all',
        active
          ? 'text-[#030303]'
          : 'bg-white/10 text-white/60 hover:bg-white/20',
      ].join(' ')}
      style={active ? { background: '#c8f135' } : {}}
    >
      #{tag}
    </button>
  )
}
