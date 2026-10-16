import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import SafeHtml from '../components/SafeHtml'
import { Skeleton } from '../components/Skeleton'
import CommentThread from '../features/comments/CommentThread'
import { useGetItemQuery } from '../features/stories/hnApi'
import { domainOf, formatScore, timeAgo } from '../utils/format'
import styles from './ItemPage.module.css'

export default function ItemPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  const valid = Number.isFinite(numericId)

  const { data, isLoading, isError, isSuccess, refetch } = useGetItemQuery(numericId, {
    skip: !valid,
  })

  const domain = domainOf(data?.story.url)
  const commentCount = data?.story.descendants ?? 0

  return (
    <div>
      <Link to="/" className={styles.back}>
        ← Back to stories
      </Link>

      {(!valid || isError) && (
        <ErrorMessage
          message="Couldn't load this story."
          onRetry={valid ? () => refetch() : undefined}
        />
      )}

      {isLoading && (
        <div className={styles.loading}>
          <Skeleton width="70%" height="1.8rem" />
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="100%" height="8rem" />
        </div>
      )}

      {isSuccess && (
        <article>
          <header className={styles.header}>
            <h1 className={styles.title}>
              {data.story.url ? (
                <a href={data.story.url} target="_blank" rel="noreferrer">
                  {data.story.title}
                </a>
              ) : (
                data.story.title
              )}
              {domain && <span className={styles.domain}> ({domain})</span>}
            </h1>
            <p className={styles.meta}>
              <span>{formatScore(data.story.score)} points</span>
              <span> · by {data.story.by}</span>
              <span> · {timeAgo(data.story.time)}</span>
            </p>
          </header>

          {data.story.text && <SafeHtml className={styles.text} html={data.story.text} />}

          <h2 className={styles.commentsHeading}>
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </h2>
          <CommentThread comments={data.comments} />
        </article>
      )}
    </div>
  )
}
