import { Link, Outlet } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { setCategory } from '../features/ui/uiSlice'
import CategoryNav from '../features/ui/CategoryNav'
import SearchBar from '../features/ui/SearchBar'
import ThemeToggle from '../features/ui/ThemeToggle'
import styles from './Layout.module.css'

export default function Layout() {
  const dispatch = useAppDispatch()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link to="/" className={styles.brand} onClick={() => dispatch(setCategory('top'))}>
            <span className={styles.logo} aria-hidden="true">
              Y
            </span>
            <span>read<strong>it</strong></span>
          </Link>
          <SearchBar />
          <ThemeToggle />
        </div>
        <div className={styles.navRow}>
          <CategoryNav />
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>
          Built with React, TypeScript &amp; Redux Toolkit · Data from the{' '}
          <a href="https://github.com/HackerNews/API" target="_blank" rel="noreferrer">
            Hacker News API
          </a>
        </p>
      </footer>
    </div>
  )
}
