import { describe, it, expect } from 'vitest'
import { initials } from '@/lib/initials'

describe('initials', () => {
  it('single token → first two letters', () => {
    expect(initials('fauzan')).toBe('FA')
  })
  it('strips @ and splits on punctuation', () => {
    expect(initials('@budi.santoso')).toBe('BS')
  })
  it('underscores split tokens too', () => {
    expect(initials('rama_dhani')).toBe('RD')
  })
  it('empty → ??', () => {
    expect(initials('@')).toBe('??')
  })
})
