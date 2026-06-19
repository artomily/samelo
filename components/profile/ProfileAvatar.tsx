'use client'

interface ProfileAvatarProps {
  avatarUrl?: string | null
  walletAddress: string
  size?: number
}

function walletToColor(wallet: string): string {
  const colors = ['#c8f135', '#35d07f', '#fbcc5c', '#f97316', '#38bdf8', '#a78bfa']
  const idx = parseInt(wallet.slice(2, 4), 16) % colors.length
  return colors[idx]
}

function walletInitial(wallet: string): string {
  return wallet.slice(2, 4).toUpperCase()
}

export function ProfileAvatar({ avatarUrl, walletAddress, size = 48 }: ProfileAvatarProps) {
  const color = walletToColor(walletAddress)
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt="Profile avatar"
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold font-mono text-black"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.35 }}
    >
      {walletInitial(walletAddress)}
    </div>
  )
}
