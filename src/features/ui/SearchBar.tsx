import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setSearchTerm } from './uiSlice'
import styles from './SearchBar.module.css'

const DEBOUNCE_MS = 350

export default function SearchBar() {
  const dispatch = useAppDispatch()
  const category = useAppSelector((state) => state.ui.category)
  const [value, setValue] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Clear the input when the user switches categories.
  useEffect(() => {
    setValue('')
  }, [category])

  // Debounce: only push the term to the store once typing pauses.
  function handleChange(next: string) {
    setValue(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      dispatch(setSearchTerm(next.trim()))
    }, DEBOUNCE_MS)
  }

  // Flush any pending debounce if the component unmounts.
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <form className={styles.form} role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="story-search" className="sr-only">
        Search Hacker News stories
      </label>
      <span className={styles.icon} aria-hidden="true">
        🔍
      </span>
      <input
        id="story-search"
        type="search"
        className={styles.input}
        placeholder="Search Hacker News…"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        autoComplete="off"
      />
    </form>
  )
}
