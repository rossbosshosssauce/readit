import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// A single MSW server instance shared across the test suite.
export const server = setupServer(...handlers)
