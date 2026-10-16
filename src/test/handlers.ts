import { http, HttpResponse } from 'msw'
import type { CommentsResponse, PostsResponse, RedditPost } from '../types/reddit'

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
    data: { after: null, before: null, children: posts.map((data) => ({ kind: 't3', data })) },
  }
}

function commentsResponse(post: RedditPost): CommentsResponse {
  return [
    listing([post]),
    {
      kind: 'Listing',
      data: {
        after: null,
        before: null,
        children: [
          {
            kind: 't1',
            data: {
              id: 'k1',
              author: 'commenter',
              body: 'A top-level comment',
              score: 12,
              created_utc: 1_700_000_500,
              replies: '',
            },
          },
        ],
      },
    },
  ]
}

// The app calls /api/reddit?path=<reddit path>. These handlers branch on that
// path to return either a feed or a single post's comments. Tests override
// them with server.use(...) to simulate errors.
export const handlers = [
  http.get('*/api/reddit', ({ request }) => {
    const path = new URL(request.url).searchParams.get('path') ?? ''

    if (path.startsWith('comments/')) {
      return HttpResponse.json(commentsResponse(makePost({ id: '1', title: 'First post' })))
    }
    if (path.startsWith('search')) {
      return HttpResponse.json(listing([makePost({ id: 's1', title: 'Search result' })]))
    }
    return HttpResponse.json(
      listing([
        makePost({ id: '1', title: 'First post' }),
        makePost({ id: '2', title: 'Second post', is_self: true, selftext: 'Body text' }),
      ]),
    )
  }),
]
