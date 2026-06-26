import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputView } from '@/components/InputView'

describe('InputView', () => {
  it('disables the CTA until a username is entered', async () => {
    render(<InputView onSubmit={vi.fn()} loading={false} />)
    const cta = screen.getByRole('button', { name: /roast gue/i })
    expect(cta).toBeDisabled()
    await userEvent.type(screen.getByLabelText(/username/i), 'fauzan')
    expect(cta).toBeEnabled()
  })

  it('submits username + vibe + photo', async () => {
    const onSubmit = vi.fn()
    render(<InputView onSubmit={onSubmit} loading={false} />)
    await userEvent.type(screen.getByLabelText(/username/i), 'fauzan')
    await userEvent.type(screen.getByLabelText(/vibe/i), 'tukang quote')
    await userEvent.click(screen.getByRole('button', { name: /roast gue/i }))
    expect(onSubmit).toHaveBeenCalledWith({ username: 'fauzan', vibe: 'tukang quote', photoDataUrl: null })
  })
})
