import { describe, it, expect } from 'vitest'
import {
  validateImageFile,
  computeTargetDimensions,
  ACCEPTED_TYPES,
  MAX_DIMENSION,
} from '@/lib/compressImage'

describe('validateImageFile', () => {
  it('accepts jpeg/png/webp', () => {
    for (const type of ACCEPTED_TYPES) {
      expect(validateImageFile({ type, size: 1000 }).ok).toBe(true)
    }
  })
  it('rejects non-images with a friendly message', () => {
    const r = validateImageFile({ type: 'application/pdf', size: 1000 })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/JPG|PNG|WebP/i)
  })
  it('rejects absurdly large files', () => {
    const r = validateImageFile({ type: 'image/jpeg', size: 30 * 1024 * 1024 })
    expect(r.ok).toBe(false)
  })
})

describe('computeTargetDimensions', () => {
  it('leaves small images untouched', () => {
    expect(computeTargetDimensions(800, 600, MAX_DIMENSION)).toEqual({ width: 800, height: 600 })
  })
  it('scales landscape by the long edge', () => {
    expect(computeTargetDimensions(2000, 1000, 1080)).toEqual({ width: 1080, height: 540 })
  })
  it('scales portrait by the long edge', () => {
    expect(computeTargetDimensions(3000, 4000, 1080)).toEqual({ width: 810, height: 1080 })
  })
})
