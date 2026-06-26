'use client'
import { useState } from 'react'
import { RoastCard, type RoastCardData } from './RoastCard'

async function fetchCardBlob(data: RoastCardData): Promise<Blob> {
  const res = await fetch('/api/card', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('card render failed')
  return res.blob()
}

export function ResultView({
  data,
  onReroll,
  onRestart,
  rerolling,
  onShared,
}: {
  data: RoastCardData
  onReroll: () => void
  onRestart: () => void
  rerolling: boolean
  onShared: () => void
}) {
  const [working, setWorking] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleShare() {
    setErr(null)
    setWorking(true)
    try {
      const blob = await fetchCardBlob(data)
      const file = new File([blob], `gosong-${data.username}.png`, { type: 'image/png' })
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({ files: [file], title: 'GOSONG', text: `Roast Threads gue: ${data.label} 🔥 via @gosong.app` })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
      }
      onShared()
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setErr('Gagal nyimpen kartu. Coba lagi ya.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-5 py-8">
      <RoastCard data={data} animate />

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={handleShare}
          disabled={working || rerolling}
          className="w-full rounded-xl bg-vermillion py-4 font-display text-2xl tracking-wide text-char transition active:scale-[0.98] disabled:opacity-50"
        >
          {working ? 'NYIAPIN KARTU…' : 'DOWNLOAD / SHARE 🔥'}
        </button>
        <div className="flex gap-3">
          <button
            onClick={onReroll}
            disabled={rerolling || working}
            className="flex-1 rounded-xl border border-vermillion py-3 font-mono text-sm text-ash transition active:scale-95 disabled:opacity-50"
          >
            {rerolling ? 'ngeroast ulang…' : 'roast lagi 🔁'}
          </button>
          <button
            onClick={onRestart}
            disabled={rerolling || working}
            className="flex-1 rounded-xl border border-oxblood py-3 font-mono text-sm text-ashdim transition active:scale-95 disabled:opacity-50"
          >
            mulai ulang
          </button>
        </div>
        {err && <p className="text-center font-mono text-xs text-vermillion">{err}</p>}
      </div>
    </div>
  )
}
