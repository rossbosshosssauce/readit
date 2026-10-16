import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { hnApi } from '../features/stories/hnApi'
import uiReducer from '../features/ui/uiSlice'

/** Build a fresh store for a test so cached queries never leak between them. */
export function makeTestStore() {
  return configureStore({
    reducer: {
      [hnApi.reducerPath]: hnApi.reducer,
      ui: uiReducer,
    },
    middleware: (getDefault) => getDefault().concat(hnApi.middleware),
  })
}

/** Render a component wrapped in a fresh Redux store and a MemoryRouter. */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: { route?: string } = {},
) {
  const store = makeTestStore()
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper }) }
}
