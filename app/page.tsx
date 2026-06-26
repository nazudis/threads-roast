'use client'
import { useState } from 'react'
import { InputView, type RoastRequest } from '@/components/InputView'
import { ResultView } from '@/components/ResultView'
import type { RoastCardData } from '@/components/RoastCard'
import { getCardMeta } from '@/lib/cardMeta'
import { track } from '@/lib/analytics'

type Phase = 'input' | 'result'

export default function Home() {
  const [phase, setPhase] = useState<Phase>('input')
  const [loading, setLoading] = useState(false)
  const [rerolling, setRerolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [req, setReq] = useState<RoastRequest | null>(null)
  const [card, setCard] = useState<RoastCardData | null>(null)

  async function requestRoast(r: RoastRequest, reroll: boolean) {
    const res = await fetch('/api/roast', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: r.username, vibe: r.vibe, reroll }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      throw new Error(j.error || 'Gagal nge-roast. Coba lagi ya.')
    }
    const { roast } = await res.json()
    const meta = getCardMeta(r.username, roast)
    return {
      username: r.username,
      roast,
      photoDataUrl: r.photoDataUrl,
      label: meta.label,
      color: meta.color,
      serial: meta.serial,
    } satisfies RoastCardData
  }

  async function handleSubmit(r: RoastRequest) {
    setReq(r)
    setError(null)
    setLoading(true)
    track('session_started')
    try {
      const c = await requestRoast(r, false)
      setCard(c)
      setPhase('result')
      track('card_generated', { severity: c.label, has_photo: !!r.photoDataUrl })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleReroll() {
    if (!req) return
    setRerolling(true)
    setError(null)
    track('reroll_clicked')
    try {
      const c = await requestRoast(req, true)
      setCard(c)
      track('card_generated', { severity: c.label, reroll: true })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setRerolling(false)
    }
  }

  function handleRestart() {
    setPhase('input')
    setCard(null)
    setError(null)
  }

  return (
    <main className="grain min-h-dvh">
      {phase === 'input' || !card ? (
        <>
          <InputView onSubmit={handleSubmit} loading={loading} />
          {error && <p className="px-5 pb-8 text-center font-mono text-xs text-vermillion">{error}</p>}
        </>
      ) : (
        <>
          <ResultView
            data={card}
            onReroll={handleReroll}
            onRestart={handleRestart}
            rerolling={rerolling}
            onShared={() => track('card_shared', { severity: card.label })}
          />
          {error && <p className="px-5 pb-8 text-center font-mono text-xs text-vermillion">{error}</p>}
        </>
      )}
    </main>
  )
}
