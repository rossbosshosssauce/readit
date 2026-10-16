import { http, HttpResponse } from 'msw'
import type { PostsResponse, RedditPost } from '../types/reddit'

/** Build a minimal but valid RedditPost for fixtures. */
export function makePost(overrides: Partial<RedditPost> = {}): RedditPost {
  return {
    id: 'abc123',
    title: 'Test post title',
    author: 'test_user',
    subreddit: 'popular',
    subreddit_name_prefixed: 'r/popular',
    score: 42,
    num_comments: 7,
    created_utc: 1_700_000_000,
    permalink: '/r/popular/comments/abc123/test_post_title/',
    url: 'https://example.com/article',
    selftext: '',
    is_self: false,
    over_18: false,
    stickied: false,
    thumbnail: 'self',
    ...overrides,
  }
}

function listing(posts: RedditPost[]): PostsResponse {
  return {
    kind: 'Listing',
    data: {
      after: null,
      before: null,
      children: posts.map((data) => ({ kind: 't3', data })),
    },
  }
}

// Default handlers return a small feed. Individual tests override as needed
// via server.use(...).
export const handlers = [
  http.get('https://www.reddit.com/r/:subreddit/:sort.json', ({ params }) => {
    if (params.sort === 'search.json') return HttpResponse.json(listing([]))
    return HttpResponse.json(
      listing([
        makePost({ id: '1', title: 'First post' }),
        makePost({ id: '2', title: 'Second post', is_self: true, selftext: 'Body text' }),
      ]),
    )
  }),
  http.get('https://www.reddit.com/search.json', () =>
    HttpResponse.json(listing([makePost({ id: 's1', title: 'Search result' })])),
  ),
]
