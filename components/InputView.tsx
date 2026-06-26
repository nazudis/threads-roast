'use client'
import { useState } from 'react'
import { PhotoUploader } from './PhotoUploader'

export type RoastRequest = { username: string; vibe: string; photoDataUrl: string | null }

export function InputView({
  onSubmit,
  loading,
}: {
  onSubmit: (req: RoastRequest) => void
  loading: boolean
}) {
  const [username, setUsername] = useState('')
  const [vibe, setVibe] = useState('')
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const canSubmit = username.trim().length > 0 && !loading

  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-5 py-10"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        onSubmit({ username: username.trim().replace(/^@+/, ''), vibe: vibe.trim(), photoDataUrl })
      }}
    >
      <div className="text-center">
        <h1 className="font-display text-6xl leading-none text-vermillion">GOSONG</h1>
        <p className="mt-2 font-mono text-xs text-ashdim">
          Roast vibe Threads lo — soal kelakuan posting, bukan muka. Santai, buat ketawa 🔥
        </p>
      </div>

      <PhotoUploader value={photoDataUrl} onChange={setPhotoDataUrl} />

      <label className="flex w-full flex-col gap-1">
        <span className="font-mono text-xs text-ashdim">Username</span>
        <div className="flex items-center rounded-xl border border-oxblood bg-char2 px-3 focus-within:border-vermillion">
          <span className="font-mono text-ashdim">@</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            placeholder="username_threads"
            className="w-full bg-transparent py-3 pl-1 font-mono text-ash outline-none placeholder:text-ashdim/50"
            autoCapitalize="none"
            autoCorrect="off"
            inputMode="text"
            spellCheck={false}
          />
        </div>
      </label>

      <label className="flex w-full flex-col gap-1">
        <span className="font-mono text-xs text-ashdim">Vibe / bio (opsional)</span>
        <textarea
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          maxLength={280}
          rows={3}
          placeholder="cth: tukang quote, jarang posting, hobi war di reply, sok bijak tiap senin"
          className="w-full resize-none rounded-xl border border-oxblood bg-char2 p-3 font-mono text-sm text-ash outline-none placeholder:text-ashdim/50 focus:border-vermillion"
        />
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-xl bg-vermillion py-4 font-display text-2xl tracking-wide text-char transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'LAGI NGE-ROAST…' : 'ROAST GUE 🔥'}
      </button>
    </form>
  )
}
