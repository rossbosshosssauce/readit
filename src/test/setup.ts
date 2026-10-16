import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './server'

// Start the Mock Service Worker before the suite, reset handlers between
// tests so one test can't leak request overrides into the next, and tear
// it down at the end.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
