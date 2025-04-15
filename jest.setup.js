// Import Jest DOM for additional matchers like toBeInTheDocument()
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}));

// Mock Supabase client
jest.mock('./config/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      signInWithPassword: jest.fn(),
    },
  },
}));

// Global setup
global.fetch = jest.fn(); 