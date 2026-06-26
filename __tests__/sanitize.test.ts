import { describe, it, expect } from 'vitest'
import { sanitizeUsername, sanitizeVibe, USERNAME_MAX, VIBE_MAX } from '@/lib/sanitize'

describe('sanitizeUsername', () => {
  it('strips a leading @ and trims', () => {
    expect(sanitizeUsername('  @Fauzan ')).toBe('Fauzan')
  })
  it('removes control chars and inner whitespace', () => {
    expect(sanitizeUsername('@ab c d')).toBe('abcd')
  })
  it('caps length', () => {
    expect(sanitizeUsername('@' + 'a'.repeat(100)).length).toBe(USERNAME_MAX)
  })
  it('handles non-strings', () => {
    expect(sanitizeUsername(undefined as unknown)).toBe('')
  })
})

describe('sanitizeVibe', () => {
  it('collapses whitespace and trims', () => {
    expect(sanitizeVibe('  tukang   quote\n\njarang  posting ')).toBe('tukang quote jarang posting')
  })
  it('strips non-printable control chars', () => {
    expect(sanitizeVibe('hobi\x01\x08war\x7f')).toBe('hobiwar')
  })
  it('caps length', () => {
    expect(sanitizeVibe('x'.repeat(500)).length).toBe(VIBE_MAX)
  })
})
