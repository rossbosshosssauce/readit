// Types describing the slices of Reddit's public JSON API that this app uses.
// Reddit wraps everything in "Listing" envelopes whose `children` are tagged
// with a `kind` ("t3" = post, "t1" = comment, "more" = unloaded replies).

/** A single Reddit post ("t3"). Only the fields we actually render are typed. */
export interface RedditPost {
  id: string
  title: string
  author: string
  subreddit: string
  subreddit_name_prefixed: string
  score: number
  num_comments: number
  created_utc: number
  permalink: string
  url: string
  selftext: string
  is_self: boolean
  over_18: boolean
  stickied: boolean
  post_hint?: string
  thumbnail: string
  /** Present on image/gallery posts; preview[0].source.url is the full image. */
  preview?: {
    images: Array<{ source: { url: string; width: number; height: number } }>
  }
}

/** A single comment ("t1"). Replies are themselves a Listing, or "" when none. */
export interface RedditComment {
  id: string
  author: string
  body: string
  score: number
  created_utc: number
  replies: Listing<CommentChild> | ''
}

/** A generic Reddit "Listing" envelope. */
export interface Listing<TChild> {
  kind: 'Listing'
  data: {
    after: string | null
    before: string | null
    children: TChild[]
  }
}

export interface PostChild {
  kind: 't3'
  data: RedditPost
}

/** Comment listings mix real comments ("t1") with "more" placeholders. */
export type CommentChild =
  | { kind: 't1'; data: RedditComment }
  | { kind: 'more'; data: { count: number } }

/** Response shape of `/r/{sub}.json` and search endpoints. */
export type PostsResponse = Listing<PostChild>

/** Response shape of a post's comments endpoint: [postListing, commentsListing]. */
export type CommentsResponse = [Listing<PostChild>, Listing<CommentChild>]
