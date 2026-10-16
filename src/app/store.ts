import { configureStore } from '@reduxjs/toolkit'
import { redditApi } from '../features/posts/redditApi'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    [redditApi.reducerPath]: redditApi.reducer,
    ui: uiReducer,
  },
  // RTK Query needs its middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(redditApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
