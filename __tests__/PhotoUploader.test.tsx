import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/lib/compressImage', async (orig) => {
  const actual = await orig<typeof import('@/lib/compressImage')>()
  return {
    ...actual,
    compressImage: vi.fn(async () => ({ dataUrl: 'data:image/jpeg;base64,xxx', blob: new Blob(), sizeBytes: 1234 })),
  }
})

import { PhotoUploader } from '@/components/PhotoUploader'

describe('PhotoUploader', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows a friendly error for an unsupported file and does not call onChange', async () => {
    const onChange = vi.fn()
    render(<PhotoUploader value={null} onChange={onChange} />)
    const input = screen.getByTestId('photo-input') as HTMLInputElement
    const pdf = new File(['x'], 'x.pdf', { type: 'application/pdf' })
    await userEvent.upload(input, pdf, { applyAccept: false })
    expect(await screen.findByText(/JPG|PNG|WebP/i)).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('compresses and emits a data URL for a valid image', async () => {
    const onChange = vi.fn()
    render(<PhotoUploader value={null} onChange={onChange} />)
    const input = screen.getByTestId('photo-input') as HTMLInputElement
    const jpg = new File(['x'], 'x.jpg', { type: 'image/jpeg' })
    await userEvent.upload(input, jpg)
    expect(onChange).toHaveBeenCalledWith('data:image/jpeg;base64,xxx')
  })

  it('shows an error and does not call onChange when compression fails', async () => {
    const { compressImage } = await import('@/lib/compressImage')
    vi.mocked(compressImage).mockRejectedValueOnce(new Error('Canvas timed out'))
    const onChange = vi.fn()
    render(<PhotoUploader value={null} onChange={onChange} />)
    const input = screen.getByTestId('photo-input') as HTMLInputElement
    const jpg = new File(['x'], 'x.jpg', { type: 'image/jpeg' })
    await userEvent.upload(input, jpg)
    expect(await screen.findByText(/Canvas timed out/i)).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })
})
