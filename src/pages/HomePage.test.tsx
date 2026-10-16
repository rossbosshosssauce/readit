import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../test/server'
import { renderWithProviders } from '../test/renderWithProviders'
import HomePage from './HomePage'

const HN = 'https://hacker-news.firebaseio.com/v0'

describe('HomePage', () => {
  it('shows a loading state, then renders fetched stories', async () => {
    renderWithProviders(<HomePage />)

    // Skeletons expose aria-busy while the request is in flight.
    expect(screen.getByLabelText('Loading posts')).toBeInTheDocument()

    expect(await screen.findByText('First story')).toBeInTheDocument()
    expect(screen.getByText('Second story')).toBeInTheDocument()
  })

  it('shows an error state with retry when the feed fails', async () => {
    server.use(
      http.get(`${HN}/:list.json`, () => HttpResponse.json(null, { status: 500 })),
    )

    renderWithProviders(<HomePage />)

    expect(
      await screen.findByRole('button', { name: /try again/i }),
    ).toBeInTheDocument()
  })
})
