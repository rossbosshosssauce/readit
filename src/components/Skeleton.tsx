import styles from './Skeleton.module.css'

/** A shimmering placeholder block. Width/height are caller-controlled. */
export function Skeleton({ width, height }: { width?: string; height?: string }) {
  return <span className={styles.skeleton} style={{ width, height }} aria-hidden="true" />
}

/** A set of post-card-shaped skeletons shown while a feed loads. */
export function PostListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.card}>
          <Skeleton width="60%" height="1.1rem" />
          <Skeleton width="100%" height="0.8rem" />
          <Skeleton width="40%" height="0.8rem" />
        </div>
      ))}
    </div>
  )
}
