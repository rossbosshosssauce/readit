import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../test/server'
import { renderWithProviders } from '../test/renderWithProviders'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('shows a loading state, then renders fetched posts', async () => {
    renderWithProviders(<HomePage />)

    // Skeletons expose aria-busy while the request is in flight.
    expect(screen.getByLabelText('Loading posts')).toBeInTheDocument()

    expect(await screen.findByText('First post')).toBeInTheDocument()
    expect(screen.getByText('Second post')).toBeInTheDocument()
  })

  it('falls back to demo data when the proxy fails', async () => {
    server.use(
      http.get('*/api/reddit', () => HttpResponse.json({ error: 'boom' }, { status: 502 })),
    )

    renderWithProviders(<HomePage />)

    // A demo post (its title is unique to the bundled fixtures) should appear.
    expect(await screen.findByText(/without any API keys/i)).toBeInTheDocument()
  })
})
