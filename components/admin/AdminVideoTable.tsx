'use client'

import { useState } from 'react'
import { useAdminVideos, useCreateVideo, useToggleVideo } from '@/hooks/useAdminVideos'

export function AdminVideoTable() {
  const { data, isLoading } = useAdminVideos()
  const createVideo = useCreateVideo()
  const toggleVideo = useToggleVideo()

  const [form, setForm] = useState({ title: '', youtubeId: '', rewardCents: 100 })
  const [showForm, setShowForm] = useState(false)

  const handleCreate = () => {
    createVideo.mutate(form, {
      onSuccess: () => { setShowForm(false); setForm({ title: '', youtubeId: '', rewardCents: 100 }) },
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white/70">Videos</h3>
        <button onClick={() => setShowForm(v => !v)} className="text-xs text-[#c8f135] hover:underline">
          {showForm ? 'Cancel' : '+ Add Video'}
        </button>
      </div>

      {showForm && (
        <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
          <input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs text-white" />
          <input placeholder="YouTube ID" value={form.youtubeId} onChange={e => setForm(f => ({ ...f, youtubeId: e.target.value }))}
            className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs text-white" />
          <div className="flex gap-2">
            <input type="number" placeholder="Points" value={form.rewardCents} onChange={e => setForm(f => ({ ...f, rewardCents: parseInt(e.target.value) }))}
              className="w-20 bg-transparent border border-white/20 rounded px-2 py-1 text-xs text-white" />
            <button onClick={handleCreate} className="text-xs bg-[#c8f135] text-black px-3 py-1 rounded font-semibold">
              Save
            </button>
          </div>
        </div>
      )}

      {isLoading && <p className="text-white/40 text-sm">Loading…</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/40 text-xs border-b border-white/10">
              <th className="text-left py-2 pr-4">Title</th>
              <th className="text-left py-2 pr-4">YouTube ID</th>
              <th className="text-right py-2 pr-4">Points</th>
              <th className="text-right py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.videos ?? []).map(v => (
              <tr key={v.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 pr-4 text-white">{v.title}</td>
                <td className="py-2 pr-4 font-mono text-white/50 text-xs">{v.youtubeId}</td>
                <td className="py-2 pr-4 text-right text-[#c8f135] font-mono">{v.rewardCents}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => toggleVideo.mutate({ id: v.id, isActive: !v.isActive })}
                    className={`text-xs px-2 py-0.5 rounded ${v.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                  >{v.isActive ? 'Active' : 'Inactive'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
