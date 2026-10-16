import { useAppSelector } from '../app/hooks'
import ErrorMessage from '../components/ErrorMessage'
import { PostListSkeleton } from '../components/Skeleton'
import StoriesList from '../features/stories/StoriesList'
import { useGetStoriesQuery, useSearchStoriesQuery } from '../features/stories/hnApi'
import type { Category } from '../types/hn'
import styles from './HomePage.module.css'

const CATEGORY_LABEL: Record<Category, string> = {
  top: 'Top Stories',
  new: 'New Stories',
  best: 'Best Stories',
  ask: 'Ask HN',
  show: 'Show HN',
  job: 'Jobs',
}

export default function HomePage() {
  const { category, searchTerm } = useAppSelector((state) => state.ui)
  const isSearching = searchTerm.length > 0

  // Only one of these runs; `skip` keeps the other idle.
  const feed = useGetStoriesQuery(category, { skip: isSearching })
  const search = useSearchStoriesQuery(searchTerm, { skip: !isSearching })
  const active = isSearching ? search : feed

  return (
    <div>
      <div className={styles.head}>
        <h1 className={styles.heading}>
          {isSearching ? `Results for “${searchTerm}”` : CATEGORY_LABEL[category]}
        </h1>
      </div>

      {active.isLoading && <PostListSkeleton />}
      {active.isError && (
        <ErrorMessage
          message="Couldn't load stories. Please try again."
          onRetry={() => active.refetch()}
        />
      )}
      {active.isSuccess && <StoriesList stories={active.data} />}
    </div>
  )
}
