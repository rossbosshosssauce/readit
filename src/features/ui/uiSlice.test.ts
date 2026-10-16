import { describe, expect, it } from 'vitest'
import reducer, { setCategory, setSearchTerm, toggleTheme } from './uiSlice'

const base = {
  theme: 'light' as const,
  category: 'top' as const,
  searchTerm: '',
}

describe('uiSlice', () => {
  it('toggles the theme', () => {
    const next = reducer(base, toggleTheme())
    expect(next.theme).toBe('dark')
    expect(reducer(next, toggleTheme()).theme).toBe('light')
  })

  it('clears the search term when the category changes', () => {
    const searched = reducer(base, setSearchTerm('rust'))
    expect(searched.searchTerm).toBe('rust')

    const switched = reducer(searched, setCategory('ask'))
    expect(switched.category).toBe('ask')
    expect(switched.searchTerm).toBe('')
  })

  it('updates the search term', () => {
    expect(reducer(base, setSearchTerm('redux')).searchTerm).toBe('redux')
  })
})
