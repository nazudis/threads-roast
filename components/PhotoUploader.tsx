'use client'
import { useRef, useState } from 'react'
import { compressImage, validateImageFile } from '@/lib/compressImage'

export function PhotoUploader({
  value,
  onChange,
}: {
  value: string | null
  onChange: (dataUrl: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-picking the same file
    if (!file) return
    setError(null)

    const valid = validateImageFile(file)
    if (!valid.ok) {
      setError(valid.error)
      return
    }
    setBusy(true)
    try {
      const { dataUrl } = await compressImage(file)
      onChange(dataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses foto.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={inputRef}
        data-testid="photo-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative grid size-28 place-items-center overflow-hidden rounded-2xl border-4 border-vermillion bg-char2 text-ashdim transition active:scale-95"
        aria-label={value ? 'Ganti foto' : 'Upload foto'}
        aria-busy={busy}
      >
        {busy ? (
          <span className="font-mono text-xs">mengompres…</span>
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="photo-duotone size-full object-cover" />
        ) : (
          <span className="font-mono text-3xl">+</span>
        )}
      </button>
      {/* Decorative twin of the square button above (same action). Hidden from
          assistive tech to avoid announcing a duplicate control. */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="font-mono text-xs text-ashdim underline underline-offset-4"
        tabIndex={-1}
        aria-hidden="true"
      >
        {value ? 'ganti foto' : 'tambah foto (opsional)'}
      </button>
      {error && <p className="font-mono text-xs text-vermillion">{error}</p>}
    </div>
  )
}
