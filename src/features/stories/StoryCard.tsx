import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Story } from '../../types/hn'
import { domainOf, formatScore, timeAgo } from '../../utils/format'
import styles from './StoryCard.module.css'

/** A small domain favicon, falling back to the story's first letter. */
function StoryThumb({ domain, title }: { domain?: string; title: string }) {
  const [failed, setFailed] = useState(false)

  if (!domain || failed) {
    return (
      <div className={styles.thumbFallback} aria-hidden="true">
        {title.slice(0, 1).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      className={styles.thumb}
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      loading="lazy"
      width={32}
      height={32}
      onError={() => setFailed(true)}
    />
  )
}

export default function StoryCard({ story }: { story: Story }) {
  const domain = domainOf(story.url)
  const commentCount = story.descendants ?? 0

  return (
    <article className={styles.card}>
      <div className={styles.score} aria-label={`${story.score} points`}>
        <span aria-hidden="true">▲</span>
        <span>{formatScore(story.score)}</span>
      </div>

      <StoryThumb domain={domain} title={story.title} />

      <div className={styles.body}>
        <h2 className={styles.title}>
          {/* External link if the story points off-site; otherwise the discussion. */}
          {story.url ? (
            <a href={story.url} target="_blank" rel="noreferrer">
              {story.title}
            </a>
          ) : (
            <Link to={`/item/${story.id}`}>{story.title}</Link>
          )}
          {domain && <span className={styles.domain}> ({domain})</span>}
        </h2>

        <p className={styles.meta}>
          <span>by {story.by}</span>
          <span> · {timeAgo(story.time)}</span>
          <span> · </span>
          <Link to={`/item/${story.id}`} className={styles.comments}>
            💬 {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </Link>
        </p>
      </div>
    </article>
  )
}
