import imageCompression from 'browser-image-compression'

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const MAX_DIMENSION = 1080
export const TARGET_MAX_BYTES = 1_000_000 // ~1MB
const HARD_MAX_BYTES = 25 * 1024 * 1024 // reject absurd uploads outright

export type ValidationResult = { ok: true } | { ok: false; error: string }

export function validateImageFile(file: { type: string; size: number }): ValidationResult {
  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    return { ok: false, error: 'Format gak didukung. Pakai JPG, PNG, atau WebP ya.' }
  }
  if (file.size > HARD_MAX_BYTES) {
    return { ok: false, error: 'Fotonya kegedean banget (maks 25MB).' }
  }
  return { ok: true }
}

export function computeTargetDimensions(width: number, height: number, maxDim: number) {
  if (width <= maxDim && height <= maxDim) return { width, height }
  const scale = maxDim / Math.max(width, height)
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

export type CompressedImage = { dataUrl: string; blob: Blob; sizeBytes: number }

/** Browser-only. Compresses to ≤~1MB / ≤1080px and returns a data URL for preview + OG. */
export async function compressImage(file: File): Promise<CompressedImage> {
  const valid = validateImageFile(file)
  if (!valid.ok) throw new Error(valid.error)

  const blob = await imageCompression(file, {
    maxSizeMB: TARGET_MAX_BYTES / (1024 * 1024),
    maxWidthOrHeight: MAX_DIMENSION,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.82,
  })
  const dataUrl = await imageCompression.getDataUrlFromFile(blob)
  return { dataUrl, blob, sizeBytes: blob.size }
}
