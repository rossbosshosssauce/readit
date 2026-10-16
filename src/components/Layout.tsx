import { Link, Outlet } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { setSubreddit } from '../features/ui/uiSlice'
import SearchBar from '../features/ui/SearchBar'
import SubredditNav from '../features/ui/SubredditNav'
import ThemeToggle from '../features/ui/ThemeToggle'
import styles from './Layout.module.css'

export default function Layout() {
  const dispatch = useAppDispatch()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link
            to="/"
            className={styles.brand}
            onClick={() => dispatch(setSubreddit('popular'))}
          >
            <span className={styles.logo} aria-hidden="true">
              👽
            </span>
            <span>reddit<strong>client</strong></span>
          </Link>
          <SearchBar />
          <ThemeToggle />
        </div>
        <div className={styles.navRow}>
          <SubredditNav />
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>
          Built with React, TypeScript &amp; Redux Toolkit · Data from the{' '}
          <a href="https://www.reddit.com/dev/api" target="_blank" rel="noreferrer">
            Reddit API
          </a>
        </p>
      </footer>
    </div>
  )
}
