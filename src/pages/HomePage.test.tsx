import { screen, waitFor } from '@testing-library/react'
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

  it('shows an error state with a retry button when the API fails', async () => {
    server.use(
      http.get('https://www.reddit.com/r/:subreddit/:sort.json', () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    )

    renderWithProviders(<HomePage />)

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument(),
    )
  })
})
