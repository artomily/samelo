import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { MediaUpload, UploadType } from '@/lib/types/media-upload'

export function useWalletUploads(wallet: string | undefined, uploadType?: UploadType) {
  return useQuery<{ uploads: MediaUpload[] }>({
    queryKey: ['media-uploads', wallet, uploadType],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (uploadType) params.set('type', uploadType)
      const res = await fetch(`/api/media/uploads?${params}`, {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load uploads')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

interface UploadInput {
  file_name: string
  file_size: number
  mime_type: string
  upload_type: UploadType
}

export function useCreateUpload(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<{ upload: MediaUpload }, Error, UploadInput>({
    mutationFn: async (body) => {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Upload failed')
      }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media-uploads', wallet] }),
  })
}
