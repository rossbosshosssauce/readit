import { http, HttpResponse } from 'msw'
import type { Story } from '../types/hn'

const HN = 'https://hacker-news.firebaseio.com/v0'
const ALGOLIA = 'https://hn.algolia.com/api/v1'

/** Build a minimal but valid Story for fixtures. */
export function makeStory(overrides: Partial<Story> & Pick<Story, 'id'>): Story {
  return {
    by: 'test_user',
    title: `Story ${overrides.id}`,
    url: 'https://example.com/article',
    score: 100,
    time: 1_700_000_000,
    descendants: 3,
    kids: [],
    type: 'story',
    ...overrides,
  }
}

// Default handlers model the HN Firebase + Algolia APIs. Individual tests
// override with server.use(...).
export const handlers = [
  // Any category list returns the same two ids.
  http.get(`${HN}/:list.json`, ({ params }) => {
    if (String(params.list).endsWith('stories')) {
      return HttpResponse.json([1, 2])
    }
    return HttpResponse.json(null)
  }),

  // Items by id.
  http.get(`${HN}/item/:id.json`, ({ params }) => {
    const id = Number(params.id)
    const byId: Record<number, Story> = {
      1: makeStory({ id: 1, title: 'First story' }),
      2: makeStory({ id: 2, title: 'Second story' }),
    }
    return HttpResponse.json(byId[id] ?? makeStory({ id }))
  }),

  // Algolia search.
  http.get(`${ALGOLIA}/search`, () =>
    HttpResponse.json({
      hits: [
        {
          objectID: '99',
          title: 'Search result story',
          url: 'https://example.com/found',
          author: 'searcher',
          points: 50,
          num_comments: 4,
          created_at_i: 1_700_000_500,
        },
      ],
    }),
  ),
]
