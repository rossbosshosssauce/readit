import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import { Skeleton } from '../components/Skeleton'
import CommentThread from '../features/comments/CommentThread'
import { useGetCommentsQuery } from '../features/posts/redditApi'
import { formatScore, timeAgo } from '../utils/format'
import styles from './PostPage.module.css'

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>()
  const { data, isLoading, isError, isSuccess, refetch } = useGetCommentsQuery(
    postId ?? '',
    { skip: !postId },
  )

  const image = data?.post.preview?.images[0]?.source.url.replace(/&amp;/g, '&')

  return (
    <div>
      <Link to="/" className={styles.back}>
        ← Back to feed
      </Link>

      {isLoading && (
        <div className={styles.loading}>
          <Skeleton width="70%" height="1.8rem" />
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="100%" height="8rem" />
        </div>
      )}

      {isError && (
        <ErrorMessage message="Couldn't load this post." onRetry={() => refetch()} />
      )}

      {isSuccess && (
        <article>
          <header className={styles.header}>
            <p className={styles.meta}>
              <span className={styles.sub}>{data.post.subreddit_name_prefixed}</span>
              <span> · u/{data.post.author}</span>
              <span> · {timeAgo(data.post.created_utc)}</span>
              <span> · {formatScore(data.post.score)} pts</span>
            </p>
            <h1 className={styles.title}>{data.post.title}</h1>
          </header>

          {image && !data.post.over_18 && (
            <img className={styles.image} src={image} alt="" />
          )}

          {data.post.selftext && (
            <div className={styles.selftext}>{data.post.selftext}</div>
          )}

          {!data.post.is_self && (
            <a
              className={styles.link}
              href={data.post.url}
              target="_blank"
              rel="noreferrer"
            >
              {data.post.url}
            </a>
          )}

          <h2 className={styles.commentsHeading}>
            {data.post.num_comments} comments
          </h2>
          <CommentThread comments={data.comments} />
        </article>
      )}
    </div>
  )
}
