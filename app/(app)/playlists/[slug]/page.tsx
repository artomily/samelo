import { PlaylistDetail } from '@/components/content/PlaylistDetail'

interface Props {
  params: { slug: string }
}

export default function PlaylistPage({ params }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <PlaylistDetail slug={params.slug} />
    </div>
  )
}
