import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorMessage from '../components/ErrorMessage'
import { PostListSkeleton } from '../components/Skeleton'
import type { SortOption } from '../features/posts/redditApi'
import { useGetPostsQuery, useSearchPostsQuery } from '../features/posts/redditApi'
import PostsList from '../features/posts/PostsList'
import { setSort } from '../features/ui/uiSlice'
import styles from './HomePage.module.css'

const SORTS: SortOption[] = ['hot', 'new', 'top']

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { subreddit, searchTerm, sort } = useAppSelector((state) => state.ui)
  const isSearching = searchTerm.length > 0

  // Only one of these actually runs; `skip` keeps the other idle.
  const browse = useGetPostsQuery({ subreddit, sort }, { skip: isSearching })
  const search = useSearchPostsQuery({ subreddit, term: searchTerm }, { skip: !isSearching })
  const active = isSearching ? search : browse

  return (
    <div>
      <div className={styles.head}>
        <h1 className={styles.heading}>
          {isSearching
            ? `Results for “${searchTerm}”`
            : subreddit === 'popular'
              ? 'Popular'
              : `r/${subreddit}`}
        </h1>

        {!isSearching && (
          <div className={styles.sorts} role="tablist" aria-label="Sort posts">
            {SORTS.map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={sort === option}
                className={styles.sort}
                data-active={sort === option}
                onClick={() => dispatch(setSort(option))}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {active.isLoading && <PostListSkeleton />}
      {active.isError && (
        <ErrorMessage
          message="Couldn't load posts. Reddit may be rate-limiting or offline."
          onRetry={() => active.refetch()}
        />
      )}
      {active.isSuccess && <PostsList posts={active.data} />}
    </div>
  )
}
