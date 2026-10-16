import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CommentChild,
  CommentsResponse,
  PostsResponse,
  RedditPost,
} from '../../types/reddit'

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

export const redditApi = createApi({
  reducerPath: 'redditApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.reddit.com/' }),
  endpoints: (builder) => ({
    // Browse a subreddit's feed. Returns a clean RedditPost[].
    getPosts: builder.query<RedditPost[], { subreddit: string; sort: SortOption }>({
      query: ({ subreddit, sort }) => `r/${subreddit}/${sort}.json`,
      transformResponse: (response: PostsResponse) =>
        response.data.children.map((child) => child.data),
    }),

    // Search. Scoped to the subreddit unless it's the special "popular" feed.
    searchPosts: builder.query<RedditPost[], { subreddit: string; term: string }>({
      query: ({ subreddit, term }) => {
        const q = encodeURIComponent(term)
        const global = subreddit === 'popular' || subreddit === 'all'
        return global
          ? `search.json?q=${q}&sort=relevance`
          : `r/${subreddit}/search.json?q=${q}&restrict_sr=1&sort=relevance`
      },
      transformResponse: (response: PostsResponse) =>
        response.data.children.map((child) => child.data),
    }),

    // A single post plus its full comment tree, keyed by the post's permalink.
    getComments: builder.query<{ post: RedditPost; comments: CommentNode[] }, string>({
      query: (permalink) => `${permalink.replace(/^\/|\/$/g, '')}.json`,
      transformResponse: (response: CommentsResponse) => ({
        post: response[0].data.children[0].data,
        comments: parseComments(response[1].data.children),
      }),
    }),
  }),
})

export const { useGetPostsQuery, useSearchPostsQuery, useGetCommentsQuery } = redditApi
