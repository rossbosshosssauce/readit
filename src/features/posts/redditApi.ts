import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { getDemoResponse } from '../../demo/fixtures'
import { setDemoMode } from '../ui/uiSlice'
import type { CommentChild, CommentsResponse, PostsResponse, RedditPost } from '../../types/reddit'

/** A comment flattened into a tree the UI can render directly. */
export interface CommentNode {
  id: string
  author: string
  body: string
  score: number
  created_utc: number
  replies: CommentNode[]
}

export type SortOption = 'hot' | 'new' | 'top'

/** Recursively turn Reddit's t1/more children into clean CommentNodes. */
function parseComments(children: CommentChild[]): CommentNode[] {
  return children
    .filter((child): child is Extract<CommentChild, { kind: 't1' }> => child.kind === 't1')
    .map((child) => {
      const { id, author, body, score, created_utc, replies } = child.data
      return {
        id,
        author,
        body,
        score,
        created_utc,
        replies: replies === '' ? [] : parseComments(replies.data.children),
      }
    })
}

/** Build the proxy URL carrying a Reddit API path as a single query param. */
function proxy(redditPath: string): string {
  return `?path=${encodeURIComponent(redditPath)}`
}

// Absolute base so Node's fetch (used in tests) can parse it; the browser
// would accept a relative path, but undici requires an absolute URL.
const API_BASE =
  typeof window !== 'undefined' ? `${window.location.origin}/api/reddit` : '/api/reddit'

const rawBaseQuery = fetchBaseQuery({ baseUrl: API_BASE })

// Wraps the network request so that when the proxy is unavailable (no Reddit
// credentials configured, upstream 502, offline, etc.) the app transparently
// serves bundled demo data and flips the UI into demo mode.
const baseQueryWithDemoFallback: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error) {
    const url = typeof args === 'string' ? args : args.url
    const redditPath = new URLSearchParams(url.split('?')[1] ?? '').get('path')
    const demo = redditPath ? getDemoResponse(redditPath) : null
    if (demo) {
      api.dispatch(setDemoMode(true))
      return { data: demo }
    }
    return result
  }

  api.dispatch(setDemoMode(false))
  return result
}

export const redditApi = createApi({
  reducerPath: 'redditApi',
  baseQuery: baseQueryWithDemoFallback,
  endpoints: (builder) => ({
    // Browse a subreddit's feed. Returns a clean RedditPost[].
    getPosts: builder.query<RedditPost[], { subreddit: string; sort: SortOption }>({
      query: ({ subreddit, sort }) => proxy(`r/${subreddit}/${sort}?limit=25&raw_json=1`),
      transformResponse: (response: PostsResponse) =>
        response.data.children.map((child) => child.data),
    }),

    // Search. Scoped to the subreddit unless it's the special "popular" feed.
    searchPosts: builder.query<RedditPost[], { subreddit: string; term: string }>({
      query: ({ subreddit, term }) => {
        const q = encodeURIComponent(term)
        const global = subreddit === 'popular' || subreddit === 'all'
        return proxy(
          global
            ? `search?q=${q}&limit=25&raw_json=1`
            : `r/${subreddit}/search?q=${q}&restrict_sr=1&sort=relevance&limit=25&raw_json=1`,
        )
      },
      transformResponse: (response: PostsResponse) =>
        response.data.children.map((child) => child.data),
    }),

    // A single post plus its full comment tree, keyed by the post's id.
    getComments: builder.query<{ post: RedditPost; comments: CommentNode[] }, string>({
      query: (postId) => proxy(`comments/${postId}?limit=100&raw_json=1`),
      transformResponse: (response: CommentsResponse) => ({
        post: response[0].data.children[0].data,
        comments: parseComments(response[1].data.children),
      }),
    }),
  }),
})

export const { useGetPostsQuery, useSearchPostsQuery, useGetCommentsQuery } = redditApi
