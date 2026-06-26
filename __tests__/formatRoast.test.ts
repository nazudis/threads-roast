import { describe, it, expect } from 'vitest'
import { formatRoastForReading } from '@/lib/formatRoast'

describe('formatRoastForReading', () => {
  it('adds blank lines between sentence beats for readability', () => {
    expect(formatRoastForReading('Satu. Dua! Tiga?')).toBe('Satu.\n\nDua!\n\nTiga?')
  })

  it('trims surrounding whitespace', () => {
    expect(formatRoastForReading('  Satu kalimat aja.  ')).toBe('Satu kalimat aja.')
  })
})
