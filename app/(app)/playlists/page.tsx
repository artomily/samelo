import { PlaylistGrid } from '@/components/content/PlaylistGrid'

export const metadata = { title: 'Playlists — Samelo' }

export default function PlaylistsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Playlists</h1>
        <p className="text-white/50 mt-1">Curated learning paths to level up your crypto knowledge</p>
      </div>
      <PlaylistGrid />
    </div>
  )
}
