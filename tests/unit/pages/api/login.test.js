import { createMocks } from 'node-mocks-http';
import loginHandler from '../../../../pages/api/auth/login';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
    },
  })),
}));

// Mock cookie
jest.mock('cookie', () => ({
  serialize: jest.fn(() => 'serialized-cookie'),
}));

describe('Login API Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: 'Method not allowed' });
  });

  it('authenticates user successfully', async () => {
    // Mock successful authentication
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSession = { access_token: 'test-token' };
    
    const supabaseAuthMock = require('@supabase/supabase-js').createClient().auth;
    supabaseAuthMock.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    await loginHandler(req, res);

    expect(supabaseAuthMock.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ user: mockUser });
  });

  it('returns error on authentication failure', async () => {
    // Mock authentication error
    const supabaseAuthMock = require('@supabase/supabase-js').createClient().auth;
    supabaseAuthMock.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' },
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Invalid login credentials' });
  });
}); 