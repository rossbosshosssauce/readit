import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setSubreddit } from './uiSlice'
import styles from './SubredditNav.module.css'

// A curated set of broadly-appealing, SFW communities to browse.
const SUBREDDITS = [
  { slug: 'popular', label: 'Popular' },
  { slug: 'news', label: 'News' },
  { slug: 'technology', label: 'Technology' },
  { slug: 'science', label: 'Science' },
  { slug: 'programming', label: 'Programming' },
  { slug: 'gaming', label: 'Gaming' },
  { slug: 'movies', label: 'Movies' },
  { slug: 'food', label: 'Food' },
  { slug: 'EarthPorn', label: 'Earth' },
]

export default function SubredditNav() {
  const current = useAppSelector((state) => state.ui.subreddit)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function choose(slug: string) {
    dispatch(setSubreddit(slug))
    navigate('/') // always return to the feed when switching communities
  }

  return (
    <nav className={styles.nav} aria-label="Communities">
      <ul className={styles.list}>
        {SUBREDDITS.map(({ slug, label }) => (
          <li key={slug}>
            <button
              type="button"
              className={styles.chip}
              aria-current={current === slug ? 'page' : undefined}
              data-active={current === slug}
              onClick={() => choose(slug)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
